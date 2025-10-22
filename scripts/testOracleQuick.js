const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("\n🧪 Quick Oracle Test\n");
  
  // Check the transaction
  const txHash = "0x7eb598d8494bdc02416db9c2138925dcfd292863b9d9b0fbc9a082456c513af0";
  console.log("Checking transaction:", txHash);
  
  try {
    const receipt = await ethers.provider.getTransactionReceipt(txHash);
    
    if (receipt) {
      console.log("✅ Transaction confirmed!");
      console.log("Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
      console.log("Block:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      
      if (receipt.logs && receipt.logs.length > 0) {
        console.log("\n📋 Logs found:", receipt.logs.length);
        // Try to find market address in logs
        receipt.logs.forEach((log, i) => {
          console.log(`\nLog ${i}:`, log.address);
        });
      }
    } else {
      console.log("⏳ Transaction pending or not found");
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
