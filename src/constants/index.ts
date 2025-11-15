/**
 * 중앙화된 애플리케이션 상수
 */

import { colors } from '@/constants/colors';
import type { Subject } from '@/src/types';

/**
 * 과목 아이콘/색상 매핑용 상수
 * 백엔드에서 받은 과목 인덱스에 따라 순환하며 할당됨
 */
export const SUBJECT_THEME_PALETTE = [
  { icon: '⚙️', color: colors.primary[500] },      // 운영체제 - 톱니바퀴
  { icon: '🧮', color: '#FF6B6B' },                // 알고리즘 - 주판
  { icon: '🗄️', color: '#4ECDC4' },                // 데이터베이스 - 파일 캐비닛
  { icon: '📚', color: '#95E1D3' },
  { icon: '✏️', color: '#F38181' },
  { icon: '🎨', color: '#FF9F43' },
  { icon: '🎵', color: '#54A0FF' },
  { icon: '⚽', color: '#5F27CD' },
  { icon: '🌍', color: '#00D2D3' },
  { icon: '💡', color: '#1DD1A1' },
];

/**
 * @deprecated DEFAULT_SUBJECTS는 더 이상 사용되지 않습니다. SUBJECT_THEME_PALETTE를 사용하세요.
 * 하위 호환성을 위해 유지됩니다.
 */
export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: '수학', icon: '📐', color: colors.primary[500] },
  { id: 'physics', name: '물리', icon: '⚛️', color: '#FF6B6B' },
  { id: 'chemistry', name: '화학', icon: '🧪', color: '#4ECDC4' },
  { id: 'english', name: '영어', icon: '📚', color: '#95E1D3' },
  { id: 'korean', name: '국어', icon: '✏️', color: '#F38181' },
];

/**
 * 새 과목 생성 시 사용 가능한 아이콘
 */
export const AVAILABLE_SUBJECT_ICONS = [
  '📐', '⚛️', '🧪', '📚', '✏️', '🎨', '🎵', '⚽', '🌍', '💻', '📖', '🔬', '🏛️', '📊'
];

/**
 * 새 과목 생성 시 사용 가능한 색상
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
 * 한글 요일 이름
 */
export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 학습 세션의 활동 레벨 임계값
 */
export const ACTIVITY_THRESHOLDS = {
  LOW: 3,      // 3회 미만의 세션 = 낮은 활동
  MEDIUM: 5,   // 5회 미만의 세션 = 중간 활동
  // 5회 이상의 세션 = 높은 활동
} as const;

/**
 * 일관된 UI를 위한 공통 간격 값
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
 * 공통 테두리 반경 값
 */
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 100,
} as const;
