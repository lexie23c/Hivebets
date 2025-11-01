const hre = require("hardhat");

async function main() {
  const txHashes = [
    "0x01b353d0f43aa18b1baba34305df0baf8e1633da98485b471e87927924bfd19d", // 币安人生
    "0x11ed087cbfb351b87863a492c7caa4688273bc91473b16cef8dbccb657644bac", // PALU
    "0x397a92b95d6b1f9788cfec32cd597e69a1af9dd04d7dda7bfb0fb4dad682ca8b"  // BNB
  ];

  const names = ["币安人生", "PALU", "BNB"];

  console.log("🔍 Fetching contract addresses from transactions...\n");

  for (let i = 0; i < txHashes.length; i++) {
    try {
      const receipt = await hre.ethers.provider.getTransactionReceipt(txHashes[i]);
      
      if (receipt && receipt.logs && receipt.logs.length > 0) {
        // Look for the MarketCreated event
        const factoryInterface = new hre.ethers.Interface([
          "event MarketCreated(address indexed marketAddress, string question, uint256 deadline, address creator)"
        ]);
        
        for (const log of receipt.logs) {
          try {
            const parsed = factoryInterface.parseLog(log);
            if (parsed && parsed.name === "MarketCreated") {
              console.log(`✅ ${names[i]}: ${parsed.args.marketAddress}`);
              break;
            }
          } catch (e) {
            // Not the event we're looking for
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error fetching ${names[i]}:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

