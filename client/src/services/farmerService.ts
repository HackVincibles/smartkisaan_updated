import api from './api';

const farmerService = {
  // ── Product Listings ──────────────────────────────────────
  getListings: async (params?: any) => {
    const response = await api.get('/farmer/listings', { params });
    return response;
  },

  getListingById: async (id: string) => {
    const response = await api.get(`/farmer/listings/${id}`);
    return response;
  },

  createListing: async (data: any) => {
    // Backend uses multipart/form-data for images
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file: File) => formData.append('images', file));
      } else if (typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/farmer/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  },

  updateListing: async (id: string, data: any) => {
    const response = await api.put(`/farmer/listings/${id}`, data);
    return response;
  },

  deleteListing: async (id: string) => {
    const response = await api.delete(`/farmer/listings/${id}`);
    return response;
  },

  // ── Bids & Offers ─────────────────────────────────────────
  getBids: async (listingId?: string) => {
    const url = listingId ? `/farmer/listings/${listingId}/bids` : '/farmer/bids';
    const response = await api.get(url);
    return response;
  },

  acceptBid: async (bidId: string) => {
    const response = await api.post(`/farmer/bids/${bidId}/accept`);
    return response;
  },

  // ── Orders ────────────────────────────────────────────────
  getOrders: async (params?: any) => {
    const response = await api.get('/farmer/orders', { params });
    return response;
  },

  // ── Market Data ───────────────────────────────────────────
  getMandiPrices: async (crop?: string) => {
    const response = await api.get('/farmer/mandi-prices', { params: { crop } });
    return response;
  },

  predictPrice: async (crop: string, days: number, currentPrice: number) => {
    const response = await api.get('/farmer/predict-price', { 
      params: { crop, days, currentPrice } 
    });
    return response;
  },

  // ── Analytics & Dashboard ─────────────────────────────────
  getDashboardStats: async () => {
    const response = await api.get('/farmer/dashboard/stats');
    return response;
  },

  // ── New Features ──────────────────────────────────────────
  getClusters: async () => {
    const response = await api.get('/farmer/clusters');
    return response;
  },

  checkInsurance: async () => {
    const response = await api.get('/farmer/insurance-check');
    return response;
  },

  // ── AI Advice ─────────────────────────────────────────────
  getAIAdvice: async (query: string) => {
    const response = await api.post('/ai/advice', { query });
    return response;
  }
};

export default farmerService;
