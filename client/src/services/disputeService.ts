import api from './api';

const disputeService = {
  getDisputes: async () => {
    const response = await api.get('/disputes/my');
    return response;
  },

  getDisputeStatus: async (id: string) => {
    const response = await api.get(`/disputes/${id}/status`);
    return response;
  },

  raiseDispute: async (disputeData: any) => {
    const response = await api.post('/disputes/raise', disputeData);
    return response;
  },

  acceptResolution: async (disputeId: string) => {
    const response = await api.post('/disputes/accept-resolution', { disputeId });
    return response;
  },

  getResolutionRules: async () => {
    const response = await api.get('/disputes/resolution-rules');
    return response;
  },

  // Admin methods
  getAllDisputes: async () => {
    const response = await api.get('/disputes/admin-all');
    return response;
  },

  resolveDispute: async (id: string, resolutionData: any) => {
    const response = await api.patch(`/disputes/admin-resolve/${id}`, resolutionData);
    return response;
  }
};

export default disputeService;
