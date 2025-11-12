// // src/api/axios.js

// import axios from "axios";

// // Create an Axios instance with default configurations
// const instance = axios.create({
//   baseURL: `${import.meta.env.VITE_APP_API_URL}/api`, // Replace with your actual backend URL
//   // // Replace with your actual backend URL
//   // baseURL: "http://localhost:5000/api", // Replace with your actual backend URL
//   // baseURL: /api/v1, // Replace with your actual backend URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include the JWT token in headers
// instance.interceptors.request.use(
//   (config) => {
//     const token = document.cookie.replace(
//       /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     );

//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default instance;






// src/api/axios.js
import axios from "axios";

// Create an Axios instance with secure default configurations
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api`,
  timeout: 90000, // 10 second timeout
  withCredentials: true, // ✅ Include HttpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh token promise to avoid multiple refresh requests
let refreshPromise = null;

// REQUEST INTERCEPTOR
instance.interceptors.request.use(
  (config) => {
    // Get CSRF token from meta tag (backend should set this)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    // Add CSRF token for state-changing requests
    if (csrfToken && ["POST", "PUT", "DELETE", "PATCH"].includes(config.method?.toUpperCase())) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // ✅ HttpOnly cookies are automatically sent by the browser
    // No need to manually add token - it's handled by withCredentials: true
    
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);



// REQUEST CANCELLATION SUPPORT
instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

// Utility function to cancel requests
export const cancelRequest = (source) => {
  if (source) {
    source.cancel("Request cancelled by user");
  }
};

// Create cancel token source
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// RETRY UTILITY WITH EXPONENTIAL BACKOFF
export const retryRequest = async (
  requestFn,
  maxRetries = 3,
  delayMs = 1000
) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      const delay = delayMs * Math.pow(2, attempt); // Exponential backoff
      console.warn(
        `Request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// BATCH REQUEST UTILITY
export const batchRequests = (requests) => {
  return axios.all(requests);
};

export default instance;
