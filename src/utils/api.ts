import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // Force token refresh
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    resetPassword: '/auth/reset-password',
  },
  documents: {
    upload: '/documents/upload',
    list: '/documents',
    get: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
  },
  applications: {
    create: '/applications',
    list: '/applications',
    get: (id: string) => `/applications/${id}`,
    update: (id: string) => `/applications/${id}`,
    delete: (id: string) => `/applications/${id}`,
    submit: (id: string) => `/applications/${id}/submit`,
    review: (id: string) => `/applications/${id}/review`,
  },
};

export default api; 