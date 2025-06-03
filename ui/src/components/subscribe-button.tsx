"use client";

import { useState, useEffect } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { sendCalls, waitForCallsStatus } from "@wagmi/core";
import { prepareEnableModuleTransactions } from "@/lib/buildTx";
import { wagmiConfig } from "@/lib/wagmi";
import {
  useWriteSubscriptionManagerSubscribe,
  useReadSubscriptionManagerModules,
} from "@/generated";
import { getTransactionUrl } from "@/lib/blockscout";
import { InputForm } from "./input-form";

import { useNotification } from "@blockscout/app-sdk";

interface SubscribeButtonProps {
  className?: string;
}

export function SubscribeButton({ className = "" }: SubscribeButtonProps) {
  const { address, isConnected } = useAccount();
  const { openTxToast } = useNotification();
  const {
    writeContract,
    data: hash,
    error,
    isPending,
  } = useWriteSubscriptionManagerSubscribe();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });
  const [mounted, setMounted] = useState(false);
  const [isRegisteringModule, setIsRegisteringModule] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [registrationHash, setRegistrationHash] = useState<string | null>(null);
  const [isRegistrationConfirmed, setIsRegistrationConfirmed] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<{
    recipient: string;
    amount: bigint;
    frequency: bigint;
  } | null>(null);

  // Get the user's registered module address
  const {
    data: userModuleAddress,
    isLoading: isLoadingModule,
    error: moduleAddressError,
  } = useReadSubscriptionManagerModules({
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hash) {
      // Show transaction toast notification
      openTxToast("100", hash);
    }
  }, [hash, openTxToast]);

  const handleRegisterModule = async () => {
    if (!address) {
      return;
    }

    setIsRegisteringModule(true);
    setRegistrationError(null);
    setRegistrationHash(null);
    setIsRegistrationConfirmed(false);

    try {
      // Prepare the module enablement transactions
      const transactions = await prepareEnableModuleTransactions(
        address as `0x${string}`,
      );

      // Convert transactions for sendCalls format
      const calls = transactions.map((tx) => ({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: BigInt(tx.value),
      }));

      // Send the batch of transactions using sendCalls
      const result = await sendCalls(wagmiConfig, { calls });

      setRegistrationHash(result.id);

      // Show transaction toast notification
      await openTxToast("100", result.id);

      // Wait for batch transaction confirmation
      const { status } = await waitForCallsStatus(wagmiConfig, {
        id: result.id,
      });

      if (status === "success") {
        setIsRegistrationConfirmed(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setRegistrationError(errorMessage);
    } finally {
      setIsRegisteringModule(false);
    }
  };

  // Check if user has a module installed (non-zero address)
  const hasModuleInstalled =
    userModuleAddress &&
    userModuleAddress !== "0x0000000000000000000000000000000000000000";

  const handleFormSubmit = (data: {
    recipient: string;
    amount: bigint;
    frequency: bigint;
  }) => {
    setSubscriptionData(data);
    handleSubscribe(data);
  };

  const handleSubscribe = async (data: {
    recipient: string;
    amount: bigint;
    frequency: bigint;
  }) => {
    if (!address || !hasModuleInstalled) {
      return;
    }

    try {
      writeContract({
        args: [data.recipient as `0x${string}`, data.amount, data.frequency],
      });
    } catch (error) {
      throw error;
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
          onClick={handleRegisterModule}
          disabled={isRegisteringModule}
          className={`px-6 py-3 bg-circles-accent hover:bg-circles-accent text-white rounded-lg font-bold transition-colors ${
            isRegisteringModule ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isRegisteringModule ? "Registering Module..." : "Register Module"}
        </button>

        {registrationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">
              ❌ Registration Error: {registrationError}
            </p>
          </div>
        )}

        {registrationHash && isRegistrationConfirmed && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">
              ✅ Module registration completed successfully!{" "}
              <a
                href={getTransactionUrl(registrationHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-circles-accent underline hover:no-underline font-semibold"
              >
                View transaction
              </a>
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Your module is now registered. Refresh the page to create
              subscriptions.
            </p>
          </div>
        )}

        {registrationHash && !isRegistrationConfirmed && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-circles-primary text-sm font-medium">
              ⏳ Waiting for batch confirmation...{" "}
              <a
                href={getTransactionUrl(registrationHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-circles-accent underline hover:no-underline font-semibold"
              >
                View transaction
              </a>
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Please wait while your module registration is being confirmed.
            </p>
          </div>
        )}
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

      <InputForm
        onSubmitAction={handleFormSubmit}
        disabled={isPending || isConfirming}
        initialRecipient="0xede0c2e70e8e2d54609c1bdf79595506b6f623fe"
        initialAmount={BigInt(1000000000000)}
        initialFrequency={BigInt(3600)}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">
            ❌ Error: {error.message}
          </p>
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
          {subscriptionData && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Recipient: {subscriptionData.recipient}</p>
              <p>
                Amount: {(Number(subscriptionData.amount) / 1e12).toFixed(6)}{" "}
                CRCs
              </p>
              <p>Frequency: Every {subscriptionData.frequency} seconds</p>
            </div>
          )}
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
          {subscriptionData && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Recipient: {subscriptionData.recipient}</p>
              <p>
                Amount: {(Number(subscriptionData.amount) / 1e12).toFixed(6)}{" "}
                CRCs
              </p>
              <p>Frequency: Every {subscriptionData.frequency} seconds</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
