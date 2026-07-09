import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config.
// Authentication is now handled via HTTP-only cookies set by /api/auth/login.
// withCredentials: true ensures the browser automatically attaches the cookie
// on every cross-origin request (required when NEXT_PUBLIC_BACKEND_URL differs from the UI origin).
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle common errors.
// No request interceptor needed: the browser attaches the auth cookie automatically.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          // Clear the display username stored for the Navbar — the auth cookie
          // will have been expired by the server or will be rejected on next request.
          if (typeof window !== 'undefined') {
            localStorage.removeItem('username');
          }
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
        case 429:
          toast.error(error.response.data?.message || 'Too many requests. Please wait and try again.');
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
  // Get blueprint data — cookie sent automatically via withCredentials.
  getBlueprint: () => api.get('/api/blueprint/get'),

  // Save blueprint data — cookie sent automatically via withCredentials.
  saveBlueprint: (data) => api.post('/api/blueprint/save', data),
};

export const authAPI = {
  // Login — server sets the auth_token cookie in the response.
  login: (credentials) => api.post('/api/auth/login', credentials),

  // Register — no cookie interaction.
  register: (userData) => api.post('/api/auth/register', userData),

  // Logout — server expires the auth_token cookie.
  logout: () => api.post('/api/auth/logout'),
};

export default api;
