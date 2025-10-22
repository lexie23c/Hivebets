# HiveBets

**Decentralized prediction markets for Four.meme tokens on BNB Chain.**

[![BSC Mainnet](https://img.shields.io/badge/Network-BSC%20Mainnet-yellow)](https://bscscan.com/)
[![Twitter](https://img.shields.io/badge/Twitter-@Hivebetsbnb-1DA1F2)](https://x.com/Hivebetsbnb)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](https://soliditylang.org/)

---

## 🎯 What is HiveBets?

HiveBets is a **trustless prediction market platform** where users can bet on:
- 📊 **Four.meme Token Market Caps** - Will a token hit $100M?
- 💰 **BNB Price Targets** - Will BNB reach $1000?
- 🐦 **CZ Tweet Activity** - Will CZ tweet about BNB this week?

### How It Works
1. **Bet** on YES or NO outcomes
2. **Winners split the losing pool** (parimutuel system)
3. **Markets auto-resolve** using our advanced oracle system
4. **Claim winnings** immediately after resolution

---

## 🚀 Key Features

### ✅ Fully Decentralized
- Smart contracts on BSC Mainnet
- Non-custodial (you control your funds)
- Automatic oracle resolution with multi-source data feeds

### ✅ Fair & Transparent
- All bets recorded on-chain
- 2% platform fee on winnings only
- Max 0.1 BNB per wallet prevents whale manipulation

### ✅ Advanced Oracle System
- **BNB Price**: BSCScan → CoinGecko → DexScreener
- **Four.meme Tokens**: Four.meme API → DexScreener
- **Multi-source fallback** for 99.9% uptime

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/lexie23c/Hivebets.git
cd Hivebets

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your private key and API keys
```

---

## 🔧 Oracle System

Our oracle fetches real-time data from multiple sources:

### BNB Price Feed
1. **BSCScan API** (primary) - On-chain price oracle
2. **CoinGecko** (fallback) - Aggregated market data
3. **DexScreener** (backup) - DEX price feed

### Four.meme Token Data
1. **Four.meme API** (primary) - Direct from source
2. **DexScreener** (fallback) - DEX market data

### Start Oracle Feed

```bash
# One-time update
npx hardhat run scripts/oracleDataFeed.js --network bsctest

# Continuous monitoring (recommended)
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous
```

**Configuration**: Update `scripts/oracleDataFeed.js` with your BSCScan API key

---

## 📝 Smart Contracts

### Core Contracts
- **BinaryMarketV2_Fixed.sol** - Individual prediction market with oracle integration
- **MarketFactoryV2.sol** - Factory for creating new markets
- **TellorPlayground.sol** - Oracle contract for testnet

### Deploy Factory

```bash
# Deploy to testnet
npx hardhat run scripts/deployFactoryV2.js --network bsctest

# Deploy to mainnet
npx hardhat run scripts/deployFactoryV2.js --network bsc
```

---

## 🎲 Create Markets

### Four.meme Token Market
```bash
npx hardhat run scripts/createMarket_MultiFourmeme.js --network bsctest
```

### BNB Price Market
```bash
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest
```

### CZ Tweet Market
```bash
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 1
```

---

## 💸 Place Bets

```bash
# Bet YES with 0.1 BNB
npx hardhat run scripts/placeBet.js --network bsctest <market-address> yes 0.1

# Bet NO with 0.05 BNB
npx hardhat run scripts/placeBet.js --network bsctest <market-address> no 0.05
```

---

## 🔍 Monitor Markets

```bash
# Check market status and oracle data
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>

# View all factory markets
npx hardhat run scripts/checkFactory.js --network bsctest
```

---

## ✅ Resolve Markets

### Automatic Resolution (Oracle)
```bash
npx hardhat run scripts/resolveFromTellor.js --network bsctest <market-address>
```

**Requirements:**
- Deadline passed
- Buffer period elapsed (1 hour)
- Oracle data available and fresh (< 24 hours old)

### Manual Resolution (Fallback)
```bash
npx hardhat run scripts/resolveMarketV2.js --network bsctest <market-address> yes
```

---

## 🏆 Claim Winnings

```bash
npx hardhat run scripts/claimFromOracleMarket.js --network bsctest <market-address>
```

---

## 📚 Documentation

- 📖 [Quick Start Guide](QUICK_START.md)
- 📖 [Oracle Integration Guide](docs/ORACLE_INTEGRATION.md)
- 📖 [Oracle System Overview](README_ORACLE.md)
- 📖 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- 📖 [Changelog](CHANGES.md)

---

## 🏗️ Project Structure

```
Hivebets/
├── contracts/              # Solidity smart contracts
│   ├── BinaryMarketV2_Fixed.sol
│   ├── MarketFactoryV2.sol
│   └── TellorPlayground.sol
├── scripts/               # Deployment and interaction scripts
│   ├── oracleDataFeed.js  # Multi-source oracle feed
│   ├── deployFactoryV2.js
│   ├── createMarket_*.js
│   └── ...
├── docs/                  # Complete documentation
├── test/                  # Test files
└── hardhat.config.js      # Hardhat configuration
```

---

## 🔐 Security Features

- ✅ **ReentrancyGuard** - Prevents reentrancy attacks
- ✅ **Max bet limits** - Prevents whale manipulation
- ✅ **Deadline enforcement** - No bets after deadline
- ✅ **Cancel protection** - Markets can only be cancelled before deadline
- ✅ **Multi-source oracle** - Fallback data sources for reliability

---

## 🌐 Networks

### BSC Testnet
- **Factory**: TBD (deploy using `deployFactoryV2.js`)
- **RPC**: https://data-seed-prebsc-1-s1.binance.org:8545/

### BSC Mainnet
- **Factory**: TBD
- **RPC**: https://bsc-dataseed.binance.org/

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# BSCScan API Key
BSCSCAN_API_KEY=P8NG9PCX4FCGIXBAJEEHFK5AP3ASSBSM5P

# Twitter API (optional, for CZ tweet markets)
TWITTER_BEARER_TOKEN=your_token_here
CZ_USER_ID=902926941413453824

# Network RPCs
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSCTEST_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
```

---

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/Lock.js

# Test on fork
npx hardhat test --network hardhat
```

---

## 📊 Example Workflow

```bash
# 1. Start oracle feed (keep running in terminal 1)
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous

# 2. Create a market (terminal 2)
npx hardhat run scripts/createMarket_4Token.js --network bsctest

# 3. Monitor the market
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>

# 4. Place bets
npx hardhat run scripts/placeBet.js --network bsctest <market-address> yes 0.05

# 5. After deadline, resolve
npx hardhat run scripts/resolveFromTellor.js --network bsctest <market-address>

# 6. Claim winnings
npx hardhat run scripts/claimFromOracleMarket.js --network bsctest <market-address>
```

---

## 🐛 Troubleshooting

### Oracle Feed Issues

**Problem**: "Failed to fetch token data"
```bash
# Check if DexScreener API is accessible
curl https://api.dexscreener.com/latest/dex/tokens/0x0A43fC31a73013089DF59194872Ecae4cAe14444
```

**Problem**: "Oracle data too old"
- Restart the oracle feed
- Verify oracle feed is running with `--continuous` flag
- Check network connectivity

### Resolution Issues

**Problem**: "Cannot resolve from oracle"
- Ensure deadline has passed
- Wait for 1-hour buffer period
- Check if oracle data is available using `previewMarketV2.js`

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

**Prediction markets involve risk. You can lose your entire bet.**

- Only bet what you can afford to lose
- Not financial advice
- Users must comply with local laws and regulations
- Smart contracts carry inherent risks
- Always verify contract addresses on BSCScan

---

## 🔗 Links

- **GitHub**: https://github.com/lexie23c/Hivebets
- **Twitter**: https://x.com/Hivebetsbnb
- **BSCScan**: https://bscscan.com/
- **Hardhat Docs**: https://hardhat.org/

---

**Built for the trenches. 🔥**
