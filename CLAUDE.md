# Smart Kissan Development Guide

## Commands
- **Install All**: `cd client && npm install && cd ../server && npm install`
- **Run Client**: `cd client && npm run dev`
- **Run Server**: `cd server && npm run dev`
- **Prisma Studio**: `cd server && npx prisma studio`
- **Deploy Contracts**: (Check `/blockchain` for scripts)

## Structure
- `client/src`: React components and logic.
- `server/src/services`: Core logic including `blockchain.service.js`, `ai.service.js`, `ipfs.service.js`, and `trust.worker.js`.
- `server/prisma`: Database schema and migrations.
- `blockchain/contracts`: Solidity smart contracts.

## Key Service Endpoints (Server)
- `/api/v1/auth`: Authentication
- `/api/v1/farmer`: Farmer operations
- `/api/v1/buyer`: Buyer operations
- `/api/v1/payments`: Razorpay & Wallet
- `/api/v1/ai`: AI Analysis
