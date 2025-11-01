const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const txHashes = [
    "0x43963a5edf166c8f76f3c27e2de3b205f4e9c31f4833a7aa5adb50e0be6534d9", // 币安人生
    "0x05739439c80c5e1d1a66ede94509c725f42d78a28774978ad4928827bdf19479", // PALU
    "0x1b350b1a0b04f80af8b69003607155c80389fd13077c9321a4f4f7107ea30219", // BNB
  ];
  
  const names = ["币安人生 → $400M", "PALU → $40M", "BNB → $1,300"];
  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  const factory = await ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);
  
  console.log("📍 NEW MARKET ADDRESSES (October 31):\n");
  
  for (let i = 0; i < txHashes.length; i++) {
    const receipt = await ethers.provider.getTransactionReceipt(txHashes[i]);
    
    for (const log of receipt.logs) {
      try {
        const parsed = factory.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        
        if (parsed && parsed.name === "MarketCreated") {
          console.log(`${i + 1}. ${names[i]}`);
          console.log(`   Address: ${parsed.args.market}`);
          console.log(`   TX: https://bscscan.com/tx/${txHashes[i]}\n`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }
}

main().catch(console.error);

