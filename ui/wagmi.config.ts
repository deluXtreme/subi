import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../contracts",
      deployments: {
        SubscriptionModule: {
          100: "0x01E65042f8CE628f07bba35c97883825e7B97c2f", // Gnosis Chain
        },
      },
    }),
    react(),
  ],
});
