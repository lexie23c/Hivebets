# Platform Fees

## Fee Structure

HiveBets has a simple, transparent fee structure:

| Fee Type           | Amount       | When Charged     | Who Pays      |
| ------------------ | ------------ | ---------------- | ------------- |
| **Platform Fee**   | .5%          | On winnings only | Winners       |
| **Gas Fee**        | $0 (Gasless) | Never            | Nobody (x402) |
| **Deposit Fee**    | 0%           | Never            | Nobody        |
| **Withdrawal Fee** | 0%           | Never            | Nobody        |

***

## Platform Fee (0.5%)

### How It Works

The platform charges .&#x35;**% of winnings** only:

```
Example:
You bet 1 BNB on YES
YES wins
Losing pool share allocated to you: 0.5 BNB
Platform fee: .5% × 0.5 = 0.01 BNB
You receive: 1 BNB (stake) + 0.5 - 0.01 = 1.49 BNB
```

### Key Points

**Only on winnings**, not on your initial stake\
**Only if you win** - losers pay no fee (they lose their bet)\
**Transparent** - deducted automatically by smart contract\
**No hidden fees** - .5% is the total platform fee

### Comparison

| Platform                      | Fee              |
| ----------------------------- | ---------------- |
| **HiveBets**                  | .5% on winnings  |
| Traditional sportsbook        | 4-10% house edge |
| Centralized prediction market | 2-5% on all bets |
| DEX trading fees              | 0.3-1% per trade |

***

## x402 Gasless Betting

### What Is x402?

**x402 gasless betting** means you never pay gas fees. HiveBets uses x402 protocol to sponsor all transaction costs for you.

### How It Works

With x402, you only need to:

| Action             | What You Do    | Gas Cost |
| ------------------ | -------------- | -------- |
| **Place Bet**      | Sign message   | $0       |
| **Claim Winnings** | Sign message   | $0       |
| **Check Odds**     | View (no sign) | $0       |
| **View Stakes**    | View (no sign) | $0       |

**No gas fees. Ever.**

### Why x402?

Traditional blockchain betting requires gas for every transaction:

| Platform                | Gas Cost per Bet | User Experience |
| ----------------------- | ---------------- | --------------- |
| **HiveBets (x402)**     | **$0**           | Just sign       |
| Traditional BSC betting | $0.10-0.20       | Pay gas         |
| Ethereum betting        | $10-50           | Expensive       |

x402 makes betting:

* **Free** - No gas fees
* **Simple** - Just sign messages
* **Fast** - Instant confirmation
* **Accessible** - No BNB needed for gas

### Why BSC?

We chose BSC for x402 implementation because:

| Network      | x402 Support | Speed     | Ecosystem |
| ------------ | ------------ | --------- | --------- |
| **BSC**      | Full support | 3-5 sec   | Large     |
| Ethereum     | Expensive    | 15-60 sec | Largest   |
| Polygon      | Supported    | 2-3 sec   | Growing   |

BSC offers the best balance of:

* x402 gasless support
* Fast confirmation
* Proven security
* Large user base

***

## Total Cost Breakdown

### Example 1: Small Bet

```
Bet: 0.01 BNB on YES
Outcome: YES wins
Winning share: 0.005 BNB

Costs:
- Bet transaction gas: $0 (x402 gasless)
- Platform fee: .5% × 0.005 = 0.0001 BNB ($0.06)
- Claim transaction gas: $0 (x402 gasless)
- Total fees: 0.0001 BNB ($0.06)

Payout:
- Stake returned: 0.01 BNB
- Winnings after fee: 0.0049 BNB
- Total received: 0.0149 BNB

Net profit: 0.0149 - 0.01 = 0.0049 BNB (~$2.94)

ROI: 49%
```

### Example 2: Max Bet

```
Bet: 0.5 BNB on NO
Outcome: NO wins
Winning share: 0.75 BNB (NO was minority)

Costs:
- Bet transaction gas: $0 (x402 gasless)
- Platform fee: .5% × 0.75 = 0.00375 BNB ($2.25)
- Claim transaction gas: $0 (x402 gasless)
- Total fees: 0.00375 BNB ($2.25)

Payout:
- Stake returned: 0.5 BNB
- Winnings after fee: 0.74625 BNB
- Total received: 1.24625 BNB

Net profit: 1.24625 - 0.5 = 0.74625 BNB (~$447.75)

ROI: 149.25%
```

### Example 3: Losing Bet

```
Bet: 0.05 BNB on YES
Outcome: NO wins

Costs:
- Bet transaction gas: $0 (x402 gasless)
- Platform fee: 0 (you didn't win)
- Claim transaction: 0 (nothing to claim)
- Total fees: $0

Payout: 0 BNB

Loss: -0.05 BNB (-$30)
Total lost: -0.05 BNB (-$30)

ROI: -100%
```

***

## Fee Destination

### Where Does the .5% Go?

Platform fees are used for:

1. **Platform Development** (40%)
   * New features
   * UI improvements
   * Bug fixes
2. **Infrastructure Costs** (30%)
   * Hosting
   * RPC nodes
   * Monitoring
3. **Security** (20%)
   * Audits
   * Bug bounties
   * Insurance fund
4. **Marketing & Growth** (10%)
   * Community building
   * Partnerships
   * User acquisition

### Transparency

All fee collection is **on-chain and visible**:

* Check BSCScan
* See feeCollected variable in contract
* Track withdrawals by platform

***

## Fee Comparison

### HiveBets vs Competitors

| Platform     | Type              | Fee                 | Notes                    |
| ------------ | ----------------- | ------------------- | ------------------------ |
| **HiveBets** | Prediction market | .5% on winnings     | Transparent, on-chain    |
| Polymarket   | Prediction market | 2% on orders        | Centralized, crypto bets |
| PredictIt    | Prediction market | 5% + 10% withdrawal | Fiat, US-regulated       |
| Augur        | Prediction market | \~1-2% + gas        | High Ethereum gas        |
| DraftKings   | Sports betting    | 15-20% edge         | Not transparent          |
| FanDuel      | Sports betting    | 15-20% edge         | Not transparent          |

### HiveBets Advantages

Lower fees than traditional betting\
Lower fees than regulated prediction markets\
Transparent (on-chain)\
No withdrawal fees\
BSC low gas costs

***

## x402 Technical Details

### How x402 Eliminates Gas Fees

HiveBets uses x402 protocol to sponsor all gas costs:

1. **EIP-712 Signatures**
   * Users sign typed data messages (no gas)
   * Signatures are cryptographically secure
   * No private key exposure
2. **Facilitator Network**
   * x402 facilitators relay signed transactions
   * Facilitators pay gas on behalf of users
   * Instant confirmation
3. **Smart Contract Integration**
   * Contracts verify signatures on-chain
   * Execute bets with full security
   * Same security as regular transactions

### Benefits Over Traditional Gas

| Feature              | x402 Gasless     | Traditional Gas |
| -------------------- | ---------------- | --------------- |
| User pays gas        | No               | Yes             |
| Transaction speed    | Instant          | 3-5 sec         |
| Requires BNB         | No               | Yes             |
| Wallet complexity    | Just sign        | Manage gas      |
| Small bet viability  | Always profitable| Often not worth |

***

## Future Improvements

Potential enhancements:

### 1. Enhanced Cashback

For high-volume users:

* Bet >1 BNB cumulative → 12% cashback
* Bet >5 BNB cumulative → 15% cashback

### 2. Referral Tiers

Multi-level referral system:

* Direct referrals → 15% commission
* Indirect referrals → 5% commission

### 3. Volume Discounts

Lower platform fees for bigger bets:

* 0.001-0.1 BNB → .5% fee
* 0.1-0.5 BNB → 0.4% fee

### 4. Cross-Chain x402

Expand to other chains:

* Ethereum with x402
* Polygon with x402
* Arbitrum with x402

***

## Fee FAQs

### Do I pay fees if I lose?

No fees at all. With x402 gasless betting, you pay $0 in gas and $0 platform fee (since you didn't win).

### Can I avoid the .5% fee?

No. It's automatically deducted by the smart contract from all winning payouts.

### Why is there a fee at all?

To sustain platform development, infrastructure, and growth. .5% is industry-low.

### Are there hidden fees?

No. Only .5% on winnings. x402 covers all gas fees. That's it.

### Can fees change?

Current markets have .5% fixed. Future markets could have different fees, but always disclosed upfront.

### Do I need BNB for gas?

No! x402 gasless betting means you never need BNB for gas. Just connect your wallet and sign.

***

## Cost Examples at Different BNB Prices

With x402 gasless betting, your costs are always the same regardless of BNB price:

### If BNB = $300

| Action    | Cost (BNB) | Cost (USD) |
| --------- | ---------- | ---------- |
| Bet       | 0          | $0         |
| Claim     | 0          | $0         |
| **Total** | **0**      | **$0**     |

### If BNB = $600 (current)

| Action    | Cost (BNB) | Cost (USD) |
| --------- | ---------- | ---------- |
| Bet       | 0          | $0         |
| Claim     | 0          | $0         |
| **Total** | **0**      | **$0**     |

### If BNB = $1,000

| Action    | Cost (BNB) | Cost (USD) |
| --------- | ---------- | ---------- |
| Bet       | 0          | $0         |
| Claim     | 0          | $0         |
| **Total** | **0**      | **$0**     |

💡 With x402, gas is always $0. You only pay the .5% platform fee on winnings.

***

## Maximize Your Returns

### Tips to Maximize Profits

1. **Take Advantage of Gasless Betting**
   * No gas fees means even small bets are profitable
   * Bet any amount from 0.001 to 0.5 BNB without worrying about gas
2. **Use Cashback System**
   * Earn 10% cashback on every bet
   * Cashback accumulates regardless of win/loss
3. **Share Your Referral Link**
   * Earn 15% commission on all referral bets
   * Passive income from your network
4. **Bet on Minority Side**
   * Higher payouts when you're in the minority
   * Check odds before betting

***

## Next Steps

Learn more:

[Parimutuel System](parimutuel.md) - How payouts work\
📋 [Market Rules](../markets/rules.md) - Betting rules\
💡 [Quick Start](../getting-started/quick-start.md) - Place your first bet

***

**Ready to bet?** [Get Started →](fees.md)
