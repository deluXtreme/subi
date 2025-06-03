import { DynamicSubscribeButton } from "@/components/dynamic-subscribe-button";

export default function Home() {

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-circles-primary mb-6">
            Subi
          </h1>
          <p className="text-xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A subscription management system for Safe wallets that enables recurring payments
            through the Circles protocol. Connect your Safe wallet to create and manage
            automated subscriptions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Subscription Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-circles-primary text-center">
              Create Subscription
            </h2>
            <div className="p-8 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Create Subscription</h3>
              <DynamicSubscribeButton />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-circles-primary dark:text-blue-400 mb-6 text-center">
            How Subi Works
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-circles-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                1
              </div>
              <div className="font-bold text-gray-900 dark:text-white mb-3">Register Module</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Register your subscription module with the Subi contract to enable
                automated payments from your Safe wallet.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-circles-accent text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                2
              </div>
              <div className="font-bold text-gray-900 dark:text-white mb-3">Create Subscriptions</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Set up recurring payments by specifying recipient address,
                amount, and frequency for your subscriptions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-circles-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                3
              </div>
              <div className="font-bold text-gray-900 dark:text-white mb-3">Automated Payments</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Recipients can claim their payments when due through the
                Circles protocol&apos;s secure flow matrix system.
              </p>
            </div>
          </div>
        </div>

        {/* Environment Info for Development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Development Info:</h4>
            <div className="space-y-1 font-mono text-gray-700 dark:text-gray-200">
              <div>
                Chain ID: {process.env.NEXT_PUBLIC_CHAIN_ID || "Not set"}{" "}
                (Gnosis Chain)
              </div>
              <div>
                Module Address:{" "}
                {process.env.NEXT_PUBLIC_MODULE_ADDRESS || "Not set"}
              </div>
              <div>Circles Hub: 0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8</div>
              <div>
                Blockscout URL:{" "}
                {process.env.NEXT_PUBLIC_BLOCKSCOUT_BASE_URL || "Not set"}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
