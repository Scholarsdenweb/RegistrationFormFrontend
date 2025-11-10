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

// RESPONSE INTERCEPTOR
// instance.interceptors.response.use(
//   (response) => {
//     // Success response
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle timeout
//     if (error.code === "ECONNABORTED") {
//       console.error("Request timeout - please try again");
//       return Promise.reject({
//         ...error,
//         message: "Request timeout. Please try again.",
//       });
//     }

//     // Handle network error
//     if (error.message === "Network Error" && !error.response) {
//       console.error("Network error - check your internet connection");
//       return Promise.reject({
//         ...error,
//         message: "Network error. Please check your internet connection.",
//       });
//     }

//     // Handle 401 (Unauthorized) - Token expired or invalid
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Prevent multiple refresh token requests
//         if (!refreshPromise) {
//           refreshPromise = instance.post("/auth/refresh", {}, {
//             withCredentials: true,
//           });
//         }

//         const refreshResponse = await refreshPromise;
//         refreshPromise = null;

//         // Token refreshed successfully (backend sets new HttpOnly cookie)
//         if (refreshResponse.data.success) {
//           // Retry original request with new token
//           return instance(originalRequest);
//         }
//       } catch (refreshError) {
//         refreshPromise = null;

//         // Refresh failed, redirect to login
//         console.error("Token refresh failed:", refreshError);
        
//         // Dispatch logout event
//         window.dispatchEvent(new CustomEvent("auth-logout"));
        
//         // Redirect to login
//         if (typeof window !== "undefined") {
//           window.location.href = "/";
//         }

//         return Promise.reject(refreshError);
//       }
//     }

//     // Handle 403 (Forbidden) - Permission denied
//     if (error.response?.status === 403) {
//       console.error("Access forbidden:", error.response.data?.message);
//       return Promise.reject({
//         ...error,
//         message: "You don't have permission to access this resource.",
//       });
//     }

//     // Handle 404 (Not Found)
//     if (error.response?.status === 404) {
//       console.log("error",error);
//       console.error("Resource not found:", error.response.data?.message);
//       return Promise.reject({
//         ...error,
//         message: "The requested resource was not found.",
//       });
//     }

//     // Handle 500 (Server Error)
//     if (error.response?.status >= 500) {
//       console.error("Server error:", error.response.data?.message);
//       return Promise.reject({
//         ...error,
//         message: "Server error. Please try again later.",
//       });
//     }

//     // Handle validation errors (422)
//     if (error.response?.status === 422) {
//       const validationErrors = error.response.data?.errors || {};
//       console.error("Validation errors:", validationErrors);
//       return Promise.reject({
//         ...error,
//         message: "Please check your input and try again.",
//         validationErrors,
//       });
//     }

//     // Handle rate limiting (429)
//     if (error.response?.status === 429) {
//       const retryAfter = error.response.headers["retry-after"] || 60;
//       console.error(`Rate limited. Retry after ${retryAfter} seconds`);
//       return Promise.reject({
//         ...error,
//         message: `Too many requests. Please try again in ${retryAfter} seconds.`,
//         retryAfter,
//       });
//     }

//     // Generic error response
//     const errorMessage =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       error.message ||
//       "An unexpected error occurred";

//     console.error("Response Error:", errorMessage);

//     return Promise.reject({
//       ...error,
//       message: errorMessage,
//     });
//   }
// );

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

// ------------------------------------------
// BACKEND REQUIREMENTS
// ------------------------------------------
/*
Your backend MUST set HttpOnly cookies as follows:

1. LOGIN ENDPOINT (POST /api/auth/login)
   - Verify credentials
   - Create JWT token
   - Set HttpOnly cookie with JWT

   res.cookie('authToken', jwtToken, {
     httpOnly: true,      // ✅ JavaScript cannot access
     secure: true,        // ✅ Only HTTPS
     sameSite: 'strict',  // ✅ CSRF protection
     maxAge: 3600000      // 1 hour
   });

2. REFRESH ENDPOINT (POST /api/auth/refresh)
   - Verify old token from cookie
   - Create new JWT token
   - Set new HttpOnly cookie
   - Return { success: true }

   res.cookie('authToken', newJwtToken, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',
     maxAge: 3600000
   });
   res.json({ success: true });

3. LOGOUT ENDPOINT (POST /api/auth/logout)
   - Clear the HttpOnly cookie
   - Return { success: true }

   res.clearCookie('authToken');
   res.json({ success: true });

4. SET CSRF TOKEN (GET /api/auth/csrf)
   - Generate CSRF token
   - Return in response or set in meta tag

   <meta name="csrf-token" content="token-here">

5. CORS CONFIGURATION
   app.use(cors({
     origin: 'https://yourdomain.com',  // ✅ Specific domain
     credentials: true                  // ✅ Allow credentials
   }));

6. SECURITY HEADERS
   app.use(helmet()); // Or set manually:
   
   app.use((req, res, next) => {
     res.setHeader('X-Content-Type-Options', 'nosniff');
     res.setHeader('X-Frame-Options', 'DENY');
     res.setHeader('X-XSS-Protection', '1; mode=block');
     next();
   });
*/