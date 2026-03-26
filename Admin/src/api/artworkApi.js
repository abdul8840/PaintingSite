import apiClient from './apiClient';

const artworkApi = {
  getAll: (params = '') => apiClient.get(`/artworks?${params}`),
  getById: (id) => apiClient.get(`/artworks/${id}`),
  create: (data) => apiClient.post('/artworks', data),
  update: (id, data) => apiClient.put(`/artworks/${id}`, data),
  delete: (id) => apiClient.delete(`/artworks/${id}`),
  getFilterOptions: () => apiClient.get('/artworks/filters/options'),
};

export default artworkApi;