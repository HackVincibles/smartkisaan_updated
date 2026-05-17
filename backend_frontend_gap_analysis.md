# SmartKissan — Backend vs Frontend Gap Analysis

## 1. Backend Architecture Summary

The `server/` directory contains a full production-grade Node.js/Express API with:
- **10 Controllers**: admin, ai, auth, buyer, dispute, farmer, logistics, payment, rating, wallet
- **13 Services**: AI grading, blockchain (Polygon Amoy), IPFS (Pinata), escrow state machine, group buying, voice (Whisper), notifications, price prediction, insurance
- **2 Smart Contracts**: `KissanEscrow.sol` and `FarmerReputation.sol`

---

## 2. Feature Gap Matrix

### 🔴 COMPLETELY ABSENT from Frontend

| Backend Feature | Controller/Service | Impact |
|---|---|---|
| **Trust Receipts** (blockchain receipt per order) | `trust.worker.js`, `blockchain.service.js` | HIGH – Entire audit trail invisible |
| **Soulbound Token (SBT) Badges** | `FarmerReputation.sol`, `blockchain.service.js` | HIGH – Static placeholder badges, not real SBTs |
| **Dispute Flow** (raise, view AI verdict, accept resolution) | `disputeController.js` | HIGH – "Raise Dispute" button only shows an Alert |
| **Evidence Vault** (IPFS upload for disputes) | `ipfs.service.js`, `disputeController.js` | HIGH – No IPFS evidence upload UI exists |
| **Escrow Status Dashboard** | `paymentController.js` (`getEscrowBalance`) | HIGH – Escrow state completely hidden from UI |
| **QR Code Display** (farmerQR / buyerQR after payment) | `paymentController.js` | HIGH – QR codes generated but never shown |
| **Razorpay Payment Checkout** | `paymentController.js` (`createRazorpayOrder`) | HIGH – "Place bid" exists but no actual payment UI |
| **Voice Command Interface** | `voiceService.js` (Whisper multilingual) | MEDIUM – Listed in backend, no mic UI |
| **AI Resolution Rules Display** | `disputeController.js` (`getResolutionRules`) | MEDIUM – Logic exists, UI doesn't explain it |
| **Group Buying / Cluster View** | `groupBuying.js`, `farmerController.js` (`getClusters`) | MEDIUM – No farmer cluster/pool UI |
| **Price Prediction Chart** | `pricePredictor.js`, `farmerController.js` | MEDIUM – Market screen has static data |
| **PMFBY Insurance Eligibility** | `insuranceService.js`, `farmerController.js` | MEDIUM – No insurance check UI |
| **Wallet: Add Funds via Razorpay** | `walletController.js` (`initAddFunds`, `verifyAndLoadFunds`) | HIGH – "Add Money" button does nothing |
| **Wallet: Withdraw to Bank** | `walletController.js` (`withdrawToBank`) | HIGH – "Withdraw" button does nothing |
| **Wallet: Send Money (P2P)** | `walletController.js` (`sendMoney`) | MEDIUM – Not implemented |
| **Real Transaction History** | `walletController.js` (`getTransactions`) | HIGH – Only hardcoded mock data |
| **Rating / Review Submission** | `ratingController.js` | MEDIUM – Reviews screen exists but no submit form |
| **Available Loads (Transporter)** | `logisticsController.js` (`getAvailableLoads`) | MEDIUM – Only assigned orders shown |
| **Live GPS Location Update** | `logisticsController.js` (`updateLocation`) | HIGH – Track order UI is static |
| **Delivery Confirmation QR Scan** | `logisticsController.js` (`confirmDelivery`) | HIGH – No QR scan flow in transporter app |

### 🟡 PARTIALLY IMPLEMENTED (UI exists, missing key features)

| Frontend Screen | What's Missing |
|---|---|
| `(farmer)/profile.js` | SBT badges are hardcoded (3 static), no real `getFarmerBadges` call; no blockchain explorer link |
| `(shared)/wallet.js` | Balance hardcoded (₹24,850), all buttons non-functional, no real transaction history |
| `(buyer)/my-orders.js` | No escrow status, no blockchain receipt link, dispute is just an Alert |
| `(buyer)/track-order.js` | Static map, no live GPS from Redis/Socket.io |
| `(transporter)/shipments.js` | No QR scanner for pickup/delivery confirmation |
| `(admin)/disputes.js` | List exists but no resolve action wired to `resolveDisputeAdmin` |
| `(farmer)/market.js` | Static mandi rates, no `getPricePrediction` integration |
| `(farmer)/bids.js` | Bid shown but no `acceptBid` API call |

---

## 3. Blockchain Integration Plan (Starting Now)

### Phase 1 — New Screens to Build (UI only, ready for API connection)

#### A. `blockchain-receipt.js` (Shared)
- Shows orderId, farmerId, buyerId, amount, quality grade, timestamp
- Mock txHash with Polygon Amoy explorer link
- "Verify on Chain" button

#### B. `sbt-badges.js` (Farmer) 
- Full SBT gallery: Trusted Farmer, Quality Champion, Consistent Supplier
- Badge criteria displayed (10 deliveries, >4.5 stars, 50 no-dispute orders)
- "View on Polygon" link per badge
- Progress bars toward earning next badge

#### C. `evidence-vault.js` (Shared/Buyer)
- Upload photos + attach chat proof to a dispute
- Shows IPFS CID after mock upload
- View uploaded evidence with IPFS gateway link
- Tamper-proof indicator badge

#### D. `escrow-status.js` (Shared)
- Visual escrow state machine progress (Pending → Paid → Pickup → Transit → Delivered → Completed)
- Shows locked amount, breakdown (product + freight + fee)
- AI Quality Score bar
- Release timeline (7-day auto-release countdown)
- Dispute button when in DELIVERED state

### Phase 2 — Enhance Existing Screens

#### Enhanced `(buyer)/my-orders.js`
- Add "View Trust Receipt" button on completed orders → `blockchain-receipt.js`
- Add "View Escrow" button → `escrow-status.js`
- Dispute button → `evidence-vault.js` (upload flow)

#### Enhanced `(farmer)/profile.js`  
- SBT badges section → links to `sbt-badges.js`
- Trust score from blockchain, not hardcoded
- Progress to next badge

---

## 4. Smart Contract ABIs (for frontend integration)

### KissanEscrow ABI (read-only functions for UI)
```json
[
  "function orders(uint256) view returns (address farmer, address buyer, uint256 amount, uint256 aiScore, uint8 status, string imageCID)"
]
```

### FarmerReputation ABI (read-only)
```json
[
  "function getFarmerBadges(address _farmer) view returns (uint256[] memory)",
  "function badges(uint256) view returns (string name, string imageURI)"
]
```

### Contract Addresses (Polygon Amoy Testnet)
- Escrow: `process.env.ESCROW_CONTRACT_ADDRESS` 
- Reputation: `process.env.REPUTATION_CONTRACT_ADDRESS`
- RPC: `https://rpc-amoy.polygon.technology`
- Chain ID: `80002`
