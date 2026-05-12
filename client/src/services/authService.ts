import api from './api';

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    return response;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token: string, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  }
};

export default authService;
