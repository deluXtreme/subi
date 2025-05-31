import { gnosis } from "wagmi/chains";
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

// RainbowKit configuration for Gnosis chain
export const wagmiConfig = getDefaultConfig({
  appName: "Subi",
  projectId: getProjectId(),
  chains: [gnosis],
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