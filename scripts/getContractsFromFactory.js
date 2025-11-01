const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const FACTORY = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  
  // Get the 3 specific transactions
  const txHashes = [
    "0x43963a5edf166c8f76f3c27e2de3b205f4e9c31f4833a7aa5adb50e0be6534d9",
    "0x05739439c80c5e1d1a66ede94509c725f42d78a28774978ad4928827bdf19479", 
    "0x1b350b1a0b04f80af8b69003607155c80389fd13077c9321a4f4f7107ea30219"
  ];
  
  const names = ["币安人生", "PALU", "BNB"];
  
  console.log("Extracting market addresses...\n");
  
  for (let i = 0; i < txHashes.length; i++) {
    const receipt = await ethers.provider.getTransactionReceipt(txHashes[i]);
    
    // Look through all logs for the MarketCreated event
    for (const log of receipt.logs) {
      // Check if this log is from the factory
      if (log.address.toLowerCase() === FACTORY.toLowerCase()) {
        // MarketCreated(address indexed market, string tokenName, bytes32 indexed queryId)
        // Topic 0: event signature
        // Topic 1: market address (indexed)
        // Topic 2: queryId (indexed)
        if (log.topics.length >= 2) {
          const marketAddress = ethers.getAddress("0x" + log.topics[1].slice(26));
          console.log(`${names[i]}: ${marketAddress}`);
          break;
        }
      }
    }
  }
}

main().catch(console.error);

