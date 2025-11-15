import { useState, useEffect, useCallback } from 'react';
import { getCourses, type Course } from '@/src/api/courses';
import { SUBJECT_THEME_PALETTE } from '@/src/constants';
import type { Subject } from '@/src/types';

/**
 * Custom hook for fetching and managing courses data
 * Converts backend Course data to frontend Subject format with caching
 */
export function useCourses(userId: number | undefined) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCourses = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedCourses = await getCourses(userId);
      setCourses(fetchedCourses);

      // Convert backend Course data to Subject type
      const convertedSubjects: Subject[] = fetchedCourses.map((course, index) => ({
        id: course.id.toString(),
        name: course.title,
        icon: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
        color: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
      }));

      setSubjects(convertedSubjects);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load courses');
      setError(error);
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    subjects,
    courses,
    isLoading,
    error,
    refetch: loadCourses,
  };
}
