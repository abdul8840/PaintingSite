import apiClient from './apiClient';

const customOrderApi = {
  getAll: (params = '') => apiClient.get(`/admin/custom-orders?${params}`),
  getById: (id) => apiClient.get(`/custom-orders/${id}`),
  update: (id, data) => apiClient.put(`/admin/custom-orders/${id}`, data),
  getArtists: () => apiClient.get('/admin/artists'),
};

export default customOrderApi;