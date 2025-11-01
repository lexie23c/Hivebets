const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying NEW markets with October 31 deadlines...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB\n");

  const FACTORY_ADDRESS = "0x984C5c5350277380AeC27624548456e9D31C9911";
  const ORACLE_ADDRESS = "0x0346C9998600Fde7bE073b72902b70cfDc671908";
  const factory = await ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);

  // October 31, 2025, 8:00 PM ET = November 1, 2025, 00:00 UTC
  const oct31_8pm = Math.floor(new Date("2025-11-01T00:00:00Z").getTime() / 1000);
  // October 31, 2025, 10:00 PM ET = November 1, 2025, 02:00 UTC
  const oct31_10pm = Math.floor(new Date("2025-11-01T02:00:00Z").getTime() / 1000);

  const markets = [
    {
      name: "Will 币安人生 reach $400M market cap by October 31?",
      dataSourceURL: "https://api.four.meme/token/BinanceLife",
      targetMcap: BigInt(400000000) * BigInt(100000000),
      queryId: ethers.id("币安人生_400M_OCT31"),
      deadline: oct31_10pm
    },
    {
      name: "Palu trading above $40M by October 31",
      dataSourceURL: "https://api.four.meme/token/Palu",
      targetMcap: BigInt(40000000) * BigInt(100000000),
      queryId: ethers.id("PALU_40M_OCT31"),
      deadline: oct31_8pm
    },
    {
      name: "BNB trading above $1,300 by October 31",
      dataSourceURL: "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd",
      targetMcap: BigInt(1300) * BigInt(100000000),
      queryId: ethers.id("BNB_1300_OCT31"),
      deadline: oct31_8pm
    }
  ];

  const deployedMarkets = [];

  for (const market of markets) {
    console.log(`\n📍 Creating: ${market.name}`);
    console.log(`   Deadline: ${new Date(market.deadline * 1000).toLocaleString("en-US", { timeZone: "America/New_York" })} ET`);
    
    try {
      const tx = await factory.createMarket(
        deployer.address, // resolver
        market.deadline,
        ethers.parseEther("0.5"), // 0.5 BNB max bet
        200, // 2% fee
        market.name,
        market.dataSourceURL,
        market.targetMcap,
        market.queryId,
        {
          gasLimit: 3000000
        }
      );

      console.log(`   TX: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`   ✅ Created! Gas: ${receipt.gasUsed.toString()}`);

      // Find market address from event
      for (const log of receipt.logs) {
        try {
          const parsed = factory.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          
          if (parsed && parsed.name === "MarketCreated") {
            const marketAddress = parsed.args.market;
            console.log(`   📍 Address: ${marketAddress}`);
            deployedMarkets.push({
              name: market.name,
              address: marketAddress,
              deadline: new Date(market.deadline * 1000).toLocaleString("en-US", { timeZone: "America/New_York" })
            });
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log("\n\n🎉 DEPLOYMENT COMPLETE!");
  console.log("═══════════════════════════════════════");
  
  deployedMarkets.forEach((m, i) => {
    console.log(`\n${i + 1}. ${m.name}`);
    console.log(`   Address: ${m.address}`);
    console.log(`   Deadline: ${m.deadline} ET`);
  });
  
  console.log("\n\n📝 Update your frontend with these addresses!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

