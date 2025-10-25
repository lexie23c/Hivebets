const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying HivebetsOracle to BSC MAINNET");
  
  if (hre.network.name !== "bsc") {
    console.error("❌ Wrong network! This script is for BSC MAINNET only");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "BNB");

  console.log("\n📦 Deploying HivebetsOracle (TellorPlayground)...");
  const HivebetsOracle = await ethers.getContractFactory("TellorPlayground");
  const oracle = await HivebetsOracle.deploy();
  await oracle.waitForDeployment();
  
  const oracleAddress = await oracle.getAddress();
  console.log("✅ HivebetsOracle deployed to:", oracleAddress);
  
  console.log("\n📝 Next steps:");
  console.log("1. Update deployMainnetFactory.js with oracle address:");
  console.log(`   const tellorOracleAddress = "${oracleAddress}";`);
  console.log("\n2. Deploy factory:");
  console.log("   npx hardhat run scripts/deployMainnetFactory.js --network bsc");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

