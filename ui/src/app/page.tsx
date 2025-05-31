import { SubscribeButton } from '@/components/subscribe-button'
import { ClientOnly } from '@/components/client-only'

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A Zodiac module for Safe wallets that enables recurring payments through the Circles protocol.
            Connect your Safe wallet to manage subscriptions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Subscription Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Manage Subscription
            </h2>
            <div className="p-6 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-medium mb-4">Create Subscription</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">1000000 wei (Circles tokens)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">2592000 seconds (30 days)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-mono text-xs">0xd1F1...9744</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Module Status:</span>
                  <span className="font-medium text-orange-600">Requires Safe module installation</span>
                </div>
              </div>
              <ClientOnly
                fallback={
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                }
              >
                <SubscribeButton
                  recipient="0xd1F11A260720010D43587317CF8Dad46aF129744"
                  amount={BigInt(1000000)}
                  frequency={BigInt(2592000)}
                />
              </ClientOnly>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How it works
          </h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-blue-800">
            <div>
              <div className="font-medium mb-2">1. Install Module</div>
              <p>Install the SubscriptionModule as a Zodiac module on your Safe wallet.</p>
            </div>
            <div>
              <div className="font-medium mb-2">2. Create Subscriptions</div>
              <p>As Safe owner, create subscriptions that specify recipient, amount, and payment frequency.</p>
            </div>
            <div>
              <div className="font-medium mb-2">3. Recipients Redeem</div>
              <p>Recipients can redeem payments when they&apos;re due using the Circles protocol flow matrix.</p>
            </div>
          </div>
        </div>

        {/* Environment Info for Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg text-xs">
            <h4 className="font-semibold mb-2">Development Info:</h4>
            <div className="space-y-1 font-mono">
              <div>Chain ID: {process.env.NEXT_PUBLIC_CHAIN_ID || 'Not set'} (Gnosis Chain)</div>
              <div>Module Address: {process.env.NEXT_PUBLIC_MODULE_ADDRESS || 'Not set'}</div>
              <div>Circles Hub: 0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8</div>
              <div>Blockscout URL: {process.env.NEXT_PUBLIC_BLOCKSCOUT_BASE_URL || 'Not set'}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}