const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying QUICK Test Markets (2-minute deadlines)");
  console.log("Deployer:", deployer.address);

  const factoryAddress = "0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB";
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryAddress);
  
  const deadline = Math.floor(Date.now() / 1000) + (2 * 60); // 2 minutes from now
  const markets = [];

  console.log(`\n⏰ Deadline: ${new Date(deadline * 1000).toLocaleString()}\n`);

  // Market 1: 哈基米
  console.log("1️⃣  Creating 哈基米 market...");
  let tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will 哈基米 hit $70M market cap?",
    "https://four.meme",
    ethers.parseUnits("70000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("HAKIMI-MCAP"))
  );
  let receipt = await tx.wait();
  const event1 = receipt.logs.find(log => {
    try {
      return factory.interface.parseLog(log).name === 'MarketCreated';
    } catch { return false; }
  });
  markets.push(factory.interface.parseLog(event1).args.market);
  console.log("✅ 哈基米:", markets[0]);

  // Market 2: 币安人生
  console.log("\n2️⃣  Creating 币安人生 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will 币安人生 hit $500M market cap?",
    "https://four.meme",
    ethers.parseUnits("500000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BIANRENSHENG-MCAP"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ 币安人生:", markets[1]);

  // Market 3: $4
  console.log("\n3️⃣  Creating $4 market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will $4 hit $200M market cap?",
    "https://four.meme",
    ethers.parseUnits("200000000", 8),
    ethers.keccak256(ethers.toUtf8Bytes("FOUR-MCAP"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ $4:", markets[2]);

  // Market 4: BNB Price
  console.log("\n4️⃣  Creating BNB Price market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.1"),
    200,
    "Will BNB hit $1100 before deadline?",
    "https://bscscan.com",
    ethers.parseUnits("1100", 8),
    ethers.keccak256(ethers.toUtf8Bytes("BNB-USD"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ BNB Price:", markets[3]);

  // Market 5: CZ Tweet
  console.log("\n5️⃣  Creating CZ Tweet market...");
  tx = await factory.createMarket(
    deployer.address,
    deadline,
    ethers.parseEther("0.05"),
    200,
    "Will CZ tweet about $4 before deadline?",
    "https://x.com/cz_binance",
    1,
    ethers.keccak256(ethers.toUtf8Bytes("CZ-TWEET-FOUR"))
  );
  receipt = await tx.wait();
  markets.push(factory.interface.parseLog(receipt.logs.find(log => {
    try { return factory.interface.parseLog(log).name === 'MarketCreated'; } catch { return false; }
  })).args.market);
  console.log("✅ CZ Tweet:", markets[4]);

  console.log("\n\n📋 UPDATE YOUR FRONTEND:\n");
  console.log(`MARKETS = {
  HAKIMI: { address: "${markets[0]}" },
  BIANRENSHENG: { address: "${markets[1]}" },
  FOUR: { address: "${markets[2]}" },
  BNB_PRICE: { address: "${markets[3]}" },
  CZ_TWEET: { address: "${markets[4]}" }
};`);

  console.log("\n⏰ Markets expire in 2 minutes!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

