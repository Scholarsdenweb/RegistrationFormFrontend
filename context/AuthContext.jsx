// // src/context/AuthContext.js
// import React, { createContext, useState, useContext } from "react";
// import { useEffect } from "react";

// // Create Context
// const AuthContext = createContext();

// // Custom hook to access auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // AuthProvider component to wrap around your app and provide auth context
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     document.cookie.replace(
//       /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     )
//   );

//   useEffect(() => {
//     console.log("isAuthenticated", localStorage.getItem("token"));
//   });
//   // Example login function
//   const login = () => setIsAuthenticated(true);

//   // Example logout function
//   const logout = () => setIsAuthenticated(false);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "../src/api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Backend should validate the HttpOnly cookie
        // This endpoint verifies the token without exposing it
        const response = await axios.get("/auth/verify");

        console.log("responzzse from chcekAuth", response);

        if (response?.data?.authenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/auth/login", credentials, {
        withCredentials: true, // Allow cookies to be sent/received
      });

      // Backend sets HttpOnly cookie automatically
      setIsAuthenticated(true);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Tell backend to clear the HttpOnly cookie
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
      // Clear state anyway
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Token refresh failed:", err);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  // Setup axios interceptor to handle 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const success = await refreshToken();
            if (success) {
              // Retry original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = "/";
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ------------------------------------------
// Backend Implementation Example (Node.js/Express)
/*
// Backend should:

1. SET SECURE COOKIES:
   res.cookie('token', token, {
     httpOnly: true,      // Prevents XSS
     secure: true,        // Only HTTPS
     sameSite: 'strict',  // Prevents CSRF
     maxAge: 3600000      // 1 hour
   });

2. VERIFY TOKEN ENDPOINT:
   app.get('/api/auth/verify', (req, res) => {
     const token = req.cookies.token;
     
     if (!token) {
       return res.json({ isAuthenticated: false });
     }

     try {
       const decoded = jwt.verify(token, SECRET_KEY);
       res.json({
         isAuthenticated: true,
         user: decoded
       });
     } catch (err) {
       res.json({ isAuthenticated: false });
     }
   });

3. LOGOUT ENDPOINT:
   app.post('/api/auth/logout', (req, res) => {
     res.clearCookie('token');
     res.json({ success: true });
   });

4. REFRESH ENDPOINT:
   app.post('/api/auth/refresh', (req, res) => {
     // Issue new token with fresh expiry
     // Clear old cookie and set new one
   });
*/
