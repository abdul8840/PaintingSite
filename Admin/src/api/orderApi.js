import apiClient from './apiClient';

const orderApi = {
  getAll: (params = '') => apiClient.get(`/admin/orders?${params}`),
  getById: (id) => apiClient.get(`/orders/${id}`),
  updateStatus: (id, data) => apiClient.put(`/admin/orders/${id}/status`, data),
};

export default orderApi;