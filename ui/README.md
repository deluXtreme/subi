# Subi - Recurring Payments for Safe Wallets

**ETHPrague 2025 Hackathon Submission**

🚀 **Reimagining money for Safe wallets through Circles protocol - where every individual has the right to create currency**

## What is Subi?

Subi brings the **revolutionary Circles monetary system** to Safe wallets through a custom Zodiac module. By integrating with Circles protocol, we're not just enabling payments - we're participating in a fundamental reimagining of money itself, where currency creation is democratized and distributed to every individual rather than concentrated in banks and central institutions.

**Circles Philosophy**: Every person deserves equal access to money creation. Circles gives everyone the right to create 1 CRC per hour, building a trust-based economy that transcends political boundaries and traditional financial gatekeepers.

**Subi's Role**: We make this monetary system accessible through Safe wallets, enabling recurring subscription flows using CRC tokens that recipients can redeem on-demand when payments become due.

### Key Features

- 🔐 **Safe-native**: Works exclusively with Safe wallets via Zodiac modules
- ⚡ **On-demand redemption**: Recipients pull payments when due (no automated transfers)
- 🌐 **Circles-powered**: Built on Circles' protocol
  - **Universal money creation**: Everyone creates 1 CRC per hour equally
  - **Trust-based economy**: Leverages real-world relationships for value transfer
  - **Demurrage system**: 7% yearly reduction keeps money flowing and active
  - **Group currencies**: Explicit fungibility for seamless integrations
- 🎯 **Fully typed**: Generated React hooks from contract ABIs using @wagmi/cli
- 🔄 **Real-time**: Live subscription status and payment tracking

## Why It's Revolutionary

1. **Democratizing Money** - First Safe integration with Circles' protocol where individuals, not banks, create currency
2. **Trust-based Economy** - Leverages real-world relationships and peer trust instead of centralized financial institutions
3. **Fair Money Creation** - Every participant gets equal access to money creation (1 CRC/hour) regardless of wealth or status
4. **Pull-based Sovereignty** - Recipients control when they get paid, aligning with Circles' philosophy of individual empowerment
5. **Beyond Borders** - Participating in money designed for a multipolar world, transcending political boundaries
6. **Type-safe Innovation** - Modern Web3 development with auto-generated hooks from Foundry contracts

## Tech Stack

- **Smart Contracts**: Solidity + Foundry + Zodiac framework
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **Monetary System**: **Circles Protocol** - Decentralized currency creation
- **Blockchain**: Gnosis Chain + Circles Hub integration
- **Tooling**: @wagmi/cli for type generation

## Quick Start

### Prerequisites
- Node.js 18.18+ or Bun
- Safe wallet on Gnosis Chain

### 1. Clone & Install
```bash
git clone <repo-url>
cd subi/ui
bun install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=100
NEXT_PUBLIC_MODULE_ADDRESS=0x01E65042f8CE628f07bba35c97883825e7B97c2f
NEXT_PUBLIC_BLOCKSCOUT_BASE_URL=https://gnosis.blockscout.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=0deda9a6c0cac87c2fd74dc0fce259c6
```

### 3. Generate Hooks & Run
```bash
bun run generate  # Generate typed hooks from contracts
bun --bun run dev # Start development server
```

Visit `http://localhost:3000`

## How to Use

1. **Connect Safe Wallet** - Use the connect button (Safe wallets only)
2. **Install Module** - Add SubscriptionModule as Zodiac module to your Safe
3. **Create Subscription** - Specify recipient, amount, and frequency
4. **Recipients Redeem** - Recipients can claim payments when due

## Demo Flow

1. Open app with Safe wallet connected
2. App detects if SubscriptionModule is installed
3. Create a test subscription (1 hour frequency for demo)
4. Recipients can redeem payments through Circles protocol flows

## Smart Contract Architecture

- **SubscriptionModule.sol** - Zodiac module for Safe wallets
- **Circles Integration** - Uses Circles Hub for efficient token transfers
- **On-demand Redemption** - Recipients call `redeemPayment()` when ready

## What's Next

- 🎨 Enhanced UI for subscription management
- 📊 Analytics dashboard for payment flows
- 🔄 Integration with more Circles token types
- 🛠️ Safe App integration for seamless UX

## Built for ETHPrague 2025

This project showcases:
- ✅ **Monetary system innovation** - Integrating Circles' revolutionary approach to decentralized currency creation
- ✅ **Safe ecosystem advancement** with proper Zodiac module integration
- ✅ **Trust-based economy** - Demonstrating peer-to-peer value transfer without traditional financial intermediaries
- ✅ **Circles protocol mastery** - Leveraging group currencies and trust networks for efficient payment flows
- ✅ **Modern Web3 development** with type-safe contract interactions
- ✅ **Gnosis Chain deployment** leveraging the local ecosystem where Circles thrives

---

**Team**: Independent hackathon submission
**Contract**: [0x01E65042f8CE628f07bba35c97883825e7B97c2f](https://gnosis.blockscout.com/address/0x01E65042f8CE628f07bba35c97883825e7B97c2f)
**Demo**: Live at hackathon event
