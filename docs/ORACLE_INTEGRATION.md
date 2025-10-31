# Oracle Integration Guide

## Overview

This system provides comprehensive oracle integration for:
1. **Four.meme Tokens** - Track multiple memecoin market caps in real-time
2. **BNB Price** - Real-time BNB/USD price feed
3. **CZ Binance Tweets** - Monitor and create prediction markets based on @cz_binance activity

## Architecture

### Data Flow
```
External APIs → Oracle Data Feed → Hivebets Oracle → Smart Contracts → Markets
```

### Components

1. **Oracle Data Feed** (`scripts/oracleDataFeed.js`)
   - Fetches data from external sources (DexScreener, CoinGecko)
   - Submits data to Hivebets oracle
   - Runs continuously or one-time

2. **Market Creation Scripts**
   - `createMarket_MultiFourmeme.js` - Create markets for multiple Four.meme tokens
   - `createMarket_BNBPrice.js` - Create BNB price prediction markets
   - `createMarket_CZTweet.js` - Create tweet-based prediction markets

3. **Smart Contracts**
   - `BinaryMarketV2_Fixed.sol` - Market with oracle integration
   - `MarketFactoryV2.sol` - Factory for creating markets
   - `Hivebets OraclePlayground.sol` - Oracle for testing

## Quick Start

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Run Oracle Data Feed

**One-time update:**
```bash
npx hardhat run scripts/oracleDataFeed.js --network bsctest
```

**Continuous monitoring (recommended for production):**
```bash
npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous
```

### 3. Create Markets

**Four.meme Token Markets:**
```bash
npx hardhat run scripts/createMarket_MultiFourmeme.js --network bsctest
```

**BNB Price Market:**
```bash
npx hardhat run scripts/createMarket_BNBPrice.js --network bsctest
```

**CZ Tweet Market:**
```bash
# Select market template 1-4
npx hardhat run scripts/createMarket_CZTweet.js --network bsctest 1
```

## Configuration

### Adding Four.meme Tokens

Edit `scripts/oracleDataFeed.js` and `scripts/createMarket_MultiFourmeme.js`:

```javascript
const FOURMEME_TOKENS = [
  {
    name: "$4",
    address: "0x...", // Token contract address
    targetMcap: "444000000", // $444M
    description: "Will $4 hit $444M mcap?"
  },
  {
    name: "YOUR_TOKEN",
    address: "0xYOUR_TOKEN_ADDRESS",
    targetMcap: "100000000", // $100M
    description: "Will YOUR_TOKEN hit $100M mcap?"
  }
];
```

### Customizing BNB Price Targets

Edit `scripts/createMarket_BNBPrice.js`:

```javascript
const targetPrice = "1000"; // $1000 BNB
const daysUntilDeadline = 90; // 90 days
```

### CZ Tweet Market Templates

Available templates in `scripts/createMarket_CZTweet.js`:

1. **Keyword Mention** - "Will CZ tweet about BNB within 24 hours?"
2. **Tweet Count** - "Will CZ tweet more than 3 times in 7 days?"
3. **Next Tweet Keyword** - "Will CZ's next tweet mention 'building'?"
4. **Memecoin Mention** - "Will CZ tweet about memecoins within 48 hours?"

## Data Sources

### Four.meme Tokens
- **Primary:** DexScreener API
- **Endpoint:** `https://api.dexscreener.com/latest/dex/tokens/{address}`
- **Data:** Market cap, price, volume, liquidity
- **Update Frequency:** 1 minute

### BNB Price
- **Primary:** CoinGecko API
- **Fallback:** DexScreener (PancakeSwap BNB/USDT)
- **Endpoint:** `https://api.coingecko.com/api/v3/simple/price`
- **Data:** Price, market cap, 24h volume, 24h change
- **Update Frequency:** 1 minute

### CZ Tweets
- **Source:** Twitter API v2
- **Requires:** Elevated access, OAuth 2.0, Bearer token
- **See:** [Twitter Integration Guide](#twitter-integration)

## Oracle Query IDs

### Four.meme Tokens
```javascript
const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["string", "address"],
  ["TokenMarketCap", tokenAddress]
);
const queryId = ethers.keccak256(queryData);
```

### BNB Price
```javascript
const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["string"],
  ["BNB-USD"]
);
const queryId = ethers.keccak256(queryData);
```

### CZ Tweets
```javascript
const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["string", "string", "uint256"],
  ["CZ_Tweet", marketType, marketId]
);
const queryId = ethers.keccak256(queryData);
```

## Market Resolution

### Automatic Resolution (Oracle-based)

Markets automatically resolve after deadline if oracle data is available:

```bash
npx hardhat run scripts/resolveFromHivebets Oracle.js --network bsctest <market-address>
```

Requirements:
- Deadline has passed
- Buffer period elapsed (1 hour)
- Oracle data available and fresh (< 24 hours old)

### Manual Resolution (Fallback)

If oracle data is unavailable, resolver can manually resolve:

```bash
npx hardhat run scripts/resolveMarketV2.js --network bsctest <market-address> yes
```

## Monitoring

### Check Market Status
```bash
npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>
```

### View Oracle Data
```bash
# Built into preview script - shows:
# - Current oracle market cap/price
# - Oracle data timestamp
# - Can resolve from oracle?
# - Preview resolution outcome
```

## Twitter Integration

### Setup Twitter API Access

1. **Apply for Developer Account**
   - Visit https://developer.twitter.com
   - Apply for elevated access
   - Explain use case: "Oracle data for prediction markets"

2. **Create App**
   - Enable OAuth 2.0
   - Generate Bearer Token
   - Store securely in environment variables

3. **Set Environment Variables**
```bash
export TWITTER_BEARER_TOKEN="your_bearer_token_here"
export CZ_USER_ID="902926941413453824" # CZ's Twitter user ID
```

### Implementing Tweet Monitoring

Create `scripts/monitorCZTweets.js`:

```javascript
const axios = require('axios');

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const CZ_USER_ID = process.env.CZ_USER_ID;

async function getLatestTweets() {
  const response = await axios.get(
    `https://api.twitter.com/2/users/${CZ_USER_ID}/tweets`,
    {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`
      },
      params: {
        'max_results': 10,
        'tweet.fields': 'created_at,text'
      }
    }
  );
  
  return response.data.data;
}

async function checkMarketCriteria(tweets, marketType, keywords) {
  // Implement your market resolution logic here
  // Example: Check if any tweet contains keywords
  for (const tweet of tweets) {
    for (const keyword of keywords) {
      if (tweet.text.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}
```

### Market Resolution for Tweet Markets

1. Monitor tweets using Twitter API
2. Check if criteria met (keyword match, tweet count, etc.)
3. Submit outcome (0 or 1) to oracle
4. Call `resolveFromHivebets Oracle()` after deadline

## Production Deployment

### Mainnet Configuration

1. **Update Factory Address**
```javascript
const factoryV2Address = "0x..."; // Your deployed factory address
```

2. **Update Oracle Address**
```javascript
const hivebetsOracle = "0x..."; // Your Hivebets Oracle address
```

3. **Run Continuous Feed**
```bash
# Use PM2 or similar for production
pm2 start scripts/oracleDataFeed.js --name "oracle-feed" -- --network bsc --continuous
```

### Security Considerations

1. **Oracle Data Validation**
   - Always validate data before submission
   - Use multiple data sources when possible
   - Implement sanity checks (price ranges, etc.)

2. **Rate Limiting**
   - DexScreener: No official limit, be respectful
   - CoinGecko: 10-50 calls/minute (free tier)
   - Twitter: Varies by access level

3. **Error Handling**
   - Implement retry logic
   - Log failures
   - Alert on consecutive failures

4. **Private Keys**
   - Never commit private keys
   - Use environment variables
   - Consider hardware wallets for mainnet

## Troubleshooting

### Common Issues

**1. "No oracle data available"**
- Check if oracle feed is running
- Verify data was submitted for correct queryId
- Check data timestamp

**2. "Oracle data too old"**
- Restart oracle feed
- Check API connectivity
- Verify update interval

**3. Twitter API errors**
- Verify bearer token is valid
- Check API access level
- Review rate limits

**4. Gas estimation failed**
- Check wallet has sufficient BNB
- Verify contract addresses
- Try manual gas limit

## API Rate Limits

| Service | Free Tier | Recommended Update Interval |
|---------|-----------|----------------------------|
| DexScreener | Unlimited* | 1 minute |
| CoinGecko | 10-50/min | 1 minute |
| Twitter API | Varies | 1-5 minutes |

*Be respectful, implement backoff if rate limited

## Support

For issues or questions:
- GitHub Issues: [Your repo]
- Docs: `/docs`
- Hivebets Oracle Docs: https://hivebets.io/docs

## License

MIT

