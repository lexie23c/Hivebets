const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const factoryAddress = "0xe8D17FDcddc3293bDD4568198d25E9657Fd23Fe9";
  
  console.log("\n🔍 Checking Factory Deployment\n");
  console.log("Address:", factoryAddress);
  
  const code = await ethers.provider.getCode(factoryAddress);
  
  if (code === "0x") {
    console.log("❌ No contract deployed at this address!");
    console.log("\n💡 You need to deploy the factory first:");
    console.log("   npx hardhat run scripts/deployFactoryV2.js --network bsctest");
  } else {
    console.log("✅ Contract found!");
    console.log("Code length:", code.length, "bytes");
  }
}

main().catch(console.error);
