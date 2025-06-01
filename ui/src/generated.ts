import {
  createUseWatchContractEvent,
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ContextUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const contextUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EnumerableSetLib
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const enumerableSetLibAbi = [
  { type: 'error', inputs: [], name: 'ExceedsCapacity' },
  { type: 'error', inputs: [], name: 'IndexOutOfBounds' },
  { type: 'error', inputs: [], name: 'ValueIsZeroSentinel' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FactoryFriendly
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const factoryFriendlyAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initializeParams', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAvatar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAvatarAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'prevModule', internalType: 'address', type: 'address' },
      { name: 'module', internalType: 'address', type: 'address' },
    ],
    name: 'disableModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'enableModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModule',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'enum Enum.Operation', type: 'uint8' },
    ],
    name: 'execTransactionFromModuleReturnData',
    outputs: [
      { name: 'success', internalType: 'bool', type: 'bool' },
      { name: 'returnData', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'start', internalType: 'address', type: 'address' },
      { name: 'pageSize', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getModulesPaginated',
    outputs: [
      { name: 'array', internalType: 'address[]', type: 'address[]' },
      { name: 'next', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    name: 'isModuleEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'DisabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EnabledModule',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleFailure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExecutionFromModuleSuccess',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ICircles
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iCirclesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'inflationDayZero',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IDemurrage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iDemurrageAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'inflationDayZero',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IHubV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iHubV2Abi = [
  {
    type: 'function',
    inputs: [{ name: 'avatar', internalType: 'address', type: 'address' }],
    name: 'avatars',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'inflationDayZero',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'avatar', internalType: 'address', type: 'address' }],
    name: 'isGroup',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'avatar', internalType: 'address', type: 'address' }],
    name: 'isHuman',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'avatar', internalType: 'address', type: 'address' }],
    name: 'isOrganization',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'avatars', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'migrate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'avatar', internalType: 'address', type: 'address' }],
    name: 'mintPolicies',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_flowVertices', internalType: 'address[]', type: 'address[]' },
      {
        name: '_flow',
        internalType: 'struct TypeDefinitions.FlowEdge[]',
        type: 'tuple[]',
        components: [
          { name: 'streamSinkId', internalType: 'uint16', type: 'uint16' },
          { name: 'amount', internalType: 'uint192', type: 'uint192' },
        ],
      },
      {
        name: '_streams',
        internalType: 'struct TypeDefinitions.Stream[]',
        type: 'tuple[]',
        components: [
          { name: 'sourceCoordinate', internalType: 'uint16', type: 'uint16' },
          { name: 'flowEdgeIds', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: '_packedCoordinates', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'operateFlowMatrix',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ISubscriptionModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iSubscriptionModuleAbi = [
  {
    type: 'function',
    inputs: [{ name: 'subId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subId', internalType: 'uint256', type: 'uint256' },
      { name: 'flowVertices', internalType: 'address[]', type: 'address[]' },
      {
        name: 'flow',
        internalType: 'struct TypeDefinitions.FlowEdge[]',
        type: 'tuple[]',
        components: [
          { name: 'streamSinkId', internalType: 'uint16', type: 'uint16' },
          { name: 'amount', internalType: 'uint192', type: 'uint192' },
        ],
      },
      {
        name: 'streams',
        internalType: 'struct TypeDefinitions.Stream[]',
        type: 'tuple[]',
        components: [
          { name: 'sourceCoordinate', internalType: 'uint16', type: 'uint16' },
          { name: 'flowEdgeIds', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'packedCoordinates', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'redeemPayment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'frequency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subscribe',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initializable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const initializableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Module
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const moduleAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'avatar',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_avatar', internalType: 'address', type: 'address' }],
    name: 'setAvatar',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_target', internalType: 'address', type: 'address' }],
    name: 'setTarget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initializeParams', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'target',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAvatar',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAvatar',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AvatarSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousTarget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newTarget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TargetSet',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OwnableUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableUpgradeableAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ScriptUtils
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const scriptUtilsAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'IS_SCRIPT',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [{ name: 'key', internalType: 'string', type: 'string' }],
    name: 'AddressNotFound',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SubscriptionManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const subscriptionManagerAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'subId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllModules',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'modules',
    outputs: [{ name: 'module', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'subId', internalType: 'uint256', type: 'uint256' },
      { name: 'flowVertices', internalType: 'address[]', type: 'address[]' },
      {
        name: 'flow',
        internalType: 'struct TypeDefinitions.FlowEdge[]',
        type: 'tuple[]',
        components: [
          { name: 'streamSinkId', internalType: 'uint16', type: 'uint16' },
          { name: 'amount', internalType: 'uint192', type: 'uint192' },
        ],
      },
      {
        name: 'streams',
        internalType: 'struct TypeDefinitions.Stream[]',
        type: 'tuple[]',
        components: [
          { name: 'sourceCoordinate', internalType: 'uint16', type: 'uint16' },
          { name: 'flowEdgeIds', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'packedCoordinates', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'redeemPayment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'isEnabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'frequency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subscribe',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'subId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nextRedeemAt',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Redeemed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'subId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SubscriptionCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'subId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'subscriber',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'frequency',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SubscriptionCreated',
  },
] as const

/**
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const subscriptionManagerAddress = {
  100: '0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834',
} as const

/**
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const subscriptionManagerConfig = {
  address: subscriptionManagerAddress,
  abi: subscriptionManagerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SubscriptionModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const subscriptionModuleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_avatar', internalType: 'address', type: 'address' },
      { name: '_target', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'HUB_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SUBSCRIPTION_MANAGER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'avatar',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'subId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'subId', internalType: 'uint256', type: 'uint256' },
      { name: 'flowVertices', internalType: 'address[]', type: 'address[]' },
      {
        name: 'flow',
        internalType: 'struct TypeDefinitions.FlowEdge[]',
        type: 'tuple[]',
        components: [
          { name: 'streamSinkId', internalType: 'uint16', type: 'uint16' },
          { name: 'amount', internalType: 'uint192', type: 'uint192' },
        ],
      },
      {
        name: 'streams',
        internalType: 'struct TypeDefinitions.Stream[]',
        type: 'tuple[]',
        components: [
          { name: 'sourceCoordinate', internalType: 'uint16', type: 'uint16' },
          { name: 'flowEdgeIds', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'packedCoordinates', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'redeemPayment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_avatar', internalType: 'address', type: 'address' }],
    name: 'setAvatar',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_target', internalType: 'address', type: 'address' }],
    name: 'setTarget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'initParams', internalType: 'bytes', type: 'bytes' }],
    name: 'setUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'frequency', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'subscribe',
    outputs: [{ name: 'subId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'subscriptionCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'subscriptions',
    outputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'lastRedeemed', internalType: 'uint256', type: 'uint256' },
      { name: 'frequency', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'target',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAvatar',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAvatar',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AvatarSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousTarget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newTarget',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TargetSet',
  },
  { type: 'error', inputs: [], name: 'CannotExec' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidRecipient' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotRedeemable' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contextUpgradeableAbi}__
 */
export const useWatchContextUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: contextUpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contextUpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchContextUpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contextUpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryFriendlyAbi}__
 */
export const useReadFactoryFriendly = /*#__PURE__*/ createUseReadContract({
  abi: factoryFriendlyAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"owner"`
 */
export const useReadFactoryFriendlyOwner = /*#__PURE__*/ createUseReadContract({
  abi: factoryFriendlyAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryFriendlyAbi}__
 */
export const useWriteFactoryFriendly = /*#__PURE__*/ createUseWriteContract({
  abi: factoryFriendlyAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteFactoryFriendlyRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryFriendlyAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"setUp"`
 */
export const useWriteFactoryFriendlySetUp =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryFriendlyAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteFactoryFriendlyTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: factoryFriendlyAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryFriendlyAbi}__
 */
export const useSimulateFactoryFriendly =
  /*#__PURE__*/ createUseSimulateContract({ abi: factoryFriendlyAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateFactoryFriendlyRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryFriendlyAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"setUp"`
 */
export const useSimulateFactoryFriendlySetUp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryFriendlyAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateFactoryFriendlyTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: factoryFriendlyAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryFriendlyAbi}__
 */
export const useWatchFactoryFriendlyEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: factoryFriendlyAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchFactoryFriendlyInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryFriendlyAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link factoryFriendlyAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchFactoryFriendlyOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: factoryFriendlyAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAvatarAbi}__
 */
export const useReadIAvatar = /*#__PURE__*/ createUseReadContract({
  abi: iAvatarAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"getModulesPaginated"`
 */
export const useReadIAvatarGetModulesPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: iAvatarAbi,
    functionName: 'getModulesPaginated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"isModuleEnabled"`
 */
export const useReadIAvatarIsModuleEnabled =
  /*#__PURE__*/ createUseReadContract({
    abi: iAvatarAbi,
    functionName: 'isModuleEnabled',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAvatarAbi}__
 */
export const useWriteIAvatar = /*#__PURE__*/ createUseWriteContract({
  abi: iAvatarAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"disableModule"`
 */
export const useWriteIAvatarDisableModule =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAvatarAbi,
    functionName: 'disableModule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"enableModule"`
 */
export const useWriteIAvatarEnableModule = /*#__PURE__*/ createUseWriteContract(
  { abi: iAvatarAbi, functionName: 'enableModule' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"execTransactionFromModule"`
 */
export const useWriteIAvatarExecTransactionFromModule =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAvatarAbi,
    functionName: 'execTransactionFromModule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"execTransactionFromModuleReturnData"`
 */
export const useWriteIAvatarExecTransactionFromModuleReturnData =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAvatarAbi,
    functionName: 'execTransactionFromModuleReturnData',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAvatarAbi}__
 */
export const useSimulateIAvatar = /*#__PURE__*/ createUseSimulateContract({
  abi: iAvatarAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"disableModule"`
 */
export const useSimulateIAvatarDisableModule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAvatarAbi,
    functionName: 'disableModule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"enableModule"`
 */
export const useSimulateIAvatarEnableModule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAvatarAbi,
    functionName: 'enableModule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"execTransactionFromModule"`
 */
export const useSimulateIAvatarExecTransactionFromModule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAvatarAbi,
    functionName: 'execTransactionFromModule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAvatarAbi}__ and `functionName` set to `"execTransactionFromModuleReturnData"`
 */
export const useSimulateIAvatarExecTransactionFromModuleReturnData =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAvatarAbi,
    functionName: 'execTransactionFromModuleReturnData',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAvatarAbi}__
 */
export const useWatchIAvatarEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iAvatarAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAvatarAbi}__ and `eventName` set to `"DisabledModule"`
 */
export const useWatchIAvatarDisabledModuleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAvatarAbi,
    eventName: 'DisabledModule',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAvatarAbi}__ and `eventName` set to `"EnabledModule"`
 */
export const useWatchIAvatarEnabledModuleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAvatarAbi,
    eventName: 'EnabledModule',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAvatarAbi}__ and `eventName` set to `"ExecutionFromModuleFailure"`
 */
export const useWatchIAvatarExecutionFromModuleFailureEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAvatarAbi,
    eventName: 'ExecutionFromModuleFailure',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAvatarAbi}__ and `eventName` set to `"ExecutionFromModuleSuccess"`
 */
export const useWatchIAvatarExecutionFromModuleSuccessEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAvatarAbi,
    eventName: 'ExecutionFromModuleSuccess',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iCirclesAbi}__
 */
export const useReadICircles = /*#__PURE__*/ createUseReadContract({
  abi: iCirclesAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iCirclesAbi}__ and `functionName` set to `"inflationDayZero"`
 */
export const useReadICirclesInflationDayZero =
  /*#__PURE__*/ createUseReadContract({
    abi: iCirclesAbi,
    functionName: 'inflationDayZero',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iDemurrageAbi}__
 */
export const useReadIDemurrage = /*#__PURE__*/ createUseReadContract({
  abi: iDemurrageAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iDemurrageAbi}__ and `functionName` set to `"inflationDayZero"`
 */
export const useReadIDemurrageInflationDayZero =
  /*#__PURE__*/ createUseReadContract({
    abi: iDemurrageAbi,
    functionName: 'inflationDayZero',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useReadIerc1155 = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc1155BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIerc1155BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIerc1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWriteIerc1155 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useSimulateIerc1155 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWatchIerc1155Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIerc1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIerc1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIerc1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchIerc1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__
 */
export const useReadIHubV2 = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"avatars"`
 */
export const useReadIHubV2Avatars = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'avatars',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIHubV2BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIHubV2BalanceOfBatch = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'balanceOfBatch',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"inflationDayZero"`
 */
export const useReadIHubV2InflationDayZero =
  /*#__PURE__*/ createUseReadContract({
    abi: iHubV2Abi,
    functionName: 'inflationDayZero',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIHubV2IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: iHubV2Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"isGroup"`
 */
export const useReadIHubV2IsGroup = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'isGroup',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"isHuman"`
 */
export const useReadIHubV2IsHuman = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'isHuman',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"isOrganization"`
 */
export const useReadIHubV2IsOrganization = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'isOrganization',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"mintPolicies"`
 */
export const useReadIHubV2MintPolicies = /*#__PURE__*/ createUseReadContract({
  abi: iHubV2Abi,
  functionName: 'mintPolicies',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIHubV2SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: iHubV2Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__
 */
export const useWriteIHubV2 = /*#__PURE__*/ createUseWriteContract({
  abi: iHubV2Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"burn"`
 */
export const useWriteIHubV2Burn = /*#__PURE__*/ createUseWriteContract({
  abi: iHubV2Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"migrate"`
 */
export const useWriteIHubV2Migrate = /*#__PURE__*/ createUseWriteContract({
  abi: iHubV2Abi,
  functionName: 'migrate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"operateFlowMatrix"`
 */
export const useWriteIHubV2OperateFlowMatrix =
  /*#__PURE__*/ createUseWriteContract({
    abi: iHubV2Abi,
    functionName: 'operateFlowMatrix',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIHubV2SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: iHubV2Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIHubV2SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: iHubV2Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIHubV2SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: iHubV2Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__
 */
export const useSimulateIHubV2 = /*#__PURE__*/ createUseSimulateContract({
  abi: iHubV2Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"burn"`
 */
export const useSimulateIHubV2Burn = /*#__PURE__*/ createUseSimulateContract({
  abi: iHubV2Abi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"migrate"`
 */
export const useSimulateIHubV2Migrate = /*#__PURE__*/ createUseSimulateContract(
  { abi: iHubV2Abi, functionName: 'migrate' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"operateFlowMatrix"`
 */
export const useSimulateIHubV2OperateFlowMatrix =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHubV2Abi,
    functionName: 'operateFlowMatrix',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIHubV2SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHubV2Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIHubV2SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHubV2Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iHubV2Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIHubV2SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iHubV2Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iHubV2Abi}__
 */
export const useWatchIHubV2Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: iHubV2Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iHubV2Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIHubV2ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iHubV2Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iHubV2Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIHubV2TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iHubV2Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iHubV2Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIHubV2TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iHubV2Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iHubV2Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchIHubV2UriEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iHubV2Abi, eventName: 'URI' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useReadIMulticall3 = /*#__PURE__*/ createUseReadContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBasefee"`
 */
export const useReadIMulticall3GetBasefee = /*#__PURE__*/ createUseReadContract(
  { abi: iMulticall3Abi, functionName: 'getBasefee' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockHash"`
 */
export const useReadIMulticall3GetBlockHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockNumber"`
 */
export const useReadIMulticall3GetBlockNumber =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockNumber',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getChainId"`
 */
export const useReadIMulticall3GetChainId = /*#__PURE__*/ createUseReadContract(
  { abi: iMulticall3Abi, functionName: 'getChainId' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockCoinbase"`
 */
export const useReadIMulticall3GetCurrentBlockCoinbase =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockCoinbase',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockDifficulty"`
 */
export const useReadIMulticall3GetCurrentBlockDifficulty =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockDifficulty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockGasLimit"`
 */
export const useReadIMulticall3GetCurrentBlockGasLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockGasLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockTimestamp"`
 */
export const useReadIMulticall3GetCurrentBlockTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getEthBalance"`
 */
export const useReadIMulticall3GetEthBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getEthBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getLastBlockHash"`
 */
export const useReadIMulticall3GetLastBlockHash =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getLastBlockHash',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useWriteIMulticall3 = /*#__PURE__*/ createUseWriteContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useWriteIMulticall3Aggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useWriteIMulticall3Aggregate3 =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useWriteIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useWriteIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useWriteIMulticall3TryAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useWriteIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useSimulateIMulticall3 = /*#__PURE__*/ createUseSimulateContract({
  abi: iMulticall3Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useSimulateIMulticall3Aggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useSimulateIMulticall3Aggregate3 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useSimulateIMulticall3Aggregate3Value =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useSimulateIMulticall3BlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useSimulateIMulticall3TryAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useSimulateIMulticall3TryBlockAndAggregate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__
 */
export const useReadISubscriptionModule = /*#__PURE__*/ createUseReadContract({
  abi: iSubscriptionModuleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadISubscriptionModuleOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__
 */
export const useWriteISubscriptionModule = /*#__PURE__*/ createUseWriteContract(
  { abi: iSubscriptionModuleAbi },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteISubscriptionModuleCancel =
  /*#__PURE__*/ createUseWriteContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"redeemPayment"`
 */
export const useWriteISubscriptionModuleRedeemPayment =
  /*#__PURE__*/ createUseWriteContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"subscribe"`
 */
export const useWriteISubscriptionModuleSubscribe =
  /*#__PURE__*/ createUseWriteContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__
 */
export const useSimulateISubscriptionModule =
  /*#__PURE__*/ createUseSimulateContract({ abi: iSubscriptionModuleAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateISubscriptionModuleCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"redeemPayment"`
 */
export const useSimulateISubscriptionModuleRedeemPayment =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iSubscriptionModuleAbi}__ and `functionName` set to `"subscribe"`
 */
export const useSimulateISubscriptionModuleSubscribe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iSubscriptionModuleAbi,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__
 */
export const useWatchInitializableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: initializableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchInitializableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: initializableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link moduleAbi}__
 */
export const useReadModule = /*#__PURE__*/ createUseReadContract({
  abi: moduleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"avatar"`
 */
export const useReadModuleAvatar = /*#__PURE__*/ createUseReadContract({
  abi: moduleAbi,
  functionName: 'avatar',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadModuleOwner = /*#__PURE__*/ createUseReadContract({
  abi: moduleAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"target"`
 */
export const useReadModuleTarget = /*#__PURE__*/ createUseReadContract({
  abi: moduleAbi,
  functionName: 'target',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__
 */
export const useWriteModule = /*#__PURE__*/ createUseWriteContract({
  abi: moduleAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteModuleRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: moduleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setAvatar"`
 */
export const useWriteModuleSetAvatar = /*#__PURE__*/ createUseWriteContract({
  abi: moduleAbi,
  functionName: 'setAvatar',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setTarget"`
 */
export const useWriteModuleSetTarget = /*#__PURE__*/ createUseWriteContract({
  abi: moduleAbi,
  functionName: 'setTarget',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setUp"`
 */
export const useWriteModuleSetUp = /*#__PURE__*/ createUseWriteContract({
  abi: moduleAbi,
  functionName: 'setUp',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteModuleTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: moduleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__
 */
export const useSimulateModule = /*#__PURE__*/ createUseSimulateContract({
  abi: moduleAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateModuleRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: moduleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setAvatar"`
 */
export const useSimulateModuleSetAvatar =
  /*#__PURE__*/ createUseSimulateContract({
    abi: moduleAbi,
    functionName: 'setAvatar',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setTarget"`
 */
export const useSimulateModuleSetTarget =
  /*#__PURE__*/ createUseSimulateContract({
    abi: moduleAbi,
    functionName: 'setTarget',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"setUp"`
 */
export const useSimulateModuleSetUp = /*#__PURE__*/ createUseSimulateContract({
  abi: moduleAbi,
  functionName: 'setUp',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link moduleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateModuleTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: moduleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link moduleAbi}__
 */
export const useWatchModuleEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: moduleAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link moduleAbi}__ and `eventName` set to `"AvatarSet"`
 */
export const useWatchModuleAvatarSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: moduleAbi,
    eventName: 'AvatarSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link moduleAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchModuleInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: moduleAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link moduleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchModuleOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: moduleAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link moduleAbi}__ and `eventName` set to `"TargetSet"`
 */
export const useWatchModuleTargetSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: moduleAbi,
    eventName: 'TargetSet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useReadOwnableUpgradeable = /*#__PURE__*/ createUseReadContract({
  abi: ownableUpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOwnableUpgradeableOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: ownableUpgradeableAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useWriteOwnableUpgradeable = /*#__PURE__*/ createUseWriteContract({
  abi: ownableUpgradeableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOwnableUpgradeableRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableUpgradeableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOwnableUpgradeableTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableUpgradeableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useSimulateOwnableUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: ownableUpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOwnableUpgradeableRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableUpgradeableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOwnableUpgradeableTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableUpgradeableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useWatchOwnableUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ownableUpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOwnableUpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableUpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOwnableUpgradeableOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableUpgradeableAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link scriptUtilsAbi}__
 */
export const useReadScriptUtils = /*#__PURE__*/ createUseReadContract({
  abi: scriptUtilsAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link scriptUtilsAbi}__ and `functionName` set to `"IS_SCRIPT"`
 */
export const useReadScriptUtilsIsScript = /*#__PURE__*/ createUseReadContract({
  abi: scriptUtilsAbi,
  functionName: 'IS_SCRIPT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionManagerAbi}__
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useReadSubscriptionManager = /*#__PURE__*/ createUseReadContract({
  abi: subscriptionManagerAbi,
  address: subscriptionManagerAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"getAllModules"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useReadSubscriptionManagerGetAllModules =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'getAllModules',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"modules"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useReadSubscriptionManagerModules =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'modules',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionManagerAbi}__
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWriteSubscriptionManager = /*#__PURE__*/ createUseWriteContract(
  { abi: subscriptionManagerAbi, address: subscriptionManagerAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"cancel"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWriteSubscriptionManagerCancel =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"redeemPayment"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWriteSubscriptionManagerRedeemPayment =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"registerModule"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWriteSubscriptionManagerRegisterModule =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'registerModule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"subscribe"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWriteSubscriptionManagerSubscribe =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionManagerAbi}__
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useSimulateSubscriptionManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"cancel"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useSimulateSubscriptionManagerCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"redeemPayment"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useSimulateSubscriptionManagerRedeemPayment =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"registerModule"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useSimulateSubscriptionManagerRegisterModule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'registerModule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `functionName` set to `"subscribe"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useSimulateSubscriptionManagerSubscribe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionManagerAbi}__
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWatchSubscriptionManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `eventName` set to `"Redeemed"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWatchSubscriptionManagerRedeemedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    eventName: 'Redeemed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `eventName` set to `"SubscriptionCancelled"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWatchSubscriptionManagerSubscriptionCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    eventName: 'SubscriptionCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionManagerAbi}__ and `eventName` set to `"SubscriptionCreated"`
 *
 * [__View Contract on Gnosis Gnosisscan__](https://gnosisscan.io/address/0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834)
 */
export const useWatchSubscriptionManagerSubscriptionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionManagerAbi,
    address: subscriptionManagerAddress,
    eventName: 'SubscriptionCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__
 */
export const useReadSubscriptionModule = /*#__PURE__*/ createUseReadContract({
  abi: subscriptionModuleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"HUB_ADDRESS"`
 */
export const useReadSubscriptionModuleHubAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'HUB_ADDRESS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"SUBSCRIPTION_MANAGER"`
 */
export const useReadSubscriptionModuleSubscriptionManager =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'SUBSCRIPTION_MANAGER',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"avatar"`
 */
export const useReadSubscriptionModuleAvatar =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'avatar',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSubscriptionModuleOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"subscriptionCounter"`
 */
export const useReadSubscriptionModuleSubscriptionCounter =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'subscriptionCounter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"subscriptions"`
 */
export const useReadSubscriptionModuleSubscriptions =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'subscriptions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"target"`
 */
export const useReadSubscriptionModuleTarget =
  /*#__PURE__*/ createUseReadContract({
    abi: subscriptionModuleAbi,
    functionName: 'target',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__
 */
export const useWriteSubscriptionModule = /*#__PURE__*/ createUseWriteContract({
  abi: subscriptionModuleAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteSubscriptionModuleCancel =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"redeemPayment"`
 */
export const useWriteSubscriptionModuleRedeemPayment =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSubscriptionModuleRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setAvatar"`
 */
export const useWriteSubscriptionModuleSetAvatar =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'setAvatar',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setTarget"`
 */
export const useWriteSubscriptionModuleSetTarget =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'setTarget',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setUp"`
 */
export const useWriteSubscriptionModuleSetUp =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"subscribe"`
 */
export const useWriteSubscriptionModuleSubscribe =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSubscriptionModuleTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: subscriptionModuleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__
 */
export const useSimulateSubscriptionModule =
  /*#__PURE__*/ createUseSimulateContract({ abi: subscriptionModuleAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateSubscriptionModuleCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"redeemPayment"`
 */
export const useSimulateSubscriptionModuleRedeemPayment =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'redeemPayment',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSubscriptionModuleRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setAvatar"`
 */
export const useSimulateSubscriptionModuleSetAvatar =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'setAvatar',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setTarget"`
 */
export const useSimulateSubscriptionModuleSetTarget =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'setTarget',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"setUp"`
 */
export const useSimulateSubscriptionModuleSetUp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'setUp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"subscribe"`
 */
export const useSimulateSubscriptionModuleSubscribe =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'subscribe',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSubscriptionModuleTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: subscriptionModuleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionModuleAbi}__
 */
export const useWatchSubscriptionModuleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: subscriptionModuleAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `eventName` set to `"AvatarSet"`
 */
export const useWatchSubscriptionModuleAvatarSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionModuleAbi,
    eventName: 'AvatarSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchSubscriptionModuleInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionModuleAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchSubscriptionModuleOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionModuleAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link subscriptionModuleAbi}__ and `eventName` set to `"TargetSet"`
 */
export const useWatchSubscriptionModuleTargetSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: subscriptionModuleAbi,
    eventName: 'TargetSet',
  })
