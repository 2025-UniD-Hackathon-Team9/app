/**
 * API Client Configuration
 *
 * Centralized HTTP client for all API requests with error handling and type safety.
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Type for HTTP methods
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Common request options
 */
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Makes an HTTP request with error handling
 * @param endpoint - API endpoint path
 * @param method - HTTP method
 * @param options - Request options
 * @returns Promise with typed response data
 */
async function request<T>(
  endpoint: string,
  method: HttpMethod,
  options?: RequestOptions
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (options?.body && method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0
    );
  }
}

/**
 * API client with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'GET', { headers });
  },

  /**
   * POST request
   */
  post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'POST', { body: data, headers });
  },

  /**
   * PUT request
   */
  put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'PUT', { body: data, headers });
  },

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'PATCH', { body: data, headers });
  },

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'DELETE', { headers });
  },
};
