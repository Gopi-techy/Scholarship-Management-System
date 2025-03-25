import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface UseApiReturn<T> extends ApiResponse<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<Response>,
  immediate = false
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        // Get fresh token
        const token = currentUser ? await currentUser.getIdToken() : null;

        const response = await apiFunction(...args);

        if (!response.ok) {
          let errorMessage = 'An error occurred';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = response.statusText;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, currentUser]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
}

// API request helper functions
export const createApiRequest = (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  customHeaders: Record<string, string> = {}
) => {
  return async (token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    return fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);
  };
};

// Common API functions
export const api = {
  get: (endpoint: string, customHeaders = {}) =>
    createApiRequest(endpoint, 'GET', undefined, customHeaders),
  post: (endpoint: string, body: any, customHeaders = {}) =>
    createApiRequest(endpoint, 'POST', body, customHeaders),
  put: (endpoint: string, body: any, customHeaders = {}) =>
    createApiRequest(endpoint, 'PUT', body, customHeaders),
  delete: (endpoint: string, customHeaders = {}) =>
    createApiRequest(endpoint, 'DELETE', undefined, customHeaders),
}; 