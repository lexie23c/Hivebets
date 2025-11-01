const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const txs = [
    { hash: "0x43963a5edf166c8f76f3c27e2de3b205f4e9c31f4833a7aa5adb50e0be6534d9", name: "币安人生" },
    { hash: "0x05739439c80c5e1d1a66ede94509c725f42d78a28774978ad4928827bdf19479", name: "PALU" },
    { hash: "0x1b350b1a0b04f80af8b69003607155c80389fd13077c9321a4f4f7107ea30219", name: "BNB" }
  ];
  
  console.log("NEW MARKET ADDRESSES:\n");
  
  for (const tx of txs) {
    try {
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      
      // Get the transaction to find contract address
      const transaction = await ethers.provider.getTransaction(tx.hash);
      
      // Contract creation typically shows as `to` being null
      // The created contract address is in the receipt
      if (receipt.contractAddress) {
        console.log(`${tx.name}: ${receipt.contractAddress}`);
      } else if (receipt.logs && receipt.logs.length > 0) {
        // Parse logs to find MarketCreated event
        const factoryABI = [
          "event MarketCreated(address indexed market, string tokenName, bytes32 indexed queryId)"
        ];
        const iface = new ethers.Interface(factoryABI);
        
        for (const log of receipt.logs) {
          try {
            const parsed = iface.parseLog(log);
            if (parsed && parsed.name === "MarketCreated") {
              console.log(`${tx.name}: ${parsed.args.market}`);
              break;
            }
          } catch (e) {
            // Not the event we're looking for
          }
        }
      }
    } catch (error) {
      console.log(`${tx.name}: Error - ${error.message}`);
    }
  }
}

main().catch(console.error);

