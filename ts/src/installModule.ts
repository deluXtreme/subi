import {
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  parseAbi,
  type Hash,
} from "viem";
import {
  getContractAddress,
  getSafe,
  getWalletClient,
  SIGNER_ACCOUNT,
  updateContractsJson,
} from "./config";
import {
  OperationType,
  type MetaTransactionData,
} from "@safe-global/types-kit";

const MODULE_PROXY_FACTORY =
  "0x000000000000aDdB49795b0f9bA5BC298cDda236" as Address;

export async function deployModule(
  safeAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<{ moduleAddress: Address; deployHash: Hash; enableHash: Hash }> {
  const walletClient = getWalletClient();
  const subscriptionModuleMasterCopy = getContractAddress(
    "subscriptionModuleMasterCopy",
  );

  const initParams = encodeAbiParameters(
    parseAbiParameters("address x, address y, address z"),
    [safeAddress, safeAddress, safeAddress],
  );

  const initData = encodeFunctionData({
    abi: parseAbi(["function setUp(bytes memory initParams)"]),
    functionName: "setUp",
    args: [initParams],
  });

  const { result, request } = await walletClient.simulateContract({
    address: MODULE_PROXY_FACTORY,
    abi: parseAbi([
      "function deployModule(address masterCopy,bytes memory initializer, uint256 saltNonce) public returns (address proxy)",
    ]),
    functionName: "deployModule",
    args: [subscriptionModuleMasterCopy, initData, salt],
    account: SIGNER_ACCOUNT,
  });
  // TODO Here we should just encode function call.

  const moduleAddress = result as Address;
  const txHash = await walletClient.writeContract(request);

  console.log(`Subscription Module deployed at:`, moduleAddress);
  console.log("Transaction hash:", txHash);

  updateContractsJson("subscriptionModuleProxy", moduleAddress);

  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function enableModule(address module)"]),
    functionName: "enableModule",
    args: [moduleAddress],
  });
  console.log("Enable module data created:", enableModuleData);

  // Prepare the meta-transaction data object
  const enableModuleTx: MetaTransactionData = {
    to: safeAddress,
    value: "0",
    data: enableModuleData,
    operation: OperationType.Call,
  };
  console.log("Transaction data prepared:", enableModuleTx);

  // Build the Safe transaction
  const safe = await getSafe(safeAddress);
  const safeModuleTx = await safe.createTransaction({
    transactions: [enableModuleTx],
  });
  console.log("Safe transaction built");

  // Sign the transaction using the locally configured signer (PRIVATE_KEY)
  const signedEnableModuleTx = await safe.signTransaction(safeModuleTx);
  console.log("Transaction signed");
  // https://github.com/safe-global/safe-core-sdk/blob/82cfd46b2d905cea2138adb4a65a7b02c74632aa/packages/protocol-kit/src/Safe.ts#L1369
  // Execute the transaction and obtain the transaction hash
  const { hash } = await safe.executeTransaction(signedEnableModuleTx);
  console.log("Transaction executed successfully:", hash);

  return { moduleAddress, deployHash: txHash, enableHash: hash as Hash };
}
