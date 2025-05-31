import os

import click
import pandas as pd
from ape import Contract, accounts, chain
from ape.types import LogFilter
from silverback import SilverbackBot, StateSnapshot

# Instantiate bot
bot = SilverbackBot()

# File path configuration
BLOCK_FILEPATH = os.environ.get("BLOCK_FILEPATH", ".db/block.csv")
SUBSCRIPTIONS_FILEPATH = os.environ.get("SUBSCRIPTIONS_FILEPATH", ".db/subscriptions.csv")
MODULE_ADDRESSES_FILEPATH = os.environ.get("MODULE_ADDRESSES_FILEPATH", ".db/module_addresses.csv")

# Variables
START_BLOCK = int(os.environ.get("START_BLOCK", chain.blocks.head.number))

# Addresses
HUB_ADDRESS = "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8"
SUBSCRIPTION_MODULE_MASTERCOPY = "0xd1F11A260720010D43587317CF8Dad46aF129744"
MODULE_PROXY_FACTORY_ADDRESS = "0x000000000000aDdB49795b0f9bA5BC298cDda236"


# Contracts
hub = Contract(HUB_ADDRESS, abi="abi/Hub.json")
module_proxy_factory = Contract(MODULE_PROXY_FACTORY_ADDRESS, abi="abi/ModuleProxyFactory.json")


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


# Module addresses tracking functions
def _load_module_addresses_db() -> pd.DataFrame:
    """Load module addresses database from CSV file or create new if doesn't exist"""
    dtype = {
        "block_number": int,
        "subscription_module_address": str,
        "owner": str,
    }

    df = (
        pd.read_csv(MODULE_ADDRESSES_FILEPATH, dtype=dtype)
        if os.path.exists(MODULE_ADDRESSES_FILEPATH)
        else pd.DataFrame(columns=dtype.keys()).astype(dtype)
    )
    return df


def _save_module_addresses_db(df: pd.DataFrame) -> None:
    """Save module addresses to CSV file"""
    os.makedirs(os.path.dirname(MODULE_ADDRESSES_FILEPATH), exist_ok=True)
    df.to_csv(MODULE_ADDRESSES_FILEPATH, index=False)


def _get_proxy_owner(proxy_address: str) -> str:
    """Get the owner of a proxy contract"""
    try:
        proxy_contract = Contract(proxy_address, abi="abi/SubscriptionModule.json")
        return proxy_contract.owner()
    except Exception as e:
        click.echo(f"Error getting owner for {proxy_address}: {e}")
        return "unknown"


# Historical events helper functions
def _get_historical_proxy_creations(
    start_block: int,
    stop_block: int = chain.blocks.head.number,
):
    """Get historical ModuleProxyCreation events"""
    log_filter = LogFilter(
        addresses=[module_proxy_factory.address],
        events=[module_proxy_factory.ModuleProxyCreation.abi],
        start_block=start_block,
        stop_block=stop_block,
    )

    for log in accounts.provider.get_contract_logs(log_filter):
        if log.masterCopy == SUBSCRIPTION_MODULE_MASTERCOPY:
            yield log


def _process_historical_proxy_creations(start_block: int, stop_block: int) -> None:
    """Process historical proxy creation events and store in database"""
    proxy_creations = []
    module_addresses_df = _load_module_addresses_db()

    for log in _get_historical_proxy_creations(start_block, stop_block):
        proxy_address = log.proxy
        owner = _get_proxy_owner(proxy_address)

        new_module = {
            "block_number": log.block_number,
            "subscription_module_address": proxy_address,
            "owner": owner,
        }

        proxy_creations.append(new_module)
        click.echo(f"Proxy address: {proxy_address} (owner: {owner}) at block {log.block_number}")

    if proxy_creations:
        click.echo(f"Found {len(proxy_creations)} historical proxy creations")
        module_df = pd.concat(
            [module_addresses_df, pd.DataFrame(proxy_creations)], ignore_index=True
        )
        _save_module_addresses_db(module_df)
    else:
        click.echo(f"No historical proxy creations found in blocks {start_block}-{stop_block}")


def _catch_up_proxy_creations(current_block: int) -> None:
    """Catch up on ModuleProxyCreation events from last processed block"""
    last_processed_block = _load_block_db()

    if current_block <= last_processed_block:
        return

    click.echo(
        f"Catching up proxy creations from block {last_processed_block + 1} to {current_block}"
    )
    _process_historical_proxy_creations(
        start_block=last_processed_block + 1, stop_block=current_block
    )


# Event watching
@bot.on_startup()
def bot_startup(startup_state: StateSnapshot):
    last_processed_block = _load_block_db()
    current_block = chain.blocks.head.number

    click.echo(f"Starting from block {last_processed_block}, current block {current_block}")

    # Catch up on historical events
    _catch_up_proxy_creations(current_block)

    # Update to current block
    _save_block_db(current_block)


@bot.on_(module_proxy_factory.ModuleProxyCreation)
def handle_proxy_creation(log):
    if log.masterCopy != SUBSCRIPTION_MODULE_MASTERCOPY:
        return

    owner = _get_proxy_owner(log.proxy)
    module_addresses_df = _load_module_addresses_db()
    new_module = {
        "block_number": log.block_number,
        "subscription_module_address": log.proxy,
        "owner": owner,
    }

    module_df = pd.concat([module_addresses_df, pd.DataFrame([new_module])], ignore_index=True)
    _save_module_addresses_db(module_df)

    click.echo(f"Subscription Module Proxy Created: {log.proxy} (owner: {owner})")


@bot.on_(chain.blocks)
def handle_subscriptions(block):
    _save_block_db(block.number)
