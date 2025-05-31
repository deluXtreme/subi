import { type Address, type Hash } from "viem";
import { getClient, getSafe } from "./config";
import {
  buildModuleDeploymentTx,
  buildEnableModuleTx,
  buildRegisterManagerTx,
  buildModuleApprovalTx,
} from "./lib";
import { HUB_ADDRESS } from "./constants";
import type { MetaTransactionData } from "@safe-global/types-kit";

export async function prepareEnableModuleTransactions(
  safeAddress: Address,
  managerAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<MetaTransactionData[]> {
const client = getClient();

  const { tx: deployModuleTx, predictedAddress: moduleProxyAddress } =
    await buildModuleDeploymentTx(client, safeAddress, salt);

  console.log(`Subscription Module address:`, moduleProxyAddress);

  // Prepare the meta-transaction data object
  const enableModuleTx = buildEnableModuleTx(safeAddress, moduleProxyAddress);
  const registerModuleTx = buildRegisterManagerTx(
    moduleProxyAddress,
    managerAddress,
  );
  const moduleApprovalTx = buildModuleApprovalTx(HUB_ADDRESS, moduleProxyAddress);
  console.log("Deploy Tx", deployModuleTx);
  console.log("Enable Tx", enableModuleTx);
  console.log("Register Tx", registerModuleTx);
  console.log("Approval Tx", moduleApprovalTx);
  console.log("Predicted Address", moduleProxyAddress);

  return [deployModuleTx, enableModuleTx, registerModuleTx, moduleApprovalTx];
}


export async function batchInstall(
  safeAddress: Address,
  managerAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<Hash> {
  const transactions = await prepareEnableModuleTransactions(safeAddress, managerAddress, salt);
  // Build the Safe transaction
  const safe = await getSafe(safeAddress);
  const safeModuleTx = await safe.createTransaction({transactions});
  console.log("Safe transaction built", safeModuleTx);

  // Sign the transaction using the locally configured signer (PRIVATE_KEY)
  const signedEnableModuleTx = await safe.signTransaction(safeModuleTx);
  console.log("Transaction signed");
  // https://github.com/safe-global/safe-core-sdk/blob/82cfd46b2d905cea2138adb4a65a7b02c74632aa/packages/protocol-kit/src/Safe.ts#L1369
  // Execute the transaction and obtain the transaction hash
  const { hash } = await safe.executeTransaction(signedEnableModuleTx);
  console.log("Transaction executed successfully:", hash);
  return hash as Hash;
}
