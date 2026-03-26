import apiClient from './apiClient';

const reviewApi = {
  getByArtwork: (artworkId, params = '') => apiClient.get(`/reviews/artwork/${artworkId}?${params}`),
  create: (data) => apiClient.post('/reviews', data),
  delete: (id) => apiClient.delete(`/reviews/${id}`),
  markHelpful: (id) => apiClient.put(`/reviews/${id}/helpful`),
};

export default reviewApi;