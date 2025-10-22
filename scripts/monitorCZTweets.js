/**
 * Twitter Monitor for CZ Binance (@cz_binance)
 * Monitors tweets and submits oracle data for tweet-based prediction markets
 * 
 * REQUIRES: Twitter API v2 Bearer Token
 * Setup: Add TWITTER_BEARER_TOKEN to .env file
 */

const hre = require("hardhat");
const { ethers } = hre;
const axios = require('axios');
require('dotenv').config();

// Configuration
const CONFIG = {
  tellorPlayground: "0x0346C9998600Fde7bE073b72902b70cfDc671908",
  
  twitter: {
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    czUserId: "902926941413453824", // CZ's Twitter user ID
    czHandle: "cz_binance",
    pollInterval: 60000, // 1 minute
  },
  
  // Market templates (must match createMarket_CZTweet.js)
  marketTypes: {
    keyword_mention: 1,
    tweet_count: 2,
    next_tweet_keyword: 3,
  }
};

class CZTweetMonitor {
  constructor() {
    this.playground = null;
    this.signer = null;
    this.lastCheckedTweetId = null;
    this.monitoringStartTime = Date.now();
  }

  async initialize() {
    // Check for Twitter token
    if (!CONFIG.twitter.bearerToken) {
      console.error("\n❌ Error: TWITTER_BEARER_TOKEN not found in environment");
      console.log("\nTo enable Twitter monitoring:");
      console.log("1. Get Twitter API access at https://developer.twitter.com");
      console.log("2. Create a .env file with:");
      console.log("   TWITTER_BEARER_TOKEN=your_token_here");
      console.log("\nFor now, running in simulation mode...\n");
      this.simulationMode = true;
    } else {
      this.simulationMode = false;
    }

    [this.signer] = await ethers.getSigners();
    this.playground = await ethers.getContractAt(
      "TellorPlayground", 
      CONFIG.tellorPlayground
    );
    
    console.log("🐦 CZ Binance Tweet Monitor initialized");
    console.log("Signer:", await this.signer.getAddress());
    console.log("Mode:", this.simulationMode ? "SIMULATION" : "LIVE");
    console.log("Monitoring: @" + CONFIG.twitter.czHandle);
  }

  /**
   * Fetch latest tweets from CZ
   */
  async fetchLatestTweets(maxResults = 10) {
    if (this.simulationMode) {
      return this.generateSimulatedTweets();
    }

    try {
      const response = await axios.get(
        `https://api.twitter.com/2/users/${CONFIG.twitter.czUserId}/tweets`,
        {
          headers: {
            'Authorization': `Bearer ${CONFIG.twitter.bearerToken}`
          },
          params: {
            'max_results': maxResults,
            'tweet.fields': 'created_at,text,public_metrics',
            'exclude': 'retweets,replies' // Only original tweets
          }
        }
      );

      if (!response.data || !response.data.data) {
        console.log("⚠️  No tweets found");
        return [];
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Error fetching tweets:", error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      return [];
    }
  }

  /**
   * Generate simulated tweets for testing
   */
  generateSimulatedTweets() {
    const now = new Date();
    const tweets = [
      {
        id: '1',
        text: 'Building the future of crypto. Stay safe everyone. 🔒',
        created_at: now.toISOString(),
        public_metrics: { like_count: 5000, retweet_count: 1000 }
      },
      {
        id: '2',
        text: 'BNB is doing great. Keep building! 💪',
        created_at: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
        public_metrics: { like_count: 8000, retweet_count: 1500 }
      }
    ];

    // Randomly add memecoin tweet
    if (Math.random() > 0.7) {
      tweets.push({
        id: '3',
        text: 'Interesting to see all these memecoins popping up. DYOR always.',
        created_at: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        public_metrics: { like_count: 12000, retweet_count: 3000 }
      });
    }

    return tweets;
  }

  /**
   * Check if tweets match keyword criteria
   */
  checkKeywordMatch(tweets, keywords, timeWindowHours = 24) {
    const cutoffTime = Date.now() - (timeWindowHours * 60 * 60 * 1000);

    for (const tweet of tweets) {
      const tweetTime = new Date(tweet.created_at).getTime();
      if (tweetTime < cutoffTime) continue;

      const tweetText = tweet.text.toLowerCase();
      for (const keyword of keywords) {
        if (tweetText.includes(keyword.toLowerCase())) {
          return {
            matched: true,
            tweet: tweet,
            keyword: keyword,
            timestamp: tweetTime
          };
        }
      }
    }

    return { matched: false };
  }

  /**
   * Count tweets in time window
   */
  countTweetsInWindow(tweets, windowDays = 7) {
    const cutoffTime = Date.now() - (windowDays * 24 * 60 * 60 * 1000);
    let count = 0;

    for (const tweet of tweets) {
      const tweetTime = new Date(tweet.created_at).getTime();
      if (tweetTime >= cutoffTime) {
        count++;
      }
    }

    return count;
  }

  /**
   * Check next tweet for keywords
   */
  checkNextTweetKeyword(tweets, keywords) {
    if (tweets.length === 0) return { matched: false };

    // Get the newest tweet
    const latestTweet = tweets[0];
    
    // If we've already checked this tweet, no new tweet yet
    if (this.lastCheckedTweetId === latestTweet.id) {
      return { matched: false, waiting: true };
    }

    // New tweet found!
    this.lastCheckedTweetId = latestTweet.id;
    const tweetText = latestTweet.text.toLowerCase();

    for (const keyword of keywords) {
      if (tweetText.includes(keyword.toLowerCase())) {
        return {
          matched: true,
          tweet: latestTweet,
          keyword: keyword
        };
      }
    }

    return { matched: false, checked: true };
  }

  /**
   * Submit oracle data for market outcome
   */
  async submitMarketOutcome(marketId, marketType, outcome) {
    const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string", "uint256"],
      ["CZ_Tweet", marketType, marketId]
    );
    const queryId = ethers.keccak256(queryData);

    // Outcome: 0 = NO, 1 = YES (with 8 decimals)
    const outcomeValue = ethers.parseUnits(outcome ? "1" : "0", 8);
    
    const valueBytes = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256"],
      [outcomeValue]
    );

    console.log(`\n📤 Submitting market outcome...`);
    console.log(`   Market ID: ${marketId}`);
    console.log(`   Type: ${marketType}`);
    console.log(`   Outcome: ${outcome ? "YES" : "NO"}`);
    console.log(`   QueryId: ${queryId}`);

    try {
      const tx = await this.playground.submitValue(queryId, valueBytes, 0, queryData);
      await tx.wait();
      console.log(`   ✅ Submitted successfully!`);
      return { success: true, queryId };
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Monitor active markets
   */
  async checkMarkets() {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 Checking CZ Tweet Activity");
    console.log(new Date().toISOString());
    console.log("=".repeat(60));

    const tweets = await this.fetchLatestTweets();
    
    if (tweets.length === 0) {
      console.log("\n⚠️  No tweets retrieved");
      return;
    }

    console.log(`\n📊 Retrieved ${tweets.length} recent tweets`);
    console.log("\nLatest tweets:");
    tweets.slice(0, 3).forEach((tweet, i) => {
      console.log(`\n${i + 1}. ${tweet.text.substring(0, 100)}...`);
      console.log(`   Posted: ${new Date(tweet.created_at).toLocaleString()}`);
      console.log(`   Likes: ${tweet.public_metrics?.like_count || 'N/A'}`);
    });

    // Example: Check for BNB keyword in last 24 hours
    console.log("\n" + "-".repeat(60));
    console.log("Market Check: BNB mention in 24 hours");
    console.log("-".repeat(60));
    
    const bnbCheck = this.checkKeywordMatch(tweets, ["BNB", "bnb"], 24);
    if (bnbCheck.matched) {
      console.log("✅ MATCH FOUND!");
      console.log("   Tweet:", bnbCheck.tweet.text.substring(0, 100));
      console.log("   Keyword:", bnbCheck.keyword);
      console.log("   Time:", new Date(bnbCheck.timestamp).toLocaleString());
      // In production: await this.submitMarketOutcome(1, "keyword_mention", true);
    } else {
      console.log("⏳ No match yet");
    }

    // Example: Check tweet count in 7 days
    console.log("\n" + "-".repeat(60));
    console.log("Market Check: Tweet count in 7 days");
    console.log("-".repeat(60));
    
    const tweetCount = this.countTweetsInWindow(tweets, 7);
    console.log(`   Count: ${tweetCount} tweets`);
    console.log(`   Threshold: 3 tweets`);
    if (tweetCount > 3) {
      console.log("✅ Threshold exceeded!");
      // In production: await this.submitMarketOutcome(2, "tweet_count", true);
    } else {
      console.log("⏳ Below threshold");
    }

    // Example: Check next tweet for "building" keyword
    console.log("\n" + "-".repeat(60));
    console.log("Market Check: Next tweet mentions 'building'");
    console.log("-".repeat(60));
    
    const nextTweetCheck = this.checkNextTweetKeyword(tweets, ["building", "build", "buidl"]);
    if (nextTweetCheck.matched) {
      console.log("✅ MATCH FOUND!");
      console.log("   Tweet:", nextTweetCheck.tweet.text.substring(0, 100));
      console.log("   Keyword:", nextTweetCheck.keyword);
      // In production: await this.submitMarketOutcome(3, "next_tweet_keyword", true);
    } else if (nextTweetCheck.waiting) {
      console.log("⏳ Waiting for new tweet...");
    } else {
      console.log("❌ No match in latest tweet");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Check completed");
    console.log("=".repeat(60) + "\n");
  }

  /**
   * Start continuous monitoring
   */
  async startMonitoring() {
    console.log("\n🚀 Starting CZ Tweet Monitor");
    console.log(`Update interval: ${CONFIG.twitter.pollInterval / 1000} seconds`);
    console.log(`Mode: ${this.simulationMode ? 'SIMULATION (no real Twitter data)' : 'LIVE'}`);

    if (this.simulationMode) {
      console.log("\n⚠️  SIMULATION MODE");
      console.log("To enable real Twitter monitoring:");
      console.log("1. Get Twitter API access");
      console.log("2. Add TWITTER_BEARER_TOKEN to .env");
      console.log("3. Restart this script\n");
    }

    // Initial check
    await this.checkMarkets();

    // Set up interval
    setInterval(async () => {
      try {
        await this.checkMarkets();
      } catch (error) {
        console.error("❌ Error in monitoring cycle:", error.message);
      }
    }, CONFIG.twitter.pollInterval);

    console.log("✨ Monitor running... Press Ctrl+C to stop\n");
  }
}

// Main execution
async function main() {
  const monitor = new CZTweetMonitor();
  await monitor.initialize();

  // Check if we want continuous monitoring or one-time check
  const args = process.argv.slice(2);
  const continuous = args.includes('--continuous') || args.includes('-c');

  if (continuous) {
    await monitor.startMonitoring();
  } else {
    await monitor.checkMarkets();
    console.log("\n💡 Tip: Use --continuous flag for ongoing monitoring");
  }
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});

