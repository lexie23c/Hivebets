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
  const [resolver] = await ethers.getSigners();
  console.log("🔍 Resolving markets with account:", resolver.address);
  
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

  console.log("\n\n✅ All markets resolved!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

