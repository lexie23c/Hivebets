# x402 Gasless Betting

HiveBets is the first prediction market platform to integrate x402 gasless betting technology, allowing you to place bets without paying any gas fees.

---

## What is x402?

x402 is a revolutionary gasless transaction protocol that eliminates the need for users to pay gas fees when interacting with smart contracts. Instead of submitting transactions directly, users simply sign messages, and our facilitator network sponsors the gas and submits the transaction on-chain.

### The Problem x402 Solves

Traditional blockchain betting requires:
- Holding extra BNB for gas fees
- Understanding gas prices and limits
- Waiting for transaction confirmations
- Dealing with failed transactions due to insufficient gas

**x402 eliminates all of this.**

---

## How x402 Works on HiveBets

### Traditional Betting Flow
```
User → Wallet Transaction → Pay Gas Fee → Blockchain → Bet Recorded
```

### x402 Gasless Betting Flow
```
User → Sign Message (Free) → x402 Facilitator → Sponsors Gas → Blockchain → Bet Recorded
```

### Step-by-Step Process

1. **You Choose Your Bet**
   - Select YES or NO on any market
   - Enter your bet amount in BNB
   - Toggle "Gasless Betting" ON

2. **You Sign a Message**
   - Your wallet shows "Sign Message" (not a transaction)
   - No gas fee required
   - Takes 1 second to sign

3. **x402 Facilitator Receives**
   - Our facilitator network receives your signed message
   - Verifies the signature is valid
   - Prepares the on-chain transaction

4. **Gas is Sponsored**
   - The facilitator pays the gas fee (not you)
   - Transaction is submitted to BSC blockchain
   - Your bet is recorded on-chain

5. **Instant Confirmation**
   - You receive confirmation
   - Your bet is live
   - Total cost to you: 0 BNB in gas

---

## Technical Implementation

### EIP-712 Typed Data Signing

x402 uses EIP-712, the industry standard for structured data signing used by protocols like Uniswap, OpenSea, and Aave.

**What You Sign:**
```
Domain: HiveBets
Chain: BSC (56)
Contract: Market Address
Message:
  - Your wallet address
  - Bet amount
  - Bet side (YES/NO)
  - Unique nonce
  - Signature deadline
```

### Security Features

**Nonce Protection**
- Each signature includes a unique nonce
- Prevents replay attacks
- Nonces increment with each bet

**Deadline Enforcement**
- Signatures expire after 15 minutes
- Prevents old signatures from being used
- Protects against front-running

**Domain Verification**
- Signatures are cryptographically bound to HiveBets
- Cannot be used on other platforms
- Chain ID verification ensures BSC only

**Non-Custodial**
- You never give token approvals
- Your funds never leave your control
- Facilitator can only execute what you sign

---

## Benefits of x402 Gasless Betting

### For New Users

**No Gas Complexity**
- Don't need to understand gas prices
- Don't need extra BNB for gas
- Just sign and bet

**Better Mobile Experience**
- Signing is simpler than transaction approval
- Works perfectly on mobile wallets
- Faster and more intuitive

### For Active Bettors

**Save Money**
- Zero gas fees on every bet
- More of your BNB goes to actual bets
- Especially valuable for small bets

**Faster Betting**
- No waiting for gas price calculations
- No transaction confirmation delays
- Instant signing

### For Everyone

**10% Cashback Still Applies**
- Gasless betting doesn't affect cashback
- Still earn 10% on every bet
- Still earn 15% referral commissions

---

## x402 vs Traditional Betting

| Feature | x402 Gasless | Traditional |
|---------|-------------|-------------|
| **Gas Fee** | 0 BNB | ~0.0005 BNB |
| **User Action** | Sign message | Approve transaction |
| **Speed** | Instant | Wait for confirmation |
| **Mobile UX** | Excellent | Complex |
| **Bet Outcome** | Identical | Identical |
| **Cashback** | 10% | 10% |
| **Referrals** | 15% | 15% |

---

## Facilitator Network

### What is the Facilitator?

The x402 facilitator is a service operated by HiveBets that:
- Receives signed messages from users
- Verifies signatures are valid
- Sponsors gas for transactions
- Submits bets to the blockchain
- Returns transaction confirmation

### Facilitator Economics

**How We Cover Gas Costs:**
- Platform fees (2% on winnings) cover facilitator costs
- Sustainable at scale with high betting volume
- No cost passed to users
- Better user experience drives more volume

### Facilitator Security

**Limited Permissions:**
- Can only execute bets you explicitly sign
- Cannot access your wallet
- Cannot withdraw your funds
- Cannot modify bet parameters

**Authorized Address:**
- Only one authorized facilitator per market
- All signatures verified on-chain
- Open source and auditable

---

## Using x402 on HiveBets

### Enabling Gasless Betting

1. Click on any market
2. Choose YES or NO
3. Enter bet amount
4. **Toggle "Gasless Betting" ON**
5. Click "Place Bet"
6. Sign the message in your wallet
7. Done!

### When to Use x402

**Always Recommended:**
- Small bets (under 0.1 BNB)
- Mobile betting
- Multiple bets in quick succession
- When you want to save gas

**Optional Traditional Betting:**
- If you prefer standard transactions
- If facilitator is temporarily offline
- Toggle "Gasless Betting" OFF

---

## Supported Wallets

x402 works with any wallet that supports EIP-712 signing:

- MetaMask (Desktop & Mobile)
- Rabby Wallet
- WalletConnect (all compatible wallets)
- Trust Wallet
- Rainbow Wallet
- Coinbase Wallet
- And more

---

## Troubleshooting

### "Signature Failed"
**Cause:** You rejected the signature request  
**Solution:** Try again and approve the signature

### "Signature Expired"
**Cause:** You waited too long to sign (>15 minutes)  
**Solution:** Refresh and place bet again

### "Invalid Nonce"
**Cause:** You signed multiple bets simultaneously  
**Solution:** Wait for previous bet to confirm, then try again

### "Facilitator Offline"
**Cause:** x402 facilitator temporarily unavailable  
**Solution:** Toggle off "Gasless Betting" and use traditional betting

---

## Frequently Asked Questions

### Is x402 safe?
Yes. x402 uses industry-standard EIP-712 signatures. You never give token approvals or fund access. The facilitator can only execute bets you explicitly sign.

### Can the facilitator steal my funds?
No. The facilitator has no access to your wallet or funds. It can only submit bets you sign with exact parameters you approve.

### Does x402 affect my bet outcome?
No. Whether you use x402 or traditional betting, the bet is identical on-chain. Same odds, same payouts, same cashback.

### Is there a limit to gasless bets?
No. You can place unlimited gasless bets. Each bet still requires your signature.

### What if x402 stops working?
You can always toggle off "Gasless Betting" and use traditional betting with gas fees. Both options are always available.

### Does x402 work on mobile?
Yes! x402 is especially good for mobile wallets as signing is simpler than transaction approval.

---

## The Future of Gasless Betting

HiveBets is pioneering gasless prediction markets. x402 represents the future of blockchain UX:

**No More Gas Anxiety**
- Users shouldn't worry about gas fees
- Betting should be simple and intuitive
- x402 makes this possible

**Mass Adoption Ready**
- Gasless transactions remove a major barrier
- New users can bet without understanding gas
- Better UX drives mainstream adoption

**Industry Leading**
- First prediction market with x402
- Setting the standard for gasless betting
- Other platforms will follow

---

## Technical Resources

### For Developers

Want to integrate x402 into your dApp?

- **EIP-712 Specification:** [eips.ethereum.org/EIPS/eip-712](https://eips.ethereum.org/EIPS/eip-712)
- **HiveBets Contracts:** [github.com/robertechs/Hivebets](https://github.com/robertechs/Hivebets)
- **x402 Documentation:** [X402_QUICK_START.md](../../X402_QUICK_START.md)

### Smart Contract Integration

Our contracts include `betWithSignature()` function:

```solidity
function betWithSignature(
    address user,
    uint256 amount,
    bool isYes,
    uint256 nonce,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external payable onlyFacilitator
```

---

## Get Started with x402

Ready to experience gasless betting?

1. Connect your wallet to HiveBets
2. Browse active markets
3. Toggle "Gasless Betting" ON
4. Sign and bet - pay zero gas fees

**Welcome to the future of prediction markets.**

---

*HiveBets x402 - The first gasless prediction market platform.*
