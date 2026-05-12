import api from './api';

const transporterService = {
  // ── Dashboard & Stats ─────────────────────────────────────
  getDashboardStats: async () => {
    const response = await api.get('/logistics/dashboard');
    return response;
  },

  // ── Order Management ──────────────────────────────────────
  getAssignedOrders: async () => {
    const response = await api.get('/logistics/assigned-orders');
    return response;
  },

  getAvailableLoads: async (params?: any) => {
    const response = await api.get('/logistics/available-loads', { params });
    return response;
  },

  acceptOrder: async (orderId: string) => {
    const response = await api.post(`/logistics/orders/${orderId}/accept`);
    return response;
  },

  confirmPickup: async (orderId: string, pickupData?: any) => {
    const response = await api.post(`/logistics/orders/${orderId}/pickup`, pickupData || {});
    return response;
  },

  confirmDelivery: async (orderId: string, deliveryData?: any) => {
    const response = await api.post(`/logistics/orders/${orderId}/delivery`, deliveryData || {});
    return response;
  },

  // ── Tracking ──────────────────────────────────────────────
  updateLocation: async (lat: number, lng: number) => {
    const response = await api.post('/logistics/location', { lat, lng });
    return response;
  },

  getOrderLocation: async (orderId: string) => {
    const response = await api.get(`/logistics/orders/${orderId}/location`);
    return response;
  },

  // ── Blockchain / Proof ────────────────────────────────────
  generateQR: async (orderId: string) => {
    const response = await api.post(`/logistics/orders/${orderId}/generate-qr`);
    return response;
  },

  // Compatibility aliases for existing UI components
  getTrips: async () => {
    return await api.get('/logistics/assigned-orders');
  },
  
  updateTripStatus: async (orderId: string, status: string) => {
    if (status === 'picked_up') return await api.post(`/logistics/orders/${orderId}/pickup`);
    if (status === 'delivered') return await api.post(`/logistics/orders/${orderId}/delivery`);
    return { data: { success: false, error: 'Status not supported via this alias' } };
  }
};

export default transporterService;
