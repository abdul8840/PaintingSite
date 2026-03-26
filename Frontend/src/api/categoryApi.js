import apiClient from './apiClient';

const categoryApi = {
  getAll: () => apiClient.get('/categories'),
  getBySlug: (slug) => apiClient.get(`/categories/${slug}`),
};

export default categoryApi;