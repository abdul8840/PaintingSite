import apiClient from './apiClient';

const userApi = {
  updateProfile: (data) => apiClient.put('/users/profile', data),
  updatePassword: (data) => apiClient.put('/users/password', data),
  updateAvatar: (formData) => apiClient.put('/users/avatar', formData, true),
  addAddress: (data) => apiClient.post('/users/addresses', data),
  updateAddress: (addressId, data) => apiClient.put(`/users/addresses/${addressId}`, data),
  deleteAddress: (addressId) => apiClient.delete(`/users/addresses/${addressId}`),
  getWishlist: () => apiClient.get('/users/wishlist'),
  toggleWishlist: (artworkId) => apiClient.put(`/users/wishlist/${artworkId}`),
};

export default userApi;