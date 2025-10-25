const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying SHORT-TERM markets (Oct 26-30 deadlines)");
  console.log("Deployer:", deployer.address);

  const factoryAddress = "0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB";
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryAddress);
  
  const now = Math.floor(Date.now() / 1000);
  const oct26 = now + (2 * 24 * 60 * 60); // Oct 26
  const oct28 = now + (4 * 24 * 60 * 60); // Oct 28
  const oct30 = now + (6 * 24 * 60 * 60); // Oct 30
  
  const markets = [];

  // Market 1: Pluto (2 days - Oct 26)
  console.log("\n1️⃣  Creating Pluto market (Ends Oct 26)...");
  let tx = await factory.createMarket(
    deployer.address,
    oct26,
    ethers.parseEther("0.1"),
    200,
    "Will Pluto reach $2M market cap before October 26th?",
    "https://dexscreener.com/bsc/0x99df6F337eeC8bb3A197961099dF163Ea3494444",
    ethers.parseUnits("2000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("PLUTO-MCAP-OCT26"))
  );
  let receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ Pluto:", markets[0]);

  // Market 2: 红包 (2 days - Oct 26)
  console.log("\n2️⃣  Creating 红包 market (Ends Oct 26)...");
  tx = await factory.createMarket(
    deployer.address,
    oct26,
    ethers.parseEther("0.1"),
    200,
    "Will 红包 hit $25M market cap before October 26th?",
    "https://dexscreener.com/bsc/0x88378CA8257C567239da55733DBcAD9487E54444",
    ethers.parseUnits("25000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("HONGBAO-MCAP-OCT26"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ 红包:", markets[1]);

  // Market 3: BNB $1,167 (4 days - Oct 28)
  console.log("\n3️⃣  Creating BNB $1,167 market (Ends Oct 28)...");
  tx = await factory.createMarket(
    deployer.address,
    oct28,
    ethers.parseEther("0.1"),
    200,
    "Will BNB reach $1,167 before October 28th?",
    "https://bscscan.com/bnb-price",
    ethers.parseUnits("1167", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1167-OCT28"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,167:", markets[2]);

  // Market 4: BNB $1,200 (6 days - Oct 30)
  console.log("\n4️⃣  Creating BNB $1,200 market (Ends Oct 30)...");
  tx = await factory.createMarket(
    deployer.address,
    oct30,
    ethers.parseEther("0.1"),
    200,
    "Will BNB break $1,200 before October 30th?",
    "https://bscscan.com/bnb-price",
    ethers.parseUnits("1200", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1200-OCT30"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,200:", markets[3]);

  // Market 5: BNB $1,250 (6 days - Oct 30)
  console.log("\n5️⃣  Creating BNB $1,250 market (Ends Oct 30)...");
  tx = await factory.createMarket(
    deployer.address,
    oct30,
    ethers.parseEther("0.1"),
    200,
    "Will BNB reach $1,250 before October 30th?",
    "https://bscscan.com/bnb-price",
    ethers.parseUnits("1250", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1250-OCT30"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,250:", markets[4]);

  console.log("\n\n📋 UPDATE YOUR FRONTEND:\n");
  console.log(`const MARKETS = [
    { address: '${markets[0]}', name: 'Pluto', symbol: 'PLUTO', category: 'Memecoin', target: 2000000, question: 'Will Pluto reach $2M market cap before October 26th?' },
    { address: '${markets[1]}', name: '红包', symbol: 'HONGBAO', category: 'Memecoin', target: 25000000, question: 'Will 红包 hit $25M market cap before October 26th?' },
    { address: '${markets[2]}', name: 'BNB $1,167', symbol: 'BNB', category: 'Price Target', target: 1167, question: 'Will BNB reach $1,167 before October 28th?' },
    { address: '${markets[3]}', name: 'BNB $1,200', symbol: 'BNB', category: 'Price Target', target: 1200, question: 'Will BNB break $1,200 before October 30th?' },
    { address: '${markets[4]}', name: 'BNB $1,250', symbol: 'BNB', category: 'Price Target', target: 1250, question: 'Will BNB reach $1,250 before October 30th?' }
];`);

  console.log("\n\n⏰ DEADLINES:");
  console.log(`  Oct 26 (2 days): Pluto, 红包`);
  console.log(`  Oct 28 (4 days): BNB $1,167`);
  console.log(`  Oct 30 (6 days): BNB $1,200, BNB $1,250`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

