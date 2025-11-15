/**
 * Courses API 서비스
 * 과목 생성 및 조회 관련 API
 */

import { apiClient } from './client';

/**
 * 과목 데이터 타입
 */
export interface Course {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
}

/**
 * 과목 생성 요청 타입
 */
export interface CreateCourseRequest {
  user_id: number;
  title: string;
}

/**
 * 과목 생성
 */
export async function createCourse(data: CreateCourseRequest): Promise<Course> {
  return apiClient.post<Course>('/courses', data);
}

/**
 * 유저의 과목 목록 조회
 */
export async function getCourses(userId: number): Promise<Course[]> {
  return apiClient.get<Course[]>(`/courses?user_id=${userId}`);
}
