const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Claiming refunds from cancelled markets...\n");
  
  const [claimer] = await ethers.getSigners();
  console.log("Claiming to:", claimer.address);
  
  const balanceBefore = await ethers.provider.getBalance(claimer.address);
  console.log("Balance before:", ethers.formatEther(balanceBefore), "BNB\n");

  // The 3 cancelled markets
  const markets = [
    {
      name: "币安人生 → $400M",
      address: "0xd055f4D1af414E2880BA71f55024d0Ce44075AA4"
    },
    {
      name: "PALU → $40M",
      address: "0xc838f181FE484628cd5fe2eF4c64890D979B480C"
    },
    {
      name: "BNB → $1,300",
      address: "0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40"
    }
  ];

  let totalRefunded = BigInt(0);

  for (const market of markets) {
    console.log(`📍 ${market.name}`);
    console.log(`   Address: ${market.address}`);
    
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", market.address);
      
      // Check user's stakes
      const yesStake = await contract.yesStake(claimer.address);
      const noStake = await contract.noStake(claimer.address);
      const totalStake = yesStake + noStake;
      
      console.log(`   Your YES stake: ${ethers.formatEther(yesStake)} BNB`);
      console.log(`   Your NO stake: ${ethers.formatEther(noStake)} BNB`);
      console.log(`   Total to refund: ${ethers.formatEther(totalStake)} BNB`);
      
      if (totalStake === BigInt(0)) {
        console.log(`   ⚠️  No funds to claim\n`);
        continue;
      }
      
      // Claim refund
      console.log(`   Calling claim()...`);
      const tx = await contract.claim({
        gasLimit: 200000
      });
      
      console.log(`   TX: ${tx.hash}`);
      await tx.wait();
      console.log(`   ✅ Refunded ${ethers.formatEther(totalStake)} BNB!\n`);
      
      totalRefunded += totalStake;
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  const balanceAfter = await ethers.provider.getBalance(claimer.address);
  console.log("\n═══════════════════════════════════════");
  console.log("💰 REFUND COMPLETE!");
  console.log("═══════════════════════════════════════");
  console.log("Total refunded:", ethers.formatEther(totalRefunded), "BNB");
  console.log("Balance before:", ethers.formatEther(balanceBefore), "BNB");
  console.log("Balance after:", ethers.formatEther(balanceAfter), "BNB");
  console.log("Net change:", ethers.formatEther(balanceAfter - balanceBefore), "BNB (includes gas fees)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

