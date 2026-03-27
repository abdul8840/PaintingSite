import apiClient from './apiClient';

const orderApi = {
  create: (data) => apiClient.post('/orders', data),
  verifyPayment: (data) => apiClient.post('/orders/verify-payment', data),
  verifyCustomPayment: (data) => apiClient.post('/orders/verify-custom-payment', data),
  getMyOrders: (params = '') => apiClient.get(`/orders/my-orders?${params}`),
  getById: (id) => apiClient.get(`/orders/${id}`),
  track: (orderNumber) => apiClient.get(`/orders/track/${orderNumber}`),
  cancel: (id, data) => apiClient.put(`/orders/${id}/cancel`, data),
};

export default orderApi;