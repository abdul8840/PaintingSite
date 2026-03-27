const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', BASE_URL);

class ApiClient {
  async request(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, isFormData = false } = options;

    const config = {
      method,
      credentials: 'include',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = { message: 'Invalid server response' };
      }

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || data.error || 'Something went wrong',
          data,
        };
      }

      return data;
    } catch (error) {
      console.error('API Client Error:', error);
      
      if (error.status) {
        throw error;
      }
      
      throw { 
        status: 500, 
        message: error.message || 'Network error',
        data: null,
      };
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body, isFormData = false) {
    return this.request(endpoint, { method: 'POST', body, isFormData });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();
export default apiClient;