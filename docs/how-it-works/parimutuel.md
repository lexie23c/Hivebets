# Parimutuel Pools

## What is Parimutuel Betting?

**Parimutuel betting** is a betting system where all bets go into a pool, and winners share the losing pool proportionally to their stakes.

### Key Characteristics:

* &#x20;No bookmaker setting odds
* &#x20;No house edge (just a small fee)
* &#x20;Odds determined by bettors themselves
* &#x20;Self-balancing market

### Origin

The term comes from French: "pari mutuel" = "mutual betting". It's commonly used in horse racing and other sports betting.

***

## How It Works on HiveBets

### Basic Flow

1. **Pool Creation**
   * Two pools: YES and NO
   * Initially empty (0 BNB each)
2. **Bets Accumulate**
   * Users bet on YES or NO
   * Each bet adds to respective pool
   * Pools grow over time
3. **Odds Update**
   * Odds = Pool Size / Total Pool
   * Calculated in real-time
   * Displayed as percentages
4. **Resolution**
   * Winning pool gets their stake back
   * Winning pool also gets the losing pool
   * Distributed proportionally
5. **Payouts**
   * Your share = Your stake / Winning pool size
   * You get: Stake + (Losing pool × Your share)
   * Minus .5% platform fee

***

## Example Walkthrough

Let's see a complete example:

### Initial State

```
哈基米 Market
YES Pool: 0 BNB
NO Pool: 0 BNB
Total: 0 BNB
```

### Bet 1: Shelly bets 2 BNB on YES

```
YES Pool: 2 BNB (100%)
NO Pool: 0 BNB (0%)
Total: 2 BNB

Shelly's odds: 100% (no competition yet)
```

### Bet 2: David bets 1 BNB on NO

```
YES Pool: 2 BNB (67%)
NO Pool: 1 BNB (33%)
Total: 3 BNB

Shelly's YES odds: 67%
David's NO odds: 33%
```

### Bet 3: Josh bets 1 BNB on YES

```
YES Pool: 3 BNB (75%)
NO Pool: 1 BNB (25%)
Total: 4 BNB

YES odds: 75%
NO odds: 25%
```

### Bet 4: Eva bets 2 BNB on NO

```
YES Pool: 3 BNB (50%)
NO Pool: 3 BNB (50%)
Total: 6 BNB

Final odds: 50/50
```

### Scenario A: YES Wins

**Winners**: Shelly (2 BNB) + Josh (1 BNB) = 3 BNB staked\
**Losing Pool**: 3 BNB (from David + Eva)\
**Platform Fee**: .5% of 3 BNB = 0.06 BNB\
**To Distribute**: 3 - 0.06 = 2.94 BNB

**Shelly's Share**: 2/3 of pool = 66.67%\
**Shelly's Payout**: 2 BNB (stake) + (2.94 × 0.6667) = 2 + 1.96 = **3.96 BNB**\
**Shellys Profit**: 1.96 BNB&#x20;

**Josh's Share**: 1/3 of pool = 33.33%\
**Josh's Payout**: 1 BNB (stake) + (2.94 × 0.3333) = 1 + 0.98 = **1.98 BNB**\
**Josh's Profit**: 0.98 BNB&#x20;

**David**: Loses 1 BNB \
**Eva**: Loses 2 BNB&#x20;

### Scenario B: NO Wins

**Winners**: David (1 BNB) + Eva (2 BNB) = 3 BNB staked\
**Losing Pool**: 3 BNB (from Shelly + Josh)\
**Platform Fee**: .5% of 3 BNB = 0.06 BNB\
**To Distribute**: 3 - 0.06 = 2.94 BNB

**David's Share**: 1/3 of pool = 33.33%\
**David's Payout**: 1 BNB (stake) + (2.94 × 0.3333) = 1 + 0.98 = **1.98 BNB**\
**David's Profit**: 0.98 BNB&#x20;

**Eva's Share**: 2/3 of pool = 66.67%\
**Eva's Payout**: 2 BNB (stake) + (2.94 × 0.6667) = 2 + 1.96 = **3.96 BNB**\
**Eva"s Profit**: 1.96 BNB&#x20;

**Shelly**: Loses 2 BNB \
Josh: Loses 1 BNB&#x20;

***

## Payout Formula

### The Math

```
Your Payout = Your Stake + (Losing Pool × Your Stake / Winning Pool) - Platform Fee

Where:
- Your Stake = What you bet
- Losing Pool = Total BNB in the losing side
- Winning Pool = Total BNB in your side (including you)
- Platform Fee = .5% of (Losing Pool × Your Stake / Winning Pool)
```

### Simplified

```
Your Share of Winnings = (Your Stake / Winning Pool) × Losing Pool
Your Total Payout = Your Stake + Your Share of Winnings - .5% Fee
```

### Example Calculation

```
You bet: 1 BNB on YES
YES Pool: 4 BNB total
NO Pool: 2 BNB total
Outcome: YES wins

Step 1: Calculate your share
Your share = 1 / 4 = 25% of YES pool

Step 2: Calculate winnings from losing pool
Winnings = 25% × 2 BNB = 0.5 BNB

Step 3: Calculate fee
Fee = .5% × 0.5 = 0.01 BNB

Step 4: Calculate total payout
Payout = 1 (stake) + 0.5 (winnings) - 0.01 (fee) = 1.49 BNB

Your profit: 0.49 BNB (+49% ROI)
```

***

## Odds Display

### Percentage Odds

HiveBets shows odds as **percentages**:

```
YES: 70%
NO: 30%
```

This means:

* 70% of the pool is on YES
* 30% of the pool is on NO

### What This Tells You

**Higher Percentage = Lower Payout**

* If YES is 70%, YES bettors have more competition
* Winning YES bet pays less per BNB
* But higher "probability" of winning (according to the crowd)

**Lower Percentage = Higher Payout**

* If NO is 30%, NO bettors have less competition
* Winning NO bet pays more per BNB
* But lower "probability" of winning (according to the crowd)

***

## Advantages of Parimutuel

### 1. No House Edge

Traditional sportsbooks have a house edge (4-10%). Parimutuel has only a small admin fee (.5%).

**Example**:

* Traditional book: Might offer 1.8x on both sides (11% edge)
* Parimutuel: Depends on pools, but typically fairer

### 2. Market-Driven Odds

The crowd sets the odds. If everyone thinks YES, odds move to reflect that.

### 3. No Betting Limits (Except Max Cap)

Unlike traditional books that limit sharp bettors, anyone can bet up to the max (0.1 BNB).

### 4. Transparent

You see exactly how much is in each pool. No hidden algorithms.

### 5. Can't Be "Banned"

Traditional sportsbooks ban winners. Parimutuel doesn't care if you win.

***

## Strategic Implications

### Early Bird Advantage

Betting early when pools are small can get you better odds:

```
Example:
Bet 1: You bet 0.1 BNB on YES when YES pool = 0.1 BNB
Your share: 100% of YES pool

Bet 2: Someone else bets 0.9 BNB on YES
Your share: Now only 10% of YES pool

Result: Later bettors dilute your share!
```

**Lesson**: If you have strong conviction, bet early.

### Contrarian Strategy

Betting against the crowd can pay well:

```
YES Pool: 9 BNB (90%)
NO Pool: 1 BNB (10%)

If NO wins:
NO bettors split 9 BNB
9x potential return!

If YES wins:
YES bettors split 1 BNB
Only 1.11x return
```

**Lesson**: Minority side has higher upside if correct.

### Hedging

You can bet on both sides:

```
Bet 0.08 BNB on YES
Bet 0.02 BNB on NO

Scenario A: YES wins
You profit from YES, lose small NO bet
Net: Likely small profit

Scenario B: NO wins (if NO was minority)
You profit big from NO, lose YES bet
Net: Likely profit

Worst case: Small loss
Best case: Good profit
```

**Lesson**: Hedging reduces variance.

***

## Odds Movement Example

Watch how odds change with each bet:

```
Initial State:
YES: 0 BNB
NO: 0 BNB

After 1 BNB on YES:
YES: 100%
NO: 0%

After 1 BNB on NO:
YES: 50%
NO: 50%

After 3 BNB more on YES:
YES: 80% (4 BNB / 5 BNB)
NO: 20% (1 BNB / 5 BNB)

After 4 BNB more on NO:
YES: 44% (4 BNB / 9 BNB)
NO: 56% (5 BNB / 9 BNB)
```

Notice how odds flip as bets accumulate!

***

## Comparison to Fixed Odds

| Feature          | Parimutuel (HiveBets) | Fixed Odds (Traditional) |
| ---------------- | --------------------- | ------------------------ |
| **Odds Set By**  | Bettors               | Bookmaker                |
| **Odds Change**  | Yes, continuously     | No (locked at bet time)  |
| **House Edge**   | .5% fee only          | 4-10% built into odds    |
| **Transparency** | 100% (on-chain pools) | Opaque                   |
| **Max Bet**      | 0.1 BNB               | Varies (can be banned)   |
| **Fairness**     | Market-driven         | Bookmaker sets           |

***

## Common Questions

### Why do odds keep changing?

Because parimutuel odds reflect the current pool ratio. Every new bet changes the pools, thus changing the odds.

### Can I lock in my odds?

No. Your payout is determined by the final pool sizes at deadline, not when you bet.

### Does it matter when I bet?

For the odds you get: **No** (determined at deadline).\
For your share of the pool: **Yes** (betting early means less dilution).

### What if I bet when odds are good, then odds get worse?

Your payout is still based on final odds at deadline. Early betting doesn't lock in better odds, but it does give you a bigger share of your side's pool.

***

## Advanced: Slippage

In parimutuel, "slippage" occurs when your own bet moves the odds:

```
Before your bet:
YES: 3 BNB (75%)
NO: 1 BNB (25%)

You bet: 1 BNB on NO

After your bet:
YES: 3 BNB (60%)
NO: 2 BNB (40%)

Your bet moved NO from 25% → 40%!
```

**Large bets** relative to pool size cause more slippage.

**Small bets** barely move odds.

With 0.1 BNB max, slippage is usually minimal on HiveBets.

***

## Next Steps

Learn more:

&#x20;[Prediction Markets](prediction-markets.md) - Market overview\
&#x20;[Oracle Resolution](oracle-resolution.md) - How outcomes are determined\
&#x20;[Platform Fees](fees.md) - Detailed fee breakdown

***

**Ready to bet?** [Quick Start Guide →](../getting-started/quick-start.md)
