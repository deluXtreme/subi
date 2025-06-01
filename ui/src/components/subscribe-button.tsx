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
import {
  createLogger,
  logUserAction,
  logComponentMount,
  logComponentUnmount,
  logContractCall,
  logTransaction,
} from "@/lib/logger";
import { useNotification } from "@blockscout/app-sdk";

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
  const logger = createLogger({ component: "SubscribeButton" });
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
    logComponentMount("SubscribeButton", {
      recipient,
      amount: amount.toString(),
      frequency: frequency.toString(),
    });
    setMounted(true);

    return () => {
      logComponentUnmount("SubscribeButton");
    };
  }, [recipient, amount, frequency]);

  useEffect(() => {
    if (address) {
      logger.info("Wallet connected", { address, isConnected });
    } else {
      logger.info("Wallet disconnected");
    }
  }, [address, isConnected, logger]);

  useEffect(() => {
    if (isLoadingModule) {
      logger.debug("Loading user module address", { address });
    } else if (userModuleAddress) {
      logger.info("Module address loaded", {
        address,
        userModuleAddress,
        hasModule:
          userModuleAddress !== "0x0000000000000000000000000000000000000000",
      });
    }
  }, [isLoadingModule, userModuleAddress, address, logger]);

  useEffect(() => {
    if (moduleAddressError) {
      logger.error("Module address check failed", moduleAddressError as Error, {
        address,
      });
    }
  }, [moduleAddressError, address, logger]);

  // Log transaction state changes
  useEffect(() => {
    if (error) {
      logger.error("Subscription transaction error", error as Error, {
        address,
        hash,
      });
    }
  }, [error, address, hash, logger]);

  useEffect(() => {
    if (hash) {
      logTransaction(hash, "Subscription transaction submitted", {
        address,
        recipient,
      });
      // Show transaction toast notification
      openTxToast("100", hash);
    }
  }, [hash, address, recipient, openTxToast]);

  useEffect(() => {
    if (isConfirming && hash) {
      logger.info("Transaction confirming", { address, hash, recipient });
    }
  }, [isConfirming, hash, address, recipient, logger]);

  useEffect(() => {
    if (isConfirmed && hash) {
      logger.info("Subscription created successfully", {
        address,
        hash,
        recipient,
        amount: amount.toString(),
        frequency: frequency.toString(),
      });
      logUserAction("Subscription creation completed", {
        address,
        hash,
        recipient,
      });
    }
  }, [isConfirmed, hash, address, recipient, amount, frequency, logger]);

  // Track module registration success
  useEffect(() => {
    if (registrationHash) {
      logger.info("Module registration hash received", {
        address,
        registrationHash,
        timestamp: new Date().toISOString(),
      });
    }
  }, [registrationHash, address, logger]);

  // Track registration error states
  useEffect(() => {
    if (registrationError) {
      logger.warn("Module registration error state updated", {
        address,
        registrationError,
        timestamp: new Date().toISOString(),
      });
    }
  }, [registrationError, address, logger]);

  // Track registration loading state
  useEffect(() => {
    logger.debug("Module registration loading state changed", {
      address,
      isRegisteringModule,
      timestamp: new Date().toISOString(),
    });
  }, [isRegisteringModule, address, logger]);

  // Track registration confirmation state
  useEffect(() => {
    if (isRegistrationConfirmed) {
      logger.info("Module registration confirmation state updated", {
        address,
        isRegistrationConfirmed,
        registrationHash,
        timestamp: new Date().toISOString(),
      });
    }
  }, [isRegistrationConfirmed, address, registrationHash, logger]);

  const handleRegisterModule = async () => {
    if (!address) {
      logger.warn("Module registration attempted without connected wallet", { address });
      return;
    }

    logger.info("Module registration flow initiated", {
      address,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    setIsRegisteringModule(true);
    setRegistrationError(null);
    setRegistrationHash(null);
    setIsRegistrationConfirmed(false);

    try {
      logger.info("Starting module registration process", { address });
      logUserAction("Module registration started", { address });

      // Prepare the module enablement transactions
      logger.debug("Preparing module enablement transactions", { address });
      const startTime = performance.now();

      const transactions = await prepareEnableModuleTransactions(address as `0x${string}`);

      const preparationTime = performance.now() - startTime;
      logger.info("Module transactions prepared successfully", {
        address,
        transactionCount: transactions.length,
        preparationTimeMs: preparationTime.toFixed(2),
        transactionSummary: transactions.map((tx, index) => ({
          index,
          to: tx.to,
          value: tx.value,
          dataLength: tx.data.length,
        })),
      });

      // Convert transactions for sendCalls format
      const calls = transactions.map((tx) => ({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: BigInt(tx.value),
      }));

      logger.debug("Converted transactions to sendCalls format", {
        address,
        callsCount: calls.length,
        calls: calls.map((call, index) => ({
          index,
          to: call.to,
          value: call.value.toString(),
          dataLength: call.data.length,
        })),
      });

      // Send the batch of transactions using sendCalls
      logger.info("Initiating batch transaction submission", {
        address,
        transactionCount: calls.length,
        wagmiConfigPresent: !!wagmiConfig,
      });

      const sendStartTime = performance.now();
      const result = await sendCalls(wagmiConfig, { calls });
      const sendTime = performance.now() - sendStartTime;

      logger.info("Module registration batch sent successfully", {
        address,
        batchId: result.id,
        submissionTimeMs: sendTime.toFixed(2),
        result: {
          id: result.id,
          capabilities: result.capabilities,
        },
      });

      setRegistrationHash(result.id);
      logTransaction(result.id, "Module registration batch submitted", {
        address,
        transactionCount: calls.length,
        totalTimeMs: (performance.now() - startTime).toFixed(2),
      });

      // Show transaction toast notification
      await openTxToast("100", result.id);
      logUserAction("Module registration batch submitted", {
        address,
        batchId: result.id,
        transactionCount: calls.length,
      });

      logger.info("Module registration state updated", {
        address,
        registrationHash: result.id,
        nextStep: "awaiting confirmation",
      });

      // Wait for batch transaction confirmation
      logger.info("Waiting for batch transaction confirmation", {
        address,
        batchId: result.id,
      });

      const waitStartTime = performance.now();
      const { status, receipts } = await waitForCallsStatus(wagmiConfig, {
        id: result.id,
      });
      const waitTime = performance.now() - waitStartTime;

      logger.info("Batch transaction status received", {
        address,
        batchId: result.id,
        status,
        statusType: typeof status,
        receiptsCount: receipts?.length || 0,
        waitTimeMs: waitTime.toFixed(2),
        debugInfo: {
          statusString: String(status),
          actualStatusValue: status,
        },
        receipts: receipts?.map((receipt, index) => ({
          index,
          transactionHash: receipt.transactionHash,
          status: receipt.status,
          gasUsed: receipt.gasUsed?.toString(),
          blockNumber: receipt.blockNumber?.toString(),
        })),
      });

      if (status === "success") {
        setIsRegistrationConfirmed(true);
        logger.info("Module registration confirmed successfully", {
          address,
          batchId: result.id,
          totalTimeMs: (performance.now() - startTime).toFixed(2),
          receiptsCount: receipts?.length || 0,
          statusReceived: status,
        });
        logUserAction("Module registration confirmed", {
          address,
          batchId: result.id,
          receiptsCount: receipts?.length || 0,
        });
      } else {
        logger.warn("Module registration batch completed with non-success status", {
          address,
          batchId: result.id,
          status,
          receiptsCount: receipts?.length || 0,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const errorStack = error instanceof Error ? error.stack : undefined;

      logger.error("Module registration failed", error as Error, {
        address,
        errorMessage,
        errorType: error?.constructor?.name,
        errorStack: errorStack?.split("\n").slice(0, 5).join("\n"), // First 5 lines of stack
      });

      setRegistrationError(errorMessage);
      logUserAction("Module registration failed", {
        address,
        error: errorMessage,
        errorType: error?.constructor?.name,
      });
    } finally {
      setIsRegisteringModule(false);
      logger.debug("Module registration process completed", {
        address,
        isRegisteringModule: false,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Check if user has a module installed (non-zero address)
  const hasModuleInstalled =
    userModuleAddress &&
    userModuleAddress !== "0x0000000000000000000000000000000000000000";

  const handleSubscribe = async () => {
    logger.debug("Subscribe button clicked", {
      address,
      hasModuleInstalled,
      recipient,
      amount: amount.toString(),
      frequency: frequency.toString(),
    });

    if (!address || !hasModuleInstalled) {
      logger.warn("Subscribe attempt blocked - missing requirements", {
        hasAddress: !!address,
        hasModuleInstalled,
      });
      return;
    }

    try {
      logUserAction("Creating subscription", {
        address,
        recipient,
        amount: amount.toString(),
        frequency: frequency.toString(),
      });

      logContractCall("SubscriptionManager", "subscribe", {
        recipient,
        amount: amount.toString(),
        frequency: frequency.toString(),
      });

      writeContract({
        args: [recipient, amount, frequency],
      });

      logger.info("Subscription contract call initiated");
    } catch (error) {
      logger.error("Error creating subscription", error as Error, {
        address,
        recipient,
        amount: amount.toString(),
        frequency: frequency.toString(),
      });
    }
  };

  if (!mounted) {
    logger.debug("Component not yet mounted, showing loading state");
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
    logger.debug("Wallet not connected, showing connection prompt");
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
    logger.debug("Checking module installation status", { address });
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
    logger.error(
      "Module check error displayed to user",
      moduleAddressError as Error,
      { address },
    );
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
    logger.info("Module not installed, showing registration prompt", {
      address,
      userModuleAddress,
    });
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
              Your module is now registered. Refresh the page to create subscriptions.
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
  logger.debug("Module installed, showing subscribe interface", {
    address,
    userModuleAddress,
  });

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
