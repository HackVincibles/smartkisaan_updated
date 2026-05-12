const { ethers } = require("ethers");

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const ESCROW_ADDRESS = process.env.ESCROW_CONTRACT_ADDRESS;
const REPUTATION_ADDRESS = process.env.REPUTATION_CONTRACT_ADDRESS;

const ESCROW_ABI = [
  "function createOrder(address _farmer, uint256 _orderId) external payable",
  "function confirmDelivery(uint256 _orderId, uint256 _aiScore, string memory _imageCID) external",
  "function resolveDispute(uint256 _orderId, uint256 _farmerAmount, uint256 _buyerRefund) external"
];

const REPUTATION_ABI = [
  "function mintBadge(address _farmer, string memory _name, string memory _uri) external",
  "function getFarmerBadges(address _farmer) external view returns (uint256[] memory)"
];

class PolygonService {
  constructor() {
    if (!PRIVATE_KEY) {
      console.warn("⚠️ POLYGON_PRIVATE_KEY is missing. Blockchain features will be disabled.");
      return;
    }
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.escrow = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, this.wallet);
    this.reputation = new ethers.Contract(REPUTATION_ADDRESS, REPUTATION_ABI, this.wallet);
  }

  async confirmDeliveryOnChain(orderId, aiScore, imageCID) {
    try {
      const numericId = parseInt(orderId.substring(0, 8), 16); 
      const tx = await this.escrow.confirmDelivery(numericId, Math.floor(aiScore * 100), imageCID);
      const receipt = await tx.wait();
      return { hash: receipt.hash, explorerUrl: `https://amoy.polygonscan.com/tx/${receipt.hash}` };
    } catch (error) {
      console.error("Escrow Error:", error);
      throw error;
    }
  }

  async awardFarmerBadge(farmerAddress, badgeName, ipfsUri) {
    try {
      const tx = await this.reputation.mintBadge(farmerAddress, badgeName, ipfsUri);
      const receipt = await tx.wait();
      return { hash: receipt.hash };
    } catch (error) {
      console.error("Reputation Error:", error);
      throw error;
    }
  }
}

module.exports = new PolygonService();
