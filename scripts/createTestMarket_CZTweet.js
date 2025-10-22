const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Creating CZ Tweet test market with account:", deployer.address);

  const factoryV2Address = "0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB";
  const resolver = deployer.address;
  
  // 10 minutes from now
  const deadline = Math.floor(Date.now() / 1000) + (10 * 60);
  console.log("Deadline:", new Date(deadline * 1000).toISOString());
  console.log("Market will close in 10 minutes");

  const maxPerWallet = ethers.parseEther("0.05"); // 0.05 BNB for social markets
  const feeBps = 200; // 2% fee

  const factory = await ethers.getContractAt("MarketFactoryV2", factoryV2Address);
  const usd8 = (s) => ethers.parseUnits(s, 8);

  const title = "Will CZ tweet about $4 (0x0A43fC31a73013089DF59194872Ecae4cAe14444) before October 25th?";
  const dataSource = "https://x.com/cz_binance";
  const target = usd8("1"); // 1 = YES (mentioned), 0 = NO (not mentioned)

  // Create CZ tweet queryId
  const tokenAddress = "0x0A43fC31a73013089DF59194872Ecae4cAe14444"; // $4 token
  const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["string", "string", "address"],
    ["CZ_Tweet_Mention", "cz_binance", tokenAddress]
  );
  const queryId = ethers.keccak256(queryData);

  console.log("\n🐦 Creating CZ Tweet Market:");
  console.log("  Question:", title);
  console.log("  Target Token:", "$4 (Four.meme)");
  console.log("  Token Address:", tokenAddress);
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
    console.log("\n✅ CZ Tweet Market Created!");
    console.log("📍 Market Address:", marketAddress);
    console.log("⏰ Ends in 10 minutes");
    console.log("\n💡 Add this to your frontend MARKETS array:");
    console.log(`{
  address: '${marketAddress}',
  name: 'CZ Tweet about $4',
  symbol: 'CZ-TWEET',
  platform: 'twitter',
  category: 'Social Signal',
  target: 1,
  question: 'Will CZ tweet about $4 before October 25th?'
}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

