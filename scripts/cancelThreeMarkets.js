const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🔴 Cancelling markets for Oct 31 redeployment...\n");
  
  const [owner] = await ethers.getSigners();
  console.log("Cancelling from:", owner.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(owner.address)), "BNB\n");

  // The 3 markets to cancel
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

  for (const market of markets) {
    console.log(`📍 Cancelling: ${market.name}`);
    console.log(`   Address: ${market.address}`);
    
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", market.address);
      
      // Check current state
      const state = await contract.state();
      console.log(`   Current state: ${state} (0=Open, 1=Resolved, 2=Cancelled)`);
      
      if (state === 2) {
        console.log(`   ⚠️  Already cancelled, skipping...\n`);
        continue;
      }
      
      // Cancel the market
      console.log(`   Calling cancel()...`);
      const tx = await contract.cancel({
        gasLimit: 200000
      });
      
      console.log(`   TX: ${tx.hash}`);
      await tx.wait();
      console.log(`   ✅ Cancelled!\n`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log("🎯 Done! Users can now claim refunds.");
  console.log("   Next: Deploy new markets with Oct 31 deadlines");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

