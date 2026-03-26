import apiClient from './apiClient';

const artworkApi = {
  getAll: (params = '') => apiClient.get(`/artworks?${params}`),
  getBySlug: (slug) => apiClient.get(`/artworks/slug/${slug}`),
  getById: (id) => apiClient.get(`/artworks/${id}`),
  getFeatured: (limit = 8) => apiClient.get(`/artworks/featured?limit=${limit}`),
  getRelated: (id) => apiClient.get(`/artworks/${id}/related`),
  getFilterOptions: () => apiClient.get('/artworks/filters/options'),
};

export default artworkApi;