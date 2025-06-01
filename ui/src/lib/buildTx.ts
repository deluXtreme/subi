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
} from "viem";
import { type MetaTransactionData } from "@safe-global/types-kit";
import {
  HUB_ADDRESS,
  MODULE_PROXY_FACTORY,
  SUBSCRIPTION_MANAGER,
  SUBSCRIPTION_MASTER_COPY,
} from "./constants";
import { createLogger, logContractCall } from "./logger";

const defaultSalt = BigInt(
  "110647465789069657756111682142268192901188952877020749627246931254533522453",
);

// Create logger for transaction building operations
const logger = createLogger({ component: 'TransactionBuilder' });

export async function prepareEnableModuleTransactions(
  safeAddress: Address,
  managerAddress: Address = SUBSCRIPTION_MANAGER,
  salt: bigint = defaultSalt,
): Promise<MetaTransactionData[]> {
  logger.info('Starting module enablement transaction preparation', {
    safeAddress,
    managerAddress,
    salt: salt.toString(),
    hubAddress: HUB_ADDRESS,
    moduleProxyFactory: MODULE_PROXY_FACTORY,
    subscriptionMasterCopy: SUBSCRIPTION_MASTER_COPY
  });

  const { tx: deployModuleTx, predictedAddress: moduleProxyAddress } =
    await buildModuleDeploymentTx(safeAddress, salt);

  logger.info('Module deployment transaction prepared', {
    safeAddress,
    moduleProxyAddress,
    deployTx: deployModuleTx
  });

  // Prepare the meta-transaction data object
  const enableModuleTx = buildEnableModuleTx(safeAddress, moduleProxyAddress);
  logger.debug('Enable module transaction built', { enableModuleTx });

  const registerModuleTx = buildRegisterManagerTx(
    moduleProxyAddress,
    managerAddress,
  );
  logger.debug('Register module transaction built', { registerModuleTx });

  const moduleApprovalTx = buildModuleApprovalTx(
    HUB_ADDRESS,
    moduleProxyAddress,
  );
  logger.debug('Module approval transaction built', { moduleApprovalTx });

  const transactions = [deployModuleTx, enableModuleTx, registerModuleTx, moduleApprovalTx];
  
  logger.info('All module enablement transactions prepared', {
    safeAddress,
    moduleProxyAddress,
    transactionCount: transactions.length,
    transactions: transactions.map((tx, index) => ({
      index,
      to: tx.to,
      value: tx.value,
      dataLength: tx.data.length
    }))
  });

  return transactions;
}

export async function buildModuleDeploymentTx(
  safeAddress: Address,
  salt: bigint = defaultSalt,
): Promise<{ tx: MetaTransactionData; predictedAddress: Address }> {
  logger.debug('Building module deployment transaction', {
    safeAddress,
    salt: salt.toString(),
    masterCopy: SUBSCRIPTION_MASTER_COPY,
    factory: MODULE_PROXY_FACTORY
  });

  const initParams = encodeAbiParameters(
    parseAbiParameters("address x, address y, address z"),
    [safeAddress, safeAddress, safeAddress],
  );
  logger.debug('Init parameters encoded', { initParams, safeAddress });

  const initData = encodeFunctionData({
    abi: parseAbi(["function setUp(bytes memory initParams)"]),
    functionName: "setUp",
    args: [initParams],
  });
  logger.debug('Init data encoded', { initData });

  logContractCall('ModuleProxyFactory', 'deployModule', {
    masterCopy: SUBSCRIPTION_MASTER_COPY,
    initializer: initData,
    saltNonce: salt.toString()
  });

  const deployData = encodeFunctionData({
    abi: parseAbi([
      "function deployModule(address masterCopy,bytes memory initializer, uint256 saltNonce) public returns (address proxy)",
    ]),
    functionName: "deployModule",
    args: [SUBSCRIPTION_MASTER_COPY, initData, salt],
  });

  const factoryAddress = MODULE_PROXY_FACTORY;
  const predictedAddress = await predictMinimalProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    masterCopy: SUBSCRIPTION_MASTER_COPY,
    initializer: initData, // as you've built above
    saltNonce: salt,
  });

  const result = {
    tx: {
      to: factoryAddress.toString(),
      value: "0",
      data: deployData,
    },
    predictedAddress,
  };

  logger.info('Module deployment transaction built', {
    safeAddress,
    factoryAddress,
    predictedAddress,
    txData: {
      to: result.tx.to,
      value: result.tx.value,
      dataLength: result.tx.data.length
    }
  });

  return result;
}

function buildEnableModuleTx(
  safeAddress: Address,
  moduleAddress: Address,
): MetaTransactionData {
  logger.debug('Building enable module transaction', { safeAddress, moduleAddress });

  logContractCall('Safe', 'enableModule', { module: moduleAddress });

  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function enableModule(address module)"]),
    functionName: "enableModule",
    args: [moduleAddress],
  });

  const tx = {
    to: safeAddress,
    value: "0",
    data: enableModuleData,
  };

  logger.debug('Enable module transaction built', {
    safeAddress,
    moduleAddress,
    tx: {
      to: tx.to,
      value: tx.value,
      dataLength: tx.data.length
    }
  });

  // Prepare the meta-transaction data object
  return tx;
}

function buildRegisterManagerTx(
  moduleAddress: Address,
  managerAddress: Address,
): MetaTransactionData {
  logger.debug('Building register manager transaction', { moduleAddress, managerAddress });

  logContractCall('SubscriptionManager', 'registerModule', { module: moduleAddress });

  // Build the call data for enabling the module
  const enableModuleData = encodeFunctionData({
    abi: parseAbi(["function registerModule(address module, bool isEnabled)"]),
    functionName: "registerModule",
    args: [moduleAddress, true],
  });

  const tx = {
    to: managerAddress,
    value: "0",
    data: registerModuleData,
  };

  logger.debug('Register manager transaction built', {
    moduleAddress,
    managerAddress,
    tx: {
      to: tx.to,
      value: tx.value,
      dataLength: tx.data.length
    }
  });

  // Prepare the meta-transaction data object
  return tx;
}

function buildModuleApprovalTx(
  hubAddress: Address,
  moduleProxyAddress: Address,
): MetaTransactionData {
  logger.debug('Building module approval transaction', { hubAddress, moduleProxyAddress });

  logContractCall('CirclesHub', 'setApprovalForAll', { 
    operator: moduleProxyAddress, 
    approved: true 
  });

  // Build the call data for enabling the module
  const approvalData = encodeFunctionData({
    abi: parseAbi([
      "function setApprovalForAll(address operator, bool approved)",
    ]),
    functionName: "setApprovalForAll",
    args: [moduleProxyAddress, true],
  });

  const tx = {
    to: hubAddress,
    value: "0",
    data: approvalData,
  };

  logger.debug('Module approval transaction built', {
    hubAddress,
    moduleProxyAddress,
    tx: {
      to: tx.to,
      value: tx.value,
      dataLength: tx.data.length
    }
  });

  // Prepare the meta-transaction data object
  return tx;
}

function predictMinimalProxyAddress({
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
  logger.debug('Predicting minimal proxy address', {
    factory,
    masterCopy,
    initializerLength: initializer.length,
    saltNonce: saltNonce.toString()
  });

  // Salt: keccak256(abi.encodePacked(keccak256(initializer), saltNonce))
  const initializerHash = keccak256(initializer);
  const salt = keccak256(
    encodePacked(
      ["bytes32", "uint256"],
      [initializerHash, BigInt(saltNonce)],
    ),
  );

  logger.debug('Salt calculation', {
    initializerHash,
    saltNonce: saltNonce.toString(),
    salt
  });

  // Minimal proxy init code with masterCopy embedded
  const prefix = "0x602d8060093d393df3363d3d373d3d3d363d73";
  const suffix = "0x5af43d82803e903d91602b57fd5bf3";

  const initCode = encodePacked(
    ["bytes", "address", "bytes"],
    [prefix, masterCopy, suffix],
  );

  const bytecodeHash = keccak256(initCode);

  const predictedAddress = getCreate2Address({
    from: factory,
    salt,
    bytecodeHash,
  });

  logger.info('Minimal proxy address predicted', {
    factory,
    masterCopy,
    predictedAddress,
    salt,
    bytecodeHash
  });

  return predictedAddress;
}
