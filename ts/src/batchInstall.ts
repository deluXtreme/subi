import { type Address, type Hash } from "viem";
import { getClient, getSafe } from "./config";
import {
  buildModuleDeploymentTx,
  buildEnableModuleTx,
  buildRegisterManagerTx,
} from "./lib";

export async function batchInstall(
  safeAddress: Address,
  managerAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<{ moduleAddress: Address; enableHash: Hash }> {
  const client = getClient();

  const { tx: deployModuleTx, predictedAddress } =
    await buildModuleDeploymentTx(client, safeAddress, salt);

  const moduleAddress = predictedAddress;
  console.log(`Subscription Module address:`, moduleAddress);

  // Prepare the meta-transaction data object
  const enableModuleTx = buildEnableModuleTx(safeAddress, moduleAddress);
  const registerModuleTx = buildRegisterManagerTx(
    moduleAddress,
    managerAddress,
  );
  console.log("Deploy Tx", deployModuleTx);
  console.log("Enable Tx", enableModuleTx);
  console.log("Register Tx", registerModuleTx);
  console.log("Predicted Address", predictedAddress);
  // Build the Safe transaction
  const safe = await getSafe(safeAddress);
  const safeModuleTx = await safe.createTransaction({
    transactions: [deployModuleTx, enableModuleTx, registerModuleTx],
  });
  console.log("Safe transaction built", safeModuleTx);

  // Sign the transaction using the locally configured signer (PRIVATE_KEY)
  const signedEnableModuleTx = await safe.signTransaction(safeModuleTx);
  console.log("Transaction signed");
  // https://github.com/safe-global/safe-core-sdk/blob/82cfd46b2d905cea2138adb4a65a7b02c74632aa/packages/protocol-kit/src/Safe.ts#L1369
  // Execute the transaction and obtain the transaction hash
  const { hash } = await safe.executeTransaction(signedEnableModuleTx);
  console.log("Transaction executed successfully:", hash);

  return { moduleAddress, enableHash: hash as Hash };
}
