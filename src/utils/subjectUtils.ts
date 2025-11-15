/**
 * 과목 관련 유틸리티 함수
 */

import type { Subject } from '@/src/types';

/**
 * 시각화를 위해 불투명도가 적용된 활동 색상을 가져옵니다
 * @param baseColor - 과목의 기본 색상
 * @param level - 활동 레벨 (0-3)
 * @param fallbackColor - 레벨이 0일 때 사용할 색상
 * @returns 적절한 불투명도가 적용된 색상 문자열
 */
export function getActivityColor(
  baseColor: string,
  level: number,
  fallbackColor: string
): string {
  if (level === 0) return fallbackColor;
  if (level === 1) return `${baseColor}40`; // 25% 불투명도
  if (level === 2) return `${baseColor}80`; // 50% 불투명도
  return baseColor; // 100% 불투명도
}
