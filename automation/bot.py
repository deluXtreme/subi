import click
from ape import Contract
from silverback import SilverbackBot

# Addresses
HUB_ADDRESS = "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8"

SUBSCRIPTION_MODULE_MASTERCOPY = "0xd1F11A260720010D43587317CF8Dad46aF129744"
MODULE_PROXY_FACTORY_ADDRESS = "0x000000000000aDdB49795b0f9bA5BC298cDda236"


# Contracts
HUB = Contract(HUB_ADDRESS)
MODULE_PROXY_FACTORY = Contract(MODULE_PROXY_FACTORY_ADDRESS)

# Instantiate bot
bot = SilverbackBot()


# Event watching
@bot.on_(MODULE_PROXY_FACTORY.ModuleProxyCreation, filter_args={"masterCopy": SUBSCRIPTION_MODULE_MASTERCOPY})
def handle_proxy_creation(log):
    click.echo(f"Subscrition Module Proxy Created: {log.proxy}")
