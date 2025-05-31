// TypeScript types for the SubscriptionModule contract

export interface Subscription {
  recipient: string
  amount: bigint
  lastRedeemed: bigint
  frequency: bigint
}

export interface SubscribeParams {
  recipient: string
  amount: bigint
  frequency: bigint
}

export interface FlowEdge {
  streamSinkId: number
  amount: bigint
}

export interface Stream {
  sourceCoordinate: number
  flowEdgeIds: number[]
  data: `0x${string}`
}

export interface RedeemPaymentParams {
  subId: bigint
  flowVertices: string[]
  flow: FlowEdge[]
  streams: Stream[]
  packedCoordinates: `0x${string}`
}

// Event types for better TypeScript support
export interface SubscriptionCreatedEvent {
  recipient: string
  subId: bigint
  amount: bigint
  frequency: bigint
  blockNumber: number
  transactionHash: string
}

export interface RedeemedEvent {
  subId: bigint
  recipient: string
  amount: bigint
  blockNumber: number
  transactionHash: string
}

// Utility functions
export const isPaymentDue = (subscription: Subscription): boolean => {
  const now = BigInt(Math.floor(Date.now() / 1000))
  return subscription.lastRedeemed + subscription.frequency <= now
}

export const formatFrequency = (frequency: bigint): string => {
  const frequencyNumber = Number(frequency)
  const days = frequencyNumber / (24 * 60 * 60)
  
  if (days === 1) return '1 day'
  if (days === 7) return '1 week'
  if (days === 30) return '1 month'
  if (days === 365) return '1 year'
  
  if (days < 1) return `${frequencyNumber} seconds`
  if (days < 7) return `${days} days`
  if (days < 30) return `${Math.round(days / 7)} weeks`
  if (days < 365) return `${Math.round(days / 30)} months`
  
  return `${Math.round(days / 365)} years`
}

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}