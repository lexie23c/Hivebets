const hre = require("hardhat");
const { ethers } = hre;

/**
 * Deploy November 3rd Markets with x402 Gasless Betting Support
 * This script deploys new markets with BinaryMarketV2_X402 contract
 */

async function main() {
  console.log("\n🚀 DEPLOYING NOVEMBER 3 MARKETS WITH x402 SUPPORT\n");
  console.log("═══════════════════════════════════════════════════\n");

  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BNB\n");

  // Configuration
  const factoryAddress = "0xC3286F0649Df923CBDDEaC8032cC45C9A12D84b6"; // Your existing factory
  const tellorOracle = "0xD9157453E2668B2fc45b7A803D3FEF3642430cC0"; // BSC Mainnet Tellor
  const resolver = deployer.address; // You as resolver
  const facilitator = deployer.address; // Initially you, update later with dedicated facilitator wallet
  
  // Market parameters
  const maxPerWallet = ethers.parseEther("10"); // 10 BNB max per wallet
  const feeBps = 200; // 2% fee
  
  // November 3, 2025 deadlines (8PM ET = Nov 4 00:00 UTC, 10PM ET = Nov 4 02:00 UTC)
  const deadline8PM = Math.floor(new Date("2025-11-04T00:00:00Z").getTime() / 1000);
  const deadline10PM = Math.floor(new Date("2025-11-04T02:00:00Z").getTime() / 1000);

  console.log("⏰ Deadlines:");
  console.log("   8PM ET (Nov 3):", new Date(deadline8PM * 1000).toISOString());
  console.log("   10PM ET (Nov 3):", new Date(deadline10PM * 1000).toISOString());
  console.log("");

  // Get factory contract
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryAddress);
  console.log("✅ Connected to factory:", factoryAddress);
  console.log("");

  const markets = [];

  // ═══════════════════════════════════════════════════════════
  // MARKET 1: BNB → $1,300 (Nov 3, 8PM ET)
  // ═══════════════════════════════════════════════════════════
  console.log("📊 MARKET 1: BNB → $1,300");
  console.log("─────────────────────────────────────────────────");
  
  const bnbQueryId = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      ["SpotPrice", "bnb-usd"]
    )
  );

  console.log("Creating market...");
  const tx1 = await factory.createMarket(
    resolver,
    deadline8PM,
    maxPerWallet,
    feeBps,
    "BNB",
    "https://coinmarketcap.com/currencies/bnb/",
    ethers.parseUnits("1300", 8), // $1,300 with 8 decimals
    bnbQueryId
  );
  
  console.log("TX:", tx1.hash);
  const receipt1 = await tx1.wait();
  
  const event1 = receipt1.logs.find(log => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed && parsed.name === "MarketCreated";
    } catch (e) {
      return false;
    }
  });
  
  const market1Address = factory.interface.parseLog(event1).args.market;
  markets.push({ name: "BNB $1,300", address: market1Address });
  
  console.log("✅ Deployed:", market1Address);
  console.log("🔗 BSCScan:", `https://bscscan.com/address/${market1Address}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════
  // MARKET 2: 币安人生 → $400M (Nov 3, 10PM ET)
  // ═══════════════════════════════════════════════════════════
  console.log("📊 MARKET 2: 币安人生 → $400M");
  console.log("─────────────────────────────────────────────────");
  
  const binanceLifeQueryId = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      ["SpotPrice", "binance-life-usd-mcap"]
    )
  );

  console.log("Creating market...");
  const tx2 = await factory.createMarket(
    resolver,
    deadline10PM,
    maxPerWallet,
    feeBps,
    "币安人生",
    "https://www.dextools.io/app/en/bnb/pair-explorer/",
    ethers.parseUnits("400000000", 8), // $400M with 8 decimals
    binanceLifeQueryId
  );
  
  console.log("TX:", tx2.hash);
  const receipt2 = await tx2.wait();
  
  const event2 = receipt2.logs.find(log => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed && parsed.name === "MarketCreated";
    } catch (e) {
      return false;
    }
  });
  
  const market2Address = factory.interface.parseLog(event2).args.market;
  markets.push({ name: "币安人生 $400M", address: market2Address });
  
  console.log("✅ Deployed:", market2Address);
  console.log("🔗 BSCScan:", `https://bscscan.com/address/${market2Address}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════
  // MARKET 3: PALU → $40M (Nov 3, 8PM ET)
  // ═══════════════════════════════════════════════════════════
  console.log("📊 MARKET 3: PALU → $40M");
  console.log("─────────────────────────────────────────────────");
  
  const paluQueryId = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "string"],
      ["SpotPrice", "palu-usd-mcap"]
    )
  );

  console.log("Creating market...");
  const tx3 = await factory.createMarket(
    resolver,
    deadline8PM,
    maxPerWallet,
    feeBps,
    "PALU",
    "https://www.dextools.io/app/en/bnb/pair-explorer/",
    ethers.parseUnits("40000000", 8), // $40M with 8 decimals
    paluQueryId
  );
  
  console.log("TX:", tx3.hash);
  const receipt3 = await tx3.wait();
  
  const event3 = receipt3.logs.find(log => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed && parsed.name === "MarketCreated";
    } catch (e) {
      return false;
    }
  });
  
  const market3Address = factory.interface.parseLog(event3).args.market;
  markets.push({ name: "PALU $40M", address: market3Address });
  
  console.log("✅ Deployed:", market3Address);
  console.log("🔗 BSCScan:", `https://bscscan.com/address/${market3Address}`);
  console.log("");

  // ═══════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log("\n═══════════════════════════════════════════════════");
  console.log("🎉 ALL MARKETS DEPLOYED SUCCESSFULLY!");
  console.log("═══════════════════════════════════════════════════\n");

  markets.forEach((market, i) => {
    console.log(`${i + 1}. ${market.name}`);
    console.log(`   Address: ${market.address}`);
    console.log(`   BSCScan: https://bscscan.com/address/${market.address}`);
    console.log("");
  });

  console.log("📝 NEXT STEPS:");
  console.log("─────────────────────────────────────────────────");
  console.log("1. Update frontend contract addresses in:");
  console.log("   src/contracts/BinaryMarketV2.ts");
  console.log("");
  console.log("2. Copy these addresses:");
  markets.forEach((market, i) => {
    console.log(`   ${market.name}: "${market.address}"`);
  });
  console.log("");
  console.log("3. Set up x402 facilitator with these market addresses");
  console.log("");
  console.log("4. Update .env.local:");
  console.log("   NEXT_PUBLIC_X402_ENABLED=true");
  console.log("   NEXT_PUBLIC_X402_FACILITATOR_URL=your-url");
  console.log("");
  console.log("═══════════════════════════════════════════════════\n");

  return markets;
}

main()
  .then((markets) => {
    console.log("✅ Deployment complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

