const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Getting new market addresses from deployment transactions...\n");
  
  const txs = [
    { hash: "0x43963a5edf166c8f76f3c27e2de3b205f4e9c31f4833a7aa5adb50e0be6534d9", name: "币安人生 → $400M" },
    { hash: "0x05739439c80c5e1d1a66ede94509c725f42d78a28774978ad4928827bdf19479", name: "PALU → $40M" },
    { hash: "0x1b350b1a0b04f80af8b69003607155c80389fd13077c9321a4f4f7107ea30219", name: "BNB → $1,300" }
  ];
  
  for (const tx of txs) {
    console.log(`📍 ${tx.name}`);
    console.log(`   TX: ${tx.hash}`);
    
    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
    
    if (receipt && receipt.logs && receipt.logs.length > 0) {
      // The first log topic usually contains the event signature
      // For MarketCreated, the market address is in one of the early logs
      console.log(`   Total logs: ${receipt.logs.length}`);
      
      // Try to find contract creation in logs
      for (let i = 0; i < Math.min(5, receipt.logs.length); i++) {
        const log = receipt.logs[i];
        if (log.topics.length >= 2) {
          // Try to extract address from topic[1] (indexed market parameter)
          const possibleAddress = "0x" + log.topics[1].slice(26);
          if (possibleAddress.length === 42) {
            console.log(`   ✅ Market Address: ${possibleAddress}`);
            break;
          }
        }
      }
    }
    console.log();
  }
}

main().catch(console.error);

