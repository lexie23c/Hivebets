const axios = require('axios');

async function scrapeBSCTokens() {
  console.log("🔍 Fetching top BSC tokens from DexScreener API...\n");
  
  try {
    // Try trending tokens first
    let response = await axios.get('https://api.dexscreener.com/token-boosts/top/v1');
    let bscTokens = [];
    
    if (response.data && response.data.length > 0) {
      console.log("📈 Found trending tokens, fetching BSC data...\n");
      
      // Get BSC tokens from trending list
      for (const item of response.data.slice(0, 30)) {
        if (item.chainId === 'bsc' && item.tokenAddress) {
          try {
            const pairData = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${item.tokenAddress}`);
            if (pairData.data.pairs && pairData.data.pairs.length > 0) {
              const bestPair = pairData.data.pairs
                .filter(p => p.chainId === 'bsc')
                .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
              if (bestPair) bscTokens.push(bestPair);
            }
          } catch (e) {
            // Skip failed tokens
          }
        }
      }
    }
    
    // Fallback: Get top BSC pairs directly
    if (bscTokens.length === 0) {
      console.log("📊 Fetching top BSC pairs directly...\n");
      response = await axios.get('https://api.dexscreener.com/latest/dex/pairs/bsc/0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16,0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE');
      bscTokens = response.data.pairs || [];
    }
    
    // Get top tokens by volume and mcap
    const tokens = bscTokens
      .filter(pair => 
        pair.volume?.h24 > 50000 && // Min $50k volume
        pair.fdv > 500000 // Min $500k FDV
      )
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, 20);

    console.log("📊 Top 20 BSC Tokens by Volume:\n");
    
    tokens.forEach((token, idx) => {
      console.log(`${idx + 1}. ${token.baseToken.name} (${token.baseToken.symbol})`);
      console.log(`   💰 Market Cap: $${(token.fdv / 1000000).toFixed(2)}M`);
      console.log(`   📊 24h Volume: $${(token.volume.h24 / 1000000).toFixed(2)}M`);
      console.log(`   💵 Price: $${parseFloat(token.priceUsd).toFixed(6)}`);
      console.log(`   📈 24h Change: ${token.priceChange.h24?.toFixed(2)}%`);
      console.log(`   🔗 Address: ${token.baseToken.address}`);
      console.log("");
    });

    // Generate market questions
    console.log("\n\n💡 PREDICTION MARKET QUESTIONS:\n");
    
    const markets = [];
    
    for (let i = 0; i < Math.min(5, tokens.length); i++) {
      const token = tokens[i];
      const currentMcap = token.fdv;
      const target = currentMcap * 2; // Double market cap target
      
      markets.push({
        name: token.baseToken.name,
        symbol: token.baseToken.symbol,
        address: token.baseToken.address,
        currentMcap: currentMcap,
        targetMcap: target,
        question: `Will ${token.baseToken.symbol} reach $${(target / 1000000).toFixed(0)}M market cap within 30 days?`
      });
    }

    markets.forEach((market, idx) => {
      console.log(`${idx + 1}. ${market.name} (${market.symbol})`);
      console.log(`   ❓ ${market.question}`);
      console.log(`   📊 Current: $${(market.currentMcap / 1000000).toFixed(2)}M → Target: $${(market.targetMcap / 1000000).toFixed(0)}M`);
      console.log(`   🔗 ${market.address}`);
      console.log("");
    });

    // Generate deployment script
    console.log("\n\n📝 DEPLOYMENT SNIPPET:\n");
    console.log("const MARKET_IDEAS = [");
    markets.forEach(market => {
      console.log(`  {`);
      console.log(`    name: '${market.symbol}',`);
      console.log(`    question: '${market.question}',`);
      console.log(`    tokenAddress: '${market.address}',`);
      console.log(`    targetMcap: ${Math.floor(market.targetMcap)},`);
      console.log(`    deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days`);
      console.log(`  },`);
    });
    console.log("];");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

scrapeBSCTokens();

