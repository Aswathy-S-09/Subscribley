const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Get headers with auth token
  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Don't throw network errors, return a proper error response
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async googleAuth(googleData) {
    const response = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData)
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST'
    });
    
    this.removeToken();
    return response;
  }

  // Subscription endpoints
  async getSubscriptions() {
    return this.request('/subscriptions');
  }

  async createSubscription(subscriptionData) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
  }

  async updateSubscription(id, subscriptionData) {
    return this.request(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscriptionData)
    });
  }

  async deleteSubscription(id) {
    return this.request(`/subscriptions/${id}`, {
      method: 'DELETE'
    });
  }

  async getSubscriptionStats() {
    return this.request('/subscriptions/stats');
  }

  // Alerts
  async sendAlertEmail(payload) {
    return this.request('/alerts/email', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Contact endpoints
  async sendContactMessage(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
