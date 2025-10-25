const hre = require("hardhat");
const { ethers } = hre;

const MARKETS = [
  { address: '0x78B2b59DF95090Dc4848645182c171f81829fBBB', name: 'Pluto' },
  { address: '0x4db864C04652e7F167c7A08e62b0EDAc276DCd42', name: '红包' },
  { address: '0x90a4Bad353ec27B9A8eb13445982ccab41f1D161', name: 'BNB $1,167' },
  { address: '0xdF17E23CADF9130656FDBC2C73680546Ea34F7cD', name: 'BNB $1,200' },
  { address: '0x6C7571424a70f627E66287A2e532F42599931792', name: 'BNB $1,250' }
];

async function main() {
  const [resolver] = await ethers.getSigners();
  console.log("🔍 Resolving all 5-minute markets");
  console.log("Resolver:", resolver.address);
  
  const marketABI = [
    "function resolve(bool tokenReachedTarget) external",
    "function state() view returns (uint8)",
    "function finalOutcome() view returns (uint8)",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];

  for (let i = 0; i < MARKETS.length; i++) {
    const market = MARKETS[i];
    console.log(`\n${i + 1}️⃣  ${market.name} (${market.address})`);
    
    const contract = await ethers.getContractAt(marketABI, market.address, resolver);
    
    try {
      const state = await contract.state();
      console.log(`  📊 State: ${state === 0n ? 'Open' : state === 1n ? 'Resolved' : 'Cancelled'}`);

      if (state === 0n) {
        const yesPool = await contract.yesPool();
        const noPool = await contract.noPool();
        const yesWon = yesPool > noPool;
        
        console.log(`  💰 YES Pool: ${ethers.formatEther(yesPool)} BNB`);
        console.log(`  💰 NO Pool: ${ethers.formatEther(noPool)} BNB`);
        console.log(`  🏆 Resolving as: ${yesWon ? 'YES' : 'NO'} wins`);
        
        const tx = await contract.resolve(yesWon);
        await tx.wait();
        console.log(`  ✅ Resolved!`);
      } else {
        const outcome = await contract.finalOutcome();
        console.log(`  ✅ Already resolved: ${outcome === 1n ? 'YES' : outcome === 2n ? 'NO' : 'Undecided'}`);
      }
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
    }
  }

  console.log("\n\n✅ All markets resolved! Refresh browser to claim winnings!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

