const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying new 币安人生 400M market...\n");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB\n");

  // Contract addresses
  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f"; // BSC Mainnet (lowercase to avoid checksum)
  const ORACLE_ADDRESS = "0x9fa85493034a16d5fe372375229e7061f5429e43"; // BSC Mainnet (lowercase to avoid checksum)

  // Market parameters
  const resolver = deployer.address; // Manual resolver (fallback)
  const tokenName = "Will 币安人生 reach $400M market cap by October 27?";
  const dataSourceURL = "https://api.four.meme/token/BinanceLife"; // Data source
  const targetMcapUsd = BigInt(400000000) * BigInt(100000000); // $400M with 8 decimals
  const oracleQueryId = ethers.id("币安人生_400M_OCT27"); // Unique query ID
  
  // Deadline: October 27, 2025, 10:00 PM ET (02:00 AM UTC on Oct 28)
  const deadline = Math.floor(new Date("2025-10-28T02:00:00Z").getTime() / 1000);
  
  const maxBetPerWallet = ethers.parseEther("0.5"); // 0.5 BNB max bet
  const feeBps = 200; // 2% fee (200 basis points)

  console.log("Market Details:");
  console.log("Question:", tokenName);
  console.log("Deadline:", new Date(deadline * 1000).toLocaleString("en-US", { timeZone: "America/New_York" }), "ET");
  console.log("Max Bet:", ethers.formatEther(maxBetPerWallet), "BNB");
  console.log("Fee:", feeBps / 100, "%");
  console.log("Target Market Cap:", "$400M");
  console.log("Oracle Query ID:", oracleQueryId);
  console.log("");

  // Connect to factory
  const factory = await ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);

  console.log("Creating market...");
  const tx = await factory.createMarket(
    resolver,
    deadline,
    maxBetPerWallet,
    feeBps,
    tokenName,
    dataSourceURL,
    targetMcapUsd,
    oracleQueryId,
    {
      gasLimit: 3000000
    }
  );

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✅ Market created! Gas used:", receipt.gasUsed.toString());

  // Get the market address from the event
  const event = receipt.logs.find(log => {
    try {
      const parsed = factory.interface.parseLog(log);
      return parsed.name === "MarketCreated";
    } catch {
      return false;
    }
  });

  if (event) {
    const parsed = factory.interface.parseLog(event);
    const marketAddress = parsed.args.market;
    
    console.log("\n🎉 SUCCESS!");
    console.log("════════════════════════════════════════");
    console.log("Market Address:", marketAddress);
    console.log("Question:", tokenName);
    console.log("Target:", "$400M market cap");
    console.log("Deadline:", new Date(deadline * 1000).toLocaleString("en-US", { timeZone: "America/New_York" }), "ET");
    console.log("════════════════════════════════════════");
    console.log("\n📝 Update your frontend with this address:");
    console.log(`BINANCE_LIFE: { address: "${marketAddress}" }`);
    console.log("\nView on BSCScan: https://bscscan.com/address/" + marketAddress);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

