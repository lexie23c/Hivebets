const hre = require("hardhat");
const { ethers } = hre;

const MARKETS = [
  { address: '0x78B2b59DF95090Dc4848645182c171f81829fBBB', name: 'Pluto' },
  { address: '0x4db864C04652e7F167c7A08e62b0EDAc276DCd42', name: '红包' },
  { address: '0x90a4Bad353ec27B9A8eb13445982ccab41f1D161', name: 'BNB $1,167' },
  { address: '0xdF17E23CADF9130656FDBC2C73680546Ea34F7cD', name: 'BNB $1,200' },
  { address: '0x6C7571424a70f627E66287A2e532F42599931792', name: 'BNB $1,250' }
];

// Check these addresses (script deployer vs potential frontend wallet)
const ADDRESSES_TO_CHECK = [
  '0x959132daf311aA5A67b7BCcFCf684e7A05b92605', // Script wallet
  // Add your Rabby wallet address here if different
];

async function main() {
  console.log("🔍 Checking stakes across all markets\n");
  
  const marketABI = [
    "function state() view returns (uint8)",
    "function finalOutcome() view returns (uint8)",
    "function yesStake(address) view returns (uint256)",
    "function noStake(address) view returns (uint256)",
    "function yesPool() view returns (uint256)",
    "function noPool() view returns (uint256)"
  ];

  for (const market of MARKETS) {
    console.log(`\n📊 ${market.name} (${market.address})`);
    const contract = await ethers.getContractAt(marketABI, market.address);
    
    const state = await contract.state();
    const outcome = await contract.finalOutcome();
    const yesPool = await contract.yesPool();
    const noPool = await contract.noPool();
    
    console.log(`  State: ${state === 0n ? 'Open' : state === 1n ? 'Resolved' : 'Cancelled'}`);
    console.log(`  Outcome: ${outcome === 1n ? 'YES won' : outcome === 2n ? 'NO won' : 'Undecided'}`);
    console.log(`  Pools: YES ${ethers.formatEther(yesPool)} BNB | NO ${ethers.formatEther(noPool)} BNB`);
    
    for (const addr of ADDRESSES_TO_CHECK) {
      const yesStake = await contract.yesStake(addr);
      const noStake = await contract.noStake(addr);
      
      if (yesStake > 0n || noStake > 0n) {
        console.log(`\n  💰 ${addr.slice(0, 6)}...${addr.slice(-4)}:`);
        if (yesStake > 0n) console.log(`     YES: ${ethers.formatEther(yesStake)} BNB`);
        if (noStake > 0n) console.log(`     NO: ${ethers.formatEther(noStake)} BNB`);
        
        const didWin = (outcome === 1n && yesStake > 0n) || (outcome === 2n && noStake > 0n);
        console.log(`     Status: ${didWin ? '✅ WON - Can claim!' : '❌ Lost'}`);
      }
    }
  }
  
  console.log("\n\n💡 If no stakes found, add your frontend wallet address to ADDRESSES_TO_CHECK in the script");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

