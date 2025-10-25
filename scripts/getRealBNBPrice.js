const axios = require('axios');

async function getRealBNBPrice() {
  console.log("🔍 Fetching REAL BNB price from multiple sources...\n");
  
  const sources = [];
  
  // 1. BSCScan API
  try {
    const bscscanKey = 'P8NG9PCX4FCGIXBAJEEHFK5AP3ASSBSM5P';
    const bscscanRes = await axios.get(`https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${bscscanKey}`);
    if (bscscanRes.data.status === '1') {
      const price = parseFloat(bscscanRes.data.result.ethusd);
      sources.push({ source: 'BSCScan', price, time: new Date().toISOString() });
      console.log(`📊 BSCScan: $${price.toFixed(2)}`);
    }
  } catch (e) {
    console.log("❌ BSCScan failed:", e.message);
  }
  
  // 2. CoinGecko
  try {
    const cgRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
    const price = cgRes.data.binancecoin.usd;
    sources.push({ source: 'CoinGecko', price, time: new Date().toISOString() });
    console.log(`📊 CoinGecko: $${price.toFixed(2)}`);
  } catch (e) {
    console.log("❌ CoinGecko failed:", e.message);
  }
  
  // 3. Binance API
  try {
    const binanceRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    const price = parseFloat(binanceRes.data.price);
    sources.push({ source: 'Binance', price, time: new Date().toISOString() });
    console.log(`📊 Binance: $${price.toFixed(2)}`);
  } catch (e) {
    console.log("❌ Binance failed:", e.message);
  }
  
  // 4. DexScreener
  try {
    const dexRes = await axios.get('https://api.dexscreener.com/latest/dex/search?q=BNB%20USDT');
    const bnbPair = dexRes.data.pairs.find(p => 
      p.chainId === 'bsc' && 
      (p.baseToken.symbol === 'WBNB' || p.baseToken.symbol === 'BNB') &&
      p.quoteToken.symbol === 'USDT'
    );
    if (bnbPair) {
      const price = parseFloat(bnbPair.priceUsd);
      sources.push({ source: 'DexScreener', price, time: new Date().toISOString() });
      console.log(`📊 DexScreener: $${price.toFixed(2)}`);
    }
  } catch (e) {
    console.log("❌ DexScreener failed:", e.message);
  }
  
  if (sources.length === 0) {
    console.log("\n❌ All sources failed!");
    return;
  }
  
  // Calculate consensus
  const prices = sources.map(s => s.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const median = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)];
  
  console.log("\n\n📈 CONSENSUS BNB PRICE:");
  console.log(`   Average: $${avgPrice.toFixed(2)}`);
  console.log(`   Median: $${median.toFixed(2)}`);
  console.log(`   Sources: ${sources.length}/4 successful`);
  
  // Generate market questions
  console.log("\n\n💡 SMART MARKET QUESTIONS (Based on REAL price):\n");
  
  const currentPrice = median;
  const targets = [
    { target: Math.ceil(currentPrice * 1.05), timeframe: '7 days', risk: 'Low' },
    { target: Math.ceil(currentPrice * 1.10), timeframe: '14 days', risk: 'Medium' },
    { target: Math.ceil(currentPrice * 1.15), timeframe: '30 days', risk: 'Medium' },
    { target: 700, timeframe: '30 days', risk: 'High', note: '(Psychological level)' },
    { target: 750, timeframe: '60 days', risk: 'High', note: '(Major resistance)' }
  ];
  
  targets.forEach((t, idx) => {
    const change = ((t.target - currentPrice) / currentPrice * 100).toFixed(1);
    console.log(`${idx + 1}. Will BNB reach $${t.target} within ${t.timeframe}?`);
    console.log(`   📊 Current: $${currentPrice.toFixed(2)} → Target: $${t.target} (+${change}%)`);
    console.log(`   ⚠️  Risk: ${t.risk} ${t.note || ''}`);
    console.log("");
  });
  
  return { currentPrice, sources, avgPrice, median };
}

getRealBNBPrice();

