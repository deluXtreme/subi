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
          100: "0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834", // Gnosis Chain
        },
      },
    }),
    react(),
  ],
});
