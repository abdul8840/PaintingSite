import apiClient from './apiClient';

const customOrderApi = {
  calculatePrice: (data) => apiClient.post('/custom-orders/calculate-price', data),
  create: (data) => apiClient.post('/custom-orders', data),
  getMyOrders: (params = '') => apiClient.get(`/custom-orders/my-orders?${params}`),
  getById: (id) => apiClient.get(`/custom-orders/${id}`),
  requestRevision: (id, data) => apiClient.put(`/custom-orders/${id}/revision`, data),
  approve: (id) => apiClient.put(`/custom-orders/${id}/approve`),
  getOptions: () => apiClient.get('/custom-orders/options'),
};

export default customOrderApi;