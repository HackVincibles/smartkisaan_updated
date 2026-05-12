import api from './api';

const buyerService = {
  // ── Marketplace ──────────────────────────────────────────
  getListings: async (filters?: any) => {
    const response = await api.get('/buyer/listings', { params: filters });
    return response;
  },

  getProductById: async (id: string) => {
    // listings/:id not on backend, use listings with filter
    const response = await api.get('/buyer/listings', { params: { id } });
    return response;
  },

  placeBid: async (listingId: string, bidData: any) => {
    const response = await api.post(`/buyer/listings/${listingId}/bid`, bidData);
    return response;
  },

  // ── Orders ────────────────────────────────────────────────
  getOrders: async (params?: any) => {
    const response = await api.get('/buyer/orders', { params });
    return response;
  },

  getOrderById: async (id: string) => {
    const response = await api.get('/buyer/orders', { params: { id } });
    return response;
  },

  initiatePayment: async (orderId: string, paymentData?: any) => {
    const response = await api.post(`/buyer/orders/${orderId}/pay`, paymentData || {});
    return response;
  },

  verifyDelivery: async (data: { orderId: string; qrCode?: string; otp?: string }) => {
    const response = await api.post('/buyer/verify-delivery', data);
    return response;
  },

  // ── Demand / Reverse Auction ──────────────────────────────
  getDemands: async () => {
    const response = await api.get('/buyer/demand');
    return response;
  },

  createDemand: async (demandData: any) => {
    const response = await api.post('/buyer/demand', demandData);
    return response;
  },
};

export default buyerService;
