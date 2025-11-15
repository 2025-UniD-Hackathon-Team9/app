/**
 * Auth API 서비스
 * 회원가입 및 로그인 관련 API
 */

import { apiClient } from './client';

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * 로그인 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 사용자 응답 타입
 */
export interface UserResponse {
  user_id: number;
  email: string;
  name: string;
}

/**
 * 회원가입
 */
export async function signup(data: SignupRequest): Promise<UserResponse> {
  return apiClient.post<UserResponse>('/auth/signup', data);
}

/**
 * 로그인
 */
export async function login(data: LoginRequest): Promise<UserResponse> {
  return apiClient.post<UserResponse>('/auth/login', data);
}
