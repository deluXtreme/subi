import {
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  parseAbi,
  keccak256,
  encodePacked,
  type Hex,
  getCreate2Address,
  http,
  createPublicClient,
  getAddress,
} from "viem";
import { type MetaTransactionData } from "@safe-global/types-kit";
import {
  HUB_ADDRESS,
  MODULE_PROXY_FACTORY,
  SUBSCRIPTION_MANAGER,
  SUBSCRIPTION_MASTER_COPY,
} from "./constants";
import { gnosis } from "viem/chains";

const defaultSalt = BigInt(
  "110647465789069657756111682142268192901188952877020749627246931254533522453",
);
// TODO: Use Config.
export const getClient = () => {
  return createPublicClient({
    chain: gnosis,
    transport: http("https://rpc.gnosischain.com/"),
  });
};

export async function prepareEnableModuleTransactions(
  safeAddress: Address,
  managerAddress: Address = SUBSCRIPTION_MANAGER,
  salt: bigint = defaultSalt,
): Promise<MetaTransactionData[]> {
  const { tx: deployModuleTx, predictedAddress: moduleProxyAddress } =
    await buildModuleDeploymentTx(safeAddress, salt);
  const client = createPublicClient({
    chain: gnosis,
    transport: http("https://rpc.gnosischain.com/"),
  });

  const [code, installedSafes] = await Promise.all([
    client.getCode({ address: moduleProxyAddress }),
    getSafesForModule(moduleProxyAddress),
  ]);
  const isDeployed = code !== undefined;
  const isInstalled = installedSafes.includes(safeAddress);

  // Prepare the meta-transaction data object
  const enableModuleTx = buildEnableModuleTx(safeAddress, moduleProxyAddress);
  const registerModuleTx = buildRegisterManagerTx(
    moduleProxyAddress,
    managerAddress,
  );

  const moduleApprovalTx = buildModuleApprovalTx(
    HUB_ADDRESS,
    moduleProxyAddress,
  );

  return [
    ...(isDeployed ? [] : [deployModuleTx]),
    ...(isInstalled ? [] : [enableModuleTx]),
    registerModuleTx,
    moduleApprovalTx,
  ];
}

export async function buildModuleDeploymentTx(
  safeAddress: Address,
  salt: bigint = 110647465789069657756111682142268192901188952877020749627246931254533522453n,
): Promise<{ tx: MetaTransactionData; predictedAddress: Address }> {
  const initParams = encodeAbiParameters(
    parseAbiParameters("address x, address y, address z"),
    [safeAddress, safeAddress, safeAddress],
  );

  const initData = encodeFunctionData({
    abi: parseAbi(["function setUp(bytes memory initParams)"]),
    functionName: "setUp",
    args: [initParams],
  });
  const deployData = encodeFunctionData({
    abi: parseAbi([
      "function deployModule(address masterCopy,bytes memory initializer, uint256 saltNonce) public returns (address proxy)",
    ]),
    functionName: "deployModule",
    args: [SUBSCRIPTION_MASTER_COPY, initData, salt],
  });
  const factoryAddress = MODULE_PROXY_FACTORY;
  return {
    tx: {
      to: factoryAddress.toString(),
      value: "0",
      data: deployData,
    },
    predictedAddress: await predictMinimalProxyAddress({
      factory: MODULE_PROXY_FACTORY,
      masterCopy: SUBSCRIPTION_MASTER_COPY,
      initializer: initData, // as you've built above
      saltNonce: salt,
    }),
  };
}

export function buildEnableModuleTx(
  safeAddress: Address,
  moduleAddress: Address,
): MetaTransactionData {
  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function enableModule(address module)"]),
    functionName: "enableModule",
    args: [moduleAddress],
  });

  // Prepare the meta-transaction data object
  return {
    to: safeAddress,
    value: "0",
    data: enableModuleData,
  };
}

export function buildRegisterManagerTx(
  moduleAddress: Address,
  managerAddress: Address,
): MetaTransactionData {
  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function registerModule(address module, bool isEnabled)"]),
    functionName: "registerModule",
    args: [moduleAddress, true],
  });

  // Prepare the meta-transaction data object
  return {
    to: managerAddress,
    value: "0",
    data: enableModuleData,
  };
}

export function buildModuleApprovalTx(
  hubAddress: Address,
  moduleProxyAddress: Address,
): MetaTransactionData {
  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi([
      "function setApprovalForAll(address operator, bool approved)",
    ]),
    functionName: "setApprovalForAll",
    args: [moduleProxyAddress, true],
  });

  // Prepare the meta-transaction data object
  return {
    to: hubAddress,
    value: "0",
    data: enableModuleData,
  };
}

export function predictMinimalProxyAddress({
  factory,
  masterCopy,
  initializer,
  saltNonce,
}: {
  factory: Address;
  masterCopy: Address;
  initializer: Hex;
  saltNonce: bigint | number;
}): Address {
  // Salt: keccak256(abi.encodePacked(keccak256(initializer), saltNonce))
  const salt = keccak256(
    encodePacked(
      ["bytes32", "uint256"],
      [keccak256(initializer), BigInt(saltNonce)],
    ),
  );

  // Minimal proxy init code with masterCopy embedded
  const prefix = "0x602d8060093d393df3363d3d373d3d3d363d73";
  const suffix = "0x5af43d82803e903d91602b57fd5bf3";

  const initCode = encodePacked(
    ["bytes", "address", "bytes"],
    [prefix, masterCopy, suffix],
  );

  const bytecodeHash = keccak256(initCode);

  return getCreate2Address({
    from: factory,
    salt,
    bytecodeHash,
  });
}

async function getSafesForModule(moduleAddress: string): Promise<Address[]> {
  const SAFE_MODULES_URL =
    "https://safe-transaction-gnosis-chain.safe.global/api/v1/modules";
  const url = `${SAFE_MODULES_URL}/${moduleAddress}/safes/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch safes for module ${moduleAddress}: ${response.statusText}`,
    );
  }

  const data: { safes: string[] } = (await response.json()) as {
    safes: string[];
  };
  return data.safes.map((x) => getAddress(x));
}
