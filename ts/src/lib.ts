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
  type PublicClient,
} from "viem";
import { type MetaTransactionData } from "@safe-global/types-kit";
import { MODULE_PROXY_FACTORY, SUBSCRIPTION_MASTER_COPY } from "./constants";
import { getSafe } from "./config";

export async function buildModuleDeploymentTx(
  client: PublicClient,
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
    abi: parseAbi(["function registerModule(address module)"]),
    functionName: "registerModule",
    args: [moduleAddress],
  });

  // Prepare the meta-transaction data object
  return {
    to: managerAddress,
    value: "0",
    data: enableModuleData,
  };
}


export function buildRegisterManagerTx(
  hubAddress: Address,
  moduleProxyAddress: Address,
): MetaTransactionData {
  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function setApprovalForAll(address operator, bool approved)"]),
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

export async function checkEnabled(
  safeAddress: string,
  moduleAddress: string,
): Promise<boolean> {
  const safe = await getSafe(safeAddress);
  return safe.isModuleEnabled(moduleAddress);
}
