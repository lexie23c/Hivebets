const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Claiming for user wallet...\n");
  
  // IMPORTANT: This script needs to be run by the USER with their private key
  // You'll need to temporarily add the user's private key to .env as PRIVATE_KEY
  
  const [signer] = await ethers.getSigners();
  console.log("Claiming with:", signer.address);
  console.log("Balance before:", ethers.formatEther(await ethers.provider.getBalance(signer.address)), "BNB\n");

  const markets = [
    {
      name: "币安人生 → $400M",
      address: "0xd055f4D1af414E2880BA71f55024d0Ce44075AA4",
      expected: "0.05"
    },
    {
      name: "BNB → $1,300",
      address: "0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40",
      expected: "0.03"
    }
  ];

  let totalClaimed = BigInt(0);

  for (const market of markets) {
    console.log(`📍 ${market.name}`);
    console.log(`   Expected: ${market.expected} BNB`);
    
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", market.address);
      
      const tx = await contract.claim({
        gasLimit: 200000
      });
      
      console.log(`   TX: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`   ✅ Claimed! Gas: ${receipt.gasUsed.toString()}\n`);
      
      totalClaimed += ethers.parseEther(market.expected);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  const balanceAfter = await ethers.provider.getBalance(signer.address);
  console.log("\n💰 COMPLETE!");
  console.log("Balance after:", ethers.formatEther(balanceAfter), "BNB");
  console.log("Total claimed (estimated):", ethers.formatEther(totalClaimed), "BNB");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

