const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [signer] = await ethers.getSigners();
  
  const marketAddress = "0xC76816898d32B76b941f0548734AFfe4A0A424BA";
  const betAmount = ethers.parseEther("0.01");
  const betOnYes = true;
  
  console.log("🎲 Placing test bet...");
  console.log("Market:", marketAddress);
  console.log("Amount:", ethers.formatEther(betAmount), "BNB");
  console.log("Side:", betOnYes ? "YES" : "NO");
  console.log("From:", signer.address);
  
  const market = await ethers.getContractAt("BinaryMarketV2_Fixed", marketAddress);
  
  // Place bet
  const tx = await market.bet(betOnYes, { value: betAmount });
  console.log("\n⏳ Transaction sent:", tx.hash);
  
  await tx.wait();
  console.log("✅ Bet placed successfully!");
  
  // Check new stakes
  const yesStake = await market.yesStake(signer.address);
  const noStake = await market.noStake(signer.address);
  const yesPool = await market.yesPool();
  const noPool = await market.noPool();
  
  console.log("\n📊 Your Stakes:");
  console.log("  YES:", ethers.formatEther(yesStake), "BNB");
  console.log("  NO:", ethers.formatEther(noStake), "BNB");
  
  console.log("\n💰 Total Pools:");
  console.log("  YES Pool:", ethers.formatEther(yesPool), "BNB");
  console.log("  NO Pool:", ethers.formatEther(noPool), "BNB");
  
  // Calculate odds
  const total = yesPool + noPool;
  if (total > 0n) {
    const yesOdds = (Number(yesPool) / Number(total) * 100).toFixed(1);
    const noOdds = (100 - parseFloat(yesOdds)).toFixed(1);
    console.log("\n📈 Current Odds:");
    console.log("  YES:", yesOdds + "%");
    console.log("  NO:", noOdds + "%");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

