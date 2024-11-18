import axios from 'axios';

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base API URL
  timeout: 1000,
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to include the Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle global response errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
