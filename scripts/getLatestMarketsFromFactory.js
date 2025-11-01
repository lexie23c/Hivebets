const hre = require("hardhat");

async function main() {
  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  
  const factoryABI = [
    "event MarketCreated(address indexed marketAddress, string question, uint256 deadline, address creator)",
    "function allMarkets(uint256) view returns (address)"
  ];

  const factory = await hre.ethers.getContractAt(factoryABI, FACTORY_ADDRESS);

  console.log("🔍 Getting the last 5 markets from the factory...\n");

  try {
    // Try to get recent markets by index (assuming they're indexed)
    for (let i = 0; i < 10; i++) {
      try {
        const marketAddress = await factory.allMarkets(i);
        
        // Get market details
        const marketABI = ["function question() view returns (string)"];
        const market = await hre.ethers.getContractAt(marketABI, marketAddress);
        const question = await market.question();
        
        console.log(`Market ${i}: ${marketAddress}`);
        console.log(`Question: ${question}\n`);
      } catch (e) {
        // No more markets
        break;
      }
    }
  } catch (error) {
    console.log("⚠️  allMarkets array not available\n");
    
    // Try filtering events instead
    console.log("📡 Checking recent events...");
    
    try {
      const latestBlock = await hre.ethers.provider.getBlockNumber();
      const fromBlock = latestBlock - 5000; // Last ~5000 blocks (~15-20 min)
      
      const filter = factory.filters.MarketCreated();
      const events = await factory.queryFilter(filter, fromBlock, latestBlock);
      
      console.log(`\nFound ${events.length} markets created in last 5000 blocks:\n`);
      
      events.slice(-5).forEach((event, idx) => {
        console.log(`${idx + 1}. ${event.args.marketAddress}`);
        console.log(`   Question: ${event.args.question}`);
        console.log(`   Creator: ${event.args.creator}\n`);
      });
      
    } catch (e2) {
      console.error("❌ Error querying events:", e2.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

