# x402 Gasless Betting - Quick Start

## 🚀 Quick Implementation Checklist

### ✅ Frontend (Already Done!)
- [x] x402 types and EIP-712 utilities
- [x] Signature generation functions
- [x] Facilitator communication layer
- [x] `useX402Bet` React hook
- [x] Updated betting modal with toggle
- [x] Configuration system

### 🔨 Smart Contract (Deploy This!)
- [ ] Deploy `BinaryMarketV2_X402.sol` to BSC
- [ ] Set facilitator address
- [ ] Verify on BSCScan

### 🔧 Backend/Relayer (Set This Up!)
- [ ] Deploy facilitator/relayer service
- [ ] Fund facilitator wallet with BNB for gas
- [ ] Configure endpoint URL

### ⚙️ Configuration (Update These!)
- [ ] Set `NEXT_PUBLIC_X402_ENABLED=true`
- [ ] Set `NEXT_PUBLIC_X402_FACILITATOR_URL=your-url`

---

## 📝 Step-by-Step Setup

### Step 1: Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_X402_ENABLED=true
NEXT_PUBLIC_X402_FACILITATOR_URL=https://your-facilitator-url.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-id
```

### Step 2: Deploy Smart Contract

```bash
# In your hardhat project
cd /Users/reef/Desktop/cursorvibes/mini-prediction

# Create deployment script
cat > scripts/deployMarketFactoryV2_X402.js << 'EOF'
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Deploy factory with x402 support
  const MarketFactoryV2 = await hre.ethers.getContractFactory("MarketFactoryV2");
  
  const tellorOracle = "0x..."; // Your Tellor oracle address
  const defaultResolver = deployer.address;
  const facilitator = "0x..."; // Your facilitator wallet address
  
  const factory = await MarketFactoryV2.deploy(
    tellorOracle,
    defaultResolver,
    facilitator
  );
  
  await factory.waitForDeployment();
  console.log("Factory deployed to:", await factory.getAddress());
}

main().catch(console.error);
EOF

# Deploy
npx hardhat run scripts/deployMarketFactoryV2_X402.js --network bsc
```

### Step 3: Set Up Facilitator

#### Option A: Simple Express Server

```bash
mkdir facilitator && cd facilitator
npm init -y
npm install express ethers cors dotenv
```

Create `facilitator/index.js`:

```javascript
require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const provider = new ethers.JsonRpcProvider(
  process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org'
);

const facilitatorWallet = new ethers.Wallet(
  process.env.FACILITATOR_PRIVATE_KEY,
  provider
);

const MARKET_ABI = [
  "function betWithSignature(address user, uint256 amount, bool isYes, uint256 nonce, uint256 signatureDeadline, uint8 v, bytes32 r, bytes32 s) external payable"
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', address: facilitatorWallet.address });
});

app.post('/bet', async (req, res) => {
  try {
    const { user, marketAddress, amount, isYes, nonce, deadline, v, r, s, signature } = req.body;
    
    console.log('📥 Received bet request:', { user, marketAddress, amount, isYes });
    
    // Create contract instance
    const marketContract = new ethers.Contract(marketAddress, MARKET_ABI, facilitatorWallet);
    
    // Submit transaction (facilitator sponsors gas)
    console.log('📤 Submitting to blockchain...');
    const tx = await marketContract.betWithSignature(
      user,
      BigInt(amount),
      isYes,
      BigInt(nonce),
      BigInt(deadline),
      v,
      r,
      s,
      { 
        value: BigInt(amount),
        gasLimit: 300000
      }
    );
    
    console.log('⏳ Waiting for confirmation...', tx.hash);
    const receipt = await tx.wait();
    
    console.log('✅ Bet executed!', receipt.transactionHash);
    
    res.json({ 
      success: true, 
      txHash: receipt.transactionHash,
      message: 'Bet executed successfully'
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/estimate-fee', (req, res) => {
  // Estimate gas cost (optional)
  res.json({ fee: '0' }); // You can calculate actual gas cost here
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 x402 Facilitator running on port ${PORT}`);
  console.log(`📍 Address: ${facilitatorWallet.address}`);
});
```

Create `facilitator/.env`:

```bash
FACILITATOR_PRIVATE_KEY=your_private_key_here
BSC_RPC_URL=https://bsc-dataseed1.binance.org
PORT=3001
```

Run it:

```bash
cd facilitator
node index.js
```

#### Option B: Deploy to Cloud

```bash
# Deploy to Railway, Render, or Heroku
# Example: Railway
railway login
railway init
railway up
```

### Step 4: Fund Facilitator

The facilitator wallet needs BNB to pay gas:

```bash
# Send BNB to facilitator address
# Minimum: 0.1 BNB (for ~200-1000 bets depending on gas prices)
# Recommended: 1+ BNB for production
```

### Step 5: Test It!

```bash
# In frontend project
cd /Users/reef/Downloads/final_hivebets_darc\ 2
npm run dev
```

1. Open http://localhost:3004
2. Connect wallet
3. Click a market to bet
4. ✅ See "⚡ Gasless Betting (x402)" toggle (ON by default)
5. Enter bet amount
6. Click bet button
7. **Only sign in wallet** (no gas approval!)
8. Watch it execute!

---

## 🧪 Testing Checklist

- [ ] Facilitator health endpoint responds: `curl http://localhost:3001/health`
- [ ] Wallet shows signature request (not transaction)
- [ ] No gas approval in wallet
- [ ] Transaction appears on BSCScan
- [ ] Bet is recorded in contract
- [ ] Odds update correctly

---

## 🐛 Common Issues

### "x402 is not enabled"
→ Check `.env.local` has `NEXT_PUBLIC_X402_ENABLED=true`

### "Facilitator URL not configured"
→ Set `NEXT_PUBLIC_X402_FACILITATOR_URL` in `.env.local`

### "Signature expired"
→ Signatures expire in 10 minutes by default

### "Invalid nonce"
→ User's nonce may have changed, refresh and try again

### "Facilitator error: insufficient funds"
→ Fund facilitator wallet with more BNB

---

## 💰 Cost Comparison

| Method | User Pays | Platform Pays |
|--------|-----------|---------------|
| **Regular Betting** | ~$0.15 gas | $0 |
| **x402 Gasless** | $0 | ~$0.15 gas |

**Result**: Better UX, more conversions, lower barrier to entry!

---

## 📚 Files Created

### Frontend (`/Users/reef/Downloads/final_hivebets_darc 2/`)
- `src/lib/x402/types.ts` - Type definitions
- `src/lib/x402/signature.ts` - Signature utilities
- `src/lib/x402/facilitator.ts` - API communication
- `src/lib/x402/config.ts` - Configuration
- `src/lib/x402/index.ts` - Main exports
- `src/hooks/useX402Bet.ts` - React hook
- `src/contracts/BinaryMarketV2_X402.ts` - Updated ABI
- `src/components/betting-modal.tsx` - Updated UI

### Smart Contract (`/Users/reef/Desktop/cursorvibes/mini-prediction/`)
- `contracts/BinaryMarketV2_X402.sol` - Contract with x402 support

### Documentation
- `X402_SETUP.md` - Full setup guide
- `X402_QUICK_START.md` - This file!

---

## 🎉 You're Ready!

Once the facilitator is running and contracts are deployed, users will enjoy **completely gasless betting**! They'll only need to sign once - no BNB required for gas. 🚀

