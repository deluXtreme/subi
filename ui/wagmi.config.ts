import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../contracts",
      deployments: {
        SubscriptionManager: {
          100: "0x27c2a11AA3E2237fDE4aE782cC36eBBB49d26c57", // Gnosis Chain
        },
      },
    }),
    react(),
  ],
});
