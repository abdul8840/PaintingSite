import apiClient from './apiClient';

const aiApi = {
  suggestStyle: (data) => apiClient.post('/ai/suggest-style', data),
};

export default aiApi;