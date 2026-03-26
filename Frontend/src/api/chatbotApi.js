import apiClient from './apiClient';

const chatbotApi = {
  sendMessage: (data) => apiClient.post('/chatbot/message', data),
  getHistory: (sessionId) => apiClient.get(`/chatbot/history/${sessionId}`),
};

export default chatbotApi;