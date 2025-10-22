const hre = require("hardhat");
const { ethers } = hre;

async function getBettorsFromMarket(marketAddress, marketName) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 Analyzing ${marketName}: ${marketAddress}`);
  console.log("=".repeat(60));
  
  const market = await ethers.getContractAt("BinaryMarketV2", marketAddress);
  
  // Get all Bet events
  const filter = market.filters.Bet();
  const events = await market.queryFilter(filter);
  
  console.log(`Found ${events.length} bet events`);
  
  // Track unique bettors and their stakes
  const bettors = new Map();
  
  for (const event of events) {
    const user = event.args.user;
    const isYes = event.args.yes;
    const amount = event.args.amount;
    
    if (!bettors.has(user)) {
      bettors.set(user, { yes: 0n, no: 0n });
    }
    
    const userBets = bettors.get(user);
    if (isYes) {
      userBets.yes += amount;
    } else {
      userBets.no += amount;
    }
  }
  
  // Get current stakes from contract (in case of claims)
  console.log(`\n👥 Bettors who need to claim refunds:\n`);
  
  let totalRefunds = 0n;
  let bettorCount = 0;
  
  for (const [user, bets] of bettors.entries()) {
    const yesStake = await market.yesStake(user);
    const noStake = await market.noStake(user);
    const totalStake = yesStake + noStake;
    
    if (totalStake > 0n) {
      bettorCount++;
      totalRefunds += totalStake;
      console.log(`${user}`);
      console.log(`  YES: ${ethers.formatEther(yesStake)} BNB`);
      console.log(`  NO:  ${ethers.formatEther(noStake)} BNB`);
      console.log(`  TOTAL REFUND: ${ethers.formatEther(totalStake)} BNB\n`);
    }
  }
  
  console.log(`Total bettors to refund: ${bettorCount}`);
  console.log(`Total refunds: ${ethers.formatEther(totalRefunds)} BNB`);
  
  return Array.from(bettors.keys());
}

async function main() {
  const marketA = "0x93EAdFb94070e1EAc522A42188Ee3983df335088";
  const marketB = "0x72dE4848Ea51844215d2016867671D26f60b828A";
  
  console.log("\n🔍 FINDING ALL BETTORS WHO NEED REFUNDS\n");
  
  const bettorsA = await getBettorsFromMarket(marketA, "Market A");
  const bettorsB = await getBettorsFromMarket(marketB, "Market B");
  
  const allBettors = new Set([...bettorsA, ...bettorsB]);
  
  console.log("\n" + "=".repeat(60));
  console.log("📢 IMPORTANT INSTRUCTIONS");
  console.log("=".repeat(60));
  console.log("\n⚠️  You CANNOT automatically send funds back to bettors.");
  console.log("⚠️  Each bettor must call claim() from their own wallet.\n");
  
  console.log("What to do:");
  console.log("  1. Contact each bettor above (Twitter DM, Discord, etc.)");
  console.log("  2. Tell them the markets are cancelled");
  console.log("  3. Instruct them to go to the market contract on BscScan");
  console.log("  4. Connect their wallet and call the 'claim' function");
  console.log("  5. They will receive 100% of their bets back\n");
  
  console.log("Contract links for bettors:");
  console.log(`  Market A: https://bscscan.com/address/${marketA}#writeContract`);
  console.log(`  Market B: https://bscscan.com/address/${marketB}#writeContract`);
  
  console.log("\n💡 Tip: Create a tutorial tweet with screenshots showing how to claim!");
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
});

