const hre = require("hardhat");
const { ethers } = hre;

/**
 * Deploy BNB $1,200 Market with x402 Gasless Betting Support
 * November 3rd deadline
 */

async function main() {
  console.log("\n🚀 DEPLOYING BNB $1,200 MARKET WITH x402 SUPPORT\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BNB\n");

  // Configuration
  const tellorOracle = "0xD9157453E2668B2fc45b7A803D3FEF3642430cC0"; // BSC Mainnet Tellor
  const resolver = deployer.address; // You as resolver
  const facilitator = deployer.address; // Facilitator wallet (update with dedicated wallet later)
  
  // Market parameters
  const maxPerWallet = ethers.parseEther("10"); // 10 BNB max per wallet
  const feeBps = 200; // 2% fee
  
  // November 3, 2025 8PM ET = Nov 4 00:00 UTC
  const deadline = Math.floor(new Date("2025-11-04T00:00:00Z").getTime() / 1000);

  console.log("⏰ Deadline:", new Date(deadline * 1000).toISOString());
  console.log("   (November 3, 8PM ET)\n");

  // BNB Price Query ID
  const bnbQueryId = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      ["SpotPrice", "bnb-usd"]
    )
  );

  console.log("📊 Market Details:");
  console.log("   Token: BNB");
  console.log("   Target: $1,200");
  console.log("   Max per wallet: 10 BNB");
  console.log("   Fee: 2%");
  console.log("   Facilitator:", facilitator);
  console.log("");

  // Deploy BinaryMarketV2_X402 contract directly
  console.log("📤 Deploying BinaryMarketV2_X402 contract...\n");
  
  const BinaryMarketV2_X402 = await ethers.getContractFactory("BinaryMarketV2_X402");
  
  const market = await BinaryMarketV2_X402.deploy(
    tellorOracle,
    resolver,
    facilitator,
    deadline,
    maxPerWallet,
    feeBps,
    "BNB",
    "https://coinmarketcap.com/currencies/bnb/",
    ethers.parseUnits("1200", 8), // $1,200 with 8 decimals
    bnbQueryId
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
  console.log("   x402 Enabled: YES ✅");
  console.log("   Facilitator:", facilitator);
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
  console.log(`     "${tellorOracle}" \\`);
  console.log(`     "${resolver}" \\`);
  console.log(`     "${facilitator}" \\`);
  console.log(`     ${deadline} \\`);
  console.log(`     "${maxPerWallet.toString()}" \\`);
  console.log(`     ${feeBps} \\`);
  console.log(`     "BNB" \\`);
  console.log(`     "https://coinmarketcap.com/currencies/bnb/" \\`);
  console.log(`     "${ethers.parseUnits("1200", 8).toString()}" \\`);
  console.log(`     "${bnbQueryId}"`);
  console.log("");
  console.log("3. Start facilitator service:");
  console.log("   cd facilitator");
  console.log("   npm start");
  console.log("");
  console.log("4. Test x402 gasless betting at:");
  console.log("   http://localhost:3005");
  console.log("");
  console.log("═══════════════════════════════════════════════════\n");

  return {
    marketAddress,
    targetPrice: 1200,
    deadline,
    queryId: bnbQueryId,
    facilitator
  };
}

main()
  .then((result) => {
    console.log("✅ Deployment complete!");
    console.log("\n🎉 x402 gasless betting is now available!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

