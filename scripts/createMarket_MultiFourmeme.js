/**
 * Create prediction markets for multiple Four.meme tokens
 */

const hre = require("hardhat");
const { ethers } = hre;

// Four.meme tokens configuration
const FOURMEME_TOKENS = [
  {
    name: "$4",
    address: "0x0A43fC31a73013089DF59194872Ecae4cAe14444",
    targetMcap: "444000000", // $444M
    description: "Will $4 hit $444M mcap?"
  },
  // Add more Four.meme tokens here
  {
    name: "EXAMPLE",
    address: "0x0000000000000000000000000000000000000000", // Replace with real address
    targetMcap: "100000000", // $100M
    description: "Will EXAMPLE hit $100M mcap?"
  }
];

async function main() {
  const factoryV2Address = "0xe8D17FDcddc3293bDD4568198d25E9657Fd23Fe9"; // Update if needed
  
  const [signer] = await ethers.getSigners();
  const resolver = await signer.getAddress();
  
  console.log("\n🚀 Creating Multiple Four.meme Token Markets");
  console.log("=" + "=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Resolver:", resolver);
  console.log("Factory:", factoryV2Address);
  
  // Market deadline - 30 days from now
  const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
  console.log("Deadline:", new Date(deadline * 1000).toISOString());
  
  const maxPerWallet = ethers.parseEther("0.1"); // 0.1 BNB max
  const feeBps = 200; // 2% fee
  
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryV2Address);
  const usd8 = (s) => ethers.parseUnits(s, 8);
  
  const createdMarkets = [];
  
  // Create markets for each token
  for (const token of FOURMEME_TOKENS) {
    console.log("\n" + "-".repeat(60));
    console.log(`📊 Creating market for ${token.name}`);
    console.log("-".repeat(60));
    
    const title = token.description;
    const dataSource = `https://dexscreener.com/bsc/${token.address}`;
    const target = usd8(token.targetMcap);
    
    // Generate queryId
    const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "address"],
      ["TokenMarketCap", token.address]
    );
    const queryId = ethers.keccak256(queryData);
    
    console.log("\nMarket Details:");
    console.log("  Token:", token.address);
    console.log("  Name:", token.name);
    console.log("  Target Market Cap:", `$${parseInt(token.targetMcap).toLocaleString()}`);
    console.log("  QueryId:", queryId);
    
    try {
      console.log("\n⏳ Creating market...");
      const tx = await factory.createMarket(
        resolver,
        deadline,
        maxPerWallet,
        feeBps,
        title,
        dataSource,
        target,
        queryId
      );
      
      console.log("Transaction:", tx.hash);
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
      
      console.log("✅ Market created:", marketAddr);
      
      createdMarkets.push({
        token: token.name,
        address: marketAddr,
        tokenAddress: token.address,
        targetMcap: token.targetMcap,
        queryId: queryId
      });
    } catch (error) {
      console.error(`❌ Failed to create market for ${token.name}:`, error.message);
    }
  }
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("✅ Market Creation Complete!");
  console.log("=".repeat(60));
  console.log(`\nCreated ${createdMarkets.length} markets:\n`);
  
  createdMarkets.forEach((market, i) => {
    console.log(`${i + 1}. ${market.token}`);
    console.log(`   Market: ${market.address}`);
    console.log(`   Token: ${market.tokenAddress}`);
    console.log(`   Target: $${parseInt(market.targetMcap).toLocaleString()}`);
    console.log(`   QueryId: ${market.queryId}`);
    console.log();
  });
  
  console.log("💡 Next Steps:");
  console.log("1. Run oracle data feed:");
  console.log("   npx hardhat run scripts/oracleDataFeed.js --network bsctest --continuous");
  console.log("\n2. Monitor markets:");
  console.log("   npx hardhat run scripts/previewMarketV2.js --network bsctest <market-address>");
  
  return createdMarkets;
}

main()
  .then((result) => {
    console.log("\n✅ Script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

