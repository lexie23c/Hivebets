const hre = require("hardhat");
const { ethers } = hre;

const MARKETS = [
  { address: '0x4943c6a412f9fb97F777d23405dD19C6EA13AFa2', name: '哈基米' },
  { address: '0x011668087489cF88C073B5108Dd69D8d4A31dbB0', name: '币安人生' },
  { address: '0x7Bd48c17144CA796772938E195D01c22FF648698', name: '$4' },
  { address: '0x165953595A1a5B2FD85Fe3cfd88aF2Dc9B2f33Fb', name: 'BNB Price' },
  { address: '0x4AbaF267b8faCDcab81099a58D831caa9b921d8d', name: 'CZ Tweet' }
];

async function main() {
  const [claimer] = await ethers.getSigners();
  console.log("💰 Claiming winnings with account:", claimer.address);
  
  const balanceBefore = await ethers.provider.getBalance(claimer.address);
  console.log("💵 Balance before:", ethers.formatEther(balanceBefore), "BNB\n");
  
  const marketABI = [
    "function claim() external",
    "function state() view returns (uint8)",
    "function finalOutcome() view returns (uint8)",
    "function yesStake(address) view returns (uint256)",
    "function noStake(address) view returns (uint256)",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];

  let totalClaimed = 0n;

  for (let i = 0; i < MARKETS.length; i++) {
    const market = MARKETS[i];
    console.log(`${i + 1}️⃣  ${market.name}`);
    
    const contract = await ethers.getContractAt(marketABI, market.address, claimer);
    
    try {
      const state = await contract.state();
      
      if (state !== 1n) {
        console.log(`  ⏸️  Not resolved yet\n`);
        continue;
      }
      
      const outcome = await contract.finalOutcome();
      const yesStake = await contract.yesStake(claimer.address);
      const noStake = await contract.noStake(claimer.address);
      
      console.log(`  🏆 Winner: ${outcome === 1n ? 'YES' : 'NO'}`);
      console.log(`  💵 Your YES stake: ${ethers.formatEther(yesStake)} BNB`);
      console.log(`  💵 Your NO stake: ${ethers.formatEther(noStake)} BNB`);
      
      if (yesStake === 0n && noStake === 0n) {
        console.log(`  ⏭️  No stakes in this market\n`);
        continue;
      }
      
      const tx = await contract.claim();
      const receipt = await tx.wait();
      
      // Calculate claimed amount from balance change
      const balanceAfter = await ethers.provider.getBalance(claimer.address);
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      const claimed = balanceAfter - balanceBefore + gasCost;
      totalClaimed += claimed;
      
      console.log(`  ✅ Claimed: ${ethers.formatEther(claimed)} BNB\n`);
    } catch (error) {
      console.error(`  ❌ Error:`, error.message, "\n");
    }
  }

  const balanceAfter = await ethers.provider.getBalance(claimer.address);
  console.log("\n💰 Summary:");
  console.log("  Balance before:", ethers.formatEther(balanceBefore), "BNB");
  console.log("  Balance after:", ethers.formatEther(balanceAfter), "BNB");
  console.log("  Net change:", ethers.formatEther(balanceAfter - balanceBefore), "BNB");
  console.log("\n✅ All winnings claimed!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

