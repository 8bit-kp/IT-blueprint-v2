import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 15000, // 15 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          // Redirect to auth page after a short delay
          setTimeout(() => {
            window.location.href = '/auth';
          }, 1500);
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (error.response.data?.message) {
            toast.error(error.response.data.message);
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const blueprintAPI = {
  // Get blueprint data
  getBlueprint: () => api.get('/api/blueprint/get'),
  
  // Save blueprint data
  saveBlueprint: (data) => api.post('/api/blueprint/save', data),
};

export const authAPI = {
  // Login
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // Register
  register: (userData) => api.post('/api/auth/register', userData),
};

export default api;
