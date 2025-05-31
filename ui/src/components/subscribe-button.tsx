"use client";

import { useState, useEffect } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useWriteSubscriptionModuleSubscribe } from "@/generated";
import { getTransactionUrl } from "@/lib/blockscout";
import { useSafeModule } from "@/hooks/use-safe-module";

interface SubscribeButtonProps {
  recipient?: string;
  amount?: bigint;
  frequency?: bigint;
  className?: string;
}

export function SubscribeButton({
  recipient = "0xcF6Dc192dc292D5F2789DA2DB02D6dD4f41f4214",
  amount = BigInt(1000000000000), // 1 USDC (6 decimals)
  frequency = BigInt(3600), // 1 hour
  className = "",
}: SubscribeButtonProps) {
  const { address, isConnected } = useAccount();
  const {
    writeContract,
    data: hash,
    error,
    isPending,
  } = useWriteSubscriptionModuleSubscribe();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
  const [mounted, setMounted] = useState(false);
  
  const {
    isModuleInstalled,
    isCheckingModule,
    isSafeWallet,
    isCheckingSafe,
    error: moduleError,
    recheckModule,
  } = useSafeModule();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = async () => {
    if (!address) return;

    try {
      writeContract({
        args: [recipient as `0x${string}`, amount, frequency],
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  if (!mounted) {
    return (
      <div
        className={`p-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Not connected
  if (!isConnected) {
    return (
      <div
        className={`p-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}
      >
        <p className="text-gray-600">
          Please connect your Safe wallet to continue
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Note: Only Safe owners can create subscriptions
        </p>
      </div>
    );
  }

  // Checking if it's a Safe wallet
  if (isCheckingSafe) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            🔍 Checking if connected wallet is a Safe...
          </p>
        </div>
      </div>
    );
  }

  // Not a Safe wallet
  if (isSafeWallet === false) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ❌ This app only works with Safe wallets. Please connect through a Safe interface.
          </p>
        </div>
      </div>
    );
  }

  // Checking module installation
  if (isCheckingModule) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            🔍 Checking if SubscriptionModule is installed on your Safe...
          </p>
        </div>
      </div>
    );
  }

  // Module check error
  if (moduleError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ❌ Error checking module: {moduleError}
          </p>
          <button
            onClick={recheckModule}
            className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded"
          >
            Retry Check
          </button>
        </div>
      </div>
    );
  }

  // Module not installed
  if (isModuleInstalled === false) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ SubscriptionModule is not installed on your Safe
          </p>
          <p className="text-yellow-700 text-xs mt-1">
            You need to install the SubscriptionModule as a Zodiac module first.
          </p>
        </div>
        <button
          onClick={() => {
            // TODO: Implement module installation flow
            alert('Module installation not yet implemented. Please install the SubscriptionModule manually through your Safe interface.')
          }}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
        >
          Install SubscriptionModule
        </button>
      </div>
    );
  }

  // Module is installed - show subscribe button
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          ✅ SubscriptionModule is installed! You can create subscriptions.
        </p>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isPending || isConfirming}
        className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${
          isPending || isConfirming ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPending
          ? "Preparing..."
          : isConfirming
            ? "Creating Subscription..."
            : "Create Subscription"}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">❌ Error: {error.message}</p>
        </div>
      )}

      {hash && isConfirming && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            ⏳ Transaction submitted. Waiting for confirmation...{" "}
            <a
              href={getTransactionUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              View transaction
            </a>
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ Subscription created successfully!{" "}
            <a
              href={getTransactionUrl(hash!)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              View transaction
            </a>
          </p>
          <p className="text-green-700 text-xs mt-1">
            Recipients can now redeem payments when they become due.
          </p>
        </div>
      )}
    </div>
  );
}
