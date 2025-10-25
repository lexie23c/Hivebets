const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [claimer] = await ethers.getSigners();
  console.log("🎯 Testing claim on resolved market");
  console.log("Claimer:", claimer.address);
  
  // Test on Pluto market where we won YES
  const marketAddress = "0x78B2b59DF95090Dc4848645182c171f81829fBBB";
  
  const marketABI = [
    "function claim() external",
    "function state() view returns (uint8)",
    "function finalOutcome() view returns (uint8)",
    "function yesStake(address) view returns (uint256)",
    "function noStake(address) view returns (uint256)",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];
  
  const market = await ethers.getContractAt(marketABI, marketAddress, claimer);
  
  console.log("\n📊 Market State:");
  const state = await market.state();
  console.log("State:", state === 0n ? "Open" : state === 1n ? "Resolved" : "Cancelled");
  
  const outcome = await market.finalOutcome();
  console.log("Outcome:", outcome === 1n ? "YES won" : outcome === 2n ? "NO won" : "Undecided");
  
  const yesStake = await market.yesStake(claimer.address);
  const noStake = await market.noStake(claimer.address);
  console.log("Your YES stake:", ethers.formatEther(yesStake), "BNB");
  console.log("Your NO stake:", ethers.formatEther(noStake), "BNB");
  
  const yesPool = await market.yesPool();
  const noPool = await market.noPool();
  console.log("YES Pool:", ethers.formatEther(yesPool), "BNB");
  console.log("NO Pool:", ethers.formatEther(noPool), "BNB");
  
  if (state !== 1n) {
    console.log("\n❌ Market not resolved yet");
    return;
  }
  
  if (yesStake === 0n && noStake === 0n) {
    console.log("\n❌ No stakes to claim (already claimed or never bet)");
    return;
  }
  
  const didWin = (outcome === 1n && yesStake > 0n) || (outcome === 2n && noStake > 0n);
  if (!didWin) {
    console.log("\n❌ You didn't win this market");
    return;
  }
  
  console.log("\n✅ You WON! Attempting to claim...");
  
  try {
    const balanceBefore = await ethers.provider.getBalance(claimer.address);
    console.log("Balance before:", ethers.formatEther(balanceBefore), "BNB");
    
    const tx = await market.claim();
    console.log("Transaction hash:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Claim successful! Gas used:", receipt.gasUsed.toString());
    
    const balanceAfter = await ethers.provider.getBalance(claimer.address);
    console.log("Balance after:", ethers.formatEther(balanceAfter), "BNB");
    console.log("Net gain:", ethers.formatEther(balanceAfter - balanceBefore), "BNB");
    
  } catch (error) {
    console.error("\n❌ Claim failed:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

