import apiClient from './apiClient';

const couponApi = {
  validate: (data) => apiClient.post('/coupons/validate', data),
};

export default couponApi;