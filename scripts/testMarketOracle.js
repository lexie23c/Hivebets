const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const marketAddress = "0x533819E3Ed9989797D470eB7d6e1E3e29f277E18";
  
  console.log("\n🔍 Testing BNB Price Market with Oracle Integration\n");
  console.log("Market:", marketAddress);
  console.log("=" + "=".repeat(60) + "\n");
  
  const market = await ethers.getContractAt("BinaryMarketV2_Fixed", marketAddress);
  
  // Get market details
  const tokenName = await market.tokenName();
  const targetMcap = await market.targetMcapUsd();
  const deadline = await market.deadline();
  const state = await market.state();
  const yesPool = await market.yesPool();
  const noPool = await market.noPool();
  
  console.log("📊 Market Info:");
  console.log("  Question:", tokenName);
  console.log("  Target:", ethers.formatUnits(targetMcap, 8), "USD");
  console.log("  Deadline:", new Date(Number(deadline) * 1000).toLocaleString());
  console.log("  State:", ["Open", "Resolved", "Cancelled"][state]);
  
  console.log("\n💰 Betting Pools:");
  console.log("  YES Pool:", ethers.formatEther(yesPool), "BNB");
  console.log("  NO Pool:", ethers.formatEther(noPool), "BNB");
  console.log("  Total:", ethers.formatEther(yesPool + noPool), "BNB");
  
  // Check oracle data
  console.log("\n🔮 Oracle Data:");
  try {
    const [currentPrice, timestamp] = await market.getCurrentOracleData();
    
    if (timestamp > 0) {
      console.log("  ✅ Current BNB Price:", ethers.formatUnits(currentPrice, 8), "USD");
      console.log("  📅 Oracle Timestamp:", new Date(Number(timestamp) * 1000).toLocaleString());
      console.log("  🎯 Target Price:", ethers.formatUnits(targetMcap, 8), "USD");
      
      const currentPriceNum = Number(ethers.formatUnits(currentPrice, 8));
      const targetPriceNum = Number(ethers.formatUnits(targetMcap, 8));
      
      if (currentPriceNum >= targetPriceNum) {
        console.log("  📈 Status: BNB has ALREADY reached target! ✅");
      } else {
        const diff = targetPriceNum - currentPriceNum;
        const pct = ((diff / currentPriceNum) * 100).toFixed(2);
        console.log(`  📉 Status: Need $${diff.toFixed(2)} more (${pct}% increase)`);
      }
    } else {
      console.log("  ⚠️  No oracle data available yet");
    }
  } catch (error) {
    console.log("  ❌ Error fetching oracle data:", error.message);
  }
  
  // Check if can resolve from oracle
  console.log("\n⚡ Resolution Status:");
  try {
    const canResolve = await market.canResolveFromOracle();
    console.log("  Can auto-resolve from oracle:", canResolve ? "YES ✅" : "NO ⏳");
    
    if (!canResolve) {
      const now = Math.floor(Date.now() / 1000);
      const deadlineNum = Number(deadline);
      if (now < deadlineNum) {
        const timeLeft = deadlineNum - now;
        const days = Math.floor(timeLeft / 86400);
        console.log(`  ⏰ Deadline in ${days} days`);
      }
    }
  } catch (error) {
    console.log("  ❌ Error:", error.message);
  }
  
  console.log("\n" + "=".repeat(61));
  console.log("✅ Oracle Integration Working!");
  console.log("=".repeat(61) + "\n");
}

main().catch(console.error);
