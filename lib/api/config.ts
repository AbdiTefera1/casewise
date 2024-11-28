// import axios from 'axios';
// import axiosRetry from 'axios-retry';

// // Create an axios instance with default configurations
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api', // Base API URL
//   timeout: 10000, // Increased timeout to 10 seconds
//   withCredentials: true, // Include cookies in requests
// });

// // No need to manually set the Authorization header from local storage
// api.interceptors.request.use((config) => {
//   // No need to include the token in the header because it's in the cookie
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // Handle global response errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Log additional error information
//     console.error('API error:', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//     });
//     return Promise.reject(error);
//   }
// );

// // Implement retry logic for transient errors
// axiosRetry(api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

// export default api;


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
  const token = localStorage.getItem('auth-storage');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }else{
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
axiosRetry(api, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default api;