/**
 * Create a prediction market for BNB price
 * Example: "Will BNB hit $1000 before [deadline]?"
 */

const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const factoryV2Address = "0xC3286F0649Df923CBDDEaC8032cC45C9A12D84b6"; // BSC Testnet
  
  const [signer] = await ethers.getSigners();
  const resolver = await signer.getAddress();
  
  console.log("\n💰 Creating BNB Price Prediction Market");
  console.log("=" + "=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Resolver:", resolver);
  
  // Market configuration
  const targetPrice = "1000"; // $1000 BNB
  const daysUntilDeadline = 90; // 90 days
  const deadline = Math.floor(Date.now() / 1000) + (daysUntilDeadline * 24 * 60 * 60);
  
  console.log("\nMarket Settings:");
  console.log("  Target BNB Price: $" + targetPrice);
  console.log("  Deadline:", new Date(deadline * 1000).toISOString());
  console.log("  Days until deadline:", daysUntilDeadline);
  
  const maxPerWallet = ethers.parseEther("1.0"); // 1 BNB max for BNB markets
  const feeBps = 200; // 2% fee
  
  const usd8 = (s) => ethers.parseUnits(s, 8);
  
  // Market details
  const title = `Will BNB hit $${targetPrice} before ${new Date(deadline * 1000).toLocaleDateString()}?`;
  const dataSource = "https://www.coingecko.com/en/coins/bnb";
  const target = usd8(targetPrice);
  
  // Generate queryId for BNB price
  const queryData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["string"],
    ["BNB-USD"]
  );
  const queryId = ethers.keccak256(queryData);
  
  console.log("\n📊 Market Details:");
  console.log("  Title:", title);
  console.log("  Data Source:", dataSource);
  console.log("  Target Price: $" + targetPrice);
  console.log("  Max Bet per Wallet: 1 BNB");
  console.log("  Fee: 2%");
  console.log("  QueryId:", queryId);
  
  const factory = await ethers.getContractAt("MarketFactoryV2", factoryV2Address);
  
  console.log("\n⏳ Creating market...");
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
  
  console.log("Transaction submitted:", tx.hash);
  console.log("⏳ Waiting for confirmation...");
  
  const rc = await tx.wait();
  const ev = rc.logs.find(log => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed && parsed.name === "MarketCreated";
    } catch (e) {
      return false;
    }
  });
  
  const parsedEv = factory.interface.parseLog(ev);
  const marketAddr = parsedEv.args.market;
  
  console.log("\n✅ ✅ ✅ BNB PRICE MARKET CREATED! ✅ ✅ ✅");
  console.log("\n📍 Market Address:", marketAddr);
  
  if (hre.network.name === 'bsc') {
    console.log("🔗 BSCScan:", `https://bscscan.com/address/${marketAddr}`);
  } else if (hre.network.name === 'bsctest') {
    console.log("🔗 BSCScan:", `https://testnet.bscscan.com/address/${marketAddr}`);
  }
  
  console.log("\n📋 Market Configuration:");
  console.log("  Question:", title);
  console.log("  Target BNB Price: $" + targetPrice);
  console.log("  Deadline:", new Date(deadline * 1000).toLocaleString());
  console.log("  Max per wallet: 1 BNB");
  console.log("  Platform fee: 2%");
  console.log("  QueryId:", queryId);
  
  console.log("\n💡 Next Steps:");
  console.log("1. Start oracle data feed to update BNB price:");
  console.log("   npx hardhat run scripts/oracleDataFeed.js --network", hre.network.name, "--continuous");
  console.log("\n2. Place bets:");
  console.log("   npx hardhat run scripts/placeBet.js --network", hre.network.name, marketAddr, "yes 0.1");
  console.log("\n3. Monitor market:");
  console.log("   npx hardhat run scripts/previewMarketV2.js --network", hre.network.name, marketAddr);
  
  return {
    marketAddress: marketAddr,
    targetPrice: targetPrice,
    deadline: deadline,
    queryId: queryId
  };
}

main()
  .then((result) => {
    console.log("\n✅ Script completed successfully!");
    console.log("Market Address:", result.marketAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  });

