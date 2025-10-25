const hre = require("hardhat");
const { ethers } = hre;

const MARKETS = [
  '0x4943c6a412f9fb97F777d23405dD19C6EA13AFa2',
  '0x011668087489cF88C073B5108Dd69D8d4A31dbB0',
  '0x7Bd48c17144CA796772938E195D01c22FF648698',
  '0x165953595A1a5B2FD85Fe3cfd88aF2Dc9B2f33Fb',
  '0x4AbaF267b8faCDcab81099a58D831caa9b921d8d'
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("💰 Hedging all markets with account:", signer.address);
  
  const marketABI = [
    "function bet(bool yes) external payable",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];

  for (let i = 0; i < MARKETS.length; i++) {
    console.log(`\n${i + 1}️⃣  Market ${i + 1}: ${MARKETS[i]}`);
    
    const market = await ethers.getContractAt(marketABI, MARKETS[i], signer);
    
    try {
      // Bet YES
      console.log("  📈 Betting 0.02 BNB on YES...");
      let tx = await market.bet(true, { 
        value: ethers.parseEther("0.02") 
      });
      await tx.wait();
      console.log("  ✅ YES bet placed");

      // Bet NO
      console.log("  📉 Betting 0.02 BNB on NO...");
      tx = await market.bet(false, { 
        value: ethers.parseEther("0.02") 
      });
      await tx.wait();
      console.log("  ✅ NO bet placed");

      const yesPool = await market.yesPool();
      const noPool = await market.noPool();
      console.log(`  💰 Pools: YES=${ethers.formatEther(yesPool)} BNB, NO=${ethers.formatEther(noPool)} BNB`);
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
    }
  }

  console.log("\n\n✅ All markets hedged!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

