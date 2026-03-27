import apiClient from './apiClient';

const customOrderApi = {
  // For admin - fetch all orders (admin only)
  getAllAdmin: (params = '') => apiClient.get(`/admin/custom-orders?${params}`),
  
  // For user - fetch my own orders
  getMyOrders: (params = '') => apiClient.get(`/custom-orders/my-orders?${params}`),
  
  // Get single order by ID (works for both admin and user)
  getById: (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    return apiClient.get(`/custom-orders/${id}`);
  },
  
  // Update order (admin only)
  updateAdmin: (id, data) => {
    if (!id) {
      throw new Error('Order ID is required for update');
    }
    return apiClient.put(`/admin/custom-orders/${id}`, data);
  },
  
  // Get artists (admin only)
  getArtists: () => apiClient.get('/admin/artists'),
  
  // User actions
  requestRevision: (id, notes) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    return apiClient.put(`/custom-orders/${id}/revision`, { notes });
  },
  
  approveOrder: (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    return apiClient.put(`/custom-orders/${id}/approve`);
  },
  
  // Calculate price (public)
  calculatePrice: (data) => apiClient.post('/custom-orders/calculate-price', data),
  
  // Create custom order (authenticated)
  createOrder: (data, isFormData = false) => apiClient.post('/custom-orders', data, isFormData),
  
  // Get order options (public)
  getOptions: () => apiClient.get('/custom-orders/options'),
};

export default customOrderApi;