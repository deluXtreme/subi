// Simple Blockscout utility for manual links (when SDK isn't used)
export const getTransactionUrl = (txHash: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BLOCKSCOUT_BASE_URL?.replace(/\/$/, "") ||
    "https://gnosis.blockscout.com";
  return `${baseUrl}/tx/${txHash}`;
};
