const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const txHash = "0x84a4bc5ce8f569ad481b4b2653ad96e790eeaf41bf86deb18160898cda134067";
  
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  
  if (!receipt) {
    console.log("Transaction not found");
    return;
  }
  
  // The first log should be the MarketCreated event from the factory
  // Format: MarketCreated(address indexed market, string tokenName, bytes32 indexed queryId)
  
  console.log("Total logs:", receipt.logs.length);
  
  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    console.log(`\nLog ${i}:`);
    console.log("Address:", log.address);
    console.log("Topics:", log.topics);
    
    // MarketCreated event signature
    const eventSig = ethers.id("MarketCreated(address,string,bytes32)");
    
    if (log.topics[0] === eventSig) {
      // Second topic is the indexed market address
      const marketAddress = ethers.getAddress("0x" + log.topics[1].slice(26));
      console.log("\n✅ FOUND MARKET ADDRESS:", marketAddress);
      return;
    }
  }
  
  console.log("\nNo MarketCreated event found, checking contractAddress...");
  if (receipt.contractAddress) {
    console.log("Contract Address:", receipt.contractAddress);
  }
}

main().catch(console.error);

