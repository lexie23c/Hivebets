# HiveBets

**Trustless, decentralized prediction markets on BNB Chain**

*Where the hive predicts together*

[![BSC Mainnet](https://img.shields.io/badge/Network-BSC%20Mainnet-yellow)](https://bscscan.com/)
[![Twitter](https://img.shields.io/badge/Twitter-@Hivebetsbnb-1DA1F2)](https://x.com/Hivebetsbnb)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)

---

## What is HiveBets?

HiveBets is a fully decentralized prediction market platform built on BNB Chain. We let you bet on real-world outcomes — from crypto token prices to social events — with complete transparency and trustless execution.

Traditional betting platforms are centralized, opaque, and take your funds off-chain. HiveBets changes this. Every bet is recorded on the blockchain. Every outcome is resolved by our advanced oracle system pulling data from multiple verified sources. Your funds stay in your wallet until you place a bet, and winners are paid automatically through smart contracts.

Whether you're predicting the next Four.meme token to moon, BNB hitting a price target, or even CZ's tweet activity, HiveBets provides a fair, transparent, and community-driven platform where the hive always wins together.

---

## ✨ Key Features

- **🔓 Fully Trustless** — No intermediaries. Smart contracts handle everything from bets to payouts.
- **⛓️ Immutable Settlement** — All outcomes recorded permanently on BNB Chain.
- **💰 Native BNB Integration** — Bet directly with BNB. No token wrapping or conversions.
- **📊 Multi-Source Oracle** — Real-time data from BSCScan, Four.meme API, CoinGecko, and DexScreener.
- **🎯 Diverse Market Types** — Token market caps, price targets, and social signal predictions.
- **🏆 Parimutuel Betting** — Winners split the losing pool fairly. No house edge.
- **🛡️ Anti-Manipulation** — Max 0.1 BNB per wallet per side prevents whale dominance.
- **💸 Cashback System** — Earn cashback on every bet, win or lose.
- **🤝 Referral Rewards** — Invite friends and earn from their betting volume.
- **📱 Simple UX** — Connect wallet, place bet, claim winnings. That's it.

---

## 🚀 How to Get Started

Getting started with HiveBets takes less than 2 minutes:

1. **Connect Your Wallet** — Use MetaMask, Rabby, or any WalletConnect-compatible wallet on BNB Chain.
2. **Browse Markets** — Check out active prediction markets across tokens, prices, and events.
3. **Place Your Bet** — Choose YES or NO, enter your BNB amount (up to 0.1 BNB per side).
4. **Get Your Cashback** — Earn instant cashback on every bet.
5. **Wait for Outcome** — Markets auto-resolve after the deadline using our oracle system.
6. **Claim Rewards** — If you predicted correctly, claim your winnings + cashback instantly.

*No KYC. No registration. No hassle.*

**🎁 Pro Tip:** Use a referral link to earn extra rewards when your friends bet!

---

## 🎲 Example Use Cases

HiveBets supports a wide range of prediction markets:

### 🪙 Token Market Caps
**"Will $4 token hit $444M market cap by October 30?"**  
Bet on whether hot Four.meme tokens reach specific valuation milestones.

### 💵 Price Targets
**"Will BNB reach $1,000 by year-end?"**  
Predict if major crypto assets will hit key price levels.

### 🐦 Social Signals
**"Will CZ tweet about BNB within 24 hours?"**  
Make predictions based on social activity and sentiment.

### 📈 Custom Events
**"Will X token launch before deadline?"**  
Community-created markets for any verifiable outcome.

---

## 🏅 Why Choose HiveBets?

### vs. Centralized Betting Platforms

| Feature | HiveBets | Traditional Platforms |
|---------|----------|----------------------|
| **Custody** | Non-custodial (you control funds) | Custodial (platform holds your money) |
| **Transparency** | 100% on-chain, verifiable | Opaque backend systems |
| **Fees** | 2% on winnings + cashback rewards | 5-20% house edge + withdrawal fees |
| **Rewards** | Cashback on every bet + referral bonuses | None |
| **Settlement** | Instant, automatic | Delayed, manual approval |
| **Trust** | Smart contracts | Platform reputation |
| **Max Bet** | 0.1 BNB per side (fair access) | Unlimited (favors whales) |

### Why We're Different

- **No Central Authority** — HiveBets is governed by code, not humans. Once a market is created, no one can manipulate the outcome.
- **Multi-Source Oracle** — We don't rely on a single data feed. Our oracle aggregates from BSCScan, Four.meme API, CoinGecko, and DexScreener for maximum reliability.
- **Community-First** — Built for the crypto community, by the crypto community. No corporate interests.
- **Fair Odds** — Parimutuel system means odds reflect true market sentiment, not rigged house odds.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Blockchain** | BNB Chain (BSC Mainnet) |
| **Smart Contracts** | Solidity 0.8.24 |
| **Oracle System** | Custom multi-source aggregator |
| **Data Sources** | BSCScan, Four.meme API, CoinGecko, DexScreener |
| **Development** | Hardhat, Ethers.js |
| **Security** | OpenZeppelin contracts, ReentrancyGuard |

---

## 📦 For Developers

### Smart Contracts

HiveBets consists of three core contracts:

- **BinaryMarketV2_Fixed.sol** — Individual prediction market with oracle integration
- **MarketFactoryV2.sol** — Factory for creating new markets
- **HivebetsOracle.sol** — Proprietary oracle system for data feeds

### Installation

```bash
# Clone the repository
git clone https://github.com/lexie23c/Hivebets.git
cd Hivebets

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your private key and API keys
```

### Deploy Your Own Market

```bash
# Start the oracle feed
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous

# Create a market
npx hardhat run scripts/createMarket_MultiFourmeme.js --network bsctest

# Place a bet
npx hardhat run scripts/placeBet.js --network bsctest <market-address> yes 0.05
```

**Full documentation:** [Developer Guide](docs/ORACLE_INTEGRATION.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         External Data Sources                    │
│   BSCScan | Four.meme | CoinGecko | DexScreener │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│          Oracle Data Feed                        │
│   Aggregates, validates, and formats data       │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│       HivebetsOracle (On-Chain)                 │
│   Stores timestamped data for smart contracts   │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│    BinaryMarket Contracts (On-Chain)            │
│   Manage bets, resolve outcomes, pay winners    │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Security

- ✅ **Audited Contracts** — Built on battle-tested OpenZeppelin standards
- ✅ **ReentrancyGuard** — Protected against reentrancy attacks
- ✅ **Max Bet Limits** — Prevents whale manipulation (0.1 BNB per wallet per side)
- ✅ **Deadline Enforcement** — No bets accepted after market closes
- ✅ **Multi-Source Oracle** — Redundant data feeds eliminate single points of failure

---

## 📖 Documentation

- 📘 [Quick Start Guide](QUICK_START.md)
- 💸 [Cashback & Referral Rewards](REWARDS.md)
- 📘 [Oracle Integration Guide](docs/ORACLE_INTEGRATION.md)
- 📘 [Smart Contract Documentation](docs/README.md)
- 📘 [FAQ](docs/getting-started/faq.md)

---

## 🌐 Networks

### BSC Testnet
- **Chain ID:** 97
- **RPC:** https://data-seed-prebsc-1-s1.binance.org:8545/
- **Factory:** TBD (deploy using `deployFactoryV2.js`)

### BSC Mainnet
- **Chain ID:** 56
- **RPC:** https://bsc-dataseed.binance.org/
- **Factory:** TBD

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

**Prediction markets involve risk. You can lose your entire bet.**

- Only bet what you can afford to lose
- This is not financial advice
- Users must comply with their local laws and regulations
- Smart contracts carry inherent risks despite audits
- Always verify contract addresses on BSCScan before interacting

---

## 🐝 Join the Hive

Ready to make your predictions count?

- **🌐 Website:** Coming soon — hivebets.io
- **🐦 Twitter:** [@Hivebetsbnb](https://x.com/Hivebetsbnb)
- **💬 Discord:** Join our community (link coming soon)
- **📱 Telegram:** Connect with fellow predictors (link coming soon)
- **🔗 GitHub:** [lexie23c/Hivebets](https://github.com/lexie23c/Hivebets)

**Built for the trenches. Powered by the hive. 🔥**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*HiveBets — Where collective wisdom meets blockchain immutability.*
