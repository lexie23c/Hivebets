/**
 * Enhanced Oracle Data Feed System
 * Tracks: Four.meme coins, BNB price, and CZ Binance tweets
 */

const hre = require("hardhat");
const { ethers } = hre;
const axios = require('axios');

// Configuration
const CONFIG = {
  tellorPlayground: "0x0346C9998600Fde7bE073b72902b70cfDc671908",
  
  // Four.meme tokens to track
  fourmemeTokens: [
    {
      name: "$4",
      address: "0x0A43fC31a73013089DF59194872Ecae4cAe14444",
      symbol: "4"
    }
    // Add more tokens here as needed
  ],
  
  // BNB tracking
  bnbTracking: {
    enabled: true,
    symbol: "BNB",
    address: "native" // Native BNB
  },
  
  // CZ Twitter monitoring
  czTwitter: {
    enabled: true,
    handle: "cz_binance",
    url: "https://x.com/cz_binance"
  },
  
  // Update intervals (in milliseconds)
  updateInterval: 60000, // 1 minute
  
  // API endpoints
  apis: {
    dexscreener: "https://api.dexscreener.com/latest/dex",
    coingecko: "https://api.coingecko.com/api/v3",
    bscscan: "https://api.bscscan.com/api",
    fourmeme: "https://api.four.meme", // Four.meme API
    // Twitter API would require authentication
  }
};

class OracleDataFeed {
  constructor() {
    this.playground = null;
    this.signer = null;
  }

  async initialize() {
    [this.signer] = await ethers.getSigners();
    this.playground = await ethers.getContractAt(
      "TellorPlayground", 
      CONFIG.tellorPlayground
    );
    console.log("🔧 Oracle Data Feed initialized");
    console.log("Signer:", await this.signer.getAddress());
  }

  /**
   * Fetch market cap for a Four.meme token
   * Primary: Four.meme API
   * Fallback: DexScreener
   */
  async fetchTokenMarketCap(tokenAddress) {
    // Try Four.meme API first (most accurate for Four.meme tokens)
    try {
      const response = await axios.get(
        `${CONFIG.apis.fourmeme}/tokens/${tokenAddress}`,
        { timeout: 5000 }
      );
      
      if (response.data && response.data.marketCap) {
        return {
          marketCap: response.data.marketCap,
          price: response.data.price,
          volume24h: response.data.volume24h || 0,
          priceChange24h: response.data.priceChange24h || 0,
          liquidity: response.data.liquidity || 0,
          source: "Four.meme"
        };
      }
    } catch (error) {
      console.log(`⚠️  Four.meme API unavailable, trying DexScreener...`);
    }

    // Fallback to DexScreener
    try {
      const response = await axios.get(
        `${CONFIG.apis.dexscreener}/tokens/${tokenAddress}`
      );
      
      if (!response.data || !response.data.pairs || response.data.pairs.length === 0) {
        console.log(`⚠️  No data found for token ${tokenAddress}`);
        return null;
      }

      // Get the main pair (usually highest liquidity)
      const mainPair = response.data.pairs[0];
      const fdv = mainPair.fdv; // Fully diluted valuation
      const mcap = mainPair.marketCap;
      const price = parseFloat(mainPair.priceUsd);
      
      return {
        marketCap: mcap || fdv,
        price: price,
        volume24h: parseFloat(mainPair.volume.h24),
        priceChange24h: parseFloat(mainPair.priceChange.h24),
        liquidity: parseFloat(mainPair.liquidity.usd),
        pairAddress: mainPair.pairAddress,
        source: "DexScreener"
      };
    } catch (error) {
      console.error(`❌ Error fetching data for ${tokenAddress}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch BNB price in real-time
   * Primary: BSCScan Price Oracle
   * Fallback 1: CoinGecko
   * Fallback 2: DexScreener
   */
  async fetchBNBPrice() {
    // Try BSCScan first (most accurate on-chain data)
    try {
      const response = await axios.get(
        `${CONFIG.apis.bscscan}?module=stats&action=bnbprice&apikey=P8NG9PCX4FCGIXBAJEEHFK5AP3ASSBSM5P`,
        { timeout: 5000 }
      );
      
      if (response.data && response.data.status === "1") {
        const result = response.data.result;
        return {
          price: parseFloat(result.ethusd), // BSCScan uses "ethusd" for BNB price
          timestamp: result.ethusd_timestamp,
          source: "BSCScan"
        };
      }
    } catch (error) {
      console.log(`⚠️  BSCScan API unavailable, trying CoinGecko...`);
    }

    // Fallback 1: CoinGecko
    try {
      const response = await axios.get(
        `${CONFIG.apis.coingecko}/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
        { timeout: 5000 }
      );
      
      const data = response.data.binancecoin;
      return {
        price: data.usd,
        marketCap: data.usd_market_cap,
        volume24h: data.usd_24h_vol,
        priceChange24h: data.usd_24h_change,
        source: "CoinGecko"
      };
    } catch (error) {
      console.log("⚠️  CoinGecko API unavailable, trying DexScreener...");
      
      // Fallback 2: DexScreener for BNB/USDT pair
      try {
        const bnbUsdtPair = "0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE"; // PancakeSwap BNB/USDT
        const response = await axios.get(
          `${CONFIG.apis.dexscreener}/pairs/bsc/${bnbUsdtPair}`
        );
        
        const pair = response.data.pair;
        return {
          price: parseFloat(pair.priceUsd),
          volume24h: parseFloat(pair.volume.h24),
          priceChange24h: parseFloat(pair.priceChange.h24),
          liquidity: parseFloat(pair.liquidity.usd),
          source: "DexScreener"
        };
      } catch (fallbackError) {
        console.error("❌ All BNB price sources failed:", fallbackError.message);
        return null;
      }
    }
  }

  /**
   * Check CZ Binance's latest tweet
   * Note: This requires Twitter API credentials in production
   */
  async checkCZTweets() {
    // For now, this is a placeholder that would integrate with Twitter API
    console.log("\n🐦 CZ Binance Tweet Monitor");
    console.log(`   Profile: ${CONFIG.czTwitter.url}`);
    console.log("   ⚠️  Note: Real-time tweet monitoring requires Twitter API authentication");
    console.log("   ⚠️  For production, implement Twitter API v2 with Bearer Token");
    
    // In production, you would:
    // 1. Use Twitter API v2 to fetch latest tweets
    // 2. Parse tweet content for keywords (BNB, Bitcoin, market conditions)
    // 3. Create prediction markets based on tweet content
    // 4. Submit tweet timestamp and content hash to oracle
    
    return {
      timestamp: Date.now(),
      message: "Twitter API integration required - see documentation",
      suggestedImplementation: "Use Twitter API v2 with elevated access"
    };
  }

  /**
   * Submit token market cap to Tellor oracle
   */
  async submitTokenData(tokenAddress, tokenName, marketCapUsd) {
    const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "address"],
      ["TokenMarketCap", tokenAddress]
    );
    const queryId = ethers.keccak256(queryData);
    
    // Market cap with 8 decimals (Tellor standard for USD values)
    const mcapValue = ethers.parseUnits(marketCapUsd.toFixed(2), 8);
    
    const valueBytes = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256"],
      [mcapValue]
    );
    
    console.log(`\n📤 Submitting ${tokenName} data to oracle...`);
    console.log(`   Market Cap: $${marketCapUsd.toLocaleString()}`);
    console.log(`   QueryId: ${queryId}`);
    
    try {
      const tx = await this.playground.submitValue(queryId, valueBytes, 0, queryData);
      await tx.wait();
      console.log(`   ✅ Submitted successfully!`);
      return { success: true, queryId, marketCap: marketCapUsd };
    } catch (error) {
      console.error(`   ❌ Failed to submit:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit BNB price to Tellor oracle
   */
  async submitBNBPrice(priceUsd) {
    const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string"],
      ["BNB-USD"]
    );
    const queryId = ethers.keccak256(queryData);
    
    // Price with 8 decimals
    const priceValue = ethers.parseUnits(priceUsd.toFixed(2), 8);
    
    const valueBytes = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256"],
      [priceValue]
    );
    
    console.log(`\n📤 Submitting BNB price to oracle...`);
    console.log(`   Price: $${priceUsd.toFixed(2)}`);
    console.log(`   QueryId: ${queryId}`);
    
    try {
      const tx = await this.playground.submitValue(queryId, valueBytes, 0, queryData);
      await tx.wait();
      console.log(`   ✅ Submitted successfully!`);
      return { success: true, queryId, price: priceUsd };
    } catch (error) {
      console.error(`   ❌ Failed to submit:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Main update cycle
   */
  async updateAllData() {
    console.log("\n" + "=".repeat(60));
    console.log("🔄 Oracle Data Feed Update");
    console.log(new Date().toISOString());
    console.log("=".repeat(60));

    // Update Four.meme tokens
    console.log("\n📊 Four.meme Token Data:");
    for (const token of CONFIG.fourmemeTokens) {
      const data = await this.fetchTokenMarketCap(token.address);
      if (data && data.marketCap) {
        console.log(`\n${token.name} (${token.symbol}) [${data.source}]:`);
        console.log(`   Market Cap: $${data.marketCap.toLocaleString()}`);
        console.log(`   Price: $${data.price}`);
        console.log(`   24h Change: ${data.priceChange24h.toFixed(2)}%`);
        console.log(`   24h Volume: $${data.volume24h.toLocaleString()}`);
        console.log(`   Liquidity: $${data.liquidity.toLocaleString()}`);
        
        // Submit to oracle
        await this.submitTokenData(token.address, token.name, data.marketCap);
      }
    }

    // Update BNB price
    if (CONFIG.bnbTracking.enabled) {
      console.log("\n💰 BNB Price Data:");
      const bnbData = await this.fetchBNBPrice();
      if (bnbData && bnbData.price) {
        console.log(`   Source: ${bnbData.source}`);
        console.log(`   Price: $${bnbData.price.toFixed(2)}`);
        if (bnbData.marketCap) {
          console.log(`   Market Cap: $${(bnbData.marketCap / 1e9).toFixed(2)}B`);
        }
        if (bnbData.volume24h) {
          console.log(`   24h Volume: $${(bnbData.volume24h / 1e9).toFixed(2)}B`);
        }
        if (bnbData.priceChange24h) {
          console.log(`   24h Change: ${bnbData.priceChange24h.toFixed(2)}%`);
        }
        
        // Submit to oracle
        await this.submitBNBPrice(bnbData.price);
      }
    }

    // Check CZ tweets
    if (CONFIG.czTwitter.enabled) {
      await this.checkCZTweets();
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Update cycle completed");
    console.log("=".repeat(60) + "\n");
  }

  /**
   * Start continuous monitoring
   */
  async startMonitoring() {
    console.log("\n🚀 Starting Oracle Data Feed Monitor");
    console.log(`Update interval: ${CONFIG.updateInterval / 1000} seconds`);
    console.log(`Tracking ${CONFIG.fourmemeTokens.length} Four.meme token(s)`);
    console.log(`BNB tracking: ${CONFIG.bnbTracking.enabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`CZ Twitter monitoring: ${CONFIG.czTwitter.enabled ? 'ENABLED' : 'DISABLED'}`);
    
    // Initial update
    await this.updateAllData();
    
    // Set up interval
    setInterval(async () => {
      try {
        await this.updateAllData();
      } catch (error) {
        console.error("❌ Error in update cycle:", error.message);
      }
    }, CONFIG.updateInterval);
    
    console.log("\n✨ Monitor running... Press Ctrl+C to stop\n");
  }
}

// Main execution
async function main() {
  const feed = new OracleDataFeed();
  await feed.initialize();
  
  // Check if we want continuous monitoring or one-time update
  const args = process.argv.slice(2);
  const continuous = args.includes('--continuous') || args.includes('-c');
  
  if (continuous) {
    await feed.startMonitoring();
  } else {
    await feed.updateAllData();
    console.log("\n💡 Tip: Use --continuous flag for ongoing monitoring");
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});

