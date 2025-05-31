import { getAddress, type Address } from "viem";
import { deployModule } from "./cliInstall";
import { getSafe } from "./config";
import { batchInstall } from "./batchInstall";

console.log("Running deploy & enable module script...");
const safeAddress = process.env.SAFE_ADDRESS;
if (!safeAddress) {
  throw new Error("Missing SAFE_ADDRESS");
}
console.log("Safe address from env:", safeAddress);

async function checkEnabled(
  safeAddress: string,
  moduleAddress: string,
): Promise<boolean> {
  const safe = await getSafe(safeAddress);
  return safe.isModuleEnabled(moduleAddress);
}

batchInstall(getAddress(safeAddress))
  .then(({ moduleAddress, enableHash }) => {
    checkEnabled(safeAddress, moduleAddress)
      .then((enabled) => console.log("Safe has Module Enabled", enabled))
      .catch();
    console.log("Tx Hash:", enableHash);
  })
  .catch((err) => console.error(err));
