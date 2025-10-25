const hre = require("hardhat");
const { ethers } = hre;

const MARKETS = [
  { address: '0x4943c6a412f9fb97F777d23405dD19C6EA13AFa2', name: '哈基米' },
  { address: '0x011668087489cF88C073B5108Dd69D8d4A31dbB0', name: '币安人生' },
  { address: '0x7Bd48c17144CA796772938E195D01c22FF648698', name: '$4' },
  { address: '0x165953595A1a5B2FD85Fe3cfd88aF2Dc9B2f33Fb', name: 'BNB Price' },
  { address: '0x4AbaF267b8faCDcab81099a58D831caa9b921d8d', name: 'CZ Tweet' }
];

const BETS = [
  { marketIdx: 0, side: true, amount: "0.03" },   // 哈基米 - YES
  { marketIdx: 1, side: false, amount: "0.04" },  // 币安人生 - NO
  { marketIdx: 2, side: true, amount: "0.05" },   // $4 - YES
  { marketIdx: 3, side: false, amount: "0.02" },  // BNB Price - NO
  { marketIdx: 4, side: true, amount: "0.03" },   // CZ Tweet - YES
  { marketIdx: 0, side: false, amount: "0.02" },  // 哈基米 - NO (counter)
  { marketIdx: 2, side: false, amount: "0.03" },  // $4 - NO (counter)
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("🎲 Placing bets with account:", signer.address);
  
  const marketABI = [
    "function bet(bool yes) external payable",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];

  for (let i = 0; i < BETS.length; i++) {
    const bet = BETS[i];
    const market = MARKETS[bet.marketIdx];
    
    console.log(`\n${i + 1}️⃣  Betting ${bet.amount} BNB on ${bet.side ? 'YES' : 'NO'} - ${market.name}`);
    
    const contract = await ethers.getContractAt(marketABI, market.address, signer);
    
    try {
      const tx = await contract.bet(bet.side, { 
        value: ethers.parseEther(bet.amount) 
      });
      await tx.wait();
      
      const yesPool = await contract.yesPool();
      const noPool = await contract.noPool();
      const total = yesPool + noPool;
      const yesPercent = total > 0n ? (yesPool * 100n / total) : 50n;
      const noPercent = total > 0n ? (noPool * 100n / total) : 50n;
      
      console.log(`  ✅ Bet placed!`);
      console.log(`  💰 Pools: YES=${ethers.formatEther(yesPool)} (${yesPercent}%) | NO=${ethers.formatEther(noPool)} (${noPercent}%)`);
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
    }
  }

  console.log("\n\n✅ All bets placed!");
  console.log("🔄 Refresh your browser to see updated odds!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

