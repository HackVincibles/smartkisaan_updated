import api from './api';

// Note: This is a service that interacts with window.ethereum and backend
const blockchainService = {
  connectWallet: async () => {
    // @ts-ignore
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // @ts-ignore
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      return {
        account: accounts[0],
        chainId: parseInt(chainId, 16)
      };
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  },

  getFarmerSBTs: async (address: string) => {
    const response = await api.get(`/blockchain/sbt/${address}`);
    return response.data;
  },

  issueTrustReceipt: async (orderId: string, transactionHash: string) => {
    const response = await api.post('/blockchain/trust-receipt', {
      orderId,
      transactionHash
    });
    return response.data;
  },

  verifyTrustReceipt: async (receiptId: string) => {
    const response = await api.get(`/blockchain/trust-receipt/${receiptId}/verify`);
    return response.data.isValid;
  },

  getTransactionHistory: async (address: string) => {
    const response = await api.get(`/blockchain/transactions/${address}`);
    return response.data;
  }
};

export default blockchainService;
