const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // ⚠️ REPLACE THIS with your actual market address
  const marketAddress = "0x99991c4a14e1EBDBDdcd7bfb571542D43F355634";
  
  console.log("🔄 Cancelling market:", marketAddress);
  
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();
  console.log("Using account:", signerAddress);
  
  // Connect to market
  const market = await ethers.getContractAt("BinaryMarketV2_Fixed", marketAddress);
  
  // Check current state
  const state = await market.state();
  const stateNames = ["Open", "Resolved", "Cancelled"];
  console.log("Current state:", stateNames[Number(state)]);
  
  if (state !== 0n) { // 0 = Open
    console.log("❌ Market is not open, cannot cancel");
    return;
  }
  
  // Check if signer is the resolver
  const resolver = await market.resolver();
  if (signerAddress.toLowerCase() !== resolver.toLowerCase()) {
    console.log("❌ You are not the resolver");
    console.log("   Resolver:", resolver);
    console.log("   Your address:", signerAddress);
    return;
  }
  
  // Check deadline
  const deadline = await market.deadline();
  const now = BigInt(Math.floor(Date.now() / 1000));
  
  if (now >= deadline) {
    console.log("❌ Cannot cancel: deadline has passed");
    console.log("   Deadline:", new Date(Number(deadline) * 1000).toISOString());
    return;
  }
  
  // Check pools
  const yesPool = await market.yesPool();
  const noPool = await market.noPool();
  const totalPool = yesPool + noPool;
  
  console.log("\n💰 Current Pools:");
  console.log("  YES:", ethers.formatEther(yesPool), "BNB");
  console.log("  NO:", ethers.formatEther(noPool), "BNB");
  console.log("  TOTAL:", ethers.formatEther(totalPool), "BNB");
  
  if (totalPool === 0n) {
    console.log("\n✅ No bets placed yet, safe to cancel");
  } else {
    console.log("\n⚠️  Bettors will need to call claim() to get their refunds");
  }
  
  // Cancel the market
  console.log("\n⏳ Calling cancel()...");
  const tx = await market.cancel();
  console.log("Transaction submitted:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("\n✅ Market cancelled!");
  console.log("Transaction:", receipt.hash);
  console.log("Gas used:", receipt.gasUsed.toString());
  
  console.log("\n📢 Next steps:");
  if (totalPool > 0n) {
    console.log("  1. Announce to bettors that market is cancelled");
    console.log("  2. Bettors should call market.claim() to get full refunds");
    console.log("  3. Each bettor gets back their YES + NO stakes");
  }
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
});

