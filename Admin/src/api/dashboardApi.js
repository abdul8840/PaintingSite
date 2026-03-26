import apiClient from './apiClient';

const dashboardApi = {
  getStats: () => apiClient.get('/admin/dashboard'),
};

export default dashboardApi;