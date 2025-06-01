# Subi - Automated Recurring Payments for Circles Protocol

**ETHPrague 2025 Hackathon Submission by Team deluXtreme**

🚀 **Democratizing recurring payments through Circles protocol - where every individual has the right to create currency**

## Overview

Subi enables **Circles users to securely, trustlessly & smoothly authorize recurring payments** from their accounts. By integrating with the revolutionary Circles monetary system, we're not just enabling payments - we're participating in a fundamental reimagining of money itself, where currency creation is democratized and distributed to every individual rather than concentrated in banks and central institutions.

**Short**: Circles users can now securely, trustlessly & smoothly authorize recurring payments.

**TLDR**: Subi is an automated subscription system for Circles that enables secure, seamless recurring payments directly from a user's account. It allows users to subscribe to services by specifying a recipient, amount, and frequency—while retaining full control (i.e. cancel at any time). The system ensures payments are executed reliably and without manual intervention, even with Circles' complex transfer logic.

## Architecture

Subi consists of three integrated components:

### 1. 📜 Smart Contracts (`/contracts`)
Zodiac modules for Safe wallets that handle subscription logic:
- **SubscriptionModule.sol** - Core subscription functionality with `subscribe` & `redeemPayment` functions
- **SubscriptionManager.sol** - Data availability layer and developer experience enhancement
- **Create2 deployment** - Deterministic proxy deployment for streamlined module installation

### 2. 🤖 Automated Payment Collection (`/automation`)
Silverback bot that automates subscription redemptions:
- Tracks new subscriptions and records redemption details
- Operates permissionlessly (bot key poses no risk to user funds)
- Leverages Circles API to construct complex payment flow matrices
- Anyone can deploy their own redemption bot

### 3. 🎨 User Interface (`/ui`)
Next.js application for subscription management:
- Detects Safe wallet module installation status
- One-click module deployment via batched transactions
- Intuitive subscription creation and management
- Real-time payment tracking

## Key Technologies & Notable Hacks

- **Safe Wallets** - Zodiac module integration for secure subscription management
- **Circles Protocol** - Leveraging trust-based currency creation and transfer flows
- **Silverback** - Ape Framework bot for automated payment collection
- **EIP-7702** - Batched payment collections for EOA multisend (time permitting)
- **Create2** - Deterministic module proxy deployment

### Most Notable Technical Achievements

1. **Deterministic Module Deployment** - Constructing module proxy deployment to streamline installation into a single transaction, requiring contract deployment address fed into follow-up transactions

2. **Circles Flow Matrix Parsing** - On-chain validation of recipients and transfer amounts in trust-based payment paths through complex Circles transfer logic

3. **Batched Safe Transactions** - Single-click module "installation" via multisend: `deployModuleProxy` (create2) → `enableModule` → `registerModule` → `setModuleApproval`

4. **Permissionless Redemptions** - Open system where anyone can deploy bots to perform automated redemptions without risk to user funds

## Quick Start

### Prerequisites
- Node.js 18.18+ or Bun
- Python 3.9+ (for automation)
- Safe wallet on Gnosis Chain
- Foundry (for contracts)

### 1. Clone Repository
```bash
git clone <repo-url>
cd subi
```

### 2. Smart Contracts Setup
```bash
cd contracts
forge install
forge build
forge test
```

Deploy contracts:
```bash
forge script script/Deploy.s.sol --broadcast --rpc-url gnosis
```

### 3. Automation Setup
```bash
cd automation
uv install
python bot.py
```

### 4. UI Setup
```bash
cd ui
bun install
cp .env.example .env.local
# Edit .env.local with contract addresses
bun run generate
bun --bun run dev
```

## How It Works

### For Users (Subscribers)
1. **Connect Safe Wallet** - Connect your Circles-enabled Safe wallet
2. **Install Module** - One-click installation of SubscriptionModule via batched transaction
3. **Create Subscription** - Specify recipient, amount (in CRC), and frequency
4. **Maintain Control** - Cancel anytime, payments only happen when due

### For Recipients
1. **Automatic Collection** - Silverback bot automatically redeems payments when due
2. **Manual Collection** - Recipients can manually trigger redemption through the interface
3. **Circles Integration** - Receive payments in CRC tokens through trust-based paths

### Under the Hood
1. **Subscription Creation** - SubscriptionModule stores subscription parameters
2. **Payment Calculation** - Circles API constructs flow matrix for trust-based transfers
3. **Validation** - On-chain validation of recipients and amounts via parsed flow data
4. **Execution** - Safe executes Circles `operateFlowMatrix` through module proxy

## Circles Integration Deep Dive

**Why Circles?**
- **Universal Money Creation**: Everyone creates 1 CRC per hour equally
- **Trust-based Economy**: Leverages real-world relationships for value transfer  
- **Demurrage System**: 7% yearly reduction keeps money flowing and active
- **Group Currencies**: Explicit fungibility for seamless integrations

**Technical Implementation**:
Each redemption requires computing a valid trust-based payment path through the Circles network, then encoding it into:
- **Trusted avatars** (vertices)
- **Directional flows** (edges) 
- **Recipient validation logic** (streams)
- **Compact sender/receiver encoding** (packed coordinates)

## Smart Contract Architecture

### SubscriptionModule (Zodiac Module)
- Manages individual subscriptions for each Safe wallet
- Validates payment flows against subscription parameters
- Executes Circles transfers through Safe's `execTransactionFromModule`

### SubscriptionManager (Registry)
- Central registry for all subscription modules
- Event emission for indexing and UI updates
- Developer experience layer for easier integration

### Security Model
- **Permissioned Creation**: Only Safe owner can create subscriptions
- **Permissionless Redemption**: Anyone can trigger due payments (bot-friendly)
- **On-chain Validation**: Recipients and amounts verified against subscription terms
- **Cancellation Control**: Subscribers retain full control to cancel anytime

## Deployed Contracts

**Gnosis Chain**:
- SubscriptionModule: `0x01E65042f8CE628f07bba35c97883825e7B97c2f`
- SubscriptionManager: `0x7E9BaF7CC7cD83bACeFB9B2D5c5124C0F9c30834`
- Circles Hub: `0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8`

## Future Enhancements

- 🎨 Enhanced UI for subscription analytics and management
- 📊 Payment flow visualization and trust network insights
- 🔄 Integration with additional Circles token types and group currencies
- 🛠️ Native Safe App integration for seamless UX
- ⚡ EIP-7702 batch redemptions for improved efficiency
- 🌐 Cross-chain subscription bridging

## Development

### Testing
```bash
# Contracts
cd contracts && forge test

# UI
cd ui && bun test

# Automation
cd automation && python -m pytest
```

### Code Generation
```bash
cd ui && bun run generate  # Generate typed hooks from contract ABIs
```

## Built for ETHPrague 2025

This project showcases:
- ✅ **Monetary Innovation** - First Safe integration with Circles' revolutionary currency creation
- ✅ **Trust-based Economy** - Peer-to-peer value transfer without traditional financial intermediaries  
- ✅ **Safe Ecosystem Advancement** - Proper Zodiac module integration with advanced proxy patterns
- ✅ **Automation Excellence** - Permissionless bot architecture for reliable payment execution
- ✅ **Modern Web3 Development** - Type-safe contract interactions with auto-generated hooks
- ✅ **Gnosis Chain Mastery** - Leveraging the local ecosystem where Circles thrives

## Team deluXtreme

**Independent hackathon submission** pushing the boundaries of decentralized recurring payments through innovative integration of Safe wallets, Circles protocol, and automated redemption systems.

---

**Live Demo**: Available at ETHPrague 2025  
**Contracts**: [Blockscout Explorer](https://gnosis.blockscout.com/address/0x01E65042f8CE628f07bba35c97883825e7B97c2f)  
**License**: MIT