const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("\n🚀 DEPLOYING BNB $1,200 MARKET WITH SORA ORACLE + S402\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BNB\n");

  // Configuration
  const soraOracle = "0x5058AC254e560E54BfcabBe1bde4375E7C914d35"; // Sora Oracle on BSC
  const resolver = deployer.address;
  const s402Facilitator = "0xC504820639393874780DD774F43bA340BDFd16Bd"; // YOUR facilitator
  
  // Market parameters
  const maxPerWallet = ethers.parseEther("10");
  const feeBps = 200; // 2% fee
  
  // November 3, 2025 8PM ET = Nov 4 00:00 UTC
  const deadline = Math.floor(new Date("2025-11-04T00:00:00Z").getTime() / 1000);

  console.log("⏰ Deadline:", new Date(deadline * 1000).toISOString());
  console.log("📍 Facilitator:", s402Facilitator, "\n");

  // BNB/USD Price Query ID
  const bnbPriceQueryId = ethers.keccak256(ethers.toUtf8Bytes("BNB/USD"));

  console.log("📊 Market Details:");
  console.log("   Token: BNB");
  console.log("   Target: $1,200");
  console.log("   Max per wallet: 10 BNB");
  console.log("   Fee: 2%");
  console.log("   Oracle: Sora Oracle");
  console.log("   Facilitator: YOUR S402", s402Facilitator);
  console.log("");

  console.log("📤 Deploying BinaryMarketV2_Sora contract...\n");
  
  const BinaryMarketV2_Sora = await ethers.getContractFactory("BinaryMarketV2_Sora");
  
  const market = await BinaryMarketV2_Sora.deploy(
    soraOracle,
    resolver,
    s402Facilitator,
    deadline,
    maxPerWallet,
    feeBps,
    "BNB",
    "https://soraoracle.com",
    ethers.parseUnits("1200", 8),
    bnbPriceQueryId
  );

  await market.waitForDeployment();
  const marketAddress = await market.getAddress();

  console.log("✅ ✅ ✅ BNB $1,200 MARKET DEPLOYED! ✅ ✅ ✅\n");
  console.log("═══════════════════════════════════════════════════\n");
  console.log("📍 Market Address:", marketAddress);
  console.log("🔗 BSCScan:", `https://bscscan.com/address/${marketAddress}`);
  console.log("");
  console.log("📋 UPDATE FRONTEND:");
  console.log("   File: src/contracts/BinaryMarketV2.ts");
  console.log("   Replace address with:", marketAddress);
  console.log("");
  console.log("🎉 S402 GASLESS BETTING IS READY!");
  console.log("   Facilitator:", s402Facilitator);
  console.log("   Users sign messages - NO GAS REQUIRED!");
  console.log("");

  return { marketAddress, facilitator: s402Facilitator };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
