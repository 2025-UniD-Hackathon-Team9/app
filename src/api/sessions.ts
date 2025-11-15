/**
 * Sessions API 서비스
 * 학습 세션 및 문제 관련 API
 */

import { apiClient } from './client';

/**
 * 세션 문제 타입
 */
export interface SessionQuestion {
  id: number;
  item_order: number;
  type: '객관식' | '단답식' | 'OX';
  question_text: string;
  options?: string[];
}

/**
 * 세션 상세 정보 타입
 */
export interface SessionDetail {
  session_id: number;
  course_id: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  questions: SessionQuestion[];
}

/**
 * 답안 제출 타입
 */
export interface SessionAnswer {
  session_question_id: number;
  user_answer: string;
}

/**
 * 문제 결과 타입
 */
export interface QuestionResult {
  question_id: number;
  correct: boolean;
  real_answer?: string;
}

/**
 * 세션 제출 결과 타입
 */
export interface SessionSubmitResult {
  session_id: number;
  score: number;
  completed: boolean;
  results: QuestionResult[];
}

/**
 * 세션 기록 타입
 */
export interface SessionHistory {
  id: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  score?: number;
  created_at: string;
}

/**
 * 세션 문제 조회
 */
export async function getSession(sessionId: number): Promise<SessionDetail> {
  return apiClient.get<SessionDetail>(`/api/sessions/${sessionId}`);
}

/**
 * 세션 답안 제출 및 채점
 */
export async function submitSession(
  sessionId: number,
  answers: SessionAnswer[]
): Promise<SessionSubmitResult> {
  return apiClient.post<SessionSubmitResult>(`/api/sessions/${sessionId}/submit`, {
    answers,
  });
}

/**
 * 세션 기록 조회
 */
export async function getSessionHistory(
  userId: number,
  courseId: number
): Promise<SessionHistory[]> {
  return apiClient.get<SessionHistory[]>(`/api/sessions?user_id=${userId}&course_id=${courseId}`);
}
