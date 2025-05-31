import SafeApiKit from "@safe-global/api-kit";
import { getAddress } from "viem";

// Safe API Kit instance (singleton)
let apiKit: SafeApiKit | null = null;

// Get chain ID from environment
const getChainId = (): number => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!chainId) {
    throw new Error("NEXT_PUBLIC_CHAIN_ID environment variable is required");
  }
  return parseInt(chainId, 10);
};

// Get configured Safe API Kit instance
export const getSafeApiKit = (): SafeApiKit => {
  if (!apiKit) {
    const chainId = getChainId();
    apiKit = new SafeApiKit({
      chainId: BigInt(chainId),
    });
  }
  return apiKit;
};

// Check if a Safe has a specific module installed
export const isSafeModuleInstalled = async (
  safeAddress: string,
  moduleAddress: string,
): Promise<boolean> => {
  try {
    const apiKit = getSafeApiKit();
    const safes = await apiKit.getSafesByModule(moduleAddress);
    console.log("Safes with module:", safes);
    return safes.safes.includes(getAddress(safeAddress));
  } catch {
    console.error("Error checking if module is installed");
    return false;
  }
};

// Get all Safes that have a specific module installed
export const getSafesWithModule = async (
  moduleAddress: string,
): Promise<string[]> => {
  try {
    const apiKit = getSafeApiKit();
    const result = await apiKit.getSafesByModule(moduleAddress);
    return result.safes;
  } catch (error) {
    console.error("Error getting Safes with module:", error);
    return [];
  }
};

// Get Safe info for a specific address
export const getSafeInfo = async (safeAddress: string) => {
  try {
    const apiKit = getSafeApiKit();
    return await apiKit.getSafeInfo(safeAddress);
  } catch (error) {
    console.error("Error getting Safe info:", error);
    return null;
  }
};

// Check if an address is a Safe wallet
export const isSafeWallet = async (address: string): Promise<boolean> => {
  try {
    const safeInfo = await getSafeInfo(address);
    return safeInfo !== null;
  } catch {
    return false;
  }
};

// Validate Safe address format
export const isValidSafeAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get the SubscriptionModule address from environment
export const getSubscriptionModuleAddress = (): string => {
  const address = process.env.NEXT_PUBLIC_MODULE_ADDRESS;
  if (!address) {
    throw new Error(
      "NEXT_PUBLIC_MODULE_ADDRESS environment variable is required",
    );
  }

  if (!isValidSafeAddress(address)) {
    throw new Error(`Invalid module address format: ${address}`);
  }

  return address;
};
