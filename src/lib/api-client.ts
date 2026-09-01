import axios from 'axios';
import { getAuthToken, setAuthToken, removeAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attempt to get Tenant ID from somewhere (e.g. store or cookies, but typically from Zustand or window/document context)
    // For client-side, we can rely on Zustand store, but since this is outside React, we might read from localStorage or a cookie.
    if (typeof window !== 'undefined') {
      const tenantId = localStorage.getItem('tenant-id');
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // The refresh endpoint needs to rely on httpOnly cookies or we pass the refresh token if stored.
        // Assuming we rely on httpOnly cookies for the refresh endpoint, we just make a POST to /auth/refresh
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        const { accessToken } = response.data;
        
        // Update token in storage
        setAuthToken(accessToken);

        // Update authorization header and retry original request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
