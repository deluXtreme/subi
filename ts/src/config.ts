import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis } from "viem/chains";
import Safe from "@safe-global/protocol-kit";

export const SIGNER_PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
if (!SIGNER_PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY env variable");
}
export const SIGNER_ACCOUNT = privateKeyToAccount(SIGNER_PRIVATE_KEY);

const rpcUrl = "https://rpc.gnosischain.com/";

export const getWalletClient = () => {
  return createWalletClient({
    chain: gnosis,
    transport: http(rpcUrl),
    account: SIGNER_ACCOUNT,
  }).extend(publicActions);
};

export const getClient = () => {
  return createPublicClient({
    chain: gnosis,
    transport: http(rpcUrl),
  });
};

export const getSafe = async (safeAddress: string): Promise<Safe> => {
  return await Safe.init({
    provider: rpcUrl,
    signer: SIGNER_PRIVATE_KEY,
    safeAddress,
  });
};
