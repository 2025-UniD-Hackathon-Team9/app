/**
 * 활동 및 학습 세션 유틸리티 함수
 */

import type { ActivityLevel } from '@/src/types';
import { ACTIVITY_THRESHOLDS } from '@/src/constants';

/**
 * 완료된 세션 수를 기반으로 활동 레벨을 계산합니다
 * @param sessionsCompleted - 완료된 세션 수
 * @returns 활동 레벨 (0-3)
 */
export function getActivityLevel(sessionsCompleted: number): ActivityLevel {
  if (sessionsCompleted === 0) return 0;
  if (sessionsCompleted < ACTIVITY_THRESHOLDS.LOW) return 1;
  if (sessionsCompleted < ACTIVITY_THRESHOLDS.MEDIUM) return 2;
  return 3;
}

/**
 * 학습 진행률을 백분율로 계산합니다
 * @param completed - 완료된 세션 수
 * @param total - 전체 세션 수
 * @returns 소수로 표현된 진행률 (0-1)
 */
export function calculateProgress(completed: number, total: number): number {
  return total > 0 ? completed / total : 0;
}

/**
 * 진행률에 따른 동기부여 메시지를 가져옵니다
 * @param completed - 완료된 세션 수
 * @param total - 전체 세션 수
 * @returns 동기부여 메시지
 */
export function getMotivationMessage(completed: number, total: number): string {
  const progress = calculateProgress(completed, total);

  if (completed === 0) return '수업 후 5분 복습으로 기억력 UP! 🎯';
  if (progress < 0.5) return '빠른 복습으로 시간 절약! 💪';
  if (progress < 1) return '조금만 더! 오늘 복습 마무리 🔥';
  return '오늘 복습 완료! 내일도 화이팅 🎉';
}

/**
 * 진행률에 따른 이모지를 가져옵니다
 * @param completed - 완료된 세션 수
 * @param total - 전체 세션 수
 * @returns 진행률을 나타내는 이모지
 */
export function getProgressEmoji(completed: number, total: number): string {
  const progress = calculateProgress(completed, total);
  
  if (completed === 0) return '📚';
  if (progress < 0.5) return '💪';
  if (progress < 1) return '🔥';
  return '🎉';
}

/**
 * 퀴즈 정답률을 계산합니다
 * @param correctAnswers - 정답 수
 * @param totalAnswers - 전체 답변 수
 * @returns 백분율로 표현된 정답률 (0-100)
 */
export function calculateAccuracyRate(correctAnswers: number, totalAnswers: number): number {
  return totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
}
