# SmartKisan Backend API

Production-grade agricultural marketplace engine with AI diagnostics, secure escrow, and real-time logistics.

## 🚀 Quick Start

1.  **Clone & Install**
    ```bash
    git clone <repo-url>
    cd smartkisan-backend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file based on `.env.example`:
    - `MONGODB_URI`: MongoDB Atlas connection string
    - `JWT_SECRET`: Secure string for auth
    - `HF_TOKEN`: HuggingFace Inference API token
    - `RAZORPAY_KEY_ID`: Razorpay integration
    - `CLOUDINARY_URL`: Media storage

3.  **Run Development**
    ```bash
    npm run dev
    ```

## 🏗 Architecture

-   **AI Hub**: Crop detection, disease analysis, and quality grading via HuggingFace.
-   **Escrow Engine**: Multi-stage state machine with quality-based payout rules.
-   **Logistics**: Real-time GPS tracking (Redis/Socket.io) and secure QR verification.
-   **Blockchain Audit**: Tamper-proof transaction logging (Solana stubs).

## 🛠 Tech Stack

-   **Runtime**: Node.js (Express)
-   **Database**: MongoDB (Mongoose)
-   **Realtime**: Socket.io & Redis
-   **Payments**: Razorpay
-   **Media**: Cloudinary
-   **Logging**: Winston & Morgan

## 🧪 Testing

```bash
npm test
```

## 🌐 Deployment

Deployed on **Render.com** with automatic CI/CD from the main branch.
CORS configured for Vercel production frontend.
