/**
 * API 클라이언트 설정
 *
 * 에러 처리와 타입 안전성을 갖춘 모든 API 요청을 위한 중앙화된 HTTP 클라이언트입니다.
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * API 에러를 위한 커스텀 에러 클래스
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
 * HTTP 메서드 타입
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 공통 요청 옵션
 */
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

/**
 * 에러 처리와 함께 HTTP 요청을 수행합니다
 * @param endpoint - API 엔드포인트 경로
 * @param method - HTTP 메서드
 * @param options - 요청 옵션
 * @returns 타입이 지정된 응답 데이터가 포함된 Promise
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

    // 빈 응답 처리 (예: 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // 네트워크 또는 기타 에러
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0
    );
  }
}

/**
 * 타입이 지정된 메서드를 가진 API 클라이언트
 */
export const apiClient = {
  /**
   * GET 요청
   */
  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'GET', { headers });
  },

  /**
   * POST 요청
   */
  post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'POST', { body: data, headers });
  },

  /**
   * PUT 요청
   */
  put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'PUT', { body: data, headers });
  },

  /**
   * PATCH 요청
   */
  patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'PATCH', { body: data, headers });
  },

  /**
   * DELETE 요청
   */
  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return request<T>(endpoint, 'DELETE', { headers });
  },
};
