/**
 * 공통 타입 정의
 */

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 비동기 작업 상태
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * API 응답 형식
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * API 에러 형식
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * 기본 ID 타입
 */
export type ID = string | number;

/**
 * 선택적 필드를 가진 타입 생성
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 읽기 전용 딥 타입
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
