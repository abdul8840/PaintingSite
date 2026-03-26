import apiClient from './apiClient';

const orderApi = {
  create: (data) => apiClient.post('/orders', data),
  getMyOrders: (params = '') => apiClient.get(`/orders/my-orders?${params}`),
  getById: (id) => apiClient.get(`/orders/${id}`),
  track: (orderNumber) => apiClient.get(`/orders/track/${orderNumber}`),
  cancel: (id, data) => apiClient.put(`/orders/${id}/cancel`, data),
  verifySession: (sessionId) => apiClient.get(`/orders/verify-session/${sessionId}`),
};

export default orderApi;