const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking user stakes on cancelled markets...\n");
  
  const userAddress = "0x42d81B6E8bC1DC37cc169A76337808b62BA57aE7";
  
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

  let totalToRefund = BigInt(0);

  for (const market of markets) {
    console.log(`📍 ${market.name}`);
    console.log(`   Address: ${market.address}`);
    
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", market.address);
      
      // Check state
      const state = await contract.state();
      console.log(`   State: ${state} (0=Open, 1=Resolved, 2=Cancelled)`);
      
      // Check user's stakes
      const yesStake = await contract.yesStake(userAddress);
      const noStake = await contract.noStake(userAddress);
      const totalStake = yesStake + noStake;
      
      console.log(`   YES stake: ${ethers.formatEther(yesStake)} BNB`);
      console.log(`   NO stake: ${ethers.formatEther(noStake)} BNB`);
      console.log(`   TOTAL: ${ethers.formatEther(totalStake)} BNB`);
      
      if (totalStake > 0) {
        console.log(`   ✅ Has funds to claim!`);
        totalToRefund += totalStake;
      } else {
        console.log(`   ❌ No funds to claim`);
      }
      console.log();
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log("═══════════════════════════════════════");
  console.log("Total available to claim:", ethers.formatEther(totalToRefund), "BNB");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

