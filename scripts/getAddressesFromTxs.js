const hre = require("hardhat");

async function main() {
  const txHashes = [
    { hash: "0x01b353d0f43aa18b1baba34305df0baf8e1633da98485b471e87927924bfd19d", name: "币安人生 ($400M)" },
    { hash: "0x11ed087cbfb351b87863a492c7caa4688273bc91473b16cef8dbccb657644bac", name: "PALU ($40M)" },
    { hash: "0x397a92b95d6b1f9788cfec32cd597e69a1af9dd04d7dda7bfb0fb4dad682ca8b", name: "BNB ($1,300)" }
  ];

  console.log("🔍 Getting contract addresses from transactions...\n");

  const FACTORY_ADDRESS = "0x82e0524f8be3a82679f80fd8821ed023a08f4d2f";
  const factory = await hre.ethers.getContractAt("MarketFactoryV2", FACTORY_ADDRESS);

  const addresses = [];

  for (const tx of txHashes) {
    try {
      console.log(`\n📍 ${tx.name}`);
      console.log(`   TX: ${tx.hash}`);
      
      const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash);
      
      if (!receipt) {
        console.log("   ❌ Receipt not found");
        continue;
      }

      console.log(`   Status: ${receipt.status === 1 ? '✅ Success' : '❌ Failed'}`);
      console.log(`   Logs: ${receipt.logs.length}`);

      // Parse all logs
      let foundAddress = false;
      for (const log of receipt.logs) {
        try {
          const parsed = factory.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          
          if (parsed && parsed.name === "MarketCreated") {
            const marketAddress = parsed.args.market || parsed.args[0];
            console.log(`   ✅ CONTRACT: ${marketAddress}`);
            addresses.push({ name: tx.name, address: marketAddress });
            foundAddress = true;
            break;
          }
        } catch (e) {
          // Not a MarketCreated event
        }
      }

      if (!foundAddress) {
        console.log("   ⚠️  No MarketCreated event found");
        // Show all log addresses
        if (receipt.logs.length > 0) {
          console.log("   Addresses in logs:");
          receipt.logs.forEach(log => {
            console.log(`      - ${log.address}`);
          });
        }
      }
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  console.log("\n\n═══════════════════════════════════════");
  console.log("📝 SUMMARY:\n");
  
  if (addresses.length > 0) {
    addresses.forEach((m, i) => {
      console.log(`${i + 1}. ${m.name}`);
      console.log(`   ${m.address}\n`);
    });
  } else {
    console.log("❌ No contracts found. The transactions may have reverted.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

