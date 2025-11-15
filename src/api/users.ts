/**
 * Users API 서비스
 * 사용자 정보 조회 관련 API
 */

import { apiClient } from './client';

/**
 * 사용자 정보 타입
 */
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

/**
 * 사용자 정보 조회
 */
export async function getUserById(id: number): Promise<User> {
  return apiClient.get<User>(`/users/${id}`);
}
