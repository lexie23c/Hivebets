const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying MAINNET Markets");
  console.log("Deployer:", deployer.address);
  console.log("Network:", hre.network.name);
  
  if (hre.network.name !== "bsc") {
    console.error("❌ Wrong network! This script is for BSC MAINNET only");
    console.error("Run with: npx hardhat run scripts/deployMainnetMarkets.js --network bsc");
    process.exit(1);
  }

  const factoryAddress = "0xC5aDeB8E57B3bE1fe91a900a845165eFe790cA47";
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryAddress);
  
  // Convert deadlines to Unix timestamps (ET to UTC+0)
  // October 26, 8PM ET = October 27, 12:00 AM UTC
  const oct26_8pm = Math.floor(new Date("2025-10-27T00:00:00Z").getTime() / 1000);
  // October 26, 10PM ET = October 27, 2:00 AM UTC
  const oct26_10pm = Math.floor(new Date("2025-10-27T02:00:00Z").getTime() / 1000);
  // October 31, 8PM ET = November 1, 12:00 AM UTC
  const oct31_8pm = Math.floor(new Date("2025-11-01T00:00:00Z").getTime() / 1000);
  // October 31, 10PM ET = November 1, 2:00 AM UTC
  const oct31_10pm = Math.floor(new Date("2025-11-01T02:00:00Z").getTime() / 1000);

  console.log("\n⏰ Deadlines:");
  console.log("Oct 26 8PM ET:", new Date(oct26_8pm * 1000).toLocaleString());
  console.log("Oct 26 10PM ET:", new Date(oct26_10pm * 1000).toLocaleString());
  console.log("Oct 31 8PM ET:", new Date(oct31_8pm * 1000).toLocaleString());
  console.log("Oct 31 10PM ET:", new Date(oct31_10pm * 1000).toLocaleString());
  console.log("");

  const markets = [];

  // Market 1: BNB > $1300 by Oct 26 8PM ET
  console.log("1️⃣  Creating BNB → $1,300 market...");
  let tx = await factory.createMarket(
    deployer.address,
    oct26_8pm,
    ethers.parseEther("10"), // 10 BNB max bet for mainnet
    200, // 2% fee
    "Will BNB trade above $1,300?",
    "https://www.binance.com/en/price/bnb",
    ethers.parseUnits("1300", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-USD-1300"))
  );
  let receipt = await tx.wait();
  const event1 = receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  });
  markets.push({ name: "BNB → $1,300", address: factory.interface.parseLog(event1).args.market });
  console.log("✅", markets[0].address);

  // Market 2: 币安人生 (Binancers) → $300M market cap by Oct 26 10PM ET
  console.log("\n2️⃣  Creating 币安人生 → $300M market...");
  tx = await factory.createMarket(
    deployer.address,
    oct26_10pm,
    ethers.parseEther("10"),
    200,
    "Will 币安人生 reach $300M market cap?",
    "https://dexscreener.com/bsc/0x924fa68a0fc644485b8df8abfa0a41c2e7744444",
    ethers.parseUnits("300000000", 8), // $300M
    ethers.keccak256(ethers.toUtf8Bytes("BINANCERS-MCAP-300M"))
  );
  receipt = await tx.wait();
  const event2 = receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  });
  markets.push({ name: "币安人生 → $300M", address: factory.interface.parseLog(event2).args.market });
  console.log("✅", markets[1].address);

  // Market 3: CZ tweet about Aster by Oct 31 8PM ET
  console.log("\n3️⃣  Creating CZ Tweet Aster market...");
  tx = await factory.createMarket(
    deployer.address,
    oct31_8pm,
    ethers.parseEther("10"),
    200,
    "Will CZ tweet about Aster?",
    "https://twitter.com/cz_binance",
    ethers.parseUnits("1", 8), // Boolean: 1 = yes, 0 = no
    ethers.keccak256(ethers.toUtf8Bytes("CZ-TWEET-ASTER"))
  );
  receipt = await tx.wait();
  const event3 = receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  });
  markets.push({ name: "CZ Tweet Aster", address: factory.interface.parseLog(event3).args.market });
  console.log("✅", markets[2].address);

  // Market 4: PALU trading above $40M by Oct 26 8PM ET
  console.log("\n4️⃣  Creating PALU → $40M market...");
  tx = await factory.createMarket(
    deployer.address,
    oct26_8pm,
    ethers.parseEther("10"),
    200,
    "Will PALU trade above $40M?",
    "https://dexscreener.com/bsc/0x02e75d28a8aa2a0033b8cf866fcf0bb0e1ee4444",
    ethers.parseUnits("40000000", 8), // $40M
    ethers.keccak256(ethers.toUtf8Bytes("PALU-MCAP-40M"))
  );
  receipt = await tx.wait();
  const event4 = receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  });
  markets.push({ name: "PALU → $40M", address: factory.interface.parseLog(event4).args.market });
  console.log("✅", markets[3].address);

  // Market 5: $4 getting Binance spot listing by Oct 31 10PM ET
  console.log("\n5️⃣  Creating $4 Spot Listing market...");
  tx = await factory.createMarket(
    deployer.address,
    oct31_10pm,
    ethers.parseEther("10"),
    200,
    "Will $4 get Binance spot listing?",
    "https://twitter.com/binance",
    ethers.parseUnits("1", 8), // Boolean: 1 = yes, 0 = no
    ethers.keccak256(ethers.toUtf8Bytes("4TOKEN-BINANCE-SPOT"))
  );
  receipt = await tx.wait();
  const event5 = receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  });
  markets.push({ name: "$4 Spot Listing", address: factory.interface.parseLog(event5).args.market });
  console.log("✅", markets[4].address);

  console.log("\n\n📋 MAINNET MARKETS DEPLOYED:\n");
  markets.forEach((market, i) => {
    console.log(`${i + 1}. ${market.name}:`);
    console.log(`   ${market.address}\n`);
  });
  
  console.log("\n💡 Add these addresses to your frontend!");
  console.log("\n⚠️  REMEMBER:");
  console.log("   • Fund oracle with BNB for gas");
  console.log("   • Set up monitoring for CZ Twitter & Binance announcements");
  console.log("   • Deploy resolver service to auto-resolve after deadlines");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

