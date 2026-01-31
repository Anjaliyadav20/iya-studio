const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '/api');

class APIClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(email, password) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async signin(email, password) {
    const data = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async checkAdmin() {
    return this.request('/auth/check-admin');
  }

  logout() {
    this.removeToken();
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings');
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Gallery endpoints
  async getGallery() {
    return this.request('/gallery');
  }

  async addGalleryItem(itemData) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async deleteGalleryItem(id) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // Services endpoints
  async getServices() {
    return this.request('/services');
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id, serviceData) {
    return this.request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  }

  async toggleServiceActive(id) {
    return this.request(`/services/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Previous Work endpoints
  async getPreviousWork() {
    return this.request('/previous-work');
  }

  async createPreviousWork(workData) {
    return this.request('/previous-work', {
      method: 'POST',
      body: JSON.stringify(workData),
    });
  }

  async deletePreviousWork(id) {
    return this.request(`/previous-work/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient();
