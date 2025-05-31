// Utility types
export type Address = `0x${string}`
export type TransactionHash = `0x${string}`
export type ChainId = 1 | 5 | 10 | 100 | 137 | 42161 | 11155111

// Transaction types
export interface TransactionResult {
  hash: string
  receipt?: {
    blockNumber: number
    blockHash: string
    transactionIndex: number
    gasUsed: bigint
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

// Environment configuration types
export interface EnvironmentConfig {
  chainId: number
  moduleAddress: string
  blockscoutBaseUrl: string
  walletConnectProjectId: string
}

// Error types
export interface AppError extends Error {
  code: 'WALLET_NOT_CONNECTED' | 'INSUFFICIENT_BALANCE' | 'INVALID_PARAMS' | 'TRANSACTION_FAILED' | 'MODULE_NOT_INSTALLED'
  details?: Record<string, unknown>
}

// Toast/notification types
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}