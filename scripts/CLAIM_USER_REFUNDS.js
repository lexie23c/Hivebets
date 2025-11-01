const hre = require("hardhat");
const { ethers } = require("hardhat");

/**
 * CLAIM REFUNDS FROM CANCELLED MARKETS
 * 
 * This script claims 0.08 BNB total from cancelled markets:
 * - 币安人生: 0.05 BNB
 * - BNB: 0.03 BNB
 * 
 * SETUP:
 * 1. Open your .env file
 * 2. Add this line (replace with your actual private key):
 *    PRIVATE_KEY=your_private_key_here
 * 3. Run: npx hardhat run scripts/CLAIM_USER_REFUNDS.js --network bsc
 * 
 * SECURITY NOTE: 
 * - Delete the private key from .env after claiming
 * - Transfer funds to a new wallet immediately after
 */

async function main() {
  console.log("╔═══════════════════════════════════════╗");
  console.log("║   CLAIM REFUNDS FROM CANCELLED MARKETS   ║");
  console.log("╚═══════════════════════════════════════╝\n");
  
  const [claimer] = await ethers.getSigners();
  console.log("Claiming with wallet:", claimer.address);
  
  // Verify it's the correct wallet
  const expectedAddress = "0x42d81B6E8bC1DC37cc169A76337808b62BA57aE7";
  if (claimer.address.toLowerCase() !== expectedAddress.toLowerCase()) {
    console.error("❌ ERROR: Wrong wallet!");
    console.error("Expected:", expectedAddress);
    console.error("Got:", claimer.address);
    console.error("\nMake sure you're using the correct private key in .env");
    process.exit(1);
  }
  
  const balanceBefore = await ethers.provider.getBalance(claimer.address);
  console.log("Balance before:", ethers.formatEther(balanceBefore), "BNB\n");

  const markets = [
    {
      name: "币安人生 → $400M",
      address: "0xd055f4D1af414E2880BA71f55024d0Ce44075AA4",
      expected: 0.05
    },
    {
      name: "BNB → $1,300",
      address: "0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40",
      expected: 0.03
    }
  ];

  let totalClaimed = 0;
  let successCount = 0;

  for (const market of markets) {
    console.log("═══════════════════════════════════════");
    console.log(`📍 ${market.name}`);
    console.log(`   Contract: ${market.address}`);
    console.log(`   Expected refund: ${market.expected} BNB`);
    
    try {
      const contract = await ethers.getContractAt("BinaryMarketV2", market.address);
      
      // Verify the market is cancelled and has stakes
      const state = await contract.state();
      console.log(`   State: ${state} (2=Cancelled)`);
      if (state !== 2n && state !== 2) {
        console.log(`   ⚠️  Market not cancelled, skipping...`);
        continue;
      }
      
      const yesStake = await contract.yesStake(claimer.address);
      const noStake = await contract.noStake(claimer.address);
      const totalStake = yesStake + noStake;
      
      if (totalStake === BigInt(0)) {
        console.log(`   ⚠️  No stakes to claim, skipping...`);
        continue;
      }
      
      console.log(`   Your stakes: YES=${ethers.formatEther(yesStake)} | NO=${ethers.formatEther(noStake)}`);
      console.log(`   Calling claim()...`);
      
      const tx = await contract.claim({
        gasLimit: 200000
      });
      
      console.log(`   TX Hash: ${tx.hash}`);
      console.log(`   Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      
      console.log(`   ✅ SUCCESS!`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`   Block: ${receipt.blockNumber}`);
      console.log(`   View on BSCScan: https://bscscan.com/tx/${tx.hash}`);
      
      totalClaimed += market.expected;
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      if (error.message.includes("already claimed")) {
        console.log(`   (Funds may have been claimed already)`);
      }
    }
    console.log();
  }

  const balanceAfter = await ethers.provider.getBalance(claimer.address);
  const actualGain = balanceAfter - balanceBefore;
  
  console.log("╔═══════════════════════════════════════╗");
  console.log("║            CLAIM COMPLETE!               ║");
  console.log("╚═══════════════════════════════════════╝");
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Markets claimed: ${successCount} / ${markets.length}`);
  console.log(`   Expected total: ${totalClaimed.toFixed(4)} BNB`);
  console.log(`   Balance before: ${ethers.formatEther(balanceBefore)} BNB`);
  console.log(`   Balance after:  ${ethers.formatEther(balanceAfter)} BNB`);
  console.log(`   Net change:     ${ethers.formatEther(actualGain)} BNB (after gas)`);
  
  if (successCount === markets.length) {
    console.log(`\n✅ All claims successful!`);
  } else {
    console.log(`\n⚠️  Some claims failed. Check errors above.`);
  }
  
  console.log(`\n⚠️  SECURITY REMINDER:`);
  console.log(`   1. Remove the private key from .env NOW`);
  console.log(`   2. Transfer funds to a new wallet immediately`);
  console.log(`   3. Never share your private keys or seed phrases\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ CRITICAL ERROR:");
    console.error(error);
    process.exit(1);
  });

