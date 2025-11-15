import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSessionHistory, type SessionHistory } from '@/src/api/sessions';
import type { Course } from '@/src/api/courses';
import type { StudyRecord } from '@/src/types';
import { extractDateFromISO, getTodayString } from '@/src/utils/dateUtils';

/**
 * Custom hook for fetching and managing session history
 * Provides computed data like today's sessions and study records
 */
export function useSessions(userId: number | undefined, courses: Course[]) {
  const [allSessions, setAllSessions] = useState<SessionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadSessions = useCallback(async () => {
    if (!userId || courses.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all sessions in parallel
      const allSessionsPromises = courses.map(course =>
        getSessionHistory(userId, course.id).catch(() => [])
      );
      const allSessionsResults = await Promise.all(allSessionsPromises);
      const sessions = allSessionsResults.flat();
      
      setAllSessions(sessions);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load sessions');
      setError(error);
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, courses]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Memoize computed values to avoid recalculation on every render
  const todaySessionData = useMemo(() => {
    const today = getTodayString();
    const todaySessions = allSessions.filter(session => {
      const sessionDate = extractDateFromISO(session.created_at);
      return sessionDate === today;
    });

    const completed = todaySessions.filter(s => s.status === 'Completed').length;
    const total = todaySessions.length;

    return {
      completedSessions: completed,
      totalSessions: total,
      sessions: todaySessions,
    };
  }, [allSessions]);

  // Memoize study records for calendar
  const studyRecords = useMemo((): StudyRecord[] => {
    const recordsByDate = new Map<string, number>();
    
    allSessions.forEach(session => {
      if (session.status === 'Completed') {
        const dateString = extractDateFromISO(session.created_at);
        recordsByDate.set(dateString, (recordsByDate.get(dateString) || 0) + 1);
      }
    });

    return Array.from(recordsByDate.entries()).map(([date, count]) => ({
      date,
      sessionsCompleted: count,
    }));
  }, [allSessions]);

  return {
    allSessions,
    todaySessionData,
    studyRecords,
    isLoading,
    error,
    refetch: loadSessions,
  };
}
