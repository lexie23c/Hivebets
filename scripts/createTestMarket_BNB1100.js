const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Creating BNB $1100 test market with account:", deployer.address);

  const factoryV2Address = "0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB";
  const resolver = deployer.address;
  
  // 10 minutes from now
  const deadline = Math.floor(Date.now() / 1000) + (10 * 60);
  console.log("Deadline:", new Date(deadline * 1000).toISOString());
  console.log("Market will close in 10 minutes");

  const maxPerWallet = ethers.parseEther("0.1"); // 0.1 BNB max
  const feeBps = 200; // 2% fee

  const factory = await ethers.getContractAt("MarketFactoryV2", factoryV2Address);
  const usd8 = (s) => ethers.parseUnits(s, 8);

  const title = "Will BNB hit $1100 before October 24th?";
  const dataSource = "https://api.bscscan.com/api?module=stats&action=bnbprice";
  const target = usd8("1100"); // $1100 USD

  // Create BNB price queryId (same format as oracle uses)
  const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["string"],
    ["BNB-USD"]
  );
  const queryId = ethers.keccak256(queryData);

  console.log("\n🚀 Creating BNB Price Market:");
  console.log("  Question:", title);
  console.log("  Target:", "$1,100");
  console.log("  Max per wallet:", ethers.formatEther(maxPerWallet), "BNB");
  console.log("  Fee:", (feeBps / 100), "%");
  console.log("  QueryId:", queryId);

  const tx = await factory.createMarket(
    resolver,
    deadline,
    maxPerWallet,
    feeBps,
    title,
    dataSource,
    target,
    queryId
  );

  console.log("\n⏳ Transaction sent:", tx.hash);
  const receipt = await tx.wait();

  // Get market address from event
  const marketCreatedEvent = receipt.logs.find(
    log => log.fragment && log.fragment.name === 'MarketCreated'
  );
  
  if (marketCreatedEvent) {
    const marketAddress = marketCreatedEvent.args[0];
    console.log("\n✅ BNB $1100 Market Created!");
    console.log("📍 Market Address:", marketAddress);
    console.log("⏰ Ends in 10 minutes");
    console.log("\n💡 Add this to your frontend MARKETS array:");
    console.log(`{
  address: '${marketAddress}',
  name: 'BNB Price',
  symbol: 'BNB',
  platform: 'bsc',
  category: 'Price Target',
  target: 1100,
  question: 'Will BNB hit $1100 before October 24th?'
}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

