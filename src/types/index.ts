/**
 * 애플리케이션의 핵심 타입 정의
 */

/**
 * 앱의 과목/강좌를 나타냅니다
 */
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * 특정 날짜의 학습 기록을 나타냅니다
 */
export interface StudyRecord {
  date: string; // 형식: 'YYYY-MM-DD'
  sessionsCompleted: number;
}

/**
 * 학습 강도를 시각화하기 위한 활동 레벨
 */
export type ActivityLevel = 0 | 1 | 2 | 3;

/**
 * 오늘의 세션 카드에 대한 Props
 */
export interface TodaySession {
  completedSessions: number;
  totalSessions: number;
  subject: string;
}

/**
 * 과목의 퀴즈 통계
 */
export interface QuizStats {
  totalQuizzes: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracyRate: number;
}

/**
 * 퀴즈의 문제/질문
 */
export interface Problem {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  isCorrect?: boolean;
  attemptedAt?: string;
}
