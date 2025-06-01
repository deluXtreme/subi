import { getAddress } from "viem";
import { batchInstall } from "./batchInstall";
import { SUBSCRIPTION_MANAGER } from "./constants";

console.log("Running deploy & enable module script...");
const safeAddress = process.env.SAFE_ADDRESS;
if (!safeAddress) {
  throw new Error("Missing SAFE_ADDRESS");
}
console.log("Safe address from env:", safeAddress);

batchInstall(getAddress(safeAddress), SUBSCRIPTION_MANAGER)
  .then((hash) => {
    console.log("Tx Hash:", hash);
  })
  .catch((err) => console.error(err));
