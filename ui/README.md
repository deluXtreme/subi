# Subscription Manager

A Next.js application for managing recurring payments through a Zodiac module on Safe wallets. Integrates with the Circles protocol on Gnosis Chain. Built with TypeScript, Wagmi, and RainbowKit.

## Overview

This app allows users to:
- Install the SubscriptionModule as a Zodiac module on Safe wallets
- Create recurring payment subscriptions (Safe owners only)
- Recipients can redeem payments when due through Circles protocol
- Monitor subscription status and payment history

## Prerequisites

- Node.js >= 18.18.0 (or use Bun as the runtime)
- A Safe wallet on Gnosis Chain with the SubscriptionModule installed
- Some xDAI for gas fees on Gnosis Chain
- Wallet configured for Gnosis Chain (Chain ID: 100)
- Understanding of Circles protocol and flow matrices (for payment redemption)

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=100                                   # 100 = Gnosis Chain
NEXT_PUBLIC_BLOCKSCOUT_BASE_URL=https://gnosis.blockscout.com

# Smart Contract Addresses
NEXT_PUBLIC_MODULE_ADDRESS=0xd1F11A260720010D43587317CF8Dad46aF129744

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=0deda9a6c0cac87c2fd74dc0fce259c6
```

# Optional: RPC endpoints (if needed)
# NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here
# NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id_here
```

### 3. Generate Contract Hooks

Generate typed hooks from your compiled contracts:

```bash
bun run generate
```

This will create fully typed hooks in `src/generated.ts` using the latest contract ABIs.

### 4. Run Development Server

```bash
bun run dev
```

Visit `http://localhost:3000` to see the application.

## Architecture

### Frontend Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Wagmi v2**: React hooks for Ethereum
- **Viem**: Low-level Ethereum library
- **RainbowKit**: Wallet connection UI
- **React Query**: Data fetching and caching

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── providers.tsx      # Web3 providers wrapper
│   ├── subscribe-button.tsx # Main subscription component
│   └── wallet-connect.tsx # Safe wallet connection
├── generated.ts           # Auto-generated wagmi hooks
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks (future)
├── lib/                   # Utility libraries
│   ├── blockscout.ts     # Blockchain explorer utilities
│   ├── safe.ts           # Smart contract utilities
│   └── wagmi.ts          # Wagmi configuration
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

## Key Components

### Header Component

Contains the RainbowKit ConnectButton for wallet connections. Supports multiple wallet types including MetaMask, WalletConnect, and others.

### Generated Hooks (via @wagmi/cli)

**Write Hooks** - Fully typed contract interactions:
- `useWriteSubscriptionModuleSubscribe()` - Create subscriptions
- `useWriteSubscriptionModuleRedeemPayment()` - Redeem payments

**Read Hooks** - Typed contract data reading:
- `useReadSubscriptionModuleSubscriptions()` - Get subscription details
- `useReadSubscriptionModuleSubscriptionCounter()` - Get total count

**Event Hooks** - Listen to contract events:
- `useWatchSubscriptionModuleSubscriptionCreatedEvent()` - New subscriptions
- `useWatchSubscriptionModuleRedeemedEvent()` - Payment redemptions

### SubscribeButton Component

Main component for subscription creation. Only Safe owners can create subscriptions through the installed Zodiac module.

**Flow:**
1. Check if wallet is connected to a Safe
2. Validate that SubscriptionModule is installed on the Safe
3. Show "Create Subscription" button for Safe owners
4. Handle subscription creation transaction through Safe
5. Display transaction status and subscription ID

### Smart Contract Integration

**Generated Hooks from @wagmi/cli:**
- Fully typed contract interactions with zero boilerplate
- Auto-generated from Foundry contract artifacts
- Includes read, write, and event watching hooks
- Type-safe arguments and return values

**Key Generated Hooks:**
- `useWriteSubscriptionModuleSubscribe()` - Create subscriptions (Safe owner only)
- `useWriteSubscriptionModuleRedeemPayment()` - Redeem payments (anyone)
- `useReadSubscriptionModuleSubscriptions()` - View subscription details

### Blockscout Integration

Utility functions for creating blockchain explorer links:
- Transaction URLs
- Address URLs
- Block URLs

## TypeScript for Backend Developers

If you're coming from Rust/Python, here are key TypeScript concepts:

### Interface vs Type
```typescript
// Interface (extensible)
interface User {
  name: string
  age: number
}

// Type alias (not extensible)
type Status = 'pending' | 'complete' | 'failed'
```

### Generics
```typescript
// Similar to Rust generics or Python TypeVar
interface ApiResponse<T> {
  data: T
  success: boolean
}

const userResponse: ApiResponse<User> = {
  data: { name: "Alice", age: 30 },
  success: true
}
```

### Union Types
```typescript
// Similar to Rust enums or Python Union
type ChainId = 1 | 5 | 137 | 42161  // Only these values allowed
```

### Optional Properties
```typescript
interface Config {
  required: string
  optional?: string  // May be undefined
}
```

### async/await
```typescript
// Similar to Rust futures or Python asyncio
const fetchData = async (): Promise<User> => {
  const response = await fetch('/api/user')
  return response.json()
}
```

## Smart Contract Integration Best Practices

### 1. ABI Management
Store ABIs in typed files:
```typescript
export const contractAbi = [...] as const satisfies Abi
```

### 2. Type Safety
Use TypeScript for contract parameters:
```typescript
interface SubscribeParams {
  recipient: `0x${string}`  // Ensures valid address format
  amount: bigint           // Use bigint for uint256
  frequency: bigint
}
```

### 3. Zodiac Module Integration
### 3. Generated Hook Integration
```typescript
// Using generated hooks - fully typed and simplified
const { writeContract } = useWriteSubscriptionModuleSubscribe()

const handleSubscribe = async () => {
  // Only Safe owners can call this function
  await writeContract({
    args: [recipient, amount, frequency], // Fully typed arguments
  })
}

// Read subscription data with generated hooks
const { data: subscription } = useReadSubscriptionModuleSubscriptions({
  args: [subscriptionId],
})

// Watch for events with typed event hooks
useWatchSubscriptionModuleSubscriptionCreatedEvent({
  onLogs: (logs) => {
    logs.forEach(log => {
      console.log('New subscription:', log.args.subId)
    })
  }
})
```

## Development Workflow

### 1. Adding New Features
1. **Update contracts**: Make changes in `../contracts/src/`
2. **Rebuild and regenerate**: `forge build && bun run generate`
3. **Use generated hooks**: Import from `@/generated` 
4. **Build components**: Use typed hooks in `src/components/`
5. **Add pages**: Create pages in `src/app/`

### 2. Contract Integration and Development
1. **Update contracts**: Make changes in `../contracts/src/`
2. **Build contracts**: `cd ../contracts && forge build`
3. **Regenerate hooks**: `bun run generate`
4. **Use typed hooks**: Import and use generated hooks from `@/generated`
5. **Install on Safe**: Add SubscriptionModule as Zodiac module
6. **Verify deployment**: https://gnosis.blockscout.com/address/0xd1F11A260720010D43587317CF8Dad46aF129744

### 3. Testing Generated Hooks
1. **Test typed interactions**: Use generated hooks like `useWriteSubscriptionModuleSubscribe()`
2. **Verify Safe setup**: Ensure SubscriptionModule is installed as Zodiac module
3. **Fund wallet**: Have xDAI for gas fees on Gnosis Chain
4. **Test flows**: Create subscriptions as Safe owner, test payment redemption
5. **Monitor events**: Use generated event hooks for real-time updates
6. **Verify on-chain**: Check transactions on Gnosis Blockscout

### 4. Environment Management
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Validate required variables at startup
- Use different `.env.local` files for different environments

## Troubleshooting

### Common Issues

**"Safe wallet not detected"**
- Ensure you have a Safe wallet on Gnosis Chain
- Check that the SubscriptionModule is installed as a Zodiac module
- Verify you are the Safe owner (only owners can create subscriptions)

**"Transaction failed"**
- Verify you have sufficient xDAI for gas fees on Gnosis Chain
- Check that your wallet is connected to Gnosis Chain (Chain ID: 100)
- Verify the contract address is correct: 0xd1F11A260720010D43587317CF8Dad46aF129744

**TypeScript errors**
- Run `npx tsc --noEmit` to check for type errors
- Ensure all imports have proper types

**Transaction failures**
- Check gas limits and balances
- Verify contract addresses and function signatures
- Use block explorer to debug failed transactions

### Development Tips

1. **Use TypeScript strict mode** - Catches errors early
2. **Validate environment variables** - Fail fast on misconfiguration
3. **Handle loading states** - Better user experience
4. **Add proper error boundaries** - Graceful error handling
5. **Use React DevTools** - Debug component state

## Next Steps

### Immediate Tasks
1. **Install SubscriptionModule** on your Safe wallet as a Zodiac module
2. **Test contract updates**: Run `bun run generate` after any contract changes
3. **Build subscription UI**: Use generated hooks like `useReadSubscriptionModuleSubscriptions()`
4. **Implement redemption**: Create payment redemption flow with `useWriteSubscriptionModuleRedeemPayment()`
5. **Add Circles integration**: Build flow matrix generation for payment redemption

### Future Enhancements
1. Add subscription management UI (view all subscriptions)
2. Implement automatic payment redemption for recipients
3. Add Circles protocol flow optimization
4. Create Safe module installation wizard
5. Add subscription analytics and reporting

### Production Considerations
1. Add comprehensive error handling
2. Implement proper loading states
3. Add transaction history
4. Security audit for contract interactions
5. Performance optimization for large subscription lists
6. Add support for different Circles token types
7. Integrate with Safe Apps ecosystem

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Safe Documentation](https://docs.safe.global/)
- [Viem Documentation](https://viem.sh/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)