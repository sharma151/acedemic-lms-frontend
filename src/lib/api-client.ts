import axios from "axios";
import { getSessionState } from "./session";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { token, tenantId } = getSessionState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attempt to get Tenant ID from session
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt to refresh if the failed request was login or refresh itself
    if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // The refresh endpoint needs to rely on httpOnly cookies or we pass the refresh token if stored.
        // Assuming we rely on httpOnly cookies for the refresh endpoint, we just make a POST to /auth/refresh
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;

        // Update token in session
        getSessionState().updateToken(accessToken);

        // Update authorization header and retry original request
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear session and dispatch event for smooth client-side logout
        getSessionState().clearSession();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
