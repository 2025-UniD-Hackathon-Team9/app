/**
 * Activity and study session utility functions
 */

import type { ActivityLevel } from '@/src/types';
import { ACTIVITY_THRESHOLDS } from '@/src/constants';

/**
 * Calculates activity level based on number of completed sessions
 * @param sessionsCompleted - Number of sessions completed
 * @returns Activity level (0-3)
 */
export function getActivityLevel(sessionsCompleted: number): ActivityLevel {
  if (sessionsCompleted === 0) return 0;
  if (sessionsCompleted < ACTIVITY_THRESHOLDS.LOW) return 1;
  if (sessionsCompleted < ACTIVITY_THRESHOLDS.MEDIUM) return 2;
  return 3;
}

/**
 * Calculates study progress as a percentage
 * @param completed - Number of completed sessions
 * @param total - Total number of sessions
 * @returns Progress as a decimal (0-1)
 */
export function calculateProgress(completed: number, total: number): number {
  return total > 0 ? completed / total : 0;
}

/**
 * Gets a motivational message based on progress
 * @param completed - Number of completed sessions
 * @param total - Total number of sessions
 * @returns Motivational message
 */
export function getMotivationMessage(completed: number, total: number): string {
  const progress = calculateProgress(completed, total);
  
  if (completed === 0) return '오늘도 화이팅! 🎯';
  if (progress < 0.5) return '좋아요! 계속 가볼까요? 💪';
  if (progress < 1) return '거의 다 왔어요! 🔥';
  return '완벽해요! 🎉';
}

/**
 * Gets an emoji based on progress
 * @param completed - Number of completed sessions
 * @param total - Total number of sessions
 * @returns Emoji representing progress
 */
export function getProgressEmoji(completed: number, total: number): string {
  const progress = calculateProgress(completed, total);
  
  if (completed === 0) return '📚';
  if (progress < 0.5) return '💪';
  if (progress < 1) return '🔥';
  return '🎉';
}

/**
 * Calculates quiz accuracy rate
 * @param correctAnswers - Number of correct answers
 * @param totalAnswers - Total number of answers
 * @returns Accuracy rate as a percentage (0-100)
 */
export function calculateAccuracyRate(correctAnswers: number, totalAnswers: number): number {
  return totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
}
