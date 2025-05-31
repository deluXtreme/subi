import {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  gnosis,
} from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Get WalletConnect Project ID from environment
const getProjectId = (): string => {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    console.warn(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set, using fallback",
    );
    return "0deda9a6c0cac87c2fd74dc0fce259c6";
  }
  return projectId;
};

// Get chain ID from environment
const getChainId = (): number => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!chainId) {
    throw new Error("NEXT_PUBLIC_CHAIN_ID environment variable is required");
  }
  return parseInt(chainId, 10);
};

// Map chain IDs to chain objects
const getChainFromId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 11155111:
      return sepolia;
    case 137:
      return polygon;
    case 42161:
      return arbitrum;
    case 10:
      return optimism;
    case 100:
      return gnosis;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

const targetChainId = getChainId();
const targetChain = getChainFromId(targetChainId);

// RainbowKit configuration without auto-connect
export const wagmiConfig = getDefaultConfig({
  appName: "Subscription Manager",
  projectId: getProjectId(),
  chains: [targetChain],
  ssr: true,
});

// React Query client for Wagmi
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

// Type exports for use in components
export type Config = typeof wagmiConfig;
