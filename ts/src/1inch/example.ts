import {
  SDK,
  HashLock,
  type SupportedChain,
  Quote,
} from "@1inch/cross-chain-sdk";
import { randomBytes } from "crypto";
import { encodePacked, toHex, type Address, type Hex } from "viem";

// TODO: This is not an expoted member of the SDK, but it is used in the example.
export type MerkleLeaf = string & { _tag: "MerkleLeaf" };
export interface SecretData {
  secrets: Hex[];
  secretHashes: Hex[];
  hashLock: HashLock;
}

export async function fusionSwap(
  sdk: SDK,
  account: Address,
  srcChainId: SupportedChain,
  dstChainId: SupportedChain,
  srcTokenAddress: Address,
  dstTokenAddress: Address,
  amount: string,
) {

  console.log(
    `Starting Fusion+ swap from ${srcChainId} to ${dstChainId} for ${amount} of ${srcTokenAddress} to ${dstTokenAddress}`,
  );
  const invert = false;

  if (invert) {
    const temp = srcChainId;
    srcChainId = dstChainId;
    dstChainId = temp;

    const tempAddress = srcTokenAddress;
    srcTokenAddress = dstTokenAddress;
    dstTokenAddress = tempAddress;
  }

  // Approve tokens for spending.
  // If you need to approve the tokens before posting an order, this code can be uncommented for first run.
  // console.log("Approve Router");
  // const approvalHash = await blockchainProvider.approveRouter(
  //   srcTokenAddress as `0x${string}`,
  // );
  // console.log("Approval hash:", approvalHash);

  const params = {
    srcChainId,
    dstChainId,
    srcTokenAddress,
    dstTokenAddress,
    amount,
    enableEstimate: true,
    walletAddress: account,
  };
  console.log("Getting Quote");
  const quote = await sdk.getQuote(params);
  console.log("Received Fusion+ quote from 1inch API, generating secrets...");
  const secretData = generateSecrets(quote);
  console.log(`SecretData: ${secretData}`);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 5 seconds before next poll
  const quoteResponse = await sdk.placeOrder(quote, {
    walletAddress: params.walletAddress,
    ...secretData,
  });

  const orderHash = quoteResponse.orderHash as `0x${string}`;
  await orderExecution(sdk, orderHash);

  console.log(`Order placed: ${orderHash}`);
  acceptFills(sdk, orderHash, secretData);
}

async function orderExecution(sdk: SDK, orderHash: Hex, pollInterval: number = 5000): Promise<void> {
  let order = await sdk.getOrderStatus(orderHash);
  console.log(`Polling for fills until order status is set to "executed"...`);
  while (order.status !== "executed") {
    console.log("Order Status", order.status);
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    order = await sdk.getOrderStatus(orderHash);
  }
}

export async function acceptFills(
  sdk: SDK,
  orderHash: `0x${string}`,
  secretData: SecretData,
): Promise<void> {
  await orderExecution(sdk, orderHash);
  const { secrets, secretHashes } = secretData;

  const fillsObject = await sdk.getReadyToAcceptSecretFills(orderHash);
  console.log("HELLO", fillsObject);
  if (fillsObject.fills.length > 0) {
    fillsObject.fills.forEach((fill) => {
      console.log(fill);
      sdk
        .submitSecret(orderHash, secrets[fill.idx]!)
        .then(() => {
          console.log(
            `Fill order found! Secret submitted: ${JSON.stringify(secretHashes[fill.idx], null, 2)}`,
          );
        })
        .catch((error) => {
          console.error(
            `Error submitting secret: ${JSON.stringify(error, null, 2)}`,
          );
        });
    });
  }
}

function generateSecrets(quote: Quote): SecretData {
  const secretsCount = quote.getPreset().secretsCount;

  const secrets = Array.from({ length: secretsCount }).map(() =>
    toHex(randomBytes(32)),
  );
  return buildSecretData(secrets, secretsCount);
}

export function buildSecretData(secrets: Hex[], secretsCount: number): SecretData {
  const secretHashes = secrets.map((x) => HashLock.hashSecret(x) as Hex);

  const hashLock =
    secretsCount === 1
      ? HashLock.forSingleFill(secrets[0]!)
      : HashLock.forMultipleFills(
          secretHashes.map(
            (secretHash, i) =>
              encodePacked(
                ["uint64", "bytes32"],
                [BigInt(i), secretHash],
              ) as MerkleLeaf,
          ),
        );
  return {
    secrets,
    secretHashes,
    hashLock,
  };
}
