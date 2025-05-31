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
  const proxyCreationCode = await client.readContract({
    address: factoryAddress,
    abi: parseAbi(["function proxyCreationCode() view returns (bytes)"]),
    functionName: "proxyCreationCode",
  });

  return {
    tx: {
      to: factoryAddress.toString(),
      value: "0",
      data: deployData,
    },
    predictedAddress: await predictModuleAddress({
      factory: factoryAddress,
      masterCopy: SUBSCRIPTION_MASTER_COPY,
      saltNonce: salt,
      initializer: initData,
      proxyCreationCode,
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

/**
 * Predicts the address of a module deployed via ModuleProxyFactory.deployModule(...)
 */
export async function predictModuleAddress({
  factory,
  masterCopy,
  initializer,
  saltNonce,
  proxyCreationCode,
}: {
  factory: Address;
  masterCopy: Address;
  initializer: Hex;
  saltNonce: bigint | number;
  proxyCreationCode: Hex;
}): Promise<Address> {
  const salt = keccak256(
    encodePacked(
      ["bytes32", "uint256"],
      [keccak256(initializer), BigInt(saltNonce)],
    ),
  );

  const initCode = encodePacked(
    ["bytes", "uint256"],
    [
      proxyCreationCode, // from `proxyCreationCode()`
      BigInt(masterCopy),
    ],
  );

  const bytecodeHash = keccak256(initCode);

  return getCreate2Address({ from: factory, salt, bytecodeHash });
}
