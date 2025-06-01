# 🤖 Subscription Automation Bot

This containerized Silverback bot monitors Circles subscriptions and automates payment redemptions.

## 🛠 What it Does

Runs on Railway: Continuously syncs on Gnosis Chain

Watches Events: Tracks new SubscriptionCreated and Redeemed events

Populates Postgres: Stores subscription data and redemption state

Builds Transactions: Uses Circles pathfinder API to construct trust-based payment flows

Triggers Payments: Calls `redeemPayment()` with ABI-encoded flow matrix

Fully Permissionless: Anyone can run this bot—no user keys required

## 🔍 Example Transaction

Redemption transaction on [Gnosis Scan](https://gnosisscan.io/tx/0xa5fc315082a861219db213aa3729254191eed332891f484330163bf330f9ba35).

🐳 Docker
Pull it [here](https://github.com/users/lumoswiz/packages/container/package/subscription-automation).
