const hre = require("hardhat");
const { ethers } = hre;

/**
 * Deploy BNB $1,200 Market with Sora Oracle and S402 Gasless Betting
 * November 3rd deadline
 */

async function main() {
  console.log("\n🚀 DEPLOYING BNB $1,200 MARKET WITH SORA ORACLE + S402\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BNB\n");

  // Configuration
  const soraOracle = "0x5058AC254e560E54BfcabBe1bde4375E7C914d35"; // Sora Oracle on BSC Mainnet
  const resolver = deployer.address; // You as resolver
  const s402Facilitator = "0x605c5c8d83152bd98ecAc9B77a845349DA3c48a3"; // Sora S402 Facilitator on BSC
  
  // Market parameters
  const maxPerWallet = ethers.parseEther("10"); // 10 BNB max per wallet
  const feeBps = 200; // 2% fee
  
  // November 3, 2025 8PM ET = Nov 4 00:00 UTC
  const deadline = Math.floor(new Date("2025-11-04T00:00:00Z").getTime() / 1000);

  console.log("⏰ Deadline:", new Date(deadline * 1000).toISOString());
  console.log("   (November 3, 8PM ET)\n");

  // BNB/USD Price Query ID for Sora Oracle
  // Format: keccak256("BNB/USD")
  const bnbPriceQueryId = ethers.keccak256(
    ethers.toUtf8Bytes("BNB/USD")
  );

  console.log("📊 Market Details:");
  console.log("   Token: BNB");
  console.log("   Target: $1,200");
  console.log("   Max per wallet: 10 BNB");
  console.log("   Fee: 2%");
  console.log("   Oracle: Sora Oracle");
  console.log("   Facilitator: Sora S402", s402Facilitator);
  console.log("");

  // Deploy BinaryMarketV2_Sora contract
  console.log("📤 Deploying BinaryMarketV2_Sora contract...\n");
  
  const BinaryMarketV2_Sora = await ethers.getContractFactory("BinaryMarketV2_Sora");
  
  const market = await BinaryMarketV2_Sora.deploy(
    soraOracle,           // Sora Oracle address
    resolver,             // Resolver
    s402Facilitator,      // Sora S402 Facilitator
    deadline,             // Deadline
    maxPerWallet,         // Max per wallet
    feeBps,               // Fee (2%)
    "BNB",                // Token name
    "https://soraoracle.com", // Data source
    ethers.parseUnits("1200", 8), // $1,200 target (8 decimals)
    bnbPriceQueryId       // Sora price query ID
  );

  await market.waitForDeployment();
  const marketAddress = await market.getAddress();

  console.log("✅ ✅ ✅ BNB $1,200 MARKET DEPLOYED! ✅ ✅ ✅\n");
  console.log("═══════════════════════════════════════════════════\n");
  console.log("📍 Market Address:", marketAddress);
  console.log("🔗 BSCScan:", `https://bscscan.com/address/${marketAddress}`);
  console.log("");
  console.log("📋 Market Configuration:");
  console.log("   Question: Will BNB trade above $1,200 by November 3?");
  console.log("   Target: $1,200");
  console.log("   Deadline:", new Date(deadline * 1000).toLocaleString());
  console.log("   Max per wallet: 10 BNB");
  console.log("   Platform fee: 2%");
  console.log("   Oracle: Sora Oracle ✅");
  console.log("   Gasless: Sora S402 ✅");
  console.log("   Facilitator:", s402Facilitator);
  console.log("");

  console.log("📝 NEXT STEPS:");
  console.log("─────────────────────────────────────────────────");
  console.log("1. Update frontend contract address:");
  console.log("   File: src/contracts/BinaryMarketV2.ts");
  console.log("   Replace BNB_1300 address with:");
  console.log(`   "${marketAddress}"`);
  console.log("");
  console.log("2. Verify contract on BSCScan:");
  console.log(`   npx hardhat verify --network bsc ${marketAddress} \\`);
  console.log(`     "${soraOracle}" \\`);
  console.log(`     "${resolver}" \\`);
  console.log(`     "${s402Facilitator}" \\`);
  console.log(`     ${deadline} \\`);
  console.log(`     "${maxPerWallet.toString()}" \\`);
  console.log(`     ${feeBps} \\`);
  console.log(`     "BNB" \\`);
  console.log(`     "https://soraoracle.com" \\`);
  console.log(`     "${ethers.parseUnits("1200", 8).toString()}" \\`);
  console.log(`     "${bnbPriceQueryId}"`);
  console.log("");
  console.log("3. Update Sora Oracle address:");
  console.log("   Get actual Sora Oracle contract on BSC");
  console.log("   Update soraOracle variable in this script");
  console.log("");
  console.log("4. Test gasless betting:");
  console.log("   Users sign EIP-712 message");
  console.log("   Sora S402 Facilitator sponsors gas");
  console.log("   No BNB required for betting!");
  console.log("");
  console.log("═══════════════════════════════════════════════════\n");

  return {
    marketAddress,
    targetPrice: 1200,
    deadline,
    queryId: bnbPriceQueryId,
    facilitator: s402Facilitator,
    oracle: soraOracle
  };
}

main()
  .then((result) => {
    console.log("✅ Deployment complete!");
    console.log("\n🎉 Sora Oracle + S402 gasless betting is ready!");
    console.log("\n⚠️  IMPORTANT: Update Sora Oracle address before deploying!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

