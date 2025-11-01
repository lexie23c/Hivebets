const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Claiming refunds...\n");
  
  const [claimer] = await ethers.getSigners();
  console.log("Wallet:", claimer.address);
  console.log("Balance before:", ethers.formatEther(await ethers.provider.getBalance(claimer.address)), "BNB\n");

  const markets = [
    "0xd055f4D1af414E2880BA71f55024d0Ce44075AA4", // 币安人生
    "0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40", // BNB
  ];

  for (const address of markets) {
    console.log(`📍 ${address}`);
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", address);
      const tx = await contract.claim({ gasLimit: 200000 });
      console.log(`   TX: ${tx.hash}`);
      await tx.wait();
      console.log(`   ✅ Claimed!\n`);
    } catch (error) {
      console.log(`   ❌ ${error.message}\n`);
    }
  }

  console.log("Balance after:", ethers.formatEther(await ethers.provider.getBalance(claimer.address)), "BNB");
}

main().catch(console.error);

