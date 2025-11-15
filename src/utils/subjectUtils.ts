/**
 * Subject-related utility functions
 */

import type { Subject } from '@/src/types';
import { DEFAULT_SUBJECTS } from '@/src/constants';

/**
 * Gets subject information by ID
 * @param subjectId - Subject ID to look up
 * @param subjects - Array of subjects (defaults to DEFAULT_SUBJECTS)
 * @returns Subject object or undefined if not found
 */
export function getSubjectById(
  subjectId: string,
  subjects: Subject[] = DEFAULT_SUBJECTS
): Subject | undefined {
  return subjects.find((subject) => subject.id === subjectId);
}

/**
 * Creates a subject info lookup map for quick access
 * @param subjects - Array of subjects
 * @returns Map of subject ID to subject object
 */
export function createSubjectMap(subjects: Subject[]): Map<string, Subject> {
  return new Map(subjects.map((subject) => [subject.id, subject]));
}

/**
 * Gets activity color with opacity for visualization
 * @param baseColor - Base color of the subject
 * @param level - Activity level (0-3)
 * @param fallbackColor - Color to use when level is 0
 * @returns Color string with appropriate opacity
 */
export function getActivityColor(
  baseColor: string,
  level: number,
  fallbackColor: string
): string {
  if (level === 0) return fallbackColor;
  if (level === 1) return `${baseColor}40`; // 25% opacity
  if (level === 2) return `${baseColor}80`; // 50% opacity
  return baseColor; // 100% opacity
}
