"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import {
  isSafeModuleInstalled,
  isSafeWallet,
  getSubscriptionModuleAddress,
} from "@/lib/safe-api";

export interface UseSafeModuleResult {
  isModuleInstalled: boolean | null;
  isCheckingModule: boolean;
  isSafeWallet: boolean | null;
  isCheckingSafe: boolean;
  error: string | null;
  recheckModule: () => Promise<void>;
}

export function useSafeModule(): UseSafeModuleResult {
  const { address } = useAccount();
  console.log(address);
  const [isModuleInstalled, setIsModuleInstalled] = useState<boolean | null>(
    null,
  );
  const [isCheckingModule, setIsCheckingModule] = useState(false);
  const [isSafeWalletStatus, setIsSafeWalletStatus] = useState<boolean | null>(
    null,
  );
  const [isCheckingSafe, setIsCheckingSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSafeStatus = useCallback(async (walletAddress: string) => {
    setIsCheckingSafe(true);
    setError(null);

    try {
      const isSafe = await isSafeWallet(walletAddress);
      setIsSafeWalletStatus(isSafe);
      return isSafe;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to check Safe wallet status";
      setError(errorMessage);
      setIsSafeWalletStatus(false);
      return false;
    } finally {
      setIsCheckingSafe(false);
    }
  }, []);

  const checkModuleInstallation = useCallback(async (walletAddress: string) => {
    setIsCheckingModule(true);
    setError(null);

    try {
      const moduleAddress = getSubscriptionModuleAddress();
      const isInstalled = await isSafeModuleInstalled(
        walletAddress,
        moduleAddress,
      );
      setIsModuleInstalled(isInstalled);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to check module installation";
      setError(errorMessage);
      setIsModuleInstalled(false);
    } finally {
      setIsCheckingModule(false);
    }
  }, []);

  const recheckModule = useCallback(async () => {
    if (!address) return;

    // First check if it's a Safe wallet
    const isSafe = await checkSafeStatus(address);

    // Only check module if it's a Safe wallet
    if (isSafe) {
      await checkModuleInstallation(address);
    } else {
      setIsModuleInstalled(null);
    }
  }, [address, checkSafeStatus, checkModuleInstallation]);

  // Check Safe and module status when address changes
  useEffect(() => {
    if (!address) {
      setIsSafeWalletStatus(null);
      setIsModuleInstalled(null);
      setError(null);
      return;
    }

    recheckModule();
  }, [address, recheckModule]);

  return {
    isModuleInstalled,
    isCheckingModule,
    isSafeWallet: isSafeWalletStatus,
    isCheckingSafe,
    error,
    recheckModule,
  };
}
