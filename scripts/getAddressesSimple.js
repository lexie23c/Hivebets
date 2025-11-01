const hre = require("hardhat");

async function main() {
  const txHashes = [
    "0x01b353d0f43aa18b1baba34305df0baf8e1633da98485b471e87927924bfd19d", // 币安人生
    "0x11ed087cbfb351b87863a492c7caa4688273bc91473b16cef8dbccb657644bac", // PALU
    "0x397a92b95d6b1f9788cfec32cd597e69a1af9dd04d7dda7bfb0fb4dad682ca8b"  // BNB
  ];

  const names = ["币安人生 ($400M)", "PALU ($40M)", "BNB ($1,300)"];

  console.log("🔍 Fetching contract addresses...\n");

  for (let i = 0; i < txHashes.length; i++) {
    try {
      const receipt = await hre.ethers.provider.getTransactionReceipt(txHashes[i]);
      
      if (receipt) {
        console.log(`\n${names[i]}:`);
        console.log(`Transaction: ${txHashes[i]}`);
        console.log(`Status: ${receipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
        console.log(`Logs: ${receipt.logs.length} events`);
        
        // Print all log addresses (one is usually the created contract)
        const uniqueAddresses = [...new Set(receipt.logs.map(log => log.address))];
        console.log(`Addresses involved:`);
        uniqueAddresses.forEach(addr => {
          console.log(`  - ${addr}`);
        });
      }
    } catch (error) {
      console.error(`❌ Error:`, error.message);
    }
  }

  console.log("\n\n💡 The market addresses are the ones that appear in the logs (not the factory address).");
  console.log("Factory address is: 0x82E0524F8BE3A82679F80FD8821eD023A08F4D2F");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

