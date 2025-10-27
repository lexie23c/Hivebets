# Oracle Integration

## What is an Oracle?

In blockchain, an **oracle** is a system that brings real-world data onto the blockchain. Smart contracts can't access the internet, so oracles act as bridges.

### Why Oracles Matter

For HiveBets to resolve markets automatically, we need to know:

* **What is the current market cap of token X?**
* **Did token X reach the target by the deadline?**

This data exists off-chain (on exchanges, DEXs, aggregators). An oracle fetches it and makes it available on-chain.

***

## Hivebets Oracle

HiveBets uses its own advanced  decentralized oracle network on BSC Mainnet.

### Key Features:

**Decentralized** - Multiple data reporters\
**Transparent** - All data on-chain\
**Dispute Mechanism** - False data can be challenged\
**Trustless** - No central authority&#x20;

**Cryptoeconomically Secure** - Staking and slashing

***

## How Markets Resolve

### Automatic Resolution Flow

```
1. Market Deadline Passes
   ↓
2. 1-Hour Buffer Period
   ↓
3. Anyone Calls resolveFromHivebets()
   ↓
4. Contract Queries Hivebets Oracle
   ↓
5. Hivebets Returns Market Cap Data
   ↓
6. Contract Compares to Target
   ↓
7. Market Resolves to YES or NO
   ↓
8. Winners Can Claim Payouts
```

### Step-by-Step Breakdown

#### 1. Deadline Passes

```
Example: Market deadline is Oct 31, 2025 23:59:59 UTC
No more bets allowed after this time.
```

#### 2. Buffer Period (1 Hour)

```
Between deadline and resolution:
- Ensures oracle data is available
- Prevents frontrunning
- Gives reporters time to submit data

Anyone trying to resolve before buffer ends will fail.
```

#### 3. Resolution Trigger

```solidity
// Anyone can call this function (no special permissions)
function resolveFromHivebets() external {
    require(block.timestamp >= deadline + 1 hour);
    // ... resolution logic
}
```

**Anyone** can trigger resolution:

* User
* Developer
* Bot
* Random person

**No gas cost for HiveBets** - caller pays gas.

#### 4. Query HIvebets

```solidity
// Contract asks Hivebets: "What's the market cap?"
(bytes memory value, uint timestamp) = Hivebets.getDataBefore(
    queryId, 
    deadline + 1 hour
);
```

**queryId** uniquely identifies the data request:

* Token address
* Data type (MarketCap)

#### 5. Hivebets Returns Data

```solidity
// Hivebets returns:
uint256 marketCap = abi.decode(value, (uint256));

// Example: 125000000 (= $125M in 8 decimals)
```

#### 6. Compare to Target

```solidity
if (marketCap >= targetMarketCap) {
    outcome = true; // YES wins
} else {
    outcome = false; // NO wins
}
```

#### 7. Market Resolved

```solidity
resolved = true;
emit Resolved(outcome);
```

Once resolved, **cannot be changed**. Result is final.

#### 8. Claims Open

```solidity
function claim() external {
    require(resolved, "Not resolved");
    // ... payout logic
}
```

Winners can now claim their BNB.

***

## Fallback: Manual Resolution

If Hivebets data is **unavailable or disputed**, the resolver (contract creator) can manually resolve:

```solidity
function resolveManual(bool _outcome) external onlyResolver {
    require(!resolved, "Already resolved");
    require(block.timestamp >= deadline, "Before deadline");
    
    resolved = true;
    outcome = _outcome;
    
    emit Resolved(outcome);
}
```

### When Manual Resolution is Used:

* Hivebets data not available
* Hivebets data is disputed
* Oracle network issues

### Requirements:

* Only the designated resolver can call
* Must provide verifiable proof (e.g., DEXScreener screenshot)
* Community can verify on BSCScan

***

## Example: 哈基米 Market

Let's walk through a real resolution:

### Market Setup

```
Token: 哈基米 (0x82Ec31D69b3c289E541b50E30681FD1ACAd24444)
Question: Will 哈基米 reach $100M mcap before Oct 30?
Target: $100,000,000
Deadline: Oct 30, 2025 23:59:59 UTC
QueryId: 0xabc123... (for "TokenMarketCap" of 哈基米)
```

### Timeline

**October 25, 2025**

```
Current market cap: $75M
YES Pool: 5 BNB
NO Pool: 3 BNB
Betting still open.
```

**October 30, 2025 20:00 UTC**

```
Market cap pumps to $110M!
YES Pool: 8 BNB (final)
NO Pool: 4 BNB (final)
Deadline in 4 hours.
```

**October 30, 2025 23:59:59 UTC**

```
Deadline hits!
No more bets allowed.
Market cap: $115M
```

**October 31, 2025 01:00 UTC**

```
Buffer period ends (1 hour after deadline).
Anyone can now call resolveFromHivebets().
```

**October 31, 2025 01:05 UTC**

```
Bob calls resolveFromHivebets():
1. Function queries Hivebets
2. Hivebets returns: market cap = $115M at Oct 30 23:59
3. Contract checks: $115M >= $100M? YES ✅
4. Market resolves to YES
5. Event emitted: Resolved(true)
```

**October 31, 2025 01:10 UTC**

```
YES bettors see "Claim Winnings" button.
Alice clicks, confirms transaction, receives her payout!
```

***

## Hivebets Data Flow

```
┌─────────────────────────────────────┐
│    Real World (DEXs, Aggregators)   │
│                                     │
│  哈基米 trading at $115M mcap       │
└──────────────┬──────────────────────┘
               │
               │ Data Reporters fetch
               ▼
┌─────────────────────────────────────┐
│      Hivebets Reporters               │
│  (Decentralized network of nodes)   │
│                                     │
│  - Fetch market cap from sources    │
│  - Submit to Hivebets Oracle          │
│  - Stake TRB to report              │
└──────────────┬──────────────────────┘
               │
               │ Submit data
               ▼
┌─────────────────────────────────────┐
│      Hivebets Oracle Contract         │
│      (BSC: 0xD9157...CC0)           │
│                                     │
│  - Stores submitted data            │
│  - Tracks timestamps                │
│  - Handles disputes                 │
└──────────────┬──────────────────────┘
               │
               │ Query
               ▼
┌─────────────────────────────────────┐
│    HiveBets Market Contract     │
│                                     │
│  - Calls getDataBefore()            │
│  - Receives market cap              │
│  - Compares to target               │
│  - Resolves market                  │
└─────────────────────────────────────┘
```

***

## Data Query Specification

### Query Structure

```solidity
// Encode query parameters
bytes queryData = abi.encode(
    "TokenMarketCap",  // Data type
    tokenAddress       // Which token (e.g., 哈基米)
);

// Generate unique query ID
bytes32 queryId = keccak256(queryData);
```

### Data Format

Hivebets returns market cap as **uint256 with 8 decimals**:

```
$1 = 100000000
$100M = 10000000000000000
$1B = 100000000000000000
```

**Example**:

```
Real market cap: $125,500,000
Hivebets value: 12550000000000000
```

***

## Security Features

### 1. Dispute Mechanism

If Hivebets data is incorrect:

* Anyone can dispute within 12 hours
* Disputer stakes TRB
* If successful, bad reporter is slashed
* HiveBets can wait for dispute period

### 2. Time-Weighted Average

Hivebets can provide TWAP (Time-Weighted Average Price) to prevent manipulation via flash loans or brief pumps.

### 3. Multiple Reporters

Multiple independent parties report data, increasing reliability.

### 4. Cryptoeconomic Security

Reporters stake TRB tokens. Bad data = loss of stake.

***

## What If Scenarios

### What if Hivebets data doesn't exist?

**Answer**: Resolver manually resolves using verifiable data (DEXScreener, etc.). Community can verify on BSCScan.

### What if Hivebets data is disputed?

**Answer**: Wait for dispute resolution. If dispute succeeds, use corrected data. If needed, resolver manually resolves.

### &#x20;What if resolver manually resolves incorrectly?

**Answer**: All data is on-chain. Anyone can verify. Reputation damage would hurt future markets. Future versions could use DAO voting.

### &#x20;What if there's a flash crash right at deadline?

**Answer**: Hivebets can use time-weighted average or median price over a period to prevent manipulation.

### &#x20;What if nobody triggers resolveFromHivebets()?

**Answer**: Eventually someone will (to claim their winnings). Anyone can call it. We can also run a bot.

***

## Comparison to Alternatives

| Oracle Type         | Pros                          | Cons                            | HiveBets Choice    |
| ------------------- | ----------------------------- | ------------------------------- | ------------------ |
| **Hivebets**        | Decentralized, proven, on BSC | Requires reporters              | **Primary**        |
| **Chainlink**       | Most established              | Not specialized for custom data |  Not used          |
| **Manual Only**     | Simple                        | Requires trust                  |  **Fallback only** |
| **Snapshot Oracle** | Free                          | Centralized                     |  Not used          |

***

## Future Enhancements

Potential improvements to oracle resolution:

### 1. Multi-Oracle

Query both Hivebets + Chainlink. Resolve only if both agree.

### 2. DAO Resolution

If oracles disagree, token holders vote on outcome.

### 3. Dispute Period

Mandatory 12-hour wait before finalization, allowing disputes.

### 4. TWAP by Default

Always use time-weighted average over last hour.

***

## Transparency

All oracle interactions are **publicly visible on BSCScan**:

* Query submission
* Data returned
* Timestamp of data
* Resolution transaction
* Outcome

Anyone can verify:

```
1. Check BSCScan for market contract
2. Find Resolved event
3. See exact oracle data used
4. Verify correctness against DEXScreener/CoinGecko
```

***

## Next Steps

Learn more:

🎯 [Prediction Markets](prediction-markets.md) - Overall system\
💰 [Platform Fees](fees.md) - Fee structure\
📋 [Market Rules](../markets/rules.md) - Complete rules

***

**Ready to bet?** [Quick Start →](../getting-started/quick-start.md)
