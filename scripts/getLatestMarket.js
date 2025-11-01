const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  
  // Get past MarketCreated events
  const factory = await ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);
  
  console.log("Querying factory for MarketCreated events...\n");
  
  // Get events from the last 1000 blocks
  const currentBlock = await ethers.provider.getBlockNumber();
  const fromBlock = currentBlock - 1000;
  
  const filter = factory.filters.MarketCreated();
  const events = await factory.queryFilter(filter, fromBlock, currentBlock);
  
  console.log(`Found ${events.length} markets in last 1000 blocks\n`);
  
  if (events.length > 0) {
    // Get the last event
    const lastEvent = events[events.length - 1];
    console.log("Latest Market:");
    console.log("Address:", lastEvent.args.market);
    console.log("Token Name:", lastEvent.args.tokenName);
    console.log("Query ID:", lastEvent.args.queryId);
    console.log("Block:", lastEvent.blockNumber);
    console.log("Tx:", lastEvent.transactionHash);
    
    return lastEvent.args.market;
  } else {
    console.log("No recent markets found");
  }
}

main()
  .then((address) => {
    if (address) {
      console.log("\n✅ Use this address:", address);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

