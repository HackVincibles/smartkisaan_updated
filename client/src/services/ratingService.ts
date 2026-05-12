import api from './api';

const ratingService = {
  getUserReviews: async (userId: string) => {
    const response = await api.get(`/ratings/user/${userId}`);
    return response;
  },

  createRating: async (ratingData: { targetId: string; orderId: string; score: number; comment?: string }) => {
    const response = await api.post('/ratings/create', ratingData);
    return response;
  }
};

export default ratingService;
