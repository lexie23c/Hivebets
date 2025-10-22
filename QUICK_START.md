# Quick Start Guide - Enhanced Oracle System

## 🎯 What's New?

Your oracle system now supports:

1. **Multiple Four.meme Tokens** - Track any number of Four.meme tokens
2. **Real-time BNB Price** - Create BNB price prediction markets  
3. **CZ Binance Tweets** - Markets based on CZ's Twitter activity

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install axios
```

### Step 2: Start Oracle Data Feed

This keeps your markets updated with real-time data:

```bash
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous
```

Leave this running in the background. It updates every 60 seconds with:
- Four.meme token market caps
- BNB/USD price
- Status checks

### Step 3: Create Your First Market

**Option A: Four.meme Token Market**
```bash
npx hardhat run scripts/createMarket_4Token.js --network bsctest
```

**Option B: BNB Price Market**
```bash
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest
```

**Option C: CZ Tweet Market**
```bash
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 1
```

## 📊 Monitor Your Markets

```bash
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>
```

## 🎮 Full Workflow Example

```bash
# Terminal 1: Start oracle feed
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous

# Terminal 2: Create a market
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest
# Output: Market created at 0xABC123...

# Terminal 3: Place a bet
npx hardhat run scripts/placeBet.js --network bsctest 0xABC123... yes 0.1

# Check market status anytime
npx hardhat run scripts/previewMarketV2.js --network bsctest 0xABC123...

# After deadline: Auto-resolve
npx hardhat run scripts/resolveFromTellor.js --network bsctest 0xABC123...

# Claim winnings
npx hardhat run scripts/claimFromOracleMarket.js --network bsctest 0xABC123...
```

## 🐦 Enable Twitter Monitoring (Optional)

For CZ tweet markets, you need Twitter API access:

1. **Get Twitter API Access**
   - Go to https://developer.twitter.com
   - Apply for elevated access
   - Create an app and get Bearer Token

2. **Add to Environment**
   ```bash
   export TWITTER_BEARER_TOKEN="your_token_here"
   ```

3. **Start Tweet Monitor**
   ```bash
   npx hardhat run scripts/monitorCZTweets.js --network bsctest --continuous
   ```

## ⚙️ Configuration

### Add More Four.meme Tokens

Edit `config/tokens.json`:
```json
{
  "fourmemeTokens": [
    {
      "name": "YOUR_TOKEN",
      "address": "0xYOUR_ADDRESS",
      "targetMcap": "100000000",
      "enabled": true
    }
  ]
}
```

Then update `scripts/oracleDataFeed.js` and `scripts/createMarket_MultiFourmeme.js` to read from this config.

### Customize Update Frequency

In `scripts/oracleDataFeed.js`:
```javascript
updateInterval: 60000, // 60 seconds (1 minute)
```

## 📚 Available Scripts

### Oracle Management
- `oracleDataFeed.js` - Real-time price/mcap updates
- `monitorCZTweets.js` - Twitter monitoring (requires API)

### Market Creation
- `createMarket_4Token.js` - Single $4 token market
- `createMarket_MultiFourmeme.js` - Multiple token markets
- `createMarket_BNBPrice.js` - BNB price market
- `createMarket_CZTweet.js` - Tweet-based market

### Market Management
- `previewMarketV2.js` - Check market status
- `placeBet.js` - Place a bet
- `resolveFromTellor.js` - Auto-resolve with oracle
- `resolveMarketV2.js` - Manual resolution
- `claimFromOracleMarket.js` - Claim winnings

### Utilities
- `checkBalance.js` - Check wallet balance
- `checkPools.js` - Check betting pools
- `debugState.js` - Debug market state

## 🎯 Market Examples

### 1. Four.meme Token Market
```
Question: "Will $4 hit $444M market cap before Oct 30?"
Data: Market cap from DexScreener
Resolution: Automatic via oracle
```

### 2. BNB Price Market
```
Question: "Will BNB hit $1000 before 90 days?"
Data: BNB/USD price from CoinGecko
Resolution: Automatic via oracle
```

### 3. CZ Tweet Market
```
Question: "Will CZ tweet about BNB within 24 hours?"
Data: Twitter API monitoring
Resolution: Manual/semi-automatic
```

## 🔧 Troubleshooting

**Oracle not updating?**
```bash
# Restart the feed
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous
```

**Can't resolve market?**
```bash
# Check if data is available
npx hardhat run scripts/previewMarketV2.js --network bsctest <market>

# Verify deadline passed and buffer period elapsed (1 hour)
```

**Twitter not working?**
```bash
# Run in simulation mode first (no Twitter API needed)
npx hardhat run scripts/monitorCZTweets.js --network bsctest
```

## 📖 Full Documentation

- **Complete Guide**: `docs/ORACLE_INTEGRATION.md`
- **Oracle README**: `README_ORACLE.md`
- **Contract Docs**: `contracts/`

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review `docs/ORACLE_INTEGRATION.md`
3. Check existing scripts for examples
4. Review console logs for specific errors

## 🎉 You're Ready!

Start with a simple Four.meme or BNB market, then experiment with more complex setups. The oracle handles everything automatically once configured.

**Happy building! 🚀**

