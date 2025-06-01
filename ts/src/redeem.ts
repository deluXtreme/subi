import { createFlowMatrix, findPath } from "@circles-sdk/pathfinder";
import { getWalletClient } from "./config";
import { HUB_ADDRESS } from "./constants";
import { toHex, type Address } from "viem";

const rpcUrl = "https://rpc.aboutcircles.com/";

const redeemAbi = [
  {
    inputs: [
      { internalType: "address", name: "module", type: "address" },
      { internalType: "uint256", name: "subId", type: "uint256" },
      { internalType: "address[]", name: "flowVertices", type: "address[]" },
      {
        components: [
          { internalType: "uint16", name: "streamSinkId", type: "uint16" },
          { internalType: "uint192", name: "amount", type: "uint192" },
        ],
        internalType: "struct TypeDefinitions.FlowEdge[]",
        name: "flow",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "uint16", name: "sourceCoordinate", type: "uint16" },
          { internalType: "uint16[]", name: "flowEdgeIds", type: "uint16[]" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct TypeDefinitions.Stream[]",
        name: "streams",
        type: "tuple[]",
      },
      { internalType: "bytes", name: "packedCoordinates", type: "bytes" },
    ],
    name: "redeemPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export async function redeemPayment(
  to: `0x${string}`,
  from: `0x${string}`,
  value: bigint,
  module: Address,
  subscriptionId: bigint,
): Promise<void> {
  const targetFlow = value.toString();
  const path = await findPath(rpcUrl, {
    from,
    to,
    targetFlow,
    useWrappedBalances: true,
  });

  const {
    flowVertices,
    flowEdges,
    streams,
    packedCoordinates,
  } = createFlowMatrix(from, to, targetFlow, path.transfers);

  const client = getWalletClient();

  client.writeContract({
    address: HUB_ADDRESS,
    abi: redeemAbi,
    functionName: "redeemPayment",
    args: [
      module,
      subscriptionId,
      flowVertices,
      // Transform ethers to viem:
      flowEdges.map((e) => ({ ...e, amount: BigInt(e.toString()) })),
      streams.map((s) => ({ ...s, data: toHex(s.data) })),
      packedCoordinates,
    ],
  });
}



// const sender = getAddress(process.env.SENDER!);
// const receiver = getAddress(process.env.RECEIVER!);
// const amount = process.env.amount || "0.000001";
