/**
 * Custom hook for making API calls with standardized error handling
 */

import { useState, useCallback, useRef } from 'react';
import type { ApiResponse } from '@/shared/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic API hook for making fetch requests
 */
export function useApi<T = unknown>(
  apiCall: (...args: unknown[]) => Promise<Response>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    
    // Abort any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);

      // Check if request was aborted
      if (signal.aborted) {
        return null;
      }

      // Parse response
      let responseData: ApiResponse<T>;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      // Handle error responses
      if (!response.ok || !responseData.success) {
        const errorMessage = typeof responseData.error === 'string'
          ? responseData.error
          : 'An error occurred';
        throw new Error(errorMessage);
      }

      // Extract data from response
      const resultData = 'data' in responseData ? responseData.data : null;

      setData(resultData as T);
      options.onSuccess?.(resultData as T);
      
      return resultData as T;
    } catch (err) {
      // Don't set error if request was aborted
      if (signal.aborted) {
        return null;
      }

      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      options.onError?.(message);
      
      return null;
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [apiCall, options]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for making authenticated API calls
 */
export function useAuthenticatedApi<T = unknown>(
  apiCall: (...args: unknown[]) => Promise<Response>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  return useApi(async (...args: unknown[]) => {
    const response = await apiCall(...args);
    
    // Handle 401 Unauthorized - redirect to login or refresh token
    if (response.status === 401) {
      // You can add token refresh logic here
      throw new Error('Authentication required. Please log in.');
    }
    
    return response;
  }, options);
}
