"use client";

import { useState, useEffect } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useWriteSubscriptionManagerSubscribe, useReadSubscriptionManagerModules } from "@/generated";
import { getTransactionUrl } from "@/lib/blockscout";

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
  } = useWriteSubscriptionManagerSubscribe();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
  const [mounted, setMounted] = useState(false);

  // Get the user's registered module address
  const { 
    data: userModuleAddress, 
    isLoading: isLoadingModule,
    error: moduleAddressError 
  } = useReadSubscriptionManagerModules({
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has a module installed (non-zero address)
  const hasModuleInstalled = userModuleAddress && userModuleAddress !== '0x0000000000000000000000000000000000000000';

  const handleSubscribe = async () => {
    if (!address || !hasModuleInstalled) return;

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

  // Checking module installation
  if (isLoadingModule) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-circles-primary text-sm font-medium">
            🔍 Checking if you have a subscription module registered...
          </p>
        </div>
      </div>
    );
  }

  // Module check error
  if (moduleAddressError) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            ❌ Error checking module: {moduleAddressError.message}
          </p>
        </div>
      </div>
    );
  }

  // Module not installed
  if (!hasModuleInstalled) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-circles-accent text-sm font-medium">
            ⚠️ No subscription module found for your address
          </p>
          <p className="text-gray-600 text-xs mt-1">
            You need to register a subscription module first.
          </p>
        </div>
        <button
          onClick={() => {
            // TODO: Implement module registration flow
            alert('Module registration not yet implemented. Please register a subscription module first.')
          }}
          className="px-6 py-3 bg-circles-accent hover:bg-circles-accent text-white rounded-lg font-bold transition-colors"
        >
          Register Module
        </button>
      </div>
    );
  }

  // Module is installed - show subscribe button
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 text-sm font-medium">
          ✅ Subscription module found! You can create subscriptions.
        </p>
        <p className="text-gray-600 text-xs mt-1 font-mono">
          Module: {userModuleAddress}
        </p>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isPending || isConfirming}
        className={`px-6 py-3 bg-circles-primary hover:bg-circles-primary text-white rounded-lg font-bold transition-colors ${
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
          <p className="text-red-700 text-sm font-medium">❌ Error: {error.message}</p>
        </div>
      )}

      {hash && isConfirming && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-circles-primary text-sm font-medium">
            ⏳ Transaction submitted. Waiting for confirmation...{" "}
            <a
              href={getTransactionUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-circles-accent underline hover:no-underline font-semibold"
            >
              View transaction
            </a>
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✅ Subscription created successfully!{" "}
            <a
              href={getTransactionUrl(hash!)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-circles-accent underline hover:no-underline font-semibold"
            >
              View transaction
            </a>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Recipients can now redeem payments when they become due.
          </p>
        </div>
      )}
    </div>
  );
}
