/**
 * 과목 관련 유틸리티 함수
 */

import type { Subject } from '@/src/types';
import { DEFAULT_SUBJECTS } from '@/src/constants';

/**
 * ID로 과목 정보를 가져옵니다
 * @param subjectId - 조회할 과목 ID
 * @param subjects - 과목 배열 (기본값: DEFAULT_SUBJECTS)
 * @returns 과목 객체 또는 찾지 못한 경우 undefined
 */
export function getSubjectById(
  subjectId: string,
  subjects: Subject[] = DEFAULT_SUBJECTS
): Subject | undefined {
  return subjects.find((subject) => subject.id === subjectId);
}

/**
 * 빠른 접근을 위한 과목 정보 조회 맵을 생성합니다
 * @param subjects - 과목 배열
 * @returns 과목 ID를 키로 하는 과목 객체 맵
 */
export function createSubjectMap(subjects: Subject[]): Map<string, Subject> {
  return new Map(subjects.map((subject) => [subject.id, subject]));
}

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
