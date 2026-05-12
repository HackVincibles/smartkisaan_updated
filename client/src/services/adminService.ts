// @ts-ignore
import api from './api';

const adminService = {
  // ── Stats & Dashboard ─────────────────────────────────────
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response;
  },

  // ── User Management ───────────────────────────────────────
  getUsers: async (filters?: any) => {
    const response = await api.get('/admin/users', { params: filters });
    return response;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  },

  suspendUser: async (targetId: string, isBanned: boolean) => {
    const response = await api.post('/admin/suspend-user', { targetId, isBanned });
    return response;
  },

  // ── Listing Management ────────────────────────────────────
  getPendingListings: async () => {
    const response = await api.get('/admin/listings/review');
    return response;
  },

  approveListing: async (listingId: string, decision: 'approve' | 'reject') => {
    const response = await api.post(`/admin/listings/${listingId}/approve`, { decision });
    return response;
  },

  // ── Audit Logs ────────────────────────────────────────────
  getAuditLogs: async (params?: any) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response;
  },

  // ── Broadcast ─────────────────────────────────────────────
  broadcast: async (data: { title: string; message: string; role?: string }) => {
    const response = await api.post('/admin/broadcast', data);
    return response;
  },
};

export default adminService;
