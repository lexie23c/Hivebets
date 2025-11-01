# Hivebets Mainnet Deployment

**Deployment Date:** October 25, 2025  
**Network:** BSC Mainnet (Chain ID: 56)  
**Deployer:** 0x959132daf311aA5A67b7BCcFCf684e7A05b92605

---

## Deployed Contracts

### Core Infrastructure

| Contract | Address | BSCScan |
|----------|---------|---------|
| **HivebetsOracle** | `0x01851D6C0a978296c7FC50f9326eB21fa9A32F87` | [View](https://bscscan.com/address/0x01851D6C0a978296c7FC50f9326eB21fa9A32F87) |
| **MarketFactoryV2** | `0xC5aDeB8E57B3bE1fe91a900a845165eFe790cA47` | [View](https://bscscan.com/address/0xC5aDeB8E57B3bE1fe91a900a845165eFe790cA47) |

---

## Live Markets

### Market 1: BNB → $1,300
- **Address:** `0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40`
- **Question:** Will BNB trade above $1,300?
- **Deadline:** October 26, 2025 at 8:00 PM ET (Oct 27, 12:00 AM UTC)
- **Max Bet:** 10 BNB per wallet
- **Fee:** 2%
- **[Trade on BSCScan](https://bscscan.com/address/0x0Dccb3Be0CDA891bC0082b140e0DE43fC13Bfc40)**

### Market 2: 币安人生 → $300M Market Cap
- **Address:** `0xd055f4D1af414E2880BA71f55024d0Ce44075AA4`
- **Question:** Will 币安人生 reach $300M market cap?
- **Deadline:** October 26, 2025 at 10:00 PM ET (Oct 27, 2:00 AM UTC)
- **Token CA:** 0x924fa68a0FC644485b8df8AbfA0A41C2e7744444
- **Max Bet:** 10 BNB per wallet
- **Fee:** 2%
- **[Trade on BSCScan](https://bscscan.com/address/0xd055f4D1af414E2880BA71f55024d0Ce44075AA4)**

### Market 3: CZ Tweet About Aster
- **Address:** `0x1fe579419787CF48e918ABAb684d9792dfE1AC37`
- **Question:** Will CZ tweet about Aster?
- **Deadline:** October 31, 2025 at 8:00 PM ET (Nov 1, 12:00 AM UTC)
- **Max Bet:** 10 BNB per wallet
- **Fee:** 2%
- **[Trade on BSCScan](https://bscscan.com/address/0x1fe579419787CF48e918ABAb684d9792dfE1AC37)**

### Market 4: PALU → $40M Market Cap
- **Address:** `0xc838f181FE484628cd5fe2eF4c64890D979B480C`
- **Question:** Will PALU trade above $40M?
- **Deadline:** October 26, 2025 at 8:00 PM ET (Oct 27, 12:00 AM UTC)
- **Token CA:** 0x02e75d28A8AA2a0033b8cf866fCf0bB0E1eE4444
- **Max Bet:** 10 BNB per wallet
- **Fee:** 2%
- **[Trade on BSCScan](https://bscscan.com/address/0xc838f181FE484628cd5fe2eF4c64890D979B480C)**

### Market 5: $4 Binance Spot Listing
- **Address:** `0x8D4f714931f7b23d9265f20F650E8FdfD03f37e3`
- **Question:** Will $4 get Binance spot listing?
- **Deadline:** October 31, 2025 at 10:00 PM ET (Nov 1, 2:00 AM UTC)
- **Max Bet:** 10 BNB per wallet
- **Fee:** 2%
- **[Trade on BSCScan](https://bscscan.com/address/0x8D4f714931f7b23d9265f20F650E8FdfD03f37e3)**

---

## Platform Features

- **Max Bet:** 10 BNB per wallet per side
- **Trading Fee:** 0.5% on winnings
- **Cashback:** 0.2% on all bets
- **Referral Rewards:** 0.1% of referred bets
- **Auto-generated Referral Links:** Every wallet gets `https://hivebets.xyz/ref/{address}`

---

## Technical Details

### Smart Contract Architecture
- **Factory Pattern:** Deploys individual market contracts
- **Oracle Integration:** HivebetsOracle for decentralized data feeds
- **Parimutuel System:** Dynamic odds based on pool sizes
- **ReentrancyGuard:** Protection against reentrancy attacks

### Deployment Scripts
- `scripts/deployHivebetsOracleMainnet.js` - Oracle deployment
- `scripts/deployMainnetFactory.js` - Factory deployment
- `scripts/deployMainnetMarkets.js` - Markets deployment

---

## Important Notes

1. **Oracle Funding:** Fund oracle with BNB for gas to submit data
2. **Resolution:** Markets need manual/automated resolution after deadline
3. **Monitoring:** Set up services to watch:
   - CZ Twitter (@cz_binance) for Aster mentions
   - Binance announcements (@binance) for $4 spot listing
   - DexScreener for market cap data

---

## Links

- **Website:** https://hivebets.xyz
- **Twitter:** https://x.com/Hivebetsbnb
- **GitHub:** https://github.com/lexie23c/Hivebets
- **BSC Explorer:** https://bscscan.com

---

## Gas Costs Summary

- Oracle Deployment: ~0.0017 BNB
- Factory Deployment: ~0.0018 BNB
- 5 Markets Deployment: ~0.0029 BNB
- **Total:** ~0.0064 BNB

**Final Balance:** 0.097 BNB remaining

