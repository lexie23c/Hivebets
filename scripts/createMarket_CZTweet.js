/**
 * Create prediction markets based on CZ Binance tweets
 * Examples:
 * - "Will CZ tweet about BNB within 24 hours?"
 * - "Will CZ's next tweet mention 'building'?"
 * - "Will CZ tweet more than 3 times this week?"
 */

const hre = require("hardhat");
const { ethers } = hre;

// Market templates for CZ tweet predictions
const CZ_MARKET_TEMPLATES = [
  {
    id: 1,
    title: "Will CZ (@cz_binance) tweet about BNB within 24 hours?",
    description: "Resolves YES if CZ tweets mentioning 'BNB' within 24 hours of market creation",
    duration: 1, // days
    keywords: ["BNB", "bnb"],
    type: "keyword_mention"
  },
  {
    id: 2,
    title: "Will CZ tweet more than 3 times in the next 7 days?",
    description: "Resolves YES if CZ posts more than 3 tweets within 7 days",
    duration: 7, // days
    threshold: 3,
    type: "tweet_count"
  },
  {
    id: 3,
    title: "Will CZ's next tweet mention 'building' or 'buidl'?",
    description: "Resolves YES if the next tweet from CZ contains 'building', 'build', or 'buidl'",
    duration: 3, // days
    keywords: ["building", "build", "buidl"],
    type: "next_tweet_keyword"
  },
  {
    id: 4,
    title: "Will CZ tweet about memecoins within 48 hours?",
    description: "Resolves YES if CZ tweets mentioning memecoins, memes, or specific memecoin names",
    duration: 2, // days
    keywords: ["memecoin", "meme", "doge", "shib", "pepe"],
    type: "keyword_mention"
  }
];

async function main() {
  const factoryV2Address = "0xe8D17FDcddc3293bDD4568198d25E9657Fd23Fe9"; // Update if needed
  
  const [signer] = await ethers.getSigners();
  const resolver = await signer.getAddress();
  
  console.log("\n🐦 Creating CZ Binance Tweet Prediction Markets");
  console.log("=" + "=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Resolver:", resolver);
  console.log("Twitter Handle: @cz_binance");
  console.log("Profile URL: https://x.com/cz_binance");
  
  // Get market template selection from args
  const args = process.argv.slice(2);
  const marketId = args.length > 0 ? parseInt(args[0]) : 1;
  
  const template = CZ_MARKET_TEMPLATES.find(t => t.id === marketId);
  if (!template) {
    console.error(`\n❌ Invalid market ID. Available templates:`);
    CZ_MARKET_TEMPLATES.forEach(t => {
      console.log(`\n${t.id}. ${t.title}`);
      console.log(`   ${t.description}`);
    });
    console.log(`\nUsage: npx hardhat run scripts/createMarket_CZTweet.js --network bsctest [marketId]`);
    process.exit(1);
  }
  
  console.log("\n📋 Selected Market Template:");
  console.log("  ID:", template.id);
  console.log("  Title:", template.title);
  console.log("  Description:", template.description);
  console.log("  Duration:", template.duration, "days");
  console.log("  Type:", template.type);
  if (template.keywords) {
    console.log("  Keywords:", template.keywords.join(", "));
  }
  if (template.threshold) {
    console.log("  Threshold:", template.threshold);
  }
  
  // Calculate deadline
  const deadline = Math.floor(Date.now() / 1000) + (template.duration * 24 * 60 * 60);
  console.log("  Deadline:", new Date(deadline * 1000).toISOString());
  
  const maxPerWallet = ethers.parseEther("0.05"); // 0.05 BNB max (smaller for quick social markets)
  const feeBps = 200; // 2% fee
  
  const usd8 = (s) => ethers.parseUnits(s, 8);
  
  // For tweet-based markets, we use a binary outcome (0 or 1)
  // Target of 1 means "event occurred"
  const target = usd8("1");
  
  // Generate queryId for CZ tweet tracking
  const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["string", "string", "uint256"],
    ["CZ_Tweet", template.type, template.id]
  );
  const queryId = ethers.keccak256(queryData);
  
  const dataSource = "https://x.com/cz_binance";
  
  console.log("\n📊 Market Configuration:");
  console.log("  Max Bet per Wallet: 0.05 BNB");
  console.log("  Fee: 2%");
  console.log("  QueryId:", queryId);
  console.log("  Data Source:", dataSource);
  
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryV2Address);
  
  console.log("\n⏳ Creating market...");
  
  try {
    const tx = await factory.createMarket(
      resolver,
      deadline,
      maxPerWallet,
      feeBps,
      template.title,
      dataSource,
      target,
      queryId
    );
    
    console.log("Transaction submitted:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const rc = await tx.wait();
    const ev = rc.logs.find(log => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed && parsed.name === "MarketCreated";
      } catch (e) {
        return false;
      }
    });
    
    const parsedEv = factory.interface.parseLog(ev);
    const marketAddr = parsedEv.args.market;
    
    console.log("\n✅ ✅ ✅ CZ TWEET MARKET CREATED! ✅ ✅ ✅");
    console.log("\n📍 Market Address:", marketAddr);
    
    if (hre.network.name === 'bsc') {
      console.log("🔗 BSCScan:", `https://bscscan.com/address/${marketAddr}`);
    } else if (hre.network.name === 'bsctest') {
      console.log("🔗 BSCScan:", `https://testnet.bscscan.com/address/${marketAddr}`);
    }
    
    console.log("\n📋 Market Details:");
    console.log("  Question:", template.title);
    console.log("  Type:", template.type);
    console.log("  Duration:", template.duration, "days");
    console.log("  Deadline:", new Date(deadline * 1000).toLocaleString());
    console.log("  QueryId:", queryId);
    
    console.log("\n⚠️  IMPORTANT: Twitter Integration Required");
    console.log("=" + "=".repeat(60));
    console.log("\nTo resolve this market, you need to:");
    console.log("\n1. Set up Twitter API v2 access:");
    console.log("   - Get elevated access at https://developer.twitter.com");
    console.log("   - Enable OAuth 2.0 authentication");
    console.log("   - Set up bearer token");
    console.log("\n2. Monitor @cz_binance tweets:");
    console.log("   - Use Twitter API v2 /users/:id/tweets endpoint");
    console.log("   - Track tweet content and timestamps");
    console.log("   - Match against market criteria");
    console.log("\n3. Submit resolution data:");
    console.log("   - When criteria met, submit outcome to oracle");
    console.log("   - Call resolveFromTellor() after deadline");
    
    console.log("\n💡 Next Steps:");
    console.log("1. Implement Twitter monitoring bot (see docs/twitter-integration.md)");
    console.log("2. Place bets:");
    console.log("   npx hardhat run scripts/placeBet.js --network", hre.network.name, marketAddr, "yes 0.01");
    console.log("3. Monitor market:");
    console.log("   npx hardhat run scripts/previewMarketV2.js --network", hre.network.name, marketAddr);
    
    console.log("\n📚 Market Templates Available:");
    CZ_MARKET_TEMPLATES.forEach(t => {
      const indicator = t.id === template.id ? " ← (current)" : "";
      console.log(`  ${t.id}. ${t.title}${indicator}`);
    });
    
    return {
      marketAddress: marketAddr,
      template: template,
      deadline: deadline,
      queryId: queryId
    };
    
  } catch (error) {
    console.error("\n❌ Failed to create market:", error.message);
    throw error;
  }
}

main()
  .then((result) => {
    console.log("\n✅ Script completed successfully!");
    console.log("Market Address:", result.marketAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

