// @ts-ignore
import api from './api';

const paymentService = {
  createOrder: async (amount: number, currency = 'INR') => {
    const response = await api.post('/payments/create-order', { amount, currency });
    return response.data;
  },

  verifyPayment: async (paymentId: string, orderId: string, signature: string) => {
    const response = await api.post('/payments/verify', { paymentId, orderId, signature });
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  processRefund: async (paymentId: string, amount: number, reason: string) => {
    const response = await api.post('/payments/refund', { paymentId, amount, reason });
    return response.data;
  },

  getTransactionHistory: async (filters?: any) => {
    const response = await api.get('/payments/transactions', { params: filters });
    return response.data;
  },

  getWalletBalance: async () => {
    const response = await api.get('/payments/wallet/balance');
    return response.data;
  },

  addToWallet: async (amount: number) => {
    const response = await api.post('/payments/wallet/add', { amount });
    return response.data;
  },

  withdrawFromWallet: async (amount: number, bankAccountId: string) => {
    const response = await api.post('/payments/wallet/withdraw', { amount, bankAccountId });
    return response.data;
  },

  getBankAccounts: async () => {
    const response = await api.get('/payments/bank-accounts');
    return response.data;
  },

  addBankAccount: async (accountData: any) => {
    const response = await api.post('/payments/bank-accounts', accountData);
    return response.data;
  }
};

export default paymentService;
