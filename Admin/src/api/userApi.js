import apiClient from './apiClient';

const userApi = {
  getAll: (params = '') => apiClient.get(`/admin/users?${params}`),
  update: (id, data) => apiClient.put(`/admin/users/${id}`, data),
};

export default userApi;