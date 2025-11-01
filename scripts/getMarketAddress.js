const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const txHash = "0x84a4bc5ce8f569ad481b4b2653ad96e790eeaf41bf86deb18160898cda134067";
  
  console.log("Fetching transaction receipt...");
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  
  if (!receipt) {
    console.log("Transaction not found or not confirmed yet");
    return;
  }
  
  console.log("\nTransaction Receipt:");
  console.log("Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
  console.log("Block:", receipt.blockNumber);
  console.log("Gas Used:", receipt.gasUsed.toString());
  
  // Get the factory contract
  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  const factory = await ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);
  
  console.log("\nParsing logs...");
  
  // Find the MarketCreated event
  for (const log of receipt.logs) {
    try {
      const parsed = factory.interface.parseLog({
        topics: log.topics,
        data: log.data
      });
      
      if (parsed && parsed.name === "MarketCreated") {
        console.log("\n🎉 FOUND MARKET!");
        console.log("════════════════════════════════════════");
        console.log("Market Address:", parsed.args.market);
        console.log("Token Name:", parsed.args.tokenName);
        console.log("Query ID:", parsed.args.queryId);
        console.log("════════════════════════════════════════");
        console.log("\n📝 Update your frontend:");
        console.log(`BINANCE_LIFE: { address: "${parsed.args.market}" }`);
        console.log("\nView on BSCScan: https://bscscan.com/address/" + parsed.args.market);
        return;
      }
    } catch (e) {
      // Skip logs that don't match
      continue;
    }
  }
  
  console.log("No MarketCreated event found in logs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

