import apiClient from './apiClient';

const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  checkAuth: () => apiClient.get('/auth/check'),
  getMe: () => apiClient.get('/auth/me'),
};

export default authApi;