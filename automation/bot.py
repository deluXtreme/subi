import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import click
import pandas as pd
import psycopg2
import psycopg2.extras
import psycopg2.pool
import requests
from ape import Contract, accounts, chain
from ape.types import LogFilter
from ape_accounts import import_account_from_private_key
from silverback import SilverbackBot

# Instantiate bot
bot = SilverbackBot()

# Private key
ALIAS = os.environ.get("ALIAS")
PASSPHRASE = os.environ.get("PASSPHRASE")
PRIVATE_KEY = os.environ.get("PRIVATE_KEY")
signer_account = import_account_from_private_key(ALIAS, PASSPHRASE, PRIVATE_KEY)
signer_account.set_autosign(passphrase=PASSPHRASE, enabled=True)


# Variables
START_BLOCK = int(os.environ.get("START_BLOCK", chain.blocks.head.number))
DATABASE_URL = os.getenv("DATABASE_URL")

# Addresses
HUB_ADDRESS = "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8"
SUBSCRIPTION_MANAGER_ADDRESS = "0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834"

# Contracts
hub = Contract(HUB_ADDRESS, abi="abi/Hub.json")
subscription_manager = Contract(SUBSCRIPTION_MANAGER_ADDRESS, abi="abi/SubscriptionManager.json")


# DB helpers that work with both temp connections and pools
def _get_db_connection():
    """Get a fresh database connection."""
    return psycopg2.connect(DATABASE_URL)


def _load_block_db() -> int:
    """Load last processed block from DB, fallback to START_BLOCK."""
    conn = _get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT last_synced_block FROM sync_status WHERE name = 'main'")
            row = cur.fetchone()
            return int(row[0]) if row else START_BLOCK
    except Exception as e:
        click.echo(f"[DB] Failed to load sync block: {e}")
        return START_BLOCK
    finally:
        conn.close()


def _save_block_db(block_number: int) -> bool:
    """Save the last processed block to sync_status."""
    conn = _get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sync_status (name, last_synced_block)
                VALUES ('main', %s)
                ON CONFLICT (name) DO UPDATE SET last_synced_block = EXCLUDED.last_synced_block
                """,
                (block_number,),
            )
            conn.commit()
        return True
    except Exception as e:
        click.echo(f"[DB] Failed to save sync block: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()


def _load_subscriptions_db() -> pd.DataFrame:
    """Load subscriptions into a DataFrame."""
    conn = _get_db_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM subscriptions")
            rows = cur.fetchall()
            return pd.DataFrame(rows)
    except Exception as e:
        click.echo(f"DB error loading subscriptions: {e}")
        return pd.DataFrame()
    finally:
        conn.close()


def _save_subscriptions_db(df: pd.DataFrame) -> bool:
    """Upsert subscription entries into the database."""
    if df.empty:
        return True

    conn = _get_db_connection()
    try:
        with conn.cursor() as cur:
            data = []
            for _, row in df.iterrows():
                data.append(
                    (
                        int(row["sub_id"]),
                        str(row["module"]),
                        str(row["subscriber"]),
                        str(row["recipient"]),
                        int(row["amount"]),
                        int(row["frequency"]),
                        int(row["redeem_at"]),
                        int(row.get("created_block", row.get("block_number", 0))),
                    )
                )

            cur.executemany(
                """
                INSERT INTO subscriptions (
                    sub_id, module, subscriber, recipient,
                    amount, frequency, redeem_at, created_block
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (sub_id, module) DO UPDATE SET
                    subscriber = EXCLUDED.subscriber,
                    recipient = EXCLUDED.recipient,
                    amount = EXCLUDED.amount,
                    frequency = EXCLUDED.frequency,
                    redeem_at = EXCLUDED.redeem_at,
                    created_block = EXCLUDED.created_block
                """,
                data,
            )
            conn.commit()
        return True
    except Exception as e:
        click.echo(f"DB error saving subscriptions: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()


# Historical events helper functions
def _get_historical_subscription_creations(
    start_block: int,
    stop_block: int = chain.blocks.head.number,
):
    """Get historical SubscriptionCreated events from SubscriptionManager"""
    log_filter = LogFilter(
        addresses=[subscription_manager.address],
        events=[subscription_manager.SubscriptionCreated.abi],
        start_block=start_block,
        stop_block=stop_block,
    )

    for log in accounts.provider.get_contract_logs(log_filter):
        yield log


def _get_historical_redemptions(
    start_block: int,
    stop_block: int = chain.blocks.head.number,
):
    """Get historical Redeemed events from SubscriptionManager"""
    log_filter = LogFilter(
        addresses=[subscription_manager.address],
        events=[subscription_manager.Redeemed.abi],
        start_block=start_block,
        stop_block=stop_block,
    )

    for log in accounts.provider.get_contract_logs(log_filter):
        yield log


def _process_subscription_creation_logs(start_block: int, stop_block: int) -> List[Dict]:
    """Process subscription creation logs and return list of subscription dicts"""
    subscriptions = []

    for log in _get_historical_subscription_creations(start_block, stop_block):
        subscription = {
            "block_number": log.block_number,
            "sub_id": log.subId,
            "module": log.module,
            "subscriber": log.subscriber,
            "recipient": log.recipient,
            "amount": log.amount,
            "frequency": log.frequency,
            "redeem_at": 0,
        }

        subscriptions.append(subscription)
        click.echo(
            f"Subscription {log.subId} on module {log.module}: {log.subscriber} -> {log.recipient} "
            f"(amount: {log.amount}, frequency: {log.frequency}) at block {log.block_number}"
        )

    return subscriptions


def _update_redemption_times(subscriptions: List[Dict], start_block: int, stop_block: int) -> None:
    """Update redeem_at times for subscriptions based on redemption events"""
    for log in _get_historical_redemptions(start_block, stop_block):
        for sub in subscriptions:
            if sub["sub_id"] == log.subId and sub["module"] == log.module:
                sub["redeem_at"] = log.nextRedeemAt
                break


def _process_historical_subscription_creations(start_block: int, stop_block: int) -> None:
    """Process historical subscription creation events and store in database"""
    subscriptions_df = _load_subscriptions_db()

    subscriptions = _process_subscription_creation_logs(start_block, stop_block)
    _update_redemption_times(subscriptions, start_block, stop_block)

    if subscriptions:
        click.echo(f"Found {len(subscriptions)} historical subscription creations")
        updated_df = pd.concat([subscriptions_df, pd.DataFrame(subscriptions)], ignore_index=True)
        _save_subscriptions_db(updated_df)
    else:
        click.echo(f"No historical subscription creations found in blocks {start_block}-{stop_block}")


def _catch_up_subscription_creations(current_block: int) -> None:
    """Catch up on SubscriptionCreated events from last processed block"""
    last_processed_block = _load_block_db()

    if current_block <= last_processed_block:
        return

    click.echo(f"Catching up subscriptions from block {last_processed_block + 1} to {current_block}")
    _process_historical_subscription_creations(start_block=last_processed_block + 1, stop_block=current_block)


# Subscription processing helper functions
def _get_sub_module_pairs_from_df(subscriptions_df: pd.DataFrame) -> List[Tuple[int, str]]:
    """Extract unique (sub_id, module) pairs from dataframe"""
    return list(subscriptions_df[["sub_id", "module"]].drop_duplicates().itertuples(index=False, name=None))


# Pathfinder and flow matrix utilities
@dataclass
class TransferStep:
    """Represents a single transfer step in a payment flow."""

    from_address: str
    to_address: str
    token_owner: str
    value: str


@dataclass
class FlowEdge:
    """Represents an edge in the flow graph."""

    stream_sink_id: int
    amount: str


@dataclass
class Stream:
    """Represents a stream in the flow matrix."""

    source_coordinate: int
    flow_edge_ids: List[int]
    data: bytes


@dataclass
class FlowMatrix:
    """Complete flow matrix for ABI encoding."""

    flow_vertices: List[str]
    flow_edges: List[FlowEdge]
    streams: List[Stream]
    packed_coordinates: bytes
    source_coordinate: int


def pack_coordinates(coords: List[int]) -> bytes:
    """Pack a uint16 array into bytes (big-endian, no padding)."""
    result = bytearray(len(coords) * 2)

    for i, coord in enumerate(coords):
        hi = (coord >> 8) & 0xFF
        lo = coord & 0xFF
        offset = 2 * i
        result[offset] = hi
        result[offset + 1] = lo

    return bytes(result)


def transform_to_flow_vertices(
    transfers: List[TransferStep], from_addr: str, to_addr: str
) -> Tuple[List[str], Dict[str, int]]:
    """Build a sorted vertex list plus index lookup for quick coordinate mapping."""
    addresses = {from_addr.lower(), to_addr.lower()}

    for transfer in transfers:
        addresses.add(transfer.from_address.lower())
        addresses.add(transfer.to_address.lower())
        addresses.add(transfer.token_owner.lower())

    sorted_addresses = sorted(addresses, key=lambda addr: int(addr, 16))
    idx = {addr: i for i, addr in enumerate(sorted_addresses)}

    return sorted_addresses, idx


def create_flow_matrix(from_addr: str, to_addr: str, value: str, transfers: List[TransferStep]) -> Optional[FlowMatrix]:
    """Create flow matrix, return None on validation failure"""
    sender = from_addr.lower()
    receiver = to_addr.lower()

    flow_vertices, idx = transform_to_flow_vertices(transfers, sender, receiver)

    flow_edges = []
    for transfer in transfers:
        is_terminal = transfer.to_address.lower() == receiver
        flow_edges.append(FlowEdge(stream_sink_id=1 if is_terminal else 0, amount=transfer.value))

    has_terminal_edge = any(edge.stream_sink_id == 1 for edge in flow_edges)
    if not has_terminal_edge:
        to_addresses = [t.to_address.lower() for t in transfers]
        try:
            last_edge_index = len(to_addresses) - 1 - to_addresses[::-1].index(receiver)
        except ValueError:
            last_edge_index = -1

        fallback_index = last_edge_index if last_edge_index != -1 else len(flow_edges) - 1
        flow_edges[fallback_index].stream_sink_id = 1

    expected = int(value)
    terminal_sum = sum(int(edge.amount) for edge in flow_edges if edge.stream_sink_id == 1)

    if terminal_sum != expected:
        click.echo(f"Terminal sum {terminal_sum} does not equal expected {expected}")
        return None

    term_edge_ids = [i for i, edge in enumerate(flow_edges) if edge.stream_sink_id == 1]

    streams = [Stream(source_coordinate=idx[sender], flow_edge_ids=term_edge_ids, data=b"")]

    coords = []
    for transfer in transfers:
        coords.append(idx[transfer.token_owner.lower()])
        coords.append(idx[transfer.from_address.lower()])
        coords.append(idx[transfer.to_address.lower()])

    packed_coordinates = pack_coordinates(coords)

    return FlowMatrix(
        flow_vertices=flow_vertices,
        flow_edges=flow_edges,
        streams=streams,
        packed_coordinates=packed_coordinates,
        source_coordinate=idx[sender],
    )


def create_abi_flow_matrix(
    from_addr: str, to_addr: str, value: str, transfers: List[TransferStep]
) -> Optional[Tuple[List[str], List[Tuple], List[Tuple], str]]:
    """Create ABI-ready flow matrix, return None on failure"""
    flow_matrix = create_flow_matrix(from_addr, to_addr, value, transfers)

    if flow_matrix is None:
        return None

    flow_edges_tuples = [(edge.stream_sink_id, int(edge.amount)) for edge in flow_matrix.flow_edges]
    streams_tuples = [(stream.source_coordinate, stream.flow_edge_ids, stream.data) for stream in flow_matrix.streams]
    packed_coords_hex = "0x" + flow_matrix.packed_coordinates.hex()

    return (
        flow_matrix.flow_vertices,
        flow_edges_tuples,
        streams_tuples,
        packed_coords_hex,
    )


def make_jsonrpc_request(url: str, method: str, params: Any, request_id: int = 0) -> Dict[str, Any]:
    """Make a JSON-RPC 2.0 request, return empty dict on failure"""
    try:
        payload = {"jsonrpc": "2.0", "id": request_id, "method": method, "params": params}
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        result = response.json()

        if "error" in result:
            click.echo(f"JSON-RPC error: {result['error']}")
            return {}

        return result
    except Exception as e:
        click.echo(f"Network request failed: {e}")
        return {}


def find_circles_path_and_parse(
    source: str,
    sink: str,
    target_flow: str,
    with_wrap: bool = True,
    pathfinder_url: str = "https://rpc.aboutcircles.com/",
) -> List[TransferStep]:
    """Find a payment path and return empty list on failure"""
    params = [{"Source": source, "Sink": sink, "TargetFlow": target_flow, "WithWrap": with_wrap}]

    pathfinder_response = make_jsonrpc_request(url=pathfinder_url, method="circlesV2_findPath", params=params)

    if not pathfinder_response or "result" not in pathfinder_response:
        return []

    result = pathfinder_response["result"]
    if "transfers" not in result:
        return []

    transfers = []
    for transfer in result["transfers"]:
        transfers.append(
            TransferStep(
                from_address=transfer["from"],
                to_address=transfer["to"],
                token_owner=transfer["tokenOwner"],
                value=transfer["value"],
            )
        )

    return transfers


def _redeem(sub_id: int, module: str, subscriber: str, recipient: str, amount: int) -> bool:
    """Redeem a subscription payment using Circles pathfinder and flow matrix."""
    try:
        amount_str = str(amount)
        click.echo(f"Finding path for sub {sub_id}: {subscriber} -> {recipient} ({amount_str})")

        transfers = find_circles_path_and_parse(
            source=subscriber,
            sink=recipient,
            target_flow=amount_str,
            with_wrap=True,
        )

        if not transfers:
            click.echo(f"No payment path found for sub {sub_id}")
            return False

        click.echo(f"Found {len(transfers)} transfer steps for sub {sub_id}")

        result = create_abi_flow_matrix(from_addr=subscriber, to_addr=recipient, value=amount_str, transfers=transfers)

        if result is None:
            click.echo(f"Flow matrix creation failed for sub {sub_id}")
            return False

        flow_vertices, flow_edges, streams, packed_coordinates = result

        # DEBUG: Print all transaction parameters
        click.echo(f"=== TRANSACTION DEBUG INFO FOR SUB {sub_id} ===")
        click.echo(f"module: {module}")
        click.echo(f"sub_id: {sub_id}")
        click.echo(f"flow_vertices ({len(flow_vertices)} items): {flow_vertices}")
        click.echo(f"flow_edges ({len(flow_edges)} items): {flow_edges}")
        click.echo(f"streams ({len(streams)} items): {streams}")
        click.echo(f"packed_coordinates: {packed_coordinates}")
        click.echo(f"packed_coordinates length: {len(packed_coordinates)} chars")
        click.echo(f"sender: {signer_account.address}")
        click.echo("=== END DEBUG INFO ===")

        subscription_manager.redeemPayment(
            module,
            sub_id,
            flow_vertices,
            flow_edges,
            streams,
            packed_coordinates,
            sender=signer_account,
        )

        click.echo(f"Redemption completed for sub {sub_id} on module {module}")
        return True

    except Exception as e:
        click.echo(f"Redemption failed for sub {sub_id}: {e}")
        return False


# Event watching with proper startup handling
@bot.on_startup()
def bot_startup(startup_state):
    """Process any events missed while the bot was offline."""
    last_processed_block = _load_block_db()
    current_block = chain.blocks.head.number

    click.echo(f"Starting from block {last_processed_block}, current block {current_block}")

    if current_block > last_processed_block:
        click.echo(f"Catching up subscriptions from block {last_processed_block + 1} to {current_block}")
        _process_historical_subscription_creations(start_block=last_processed_block + 1, stop_block=current_block)

    _save_block_db(current_block)


@bot.on_(subscription_manager.SubscriptionCreated)
def handle_subscription_creation(log):
    subscriptions_df = _load_subscriptions_db()
    new_subscription = {
        "block_number": log.block_number,
        "sub_id": log.subId,
        "module": log.module,
        "subscriber": log.subscriber,
        "recipient": log.recipient,
        "amount": log.amount,
        "frequency": log.frequency,
        "redeem_at": 0,
    }

    subscription_df = pd.concat([subscriptions_df, pd.DataFrame([new_subscription])], ignore_index=True)
    _save_subscriptions_db(subscription_df)
    click.echo(f"Sub {log.subId} created on {log.module}")


@bot.on_(subscription_manager.Redeemed)
def handle_redemption(log):
    subscriptions_df = _load_subscriptions_db()
    mask = (subscriptions_df["sub_id"] == log.subId) & (subscriptions_df["module"] == log.module)
    subscriptions_df.loc[mask, "redeem_at"] = log.nextRedeemAt
    _save_subscriptions_db(subscriptions_df)
    click.echo(f"Redemption completed {log.subId} on module {log.module}, next redeem: {log.nextRedeemAt}")


@bot.on_(chain.blocks)
def handle_subscriptions(block):
    bot.state.last_processed_block = block.number
    subscriptions_df = _load_subscriptions_db()

    if subscriptions_df.empty:
        return

    sub_module_pairs = _get_sub_module_pairs_from_df(subscriptions_df)

    for sub_id, module in sub_module_pairs:
        sub_row = subscriptions_df[
            (subscriptions_df["sub_id"] == sub_id) & (subscriptions_df["module"] == module)
        ].iloc[0]

        if sub_row["redeem_at"] == 0:
            click.echo(f"Sub {sub_id} on {module} ready for first redemption")
            _redeem(sub_id, module, sub_row["subscriber"], sub_row["recipient"], sub_row["amount"])
        elif sub_row["redeem_at"] <= block.timestamp:
            click.echo(f"Sub {sub_id} on {module} is due for redemption!")
            _redeem(sub_id, module, sub_row["subscriber"], sub_row["recipient"], sub_row["amount"])
        else:
            time_until_next = sub_row["redeem_at"] - block.timestamp
            click.echo(f"Sub {sub_id} on {module} not due yet. Time remaining: {time_until_next} seconds")


@bot.on_shutdown()
def shutdown_bot():
    click.echo("[Bot] Shutdown triggered.")
    block = getattr(bot.state, "last_processed_block", None)
    if block is not None:
        success = _save_block_db(block)
        if success:
            click.echo(f"[DB] Saved final block {block} to DB.")
