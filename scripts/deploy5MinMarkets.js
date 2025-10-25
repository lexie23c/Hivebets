const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying 5-MINUTE Test Markets");
  console.log("Deployer:", deployer.address);

  const factoryAddress = "0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB";
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryAddress);
  
  const deadline = Math.floor(Date.now() / 1000) + (5 * 60); // 5 minutes from now
  const markets = [];

  console.log(`\n⏰ Deadline: ${new Date(deadline * 1000).toLocaleString()}\n`);

  // Market 1: Pluto
  console.log("1️⃣  Creating Pluto market...");
  let tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will Pluto reach $2M market cap?",
    "https://dexscreener.com",
    ethers.parseUnits("2000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("PLUTO-MCAP"))
  );
  let receipt = await tx.wait();
  const event1 = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === 'MarketCreated';
    } catch { return false; }
  });
  markets.push(factory.interface.parseLog(event1).args.market);
  console.log("✅ Pluto:", markets[0]);

  // Market 2: 红包
  console.log("\n2️⃣  Creating 红包 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will 红包 hit $25M market cap?",
    "https://dexscreener.com",
    ethers.parseUnits("25000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("HONGBAO-MCAP"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ 红包:", markets[1]);

  // Market 3: BNB $1,167
  console.log("\n3️⃣  Creating BNB $1,167 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will BNB reach $1,167?",
    "https://bscscan.com",
    ethers.parseUnits("1167", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1167"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,167:", markets[2]);

  // Market 4: BNB $1,200
  console.log("\n4️⃣  Creating BNB $1,200 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will BNB break $1,200?",
    "https://bscscan.com",
    ethers.parseUnits("1200", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1200"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,200:", markets[3]);

  // Market 5: BNB $1,250
  console.log("\n5️⃣  Creating BNB $1,250 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will BNB reach $1,250?",
    "https://bscscan.com",
    ethers.parseUnits("1250", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-1250"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB $1,250:", markets[4]);

  console.log("\n\n📋 MARKETS DEPLOYED:\n");
  console.log(`Pluto:      ${markets[0]}`);
  console.log(`红包:        ${markets[1]}`);
  console.log(`BNB $1,167: ${markets[2]}`);
  console.log(`BNB $1,200: ${markets[3]}`);
  console.log(`BNB $1,250: ${markets[4]}`);
  console.log("\n⏰ Markets expire in 5 minutes!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

