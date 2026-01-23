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

export const useAdminAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/auth/verify");

      console.log("response from checkAuth", response);

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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/auth/login", credentials, {
        withCredentials: true,
      });

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

  const adminAuthLogin = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/admin_login", credentials, {
        withCredentials: true,
      });

      console.log("response from adminAuthLogin", response);
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

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post("/auth/logout");

      console.log("response from logout", response);

      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
        },
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

  // ===== UPDATED INTERCEPTOR - Only handle 401 errors =====
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // ===== ONLY HANDLE 401 ERRORS =====
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          console.log("401 detected, attempting token refresh...");

          try {
            const success = await refreshToken();
            if (success) {
              console.log("Token refreshed, retrying request");
              return axios(originalRequest);
            } else {
              console.log("Token refresh failed, logging out");
              // Only logout if refresh explicitly fails
              setIsAuthenticated(false);
              setUser(null);
              window.location.href = "/";
            }
          } catch (refreshError) {
            console.error("Refresh error:", refreshError);
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = "/";
          }
        }

        // ===== DON'T LOGOUT FOR OTHER ERRORS =====
        // Just pass the error through
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    adminAuthLogin,
    logout,
    refreshToken,
    checkAuth,
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
