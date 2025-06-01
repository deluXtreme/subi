import type { EIP712TypedData } from "@1inch/cross-chain-sdk";
import {
  createPublicClient,
  erc20Abi,
  type Address,
  type Hash,
  type PrivateKeyAccount,
  type PublicClient,
  type WalletClient,
} from "viem";
import { createWalletClient, http, maxUint256 } from "viem";
import { privateKeyToAccount } from "viem/accounts";
export interface BlockchainProviderConnector {
  signTypedData(
    walletAddress: string,
    typedData: EIP712TypedData,
  ): Promise<string>;
  ethCall(contractAddress: string, callData: string): Promise<string>;
}

export class ViemConnector implements BlockchainProviderConnector {
  private readonly wallet: WalletClient;
  private readonly client: PublicClient;
  private readonly account: PrivateKeyAccount;

  constructor(nodeUrl: string, pk: `0x${string}`) {
    const transport = http(nodeUrl);
    this.account = privateKeyToAccount(pk);
    this.wallet = createWalletClient({
      transport,
      account: this.account,
    });
    this.client = createPublicClient({
      transport,
    });
  }

  publicKey(): Address {
    return this.account.address;
  }

  async signTypedData(
    _walletAddress: string,
    typedData: EIP712TypedData,
  ): Promise<string> {
    return this.account.signTypedData({
      ...typedData,
    });
  }

  async ethCall(contractAddress: string, callData: string): Promise<string> {
    const { data } = await this.client.call({
      to: contractAddress as `0x${string}`,
      data: callData as `0x${string}`,
    });
    if (!data) {
      throw new Error("No data returned from eth_call");
    }
    return data as `0x${string}`;
  }

  async approveRouter(token: Address): Promise<Hash> {
    const txHash = await this.wallet.writeContract({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [
        "0x111111125421ca6dc452d289314280a0f8842a65", // 1inch Aggregation Router v6
        maxUint256,
      ],
      chain: this.wallet.chain,
      account: this.account,
    });

    await this.client.waitForTransactionReceipt({
      hash: txHash,
    });

    return txHash;
  }
}
