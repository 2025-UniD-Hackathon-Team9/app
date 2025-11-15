/**
 * 세션 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getSessionHistory, type SessionHistory } from '@/src/api/sessions';
import type { StudyRecord } from '@/src/types';
import { debugLog } from '@/src/config';

/**
 * 여러 과목의 세션 히스토리를 합산하여 관리하는 훅
 * @param userId - 사용자 ID
 * @param courseIds - 과목 ID 배열
 */
export function useStudyRecords(userId: number | null | undefined, courseIds: number[]) {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 모든 과목의 세션 히스토리를 병렬로 조회하고 합산합니다
   */
  const loadStudyRecords = useCallback(async () => {
    if (!userId || courseIds.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      debugLog('Loading study records for courses:', courseIds);
      
      // 모든 과목의 세션 히스토리를 병렬로 조회
      const allSessionsPromises = courseIds.map(courseId =>
        getSessionHistory(userId, courseId)
      );
      const allSessionsResults = await Promise.all(allSessionsPromises);

      // 모든 세션을 하나의 배열로 합침
      const allSessions = allSessionsResults.flat();

      // 날짜별로 완료된 세션 수를 집계
      const recordsByDate = new Map<string, number>();

      allSessions.forEach(session => {
        if (session.status === 'Completed') {
          const dateString = new Date(session.created_at).toISOString().split('T')[0];
          recordsByDate.set(dateString, (recordsByDate.get(dateString) || 0) + 1);
        }
      });

      // Map을 StudyRecord 배열로 변환
      const records: StudyRecord[] = Array.from(recordsByDate.entries()).map(([date, count]) => ({
        date,
        sessionsCompleted: count,
      }));

      setStudyRecords(records);
      debugLog(`Loaded ${records.length} study records`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load study records');
      console.error('Failed to load study records:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, courseIds]);

  /**
   * 스터디 레코드를 새로고침합니다
   */
  const refresh = useCallback(() => {
    loadStudyRecords();
  }, [loadStudyRecords]);

  // userId나 courseIds가 변경되면 자동으로 로드
  useEffect(() => {
    loadStudyRecords();
  }, [loadStudyRecords]);

  return {
    studyRecords,
    isLoading,
    error,
    refresh,
  };
}

/**
 * 오늘의 세션 정보를 관리하는 훅
 * @param userId - 사용자 ID
 * @param courses - 과목 배열
 */
export function useTodaySessions(userId: number | null | undefined, courses: any[]) {
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [mainSubject, setMainSubject] = useState('학습');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 오늘의 세션 데이터를 로드합니다
   */
  const loadTodaySessions = useCallback(async () => {
    if (!userId || courses.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      debugLog('Loading today sessions for date:', today);

      // 모든 과목의 오늘 세션 조회
      const allSessionsPromises = courses.map(course =>
        getSessionHistory(userId, course.id)
      );
      const allSessionsResults = await Promise.all(allSessionsPromises);
      const allSessions = allSessionsResults.flat();

      // 오늘 생성된 세션 필터링
      const todaySessions = allSessions.filter(session => {
        const sessionDate = new Date(session.created_at).toISOString().split('T')[0];
        return sessionDate === today;
      });

      // 완료된 세션 수 계산
      const completedToday = todaySessions.filter(s => s.status === 'Completed').length;
      const totalToday = todaySessions.length;

      setCompletedSessions(completedToday);
      setTotalSessions(totalToday);

      // 가장 많이 학습한 과목 찾기
      if (courses.length > 0) {
        setMainSubject(courses[0].title);
      }

      debugLog(`Today: ${completedToday}/${totalToday} sessions completed`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load today sessions');
      console.error('Failed to load today sessions:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, courses]);

  /**
   * 오늘의 세션을 새로고침합니다
   */
  const refresh = useCallback(() => {
    loadTodaySessions();
  }, [loadTodaySessions]);

  // userId나 courses가 변경되면 자동으로 로드
  useEffect(() => {
    loadTodaySessions();
  }, [loadTodaySessions]);

  return {
    completedSessions,
    totalSessions,
    mainSubject,
    isLoading,
    error,
    refresh,
  };
}
