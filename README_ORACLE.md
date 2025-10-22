# Enhanced Oracle System for Prediction Markets

## 🚀 Features

This enhanced oracle system enables prediction markets for:

### 1. 🌟 Four.meme Tokens
Track multiple Four.meme tokens with real-time market cap data:
- **$4 Token** and any other Four.meme launches
- Market cap tracking from DexScreener
- Automatic oracle updates every 60 seconds
- Support for unlimited tokens

### 2. 💰 BNB Price Feed
Real-time BNB/USD price tracking:
- Primary source: CoinGecko API
- Fallback: DexScreener (PancakeSwap)
- Market cap, volume, and 24h change data
- Create markets like "Will BNB hit $1000?"

### 3. 🐦 CZ Binance Tweet Monitoring
Create prediction markets based on CZ's Twitter activity:
- **Keyword Mentions**: "Will CZ tweet about BNB?"
- **Tweet Count**: "Will CZ tweet 3+ times this week?"
- **Next Tweet**: "Will CZ's next tweet mention 'building'?"
- **Trending Topics**: "Will CZ tweet about memecoins?"

## 📦 Installation

```bash
# Install dependencies
npm install axios

# Or if axios isn't installed yet
npm install
```

## 🎯 Quick Start

### Step 1: Start Oracle Data Feed

Run the oracle feed to continuously update price/market cap data:

```bash
# Testnet - Continuous monitoring
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous

# Mainnet - Continuous monitoring  
npx hardhat run scripts/oracleDataFeed.js --network bsc --continuous

# One-time update (for testing)
npx hardhat run scripts/oracleDataFeed.js --network bsctest
```

The oracle feed will:
- ✅ Fetch market cap for all configured Four.meme tokens
- ✅ Update BNB price every minute
- ✅ Display comprehensive price data
- ✅ Submit data to Tellor oracle

### Step 2: Create Markets

#### Four.meme Token Markets

Create markets for multiple tokens at once:

```bash
npx hardhat run scripts/createMarket_MultiFourmeme.js --network bsctest
```

Or use the single token script:
```bash
npx hardhat run scripts/createMarket_4Token.js --network bsctest
```

**Example Market:**
- Question: "Will $4 hit $444M market cap before October 30?"
- Tracks: $4 token market cap
- Auto-resolves: Yes if mcap >= $444M, No otherwise

#### BNB Price Markets

Create BNB price prediction markets:

```bash
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest
```

**Example Market:**
- Question: "Will BNB hit $1000 before [deadline]?"
- Tracks: BNB/USD price
- Auto-resolves: Yes if BNB >= $1000, No otherwise

#### CZ Tweet Markets

Create tweet-based prediction markets:

```bash
# Template 1: Keyword mention
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 1

# Template 2: Tweet count
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 2

# Template 3: Next tweet keyword
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 3

# Template 4: Memecoin mention
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 4
```

**Available Templates:**
1. Will CZ tweet about BNB within 24 hours?
2. Will CZ tweet more than 3 times in 7 days?
3. Will CZ's next tweet mention 'building'?
4. Will CZ tweet about memecoins within 48 hours?

### Step 3: Monitor Markets

Check market status and oracle data:

```bash
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>
```

This shows:
- Current betting pools
- Live odds
- Current oracle data (market cap/price)
- Oracle data timestamp
- Whether market can auto-resolve
- Preview of resolution outcome

### Step 4: Place Bets

```bash
# Bet YES with 0.1 BNB
npx hardhat run scripts/placeBet.js --network bsctest <market-address> yes 0.1

# Bet NO with 0.05 BNB
npx hardhat run scripts/placeBet.js --network bsctest <market-address> no 0.05
```

### Step 5: Resolve Markets

After deadline, markets auto-resolve using oracle data:

```bash
npx hardhat run scripts/resolveFromTellor.js --network bsctest <market-address>
```

Requirements:
- ✅ Deadline has passed
- ✅ Buffer period elapsed (1 hour)
- ✅ Oracle data available and fresh

## ⚙️ Configuration

### Adding More Four.meme Tokens

Edit `scripts/oracleDataFeed.js` and `scripts/createMarket_MultiFourmeme.js`:

```javascript
const FOURMEME_TOKENS = [
  {
    name: "$4",
    address: "0x0A43fC31a73013089DF59194872Ecae4cAe14444",
    targetMcap: "444000000",
    description: "Will $4 hit $444M mcap?"
  },
  {
    name: "YOURNEWTOKEN",
    address: "0xYourTokenAddress",
    targetMcap: "100000000", // $100M target
    description: "Will YOURNEWTOKEN hit $100M mcap?"
  }
];
```

### Customizing Update Intervals

Edit `scripts/oracleDataFeed.js`:

```javascript
const CONFIG = {
  updateInterval: 60000, // 60 seconds (1 minute)
  // Change to 30000 for 30 seconds
  // Change to 120000 for 2 minutes
};
```

### Customizing Market Parameters

When creating markets, adjust:

```javascript
const maxPerWallet = ethers.parseEther("0.1"); // Max bet size
const feeBps = 200; // 2% fee (200 basis points)
const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
```

## 🐦 Twitter Integration (CZ Markets)

### Prerequisites

To fully enable CZ tweet monitoring, you need:

1. **Twitter Developer Account**
   - Apply at https://developer.twitter.com
   - Request elevated access
   - Explain use case: "Oracle data for prediction markets"

2. **Create Twitter App**
   - Enable OAuth 2.0
   - Generate Bearer Token
   - Store in environment variables

3. **Set Environment Variables**

Create `.env` file:
```bash
TWITTER_BEARER_TOKEN=your_bearer_token_here
CZ_USER_ID=902926941413453824
```

4. **Implement Tweet Monitor**

The system provides templates, but you need to implement:
- Real-time tweet fetching via Twitter API v2
- Keyword matching logic
- Tweet counting logic
- Oracle data submission based on outcomes

See `docs/ORACLE_INTEGRATION.md` for detailed implementation guide.

## 📊 Data Sources

### Four.meme Tokens
- **API**: DexScreener
- **Endpoint**: `https://api.dexscreener.com/latest/dex/tokens/{address}`
- **Data**: Market cap, price, volume, liquidity
- **Rate Limit**: Unlimited (be respectful)

### BNB Price
- **Primary API**: CoinGecko
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Fallback**: DexScreener (PancakeSwap BNB/USDT pair)
- **Rate Limit**: 10-50 calls/minute (free tier)

### CZ Tweets
- **API**: Twitter API v2
- **Endpoint**: `https://api.twitter.com/2/users/{id}/tweets`
- **Requires**: Elevated access, Bearer token
- **Rate Limit**: Varies by access tier

## 🔧 Architecture

```
┌─────────────────────────────────────────────────┐
│           External Data Sources                  │
│  DexScreener │ CoinGecko │ Twitter API          │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│        Oracle Data Feed (oracleDataFeed.js)     │
│  - Fetches market caps, prices, tweets          │
│  - Validates data                                │
│  - Formats for oracle                            │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│          Tellor Oracle (On-chain)                │
│  - Stores queryId → value mappings              │
│  - Timestamped data                              │
│  - Accessible by smart contracts                │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│    Binary Market Contracts (On-chain)           │
│  - Reads oracle data via queryId                │
│  - Auto-resolves after deadline                 │
│  - Distributes winnings                          │
└─────────────────────────────────────────────────┘
```

## 📝 Example Workflow

### Creating a $4 Token Market

```bash
# 1. Start oracle feed (keep running)
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous

# 2. Create market (in another terminal)
npx hardhat run scripts/createMarket_4Token.js --network bsctest

# Output: Market created at 0xABC...
```

### Creating a BNB Price Market

```bash
# 1. Oracle feed already running from above

# 2. Create BNB market
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest

# Output: Market created at 0xDEF...
```

### Creating a CZ Tweet Market

```bash
# 1. Create tweet market (template 1)
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 1

# 2. Implement Twitter monitoring (manual step)
#    See docs/ORACLE_INTEGRATION.md

# 3. Submit tweet data to oracle when criteria met
#    (Custom implementation required)
```

## 🔍 Monitoring & Debugging

### Check Oracle Data

```bash
# Preview market with oracle data
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>
```

Output includes:
```
🔮 Oracle Resolution:
Can resolve from oracle: true
Current Oracle Market Cap: 450,000,000 USD
Oracle data timestamp: 2025-10-21T12:34:56.000Z
Preview Resolution: YES (450M >= 444M target)
```

### Debug Market State

```bash
npx hardhat run scripts/debugState.js --network bsctest <market-address>
```

### Check Wallet Balance

```bash
npx hardhat run scripts/checkBalance.js --network bsctest
```

## 🚨 Troubleshooting

### Oracle Feed Issues

**Problem**: "Failed to fetch token data"
```bash
# Check DexScreener API
curl https://api.dexscreener.com/latest/dex/tokens/0x0A43fC31a73013089DF59194872Ecae4cAe14444

# If down, wait and retry
```

**Problem**: "Oracle data too old"
```bash
# Restart oracle feed
# Check that --continuous flag is used
# Verify network connectivity
```

**Problem**: "Cannot resolve from oracle"
```bash
# Check if deadline passed
# Verify buffer period (1 hour after deadline)
# Check oracle data timestamp
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>
```

### Twitter Integration Issues

**Problem**: "Twitter API authentication failed"
```bash
# Verify bearer token in .env
echo $TWITTER_BEARER_TOKEN

# Test Twitter API directly
curl -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  "https://api.twitter.com/2/users/902926941413453824"
```

**Problem**: "Rate limit exceeded"
```bash
# Increase update interval
# Use exponential backoff
# Consider upgrading Twitter API tier
```

## 📚 Additional Resources

- **Full Documentation**: `/docs/ORACLE_INTEGRATION.md`
- **Smart Contract Docs**: `/contracts/`
- **Tellor Documentation**: https://docs.tellor.io
- **DexScreener API**: https://docs.dexscreener.com
- **Twitter API v2**: https://developer.twitter.com/en/docs/twitter-api

## 🎯 Production Checklist

Before deploying to mainnet:

- [ ] Test all markets on testnet
- [ ] Verify oracle data accuracy
- [ ] Set up monitoring/alerts
- [ ] Implement retry logic
- [ ] Use PM2 for process management
- [ ] Set up logging
- [ ] Secure private keys
- [ ] Set up Twitter API (if using CZ markets)
- [ ] Test emergency shutdown procedures
- [ ] Document all API keys securely

## 🔐 Security Notes

1. **Never commit private keys** - Use environment variables
2. **Validate oracle data** - Implement sanity checks
3. **Monitor gas prices** - Set appropriate limits
4. **Rate limiting** - Respect API limits
5. **Error handling** - Log and alert on failures
6. **Access control** - Limit resolver permissions

## 📞 Support

For questions or issues:
- Check documentation: `/docs/`
- Review troubleshooting section above
- Check existing GitHub issues
- Open new issue with detailed logs

## 📄 License

MIT License - See LICENSE file for details

---

**Ready to create prediction markets for Four.meme, BNB, and CZ tweets! 🚀**

