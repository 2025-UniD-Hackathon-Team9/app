/**
 * Centralized application constants
 */

import { colors } from '@/constants/colors';
import type { Subject } from '@/src/types';

/**
 * Default subjects available in the application
 */
export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: '수학', icon: '📐', color: colors.primary[500] },
  { id: 'physics', name: '물리', icon: '⚛️', color: '#FF6B6B' },
  { id: 'chemistry', name: '화학', icon: '🧪', color: '#4ECDC4' },
  { id: 'english', name: '영어', icon: '📚', color: '#95E1D3' },
  { id: 'korean', name: '국어', icon: '✏️', color: '#F38181' },
];

/**
 * Available icons for creating new subjects
 */
export const AVAILABLE_SUBJECT_ICONS = [
  '📐', '⚛️', '🧪', '📚', '✏️', '🎨', '🎵', '⚽', '🌍', '💻', '📖', '🔬', '🏛️', '📊'
];

/**
 * Available colors for creating new subjects
 */
export const AVAILABLE_SUBJECT_COLORS = [
  colors.primary[500],
  '#FF6B6B',
  '#4ECDC4',
  '#95E1D3',
  '#F38181',
  '#FF9F43',
  '#54A0FF',
  '#5F27CD',
  '#00D2D3',
  '#1DD1A1',
  '#EE5A6F',
  '#C44569',
];

/**
 * Days of the week in Korean
 */
export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Activity level thresholds for study sessions
 */
export const ACTIVITY_THRESHOLDS = {
  LOW: 3,      // Less than 3 sessions = low activity
  MEDIUM: 5,   // Less than 5 sessions = medium activity
  // 5 or more sessions = high activity
} as const;

/**
 * Common spacing values for consistent UI
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Common border radius values
 */
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 100,
} as const;
