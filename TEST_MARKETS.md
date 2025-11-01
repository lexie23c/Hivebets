# Test Markets - 10 Minute Duration

**Created:** October 22, 2025  
**Network:** BSC Testnet  
**Factory:** `0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB`

---

## Market 1: BNB Price Target

**Market Address:** `0xC76816898d32B76b941f0548734AFfe4A0A424BA`

**Question:** Will BNB hit $1100 before October 24th?

**Details:**
- Target: $1,100 USD
- Max Bet: 0.1 BNB per side
- Fee: 0.5%
- Duration: 10 minutes
- Category: Price Target

**Frontend Config:**
```javascript
{
  address: '0xC76816898d32B76b941f0548734AFfe4A0A424BA',
  name: 'BNB Price',
  symbol: 'BNB',
  platform: 'bsc',
  category: 'Price Target',
  target: 1100,
  question: 'Will BNB hit $1100 before October 24th?'
}
```

---

## Market 2: CZ Tweet about $4

**Market Address:** `0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1`

**Question:** Will CZ tweet about $4 (0x0A43fC31a73013089DF59194872Ecae4cAe14444) before October 25th?

**Details:**
- Target Token: $4 (Four.meme)
- Token Address: `0x0A43fC31a73013089DF59194872Ecae4cAe14444`
- Max Bet: 0.05 BNB per side
- Fee: 0.5%
- Duration: 10 minutes
- Category: Social Signal

**Frontend Config:**
```javascript
{
  address: '0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1',
  name: 'CZ Tweet about $4',
  symbol: 'CZ-TWEET',
  platform: 'twitter',
  category: 'Social Signal',
  target: 1,
  question: 'Will CZ tweet about $4 before October 25th?'
}
```

---

## Testing Instructions

### 1. Update Your Frontend

Add these markets to `main.js` MARKETS array:

```javascript
const MARKETS = [
    // ... existing markets ...
    
    // BNB Price Market
    { 
        address: '0xC76816898d32B76b941f0548734AFfe4A0A424BA', 
        name: 'BNB Price', 
        symbol: 'BNB',
        platform: 'bsc',
        category: 'Price Target',
        target: 1100,
        question: 'Will BNB hit $1100 before October 24th?'
    },
    
    // CZ Tweet Market
    { 
        address: '0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1', 
        name: 'CZ Tweet about $4', 
        symbol: 'CZ-TWEET',
        platform: 'twitter',
        category: 'Social Signal',
        target: 1,
        question: 'Will CZ tweet about $4 before October 25th?'
    }
];
```

### 2. Place Test Bets

```bash
# Bet YES on BNB hitting $1100
npx hardhat run scripts/placeBet.js --network bsctest 0xC76816898d32B76b941f0548734AFfe4A0A424BA yes 0.01

# Bet NO on CZ tweeting about $4
npx hardhat run scripts/placeBet.js --network bsctest 0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1 no 0.01
```

### 3. Check Market Status

```bash
# Check BNB market
npx hardhat run scripts/previewMarketV2.js --network bsctest 0xC76816898d32B76b941f0548734AFfe4A0A424BA

# Check CZ tweet market
npx hardhat run scripts/previewMarketV2.js --network bsctest 0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1
```

### 4. After 10 Minutes, Resolve Markets

```bash
# Resolve BNB market (manually since it's a test)
npx hardhat run scripts/resolveMarketV2.js --network bsctest 0xC76816898d32B76b941f0548734AFfe4A0A424BA yes

# Resolve CZ tweet market
npx hardhat run scripts/resolveMarketV2.js --network bsctest 0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1 no
```

### 5. Claim Winnings

```bash
# Claim from BNB market
npx hardhat run scripts/claimFromOracleMarket.js --network bsctest 0xC76816898d32B76b941f0548734AFfe4A0A424BA

# Claim from CZ tweet market
npx hardhat run scripts/claimFromOracleMarket.js --network bsctest 0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1
```

---

## Test Checklist

- [ ] Markets show up in frontend
- [ ] Can connect wallet
- [ ] Can place YES bets
- [ ] Can place NO bets
- [ ] Cashback is calculated correctly
- [ ] Odds update in real-time
- [ ] Can't bet after deadline
- [ ] Markets resolve correctly
- [ ] Can claim winnings
- [ ] Referral link works

---

## Contract Addresses (BSC Testnet)

- **Factory V2:** `0xab6e2eb6cE6E905C5226f6ce1fF2b964e465C6dB`
- **HivebetsOracle:** `0x0346C9998600Fde7bE073b72902b70cfDc671908`
- **BNB Market:** `0xC76816898d32B76b941f0548734AFfe4A0A424BA`
- **CZ Tweet Market:** `0xE74F0aD00c8Bc1d9D99AEDe05c4afD73284b4BC1`

---

**Markets expire in 10 minutes from creation. Test quickly! ⏰**

