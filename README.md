# Subi: An Automated System For Subscriptions with Circles

[Circles](https://aboutcircles.com/) users can now securely, trustlesly & smoothly authorize recurring payments from thier accounts. This system consists of 

## Contracts

Deployed (multipurpose) Smart Contracts implementing a Custom [Zodiac Module](https://www.gnosisguild.org/) for subscriptions.

- SubscriptionModule: with primary functionality (subscribe & redeemPayment).
- SubscriptionManager (for on data availability and developer experience). 

The subscription contract offer functions...

## Automated Payment Collection

The [silverback bot](https://www.apeworx.io/silverback/) tracks new subscriptions and records the relevant details for claiming. Subscriptions can be redeemed for recipients permissionlessly, so the bot can operate with any key to invoke payment collection on behalf of all subscriptions.

Since circles payments involve a lot of token shuffling between users, the bot relies on the circles api to construct the relevant payload.

## A Sample UI
The UI detects whether the connected Safe (i.e. Circles Account) has the subscription module enabled and offers a one click/transaction deployment. Once installed, the user can subscribe to services (recipient, amount, frequency)
