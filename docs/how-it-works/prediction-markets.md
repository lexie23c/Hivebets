# System Overview

## What is a Prediction Market?

A prediction market is a market where people bet on the outcome of future events. Participants buy and sell shares representing different outcomes, and the market price reflects the collective probability of each outcome.

### Generic Prediction Markets:

* Will candidate X win the election? (Polymarket)
* Will a sports team win the championship? (PredictIt)
* Will a company's stock reach $100? (Augur)



### Advantages of Specialization

| Generic Markets        | Hivebets (Four.meme Focus)     |
| ---------------------- | ------------------------------ |
| Predict everything     | Predict one thing really well  |
| No domain expertise    | Deep understanding of trenches |
| Generic oracle data    | BSC memecoin-optimized data    |
| Broad, shallow markets | Deep, liquid Four.meme markets |
| Unfocused community    | Trenches-native community      |

**Bottom line**: We're not trying to be everything to everyone. We're the best at predicting Four.meme token success on BNB Chain.

***

## How Hivebets Markets Work

### Market Structure

Each Hivebets market has:

1. **A Token** - The memecoin being predicted (e.g., 哈基米)
2. **A Target** - Market cap goal (e.g., $100M)
3. **A Deadline** - When betting closes (e.g., October 30, 2025)
4. **Two Outcomes** - YES (reaches target) or NO (doesn't reach target)

### Example Market

```
Token: 哈基米
Question: Will 哈基米 reach $100M mcap before October 30, 2025?

YES Pool: 10 BNB (67% of total)
NO Pool: 5 BNB (33% of total)
Total Pool: 15 BNB

If YES wins: YES bettors split 5 BNB (NO pool) proportionally
If NO wins: NO bettors split 10 BNB (YES pool) proportionally
```

***

## Betting Lifecycle

### Phase 1: Open Market

**Duration**: From market creation → deadline

Users can:

* &#x20;Place bets on YES or NO
* &#x20;See live odds
* &#x20;Check pool sizes
* &#x20;Cannot withdraw bets
* &#x20;Cannot change bets

### Phase 2: Waiting for Resolution

**Duration**: Deadline → resolution trigger

Market status:

* &#x20;Betting closed (deadline passed)
* &#x20;Awaiting oracle data
* &#x20;Buffer period (1 hour)
* &#x20;No claims yet

### Phase 3: Resolved

**Duration**: After resolution → forever

Market outcome:

* &#x20;Final outcome determined (YES or NO)
* &#x20;Winners can claim payouts
* &#x20;Losers get nothing
* &#x20;No more changes possible

***

## How Outcomes Are Determined

Hivebets uses **Hivebets Oracle** for trustless resolution:

### Oracle Resolution Process

1. **Deadline Passes**
   * No more bets allowed
   * Market enters buffer period
2. **Buffer Period (1 hour)**
   * Ensures oracle data is available
   * Prevents frontrunning
3. **Anyone Triggers Resolution**
   * Calls `resolveFromHivebets Oracle()` function
   * No special permissions needed
4. **Oracle Checks Data**
   * Fetches market cap from Hivebets Oracle
   * Compares to target
   * Returns YES or NO
5. **Market Settles**
   * Outcome recorded on-chain
   * Winners can claim
   * Process complete

[Learn more about Oracle Resolution →](oracle-resolution.md)

***

## Parimutuel System

Hivebets uses **parimutuel betting**, where:

* All bets go into a pool
* Winners split the losing pool
* No house odds or bookmaker

### Example Calculation

```
Market: Will $4 reach $444M?

Bets Placed:
- Alice bets 1 BNB on YES
- Bob bets 2 BNB on YES  
- Charlie bets 3 BNB on NO

YES Pool: 3 BNB (50%)
NO Pool: 3 BNB (50%)
Total: 6 BNB

Scenario 1: YES Wins
- Alice gets: 1 + (3 × 1/3) - 2% = 1.98 BNB
- Bob gets: 2 + (3 × 2/3) - 2% = 3.96 BNB
- Charlie gets: 0 BNB (lost)
- Platform fee: 0.06 BNB

Scenario 2: NO Wins
- Charlie gets: 3 + (3 × 3/3) - 2% = 5.88 BNB
- Alice gets: 0 BNB (lost)
- Bob gets: 0 BNB (lost)
- Platform fee: 0.12 BNB
```

[Learn more about Parimutuel Betting →](parimutuel.md)

***

## Smart Contract Architecture

```
┌─────────────────────────────────────┐
│         User's Wallet               │
│      (MetaMask, Rabby, etc.)        │
└──────────────┬──────────────────────┘
               │
               │ Connects to
               ▼
┌─────────────────────────────────────┐
│      Hivebets               │
│      (Frontend Interface)           │
└──────────────┬──────────────────────┘
               │
               │ Calls
               ▼
┌─────────────────────────────────────┐
│     Binary Market Contract          │
│   (BSC Mainnet Smart Contract)      │
│                                     │
│  Functions:                         │
│  - bet(yes/no)                      │
│  - claim()                          │
│  - resolveFromHivebets Oracle()              │
└──────────────┬──────────────────────┘
               │
               │ Reads from
               ▼
┌─────────────────────────────────────┐
│      hivebets Oracle                  │
│  (Decentralized Data Provider)      │
│                                     │
│  Provides: Token market cap data    │
└─────────────────────────────────────┘
```

***

## Key Principles

### 1. Trustless

No central authority controls market outcomes. Smart contracts and oracles handle everything automatically.

### 2. Transparent

All bets, pools, and outcomes are visible on the blockchain. Anyone can verify.

### 3. Non-Custodial

We never hold your funds. Everything happens through smart contract interactions you approve.

### 4. Automated

Markets resolve automatically using oracle data. No manual intervention required.

### 5. Fair

Max bet limits prevent whale manipulation. Parimutuel system ensures fair odds.

***

## Advantages Over Traditional Prediction Markets

| Feature          | Hivebets                    | Traditional                |
| ---------------- | --------------------------- | -------------------------- |
| **Trust**        | Trustless (smart contracts) | Requires trust in platform |
| **Transparency** | 100% on-chain               | Opaque backend             |
| **Resolution**   | Automated (oracle)          | Manual or subjective       |
| **Fees**         | 0.5% on winnings              | 5-10%+ on all bets         |
| **Custody**      | Non-custodial               | Platform holds funds       |
| **Censorship**   | Resistant                   | Can ban users              |
| **Verification** | Anyone can verify           | Must trust platform        |

***

## Common Use Cases

### Speculation

"I think 哈基米 will moon before October. Let me bet on it!"

### Hedging

"I bought 哈基米 tokens. Let me bet NO to hedge my risk."

### Market Research

"What does the crowd think? Let me check the odds."

### Arbitrage

"Odds are mispriced. There's an opportunity here."

***

## Market Dynamics

### Early vs Late Betting

**Early Bets** (right after market creation):

* &#x20;Better odds (less competition)
* &#x20;More time for research
* &#x20;More uncertainty
* &#x20;Longer wait for resolution

**Late Bets** (near deadline):

* &#x20;More information available
* &#x20;Shorter wait for results
* &#x20;Worse odds (pools already filled)
* &#x20;Less time to react

### Odds Movement

Odds change as bets are placed:

* More YES bets → YES odds decrease (worse payout)
* More NO bets → YES odds increase (better payout)
* Self-balancing mechanism

***

## Safety Features

### Max Bet Limits

**0.5 BNB per wallet per side** prevents:

* Whale manipulation
* Market cornering
* Unfair advantage for big players

### Deadline Enforcement

* No bets after deadline
* Prevents frontrunning oracle
* Ensures fair resolution

### Cancellation Protection

* Markets can only be cancelled before deadline
* If cancelled, 100% refunds to all bettors
* Prevents rug pulls after outcome known

***

## Next Steps

Learn more about specific aspects:

&#x20;[Parimutuel Betting](parimutuel.md) - How payouts are calculated\
&#x20;[Oracle Resolution](oracle-resolution.md) - How markets resolve\
&#x20;[Platform Fees](fees.md) - Fee structure explained

[Market Rules](../markets/rules.md) - Complete market rules

***

**Ready to bet?** [Place your first bet →](../getting-started/quick-start.md)
