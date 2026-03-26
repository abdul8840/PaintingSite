const BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.message || 'Request failed', data };
    }

    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body, isFormData = false) { return this.request(endpoint, { method: 'POST', body, isFormData }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

const apiClient = new ApiClient();
export default apiClient;