import {
  createWalletClient,
  http,
  publicActions,
  type Address,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis } from "viem/chains";
import Safe from "@safe-global/protocol-kit";
import fs from "fs";
import path from "path";

export const SIGNER_PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
if (!SIGNER_PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY env variable");
}
export const SIGNER_ACCOUNT = privateKeyToAccount(SIGNER_PRIVATE_KEY);

const chain = gnosis;
const rpcUrl = "https://rpc.gnosischain.com/";

export const getWalletClient = () => {
  return createWalletClient({
    chain: gnosis,
    transport: http(rpcUrl),
  }).extend(publicActions);
};

export const updateContractsJson = (key: string, value: string) => {
  const contractsPath = path.join(
    __dirname,
    "../../deployments/contracts.json",
  );
  const contracts = JSON.parse(fs.readFileSync(contractsPath, "utf8"));

  if (!contracts.chains[chain.id]) {
    contracts.chains[chain.id] = {};
  }

  contracts.chains[chain.id][key] = value;
  fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2));
};

export const getSafe = async (safeAddress: string): Promise<Safe> => {
  return await Safe.init({
    provider: rpcUrl,
    signer: SIGNER_PRIVATE_KEY,
    safeAddress,
  });
};

export const getContractAddress = (contractKey: string): Address => {
  const contractsPath = path.join(
    __dirname,
    "../../deployments/contracts.json",
  );
  const contracts = JSON.parse(fs.readFileSync(contractsPath, "utf8"));

  const address = contracts.chains[chain.id]?.[contractKey];
  if (!address) {
    throw new Error(`No address found for ${contractKey} on chain ${chain.id}`);
  }

  return address;
};
