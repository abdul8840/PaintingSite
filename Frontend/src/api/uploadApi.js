import apiClient from './apiClient';

const uploadApi = {
  uploadImages: (formData) => apiClient.post('/upload', formData, true),
  uploadSingle: (formData) => apiClient.post('/upload/single', formData, true),
  deleteImage: (publicId) => apiClient.delete(`/upload/${publicId}`),
};

export default uploadApi;