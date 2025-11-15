/**
 * Core type definitions for the application
 */

/**
 * Represents a subject/course in the app
 */
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * Represents a study record for a specific date
 */
export interface StudyRecord {
  date: string; // Format: 'YYYY-MM-DD'
  sessionsCompleted: number;
}

/**
 * Activity level for visualizing study intensity
 */
export type ActivityLevel = 0 | 1 | 2 | 3;

/**
 * Props for today's session card
 */
export interface TodaySession {
  completedSessions: number;
  totalSessions: number;
  subject: string;
}

/**
 * Quiz statistics for a subject
 */
export interface QuizStats {
  totalQuizzes: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracyRate: number;
}

/**
 * Problem/question in a quiz
 */
export interface Problem {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  isCorrect?: boolean;
  attemptedAt?: string;
}
