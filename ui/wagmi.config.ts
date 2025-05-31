import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '../contracts',
      deployments: {
        SubscriptionModule: {
          100: '0xd1F11A260720010D43587317CF8Dad46aF129744', // Gnosis Chain
        },
      },
    }),
    react(),
  ],
})