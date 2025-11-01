const https = require('https');

const BSCSCAN_API_KEY = "HC4CH9TD6RWBYNVXJQRCZX7NWS7YCGV7P8";

const txHashes = [
  { hash: "0x01b353d0f43aa18b1baba34305df0baf8e1633da98485b471e87927924bfd19d", name: "币安人生 ($400M)" },
  { hash: "0x11ed087cbfb351b87863a492c7caa4688273bc91473b16cef8dbccb657644bac", name: "PALU ($40M)" },
  { hash: "0x397a92b95d6b1f9788cfec32cd597e69a1af9dd04d7dda7bfb0fb4dad682ca8b", name: "BNB ($1,300)" }
];

async function getInternalTxs(txHash) {
  return new Promise((resolve, reject) => {
    const url = `https://api.bscscan.com/api?module=account&action=txlistinternal&txhash=${txHash}&apikey=${BSCSCAN_API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log("🔍 Fetching contract addresses from BSCScan...\n");

  for (const tx of txHashes) {
    try {
      const result = await getInternalTxs(tx.hash);
      
      if (result.status === "1" && result.result && result.result.length > 0) {
        // Find contract creation
        const contractCreation = result.result.find(r => r.type === "create");
        
        if (contractCreation) {
          console.log(`✅ ${tx.name}`);
          console.log(`   Address: ${contractCreation.contractAddress}`);
          console.log(`   BSCScan: https://bscscan.com/address/${contractCreation.contractAddress}\n`);
        } else {
          console.log(`⚠️  ${tx.name}: No contract creation found`);
          console.log(`   Internal txs: ${result.result.length}\n`);
        }
      } else {
        console.log(`❌ ${tx.name}: ${result.message || 'No internal transactions'}\n`);
      }
      
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`❌ Error fetching ${tx.name}:`, error.message);
    }
  }
}

main();

