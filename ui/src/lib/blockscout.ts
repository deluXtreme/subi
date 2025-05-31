// Blockscout utility helper
export const getBlockscoutBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BLOCKSCOUT_BASE_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BLOCKSCOUT_BASE_URL environment variable is required')
  }
  return baseUrl.replace(/\/$/, '') // Remove trailing slash
}

export const getTransactionUrl = (txHash: string): string => {
  const baseUrl = getBlockscoutBaseUrl()
  return `${baseUrl}/tx/${txHash}`
}

export const getAddressUrl = (address: string): string => {
  const baseUrl = getBlockscoutBaseUrl()
  return `${baseUrl}/address/${address}`
}

export const getBlockUrl = (blockNumber: string | number): string => {
  const baseUrl = getBlockscoutBaseUrl()
  return `${baseUrl}/block/${blockNumber}`
}

export const getTokenUrl = (tokenAddress: string): string => {
  const baseUrl = getBlockscoutBaseUrl()
  return `${baseUrl}/token/${tokenAddress}`
}

// Helper to create clickable links
export const createExplorerLink = (
  type: 'tx' | 'address' | 'block' | 'token',
  value: string | number,
  text?: string
): { url: string; displayText: string } => {
  let url: string
  let displayText: string

  switch (type) {
    case 'tx':
      url = getTransactionUrl(value as string)
      displayText = text || `${(value as string).slice(0, 10)}...${(value as string).slice(-8)}`
      break
    case 'address':
      url = getAddressUrl(value as string)
      displayText = text || `${(value as string).slice(0, 6)}...${(value as string).slice(-4)}`
      break
    case 'block':
      url = getBlockUrl(value)
      displayText = text || `Block ${value}`
      break
    case 'token':
      url = getTokenUrl(value as string)
      displayText = text || `${(value as string).slice(0, 6)}...${(value as string).slice(-4)}`
      break
    default:
      throw new Error(`Unsupported explorer link type: ${type}`)
  }

  return { url, displayText }
}