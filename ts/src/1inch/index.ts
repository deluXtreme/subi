import { NetworkEnum, SDK } from "@1inch/cross-chain-sdk";
import { getAddress, parseEther } from "viem";
import { isAxiosError } from "axios";
import { ViemConnector } from "./adapter";
import { fusionSwap } from "./example";

const makerPrivateKey = process.env.WALLET_KEY as `0x${string}`; // should be a 0x-prefixed hex string
const nodeUrl = process.env.RPC_URL; // suggested for ethereum https://eth.llamarpc.com
const devPortalApiKey = process.env.DEV_PORTAL_KEY;

// Validate environment variables
if (!makerPrivateKey || !nodeUrl || !devPortalApiKey) {
  throw new Error(
    "Missing required environment variables. Please check your .env file.",
  );
}

const blockchainProvider = new ViemConnector(nodeUrl, makerPrivateKey);

const sdk = new SDK({
  url: "https://api.1inch.dev/fusion-plus",
  authKey: devPortalApiKey,
  blockchainProvider,
});

let srcChainId = NetworkEnum.OPTIMISM;
let dstChainId = NetworkEnum.GNOSIS;
let srcTokenAddress = getAddress("0x4200000000000000000000000000000000000006"); // WXDAI on Gnosis
let dstTokenAddress = getAddress("0xe91d153e0b41518a2ce8dd3d7944fa863463a97d"); // WETH on Optimism

fusionSwap(
  sdk,
  blockchainProvider.publicKey(),
  srcChainId,
  dstChainId,
  srcTokenAddress,
  dstTokenAddress,
  parseEther("0.0025").toString(),
)
  .then((result) => {
    console.log("Swap result:", result);
  })
  .catch((error) => {
    const reason =
      isAxiosError(error) && error.response?.data?.description
        ? error.response.data.description
        : error.toString();
    console.error("Error during swap:", reason);
  });