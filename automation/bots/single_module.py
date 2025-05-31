import os
from dataclasses import dataclass
from typing import Any, Dict, List, Tuple

import click
import pandas as pd
import requests
from ape import Contract, accounts, chain
from ape.types import LogFilter
from ape_ethereum import multicall
from silverback import SilverbackBot, StateSnapshot

# Instantiate bot
bot = SilverbackBot()

# Auto sign
PROMPT_AUTOSIGN = bot.signer

# File path configuration
BLOCK_FILEPATH = os.environ.get("BLOCK_FILEPATH", ".db/block.csv")
SUBSCRIPTIONS_FILEPATH = os.environ.get("SUBSCRIPTIONS_FILEPATH", ".db/subscriptions.csv")

# Variables
START_BLOCK = int(os.environ.get("START_BLOCK", chain.blocks.head.number))

# Addresses
HUB_ADDRESS = "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8"
SUBSCRIPTION_MODULE = "0x01E65042f8CE628f07bba35c97883825e7B97c2f"

# Contracts
hub = Contract(HUB_ADDRESS, abi="abi/Hub.json")
subscription_module = Contract(SUBSCRIPTION_MODULE, abi="abi/SubscriptionModule.json")


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


def create_flow_matrix(
    from_addr: str, to_addr: str, value: str, transfers: List[TransferStep]
) -> FlowMatrix:
    """Create an ABI-ready FlowMatrix object from a list of TransferSteps."""
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
        raise ValueError(f"Terminal sum {terminal_sum} does not equal expected {expected}")

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
) -> Tuple[List[str], List[Tuple], List[Tuple], str]:
    """Create ABI-ready flow matrix arguments for operateFlowMatrix function."""
    flow_matrix = create_flow_matrix(from_addr, to_addr, value, transfers)

    flow_edges_tuples = [(edge.stream_sink_id, int(edge.amount)) for edge in flow_matrix.flow_edges]
    streams_tuples = [
        (stream.source_coordinate, stream.flow_edge_ids, stream.data)
        for stream in flow_matrix.streams
    ]
    packed_coords_hex = "0x" + flow_matrix.packed_coordinates.hex()

    return (
        flow_matrix.flow_vertices,
        flow_edges_tuples,
        streams_tuples,
        packed_coords_hex,
    )


def make_jsonrpc_request(url: str, method: str, params: Any, request_id: int = 0) -> Dict[str, Any]:
    """Make a JSON-RPC 2.0 request."""
    payload = {"jsonrpc": "2.0", "id": request_id, "method": method, "params": params}

    response = requests.post(url, json=payload)
    response.raise_for_status()

    result = response.json()

    if "error" in result:
        raise ValueError(f"JSON-RPC error: {result['error']}")

    return result


def find_circles_path_and_parse(
    source: str,
    sink: str,
    target_flow: str,
    with_wrap: bool = True,
    pathfinder_url: str = "https://rpc.aboutcircles.com/",
) -> List[TransferStep]:
    """Find a payment path and return parsed TransferStep objects."""
    params = [
        {
            "Source": source,
            "Sink": sink,
            "TargetFlow": target_flow,
            "WithWrap": with_wrap,
        }
    ]

    pathfinder_response = make_jsonrpc_request(
        url=pathfinder_url, method="circlesV2_findPath", params=params
    )

    if "result" not in pathfinder_response:
        raise ValueError("No result in pathfinder response")

    result = pathfinder_response["result"]

    if "transfers" not in result:
        raise ValueError("No transfers in pathfinder result")

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


# Block tracking functions
def _load_block_db() -> int:
    """Load the last processed block from CSV file or create new if doesn't exist"""
    df = (
        pd.read_csv(BLOCK_FILEPATH)
        if os.path.exists(BLOCK_FILEPATH)
        else pd.DataFrame({"last_processed_block": [START_BLOCK]})
    )
    return df["last_processed_block"].iloc[0]


def _save_block_db(block_number: int) -> None:
    """Save the last processed block to CSV file"""
    os.makedirs(os.path.dirname(BLOCK_FILEPATH), exist_ok=True)
    df = pd.DataFrame({"last_processed_block": [block_number]})
    df.to_csv(BLOCK_FILEPATH, index=False)


# Subscriptions tracking functions
def _load_subscriptions_db() -> pd.DataFrame:
    """Load subscriptions database from CSV file or create new if doesn't exist"""
    dtype = {
        "block_number": int,
        "sub_id": int,
        "subscriber": str,
        "recipient": str,
        "amount": int,
        "frequency": int,
    }

    df = (
        pd.read_csv(SUBSCRIPTIONS_FILEPATH, dtype=dtype)
        if os.path.exists(SUBSCRIPTIONS_FILEPATH)
        else pd.DataFrame(columns=dtype.keys()).astype(dtype)
    )
    return df


def _save_subscriptions_db(df: pd.DataFrame) -> None:
    """Save subscriptions to CSV file"""
    os.makedirs(os.path.dirname(SUBSCRIPTIONS_FILEPATH), exist_ok=True)
    df.to_csv(SUBSCRIPTIONS_FILEPATH, index=False)


# Historical events helper functions
def _get_historical_subscription_creations(
    start_block: int,
    stop_block: int = chain.blocks.head.number,
):
    """Get historical SubscriptionCreated events"""
    log_filter = LogFilter(
        addresses=[subscription_module.address],
        events=[subscription_module.SubscriptionCreated.abi],
        start_block=start_block,
        stop_block=stop_block,
    )

    for log in accounts.provider.get_contract_logs(log_filter):
        yield log


def _process_historical_subscription_creations(start_block: int, stop_block: int) -> None:
    """Process historical subscription creation events and store in database"""
    subscription_creations = []
    subscriptions_df = _load_subscriptions_db()

    for log in _get_historical_subscription_creations(start_block, stop_block):
        new_subscription = {
            "block_number": log.block_number,
            "sub_id": log.subId,
            "subscriber": log.subscriber,
            "recipient": log.recipient,
            "amount": log.amount,
            "frequency": log.frequency,
        }

        subscription_creations.append(new_subscription)
        click.echo(
            f"Subscription {log.subId}: {log.subscriber} -> {log.recipient} "
            f"(amount: {log.amount}, frequency: {log.frequency}) at block {log.block_number}"
        )

    if subscription_creations:
        click.echo(f"Found {len(subscription_creations)} historical subscription creations")
        subscription_df = pd.concat(
            [subscriptions_df, pd.DataFrame(subscription_creations)], ignore_index=True
        )
        _save_subscriptions_db(subscription_df)
    else:
        click.echo(
            f"No historical subscription creations found in blocks {start_block}-{stop_block}"
        )


def _catch_up_subscription_creations(current_block: int) -> None:
    """Catch up on SubscriptionCreated events from last processed block"""
    last_processed_block = _load_block_db()

    if current_block <= last_processed_block:
        return

    click.echo(
        f"Catching up subscription creations from block {last_processed_block + 1} to {current_block}"
    )
    _process_historical_subscription_creations(
        start_block=last_processed_block + 1, stop_block=current_block
    )


# Subscription processing helper functions
def _get_sub_ids_from_df(subscriptions_df: pd.DataFrame) -> list[int]:
    """Extract unique subscription IDs from dataframe"""
    return subscriptions_df["sub_id"].unique().tolist()


def _get_subscription_data_multicall(sub_ids: list[int]) -> dict:
    """Get subscription data for multiple sub IDs using multicall"""
    if not sub_ids:
        return {}

    call = multicall.Call()
    for sub_id in sub_ids:
        call.add(subscription_module.subscriptions, sub_id)

    results = list(call())  # Convert generator to list

    # Convert results to dict with sub_id as key
    subscription_data = {}
    for i, sub_id in enumerate(sub_ids):
        if i < len(results):
            subscription_data[sub_id] = results[i]

    return subscription_data


# Event watching
@bot.on_startup()
def bot_startup(startup_state: StateSnapshot):
    last_processed_block = _load_block_db()
    current_block = chain.blocks.head.number

    click.echo(f"Starting from block {last_processed_block}, current block {current_block}")

    # Catch up on historical events
    _catch_up_subscription_creations(current_block)

    # Update to current block
    _save_block_db(current_block)


@bot.on_(subscription_module.SubscriptionCreated)
def handle_subscription_creation(log):
    subscriptions_df = _load_subscriptions_db()
    new_subscription = {
        "block_number": log.block_number,
        "sub_id": log.subId,
        "subscriber": log.subscriber,
        "recipient": log.recipient,
        "amount": log.amount,
        "frequency": log.frequency,
    }

    subscription_df = pd.concat(
        [subscriptions_df, pd.DataFrame([new_subscription])], ignore_index=True
    )
    _save_subscriptions_db(subscription_df)

    click.echo(
        f"Subscription Created: {log.subId} - {log.subscriber} -> {log.recipient} "
        f"(amount: {log.amount}, frequency: {log.frequency})"
    )


def _redeem(sub_id: int, subscriber: str, recipient: str, amount: int) -> bool:
    """
    Redeem a subscription payment using Circles pathfinder and flow matrix.

    Args:
        sub_id: Subscription ID
        subscriber: Subscriber address (source)
        recipient: Recipient address (destination)
        amount: Amount to transfer

    Returns:
        True if redemption was successful, False otherwise
    """
    try:
        # Convert amount to string for pathfinder
        amount_str = str(amount)

        click.echo(
            f"Finding payment path for sub {sub_id}: {subscriber} -> {recipient} ({amount_str})"
        )

        # Find path using pathfinder
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

        # Create ABI arguments for flow matrix
        flow_vertices, flow_edges, streams, packed_coordinates = create_abi_flow_matrix(
            from_addr=subscriber, to_addr=recipient, value=amount_str, transfers=transfers
        )

        # Print detailed input parameters
        click.echo(f"\n=== REDEEM PAYMENT PARAMETERS FOR SUB {sub_id} ===")
        click.echo(f"sub_id: {sub_id}")
        click.echo(f"flow_vertices ({len(flow_vertices)} items): {flow_vertices}")
        click.echo(f"flow_edges ({len(flow_edges)} items): {flow_edges}")
        click.echo(f"streams ({len(streams)} items): {streams}")
        click.echo(f"packed_coordinates: {packed_coordinates}")
        click.echo(f"packed_coordinates length: {len(packed_coordinates)} chars")
        click.echo("=" * 50)

        # Execute the redemption transaction
        subscription_module.redeemPayment(
            sub_id, flow_vertices, flow_edges, streams, packed_coordinates, sender=bot.signer
        )

        click.echo(f"✓ Redemption completed for sub {sub_id}")
        return True

    except Exception as e:
        click.echo(f"✗ Redemption failed for sub {sub_id}: {e}")
        return False


@bot.on_(chain.blocks)
def handle_subscriptions(block):
    _save_block_db(block.number)

    # Load current subscriptions
    subscriptions_df = _load_subscriptions_db()

    if subscriptions_df.empty:
        return

    # Get subscription IDs and fetch current data
    sub_ids = _get_sub_ids_from_df(subscriptions_df)
    subscription_data = _get_subscription_data_multicall(sub_ids)

    # Process subscriptions with current data
    for sub_id, data in subscription_data.items():
        # Check if subscription is due for redemption
        next_redemption_time = data.lastRedeemed + data.frequency
        current_timestamp = block.timestamp

        if next_redemption_time <= current_timestamp:
            click.echo(f"Sub {sub_id} is due for redemption!")

            # Get subscriber from CSV data
            sub = subscriptions_df[subscriptions_df["sub_id"] == sub_id].iloc[0]

            # Execute redemption
            _redeem(sub_id, sub["subscriber"], data.recipient, data.amount)
        else:
            time_until_next = next_redemption_time - current_timestamp
            click.echo(f"Sub {sub_id} not due yet. Time remaining: {time_until_next} seconds")
