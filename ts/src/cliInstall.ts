import {
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  parseAbi,
  type Hash,
} from "viem";
import { getSafe, getWalletClient, SIGNER_ACCOUNT } from "./config";
import { MODULE_PROXY_FACTORY, SUBSCRIPTION_MASTER_COPY } from "./constants";
import { buildEnableModuleTx } from "./lib";

export async function deployModule(
  safeAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<{ moduleAddress: Address; deployHash: Hash; enableHash: Hash }> {
  const walletClient = getWalletClient();

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
    args: [SUBSCRIPTION_MASTER_COPY, initData, salt],
    account: SIGNER_ACCOUNT,
  });
  console.log("Tx Request", request);
  // TODO Here we should just encode function call.

  const moduleAddress = result as Address;
  const txHash = await walletClient.writeContract(request);

  console.log(`Subscription Module deployed at:`, moduleAddress);

  // Prepare the meta-transaction data object
  const enableModuleTx = buildEnableModuleTx(safeAddress, moduleAddress);

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
