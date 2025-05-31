import { getAddress } from "viem";
import { deployModule } from "./cliInstall";

console.log("Running deploy & enable module script...");
const safeAddress =
  process.env.SAFE_ADDRESS;
if (!safeAddress) {
  throw new Error("Missing SAFE_ADDRESS");
}
console.log("Safe address from env:", safeAddress);

deployModule(getAddress(safeAddress))
  .then((x) => console.log("Success", x))
  .catch((err) => console.error(err));
