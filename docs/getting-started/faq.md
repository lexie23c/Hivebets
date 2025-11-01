# Frequently Asked Questions

## General Questions

### What is Hivebets?
Hivebets is a decentralized prediction market platform where users can bet on whether tokens will reach specific market cap targets before a deadline.

### Is Hivebets decentralized?
Yes! All bets are handled by smart contracts on BSC Mainnet. Markets resolve automatically using Hivebets Oracle. We never hold your funds.

### Which blockchain does Hivebets use?
We're built on **BSC (Binance Smart Chain)** Mainnet for fast transactions and low fees.

### Do I need to create an account?
No! Just connect your Web3 wallet (MetaMask, Rabby, or WalletConnect). No email, no KYC, no registration.

---

## Betting Questions

### How much can I bet?
- **Minimum**: 0.001 BNB
- **Maximum**: 0.5 BNB per wallet per side

You can bet on both YES and NO if you want, up to 0.5 BNB each.

### What are the fees?
- **Platform Fee**: 0.5% on winnings only
- **Gas Fees**: ~$0.10 per transaction (BSC network fees)
- **No deposit/withdrawal fees**

### How do I win?
If you bet on the correct outcome (YES or NO), you win! Winners split the losing pool proportionally to their stakes, minus the 0.5% platform fee.

### Can I change my bet?
No. Once a bet is placed, it's final. You can place additional bets (up to the max limit) but can't cancel existing ones.

### Can I bet on both YES and NO?
Yes! You can hedge your bets by placing up to 0.5 BNB on each side.

### What happens if I'm wrong?
You lose your bet. The BNB you bet goes to the winning pool.

---

## Market Questions

### How are markets created?
Markets are created through our smart contract factory. Each market specifies:
- A token
- A target market cap
- A deadline

### How are markets resolved?
Markets automatically resolve using **Hivebets Oracle**, which fetches real-world market cap data from multiple verified sources. If oracle data isn't available, the resolver can manually resolve based on verifiable data.

### When can I claim winnings?
Immediately after the market resolves! Click "Claim Winnings" and confirm the transaction.

### What if there's a tie?
There are no ties. The oracle checks if the token reached the target market cap (YES) or didn't (NO). It's binary.

### Can markets be cancelled?
Only before the deadline and only by the resolver. If cancelled, all bettors get 100% refunds.

---

## Odds & Payouts

### How are odds calculated?
Odds are based on the **parimutuel system**:
- If 70% of the pool is on YES, YES has 70% chance (lower payout)
- If 30% is on NO, NO has 30% chance (higher payout)

[Learn more about parimutuel betting →](../how-it-works/parimutuel.md)

### What's my potential payout?
Your payout = your stake + (losing pool × your stake / winning pool) - 0.5% fee

The interface shows your estimated payout before you bet.

### Why do odds change?
Odds update in real-time as people bet. More bets on YES increases YES odds and decreases NO odds.

### When are odds final?
At the deadline. Once the deadline passes, no more bets can be placed and odds are locked.

---

## Wallet & Security

### Which wallets are supported?
- 🦊 MetaMask
- 🐰 Rabby  
- 🔗 WalletConnect (any compatible wallet)

### Is my money safe?
Your funds are controlled by audited smart contracts on BSC Mainnet. We never custody your funds. However, smart contracts carry inherent risks.

### What if I lose my private key?
Your funds are tied to your wallet. If you lose your private key, we cannot recover your funds. Always back up your seed phrase!

### Can Hivebets access my wallet?
No. We can only interact with the specific functions you approve (placing bets, claiming winnings). We cannot withdraw funds without your explicit transaction approval.

---

## Technical Questions

### What are the contract addresses?
All contract addresses are verified on BSCScan. You can view them directly on our platform or check BSCScan for the latest deployments.

### Are the contracts audited?
Yes! Our contracts are based on industry-standard patterns (OpenZeppelin) and have been internally audited. View the code on [BSCScan](https://bscscan.com).

### Is the code open source?
Yes! All contract code is verified on BSCScan and available for review.

### Can I integrate Hivebets into my app?
Yes! Check our [Integration Guide](../for-developers/integration.md) for developers.

---

## Troubleshooting

### "Wrong Network" Error
**Solution**: Switch to BSC Mainnet in your wallet. Click the network dropdown and select "BNB Smart Chain" or "BSC".

### "Insufficient Funds" Error
**Solution**: Make sure you have enough BNB for both the bet and gas fees. Try reducing your bet amount.

### "Transaction Failed" Error
**Possible causes**:
- Deadline passed (can't bet after deadline)
- Exceeded max bet (0.5 BNB per wallet)
- Low gas limit (rare on BSC)
- Network congestion (try again)

### "Exceeds Cap" Error
**Solution**: You're trying to bet more than 0.1 BNB, or your total stakes on this side already equal 0.1 BNB.

### Transaction Pending Forever
**Solution**: BSC transactions usually confirm in 5-10 seconds. If stuck:
1. Check BSCScan for transaction status
2. Try increasing gas price
3. Contact support if truly stuck

### Can't See My Bet
**Check**:
1. Connected to correct wallet?
2. On BSC Mainnet?
3. Transaction confirmed on BSCScan?
4. Hard refresh page (Ctrl+F5)

---

## Rules & Risks

### What are the main risks?
- **Smart contract risk**: Bugs in code (mitigated by audits)
- **Oracle risk**: Oracle provides wrong data (mitigated by multi-source verification)
- **Market risk**: You can lose your bet
- **Network risk**: BSC network issues

[Read full risk factors →](../legal/risk-factors.md)

### Are there any restrictions?
- Geographic restrictions may apply
- You must be 18+ years old
- Comply with your local laws
- Don't bet more than you can afford to lose

### What's the platform fee used for?
The 0.5% fee covers:
- Platform development
- Infrastructure costs
- Security audits
- Future feature development

---

## Getting Help

### I have a question not covered here
- 🐦 Ask on [Twitter](https://x.com/Hivebetsbnb)
- 📖 Read the full [documentation](#)
- 📧 Contact support

### I found a bug
Please report it immediately! Security is our top priority.

### I have a feature request
We'd love to hear it! Share your ideas on Twitter or contact us.

---

## More Resources

[What is Hivebets?](what-is-hivebets.md)  
[Quick Start Guide](quick-start.md)  
⚙️ [How It Works](../how-it-works/prediction-markets.md)  
[Market Rules](../markets/rules.md)  

---

**Still have questions?** Reach out on [Twitter](https://x.com/Hivebetsbnb)!

