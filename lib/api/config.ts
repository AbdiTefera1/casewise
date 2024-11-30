import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an axios instance with default configurations
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base API URL
  // timeout: 10000, // Increased timeout to 10 seconds
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to include the Authorization header if token exists
api.interceptors.request.use((config) => {
    const authStorage = localStorage.getItem('auth-storage'); // Retrieve the stored JSON string
    let token = null;

    if (authStorage) {
        const parsedData = JSON.parse(authStorage); // Parse the JSON string
        token = parsedData.state.token; // Access the token property
    }

    // console.log('Token after login:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
      // console.log('Headers Sent:', config.headers);
    } else {
      console.log("No token is set!");
    }

    return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log additional error information
    console.error('API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Implement retry logic for transient errors
axiosRetry(api, { retries: 1, retryDelay: axiosRetry.exponentialDelay });

export default api;
