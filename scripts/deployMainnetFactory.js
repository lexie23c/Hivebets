const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying MarketFactoryV2 to BSC MAINNET");
  
  if (hre.network.name !== "bsc") {
    console.error("❌ Wrong network! This script is for BSC MAINNET only");
    console.error("Current network:", hre.network.name);
    console.error("Run with: npx hardhat run scripts/deployMainnetFactory.js --network bsc");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "BNB");
  
  if (balance < ethers.parseEther("0.1")) {
    console.error("❌ Insufficient BNB! Need at least 0.1 BNB for deployment");
    process.exit(1);
  }

  // HivebetsOracle deployed on BSC Mainnet
  const tellorOracleAddress = "0x01851D6C0a978296c7FC50f9326eB21fa9A32F87";
  
  console.log("\n🔮 Using HivebetsOracle:", tellorOracleAddress);
  
  console.log("\n📦 Deploying MarketFactoryV2...");
  const MarketFactoryV2 = await ethers.getContractFactory("MarketFactoryV2");
  const factory = await MarketFactoryV2.deploy(tellorOracleAddress);
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ MarketFactoryV2 deployed to:", factoryAddress);
  
  console.log("\n📝 Update deployMainnetMarkets.js with this address:");
  console.log(`   const factoryAddress = "${factoryAddress}";`);
  
  console.log("\n🔍 Verify on BSCScan:");
  console.log(`   npx hardhat verify --network bsc ${factoryAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

