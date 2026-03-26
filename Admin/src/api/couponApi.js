import apiClient from './apiClient';

const couponApi = {
  getAll: () => apiClient.get('/coupons'),
  create: (data) => apiClient.post('/coupons', data),
  update: (id, data) => apiClient.put(`/coupons/${id}`, data),
  delete: (id) => apiClient.delete(`/coupons/${id}`),
};

export default couponApi;