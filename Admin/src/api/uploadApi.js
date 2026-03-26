import apiClient from './apiClient';

const uploadApi = {
  upload: (formData) => apiClient.post('/upload', formData, true),
  uploadSingle: (formData) => apiClient.post('/upload/single', formData, true),
  delete: (publicId) => apiClient.delete(`/upload/${publicId}`),
};

export default uploadApi;