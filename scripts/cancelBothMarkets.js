const hre = require("hardhat");
const { ethers } = hre;

async function cancelMarket(marketAddress, marketName) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔄 Cancelling ${marketName}: ${marketAddress}`);
  console.log("=".repeat(60));
  
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  try {
    // Connect to market (try V2 first, fallback to V2_Fixed)
    let market;
    try {
      market = await ethers.getContractAt("BinaryMarketV2", marketAddress);
    } catch (e) {
      try {
        market = await ethers.getContractAt("BinaryMarketV2_Fixed", marketAddress);
      } catch (e2) {
        throw new Error("Could not connect to market contract");
      }
    }
    
    // Check current state
    const state = await market.state();
    const stateNames = ["Open", "Resolved", "Cancelled"];
    console.log("Current state:", stateNames[Number(state)]);
    
    if (state !== 0n) { // 0 = Open
      console.log(`❌ ${marketName} is not open (state: ${stateNames[Number(state)]})`);
      return false;
    }
    
    // Check if signer is the resolver
    const resolver = await market.resolver();
    if (signerAddress.toLowerCase() !== resolver.toLowerCase()) {
      console.log("❌ You are not the resolver");
      console.log("   Resolver:", resolver);
      console.log("   Your address:", signerAddress);
      return false;
    }
    
    // Check pools
    const yesPool = await market.yesPool();
    const noPool = await market.noPool();
    const totalPool = yesPool + noPool;
    
    console.log("\n💰 Current Pools:");
    console.log("  YES:", ethers.formatEther(yesPool), "BNB");
    console.log("  NO:", ethers.formatEther(noPool), "BNB");
    console.log("  TOTAL:", ethers.formatEther(totalPool), "BNB");
    
    // Cancel the market
    console.log("\n⏳ Calling cancel()...");
    const tx = await market.cancel();
    console.log("Transaction submitted:", tx.hash);
    
    const receipt = await tx.wait();
    console.log(`✅ ${marketName} cancelled!`);
    console.log("Transaction:", receipt.hash);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    if (totalPool > 0n) {
      console.log(`\n📢 ${ethers.formatEther(totalPool)} BNB will be refunded to bettors`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error cancelling ${marketName}:`, error.message);
    return false;
  }
}

async function main() {
  const marketA = "0x93EAdFb94070e1EAc522A42188Ee3983df335088";
  const marketB = "0x72dE4848Ea51844215d2016867671D26f60b828A";
  
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  
  console.log("\n🚀 CANCELLING BOTH MARKETS");
  console.log("Using account:", signerAddress);
  
  const results = [];
  
  // Cancel Market A
  const resultA = await cancelMarket(marketA, "Market A");
  results.push({ name: "Market A", success: resultA, address: marketA });
  
  // Cancel Market B
  const resultB = await cancelMarket(marketB, "Market B");
  results.push({ name: "Market B", success: resultB, address: marketB });
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  
  results.forEach(result => {
    const status = result.success ? "✅ Cancelled" : "❌ Failed";
    console.log(`${result.name} (${result.address}): ${status}`);
  });
  
  const allSuccess = results.every(r => r.success);
  
  if (allSuccess) {
    console.log("\n🎉 All markets cancelled successfully!");
    console.log("\n📢 Next Steps:");
    console.log("  1. Announce to bettors that markets are cancelled");
    console.log("  2. Bettors should call market.claim() to get full refunds");
    console.log("  3. Each bettor gets back 100% of their stakes (YES + NO)");
  } else {
    console.log("\n⚠️  Some markets failed to cancel. Check errors above.");
  }
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
});

