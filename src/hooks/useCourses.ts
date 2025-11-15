/**
 * 과목(코스) 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { getCourses, createCourse, type Course, type CreateCourseRequest } from '@/src/api/courses';
import { SUBJECT_THEME_PALETTE } from '@/src/constants';
import type { Subject } from '@/src/types';
import { debugLog } from '@/src/config';

/**
 * 사용자의 과목 목록을 관리하는 훅
 * @param userId - 사용자 ID
 */
export function useCourses(userId: number | null | undefined) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 과목 목록을 불러옵니다
   */
  const loadCourses = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      debugLog('Loading courses for user:', userId);
      const fetchedCourses = await getCourses(userId);
      setCourses(fetchedCourses);

      // 백엔드 Course 데이터를 Subject 타입으로 변환
      const convertedSubjects: Subject[] = fetchedCourses.map((course, index) => ({
        id: course.id.toString(),
        name: course.title,
        icon: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
        color: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
      }));

      setSubjects(convertedSubjects);
      debugLog(`Loaded ${fetchedCourses.length} courses`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load courses');
      console.error('Failed to load courses:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * 새로운 과목을 생성합니다
   */
  const addCourse = useCallback(async (data: CreateCourseRequest): Promise<Course> => {
    try {
      debugLog('Creating course:', data.title);
      const newCourse = await createCourse(data);
      setCourses(prev => [...prev, newCourse]);

      // Subject 타입으로도 추가
      const newSubject: Subject = {
        id: newCourse.id.toString(),
        name: newCourse.title,
        icon: SUBJECT_THEME_PALETTE[courses.length % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
        color: SUBJECT_THEME_PALETTE[courses.length % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
      };
      setSubjects(prev => [...prev, newSubject]);

      debugLog('Course created:', newCourse);
      return newCourse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create course');
      console.error('Failed to create course:', error);
      throw error;
    }
  }, [courses.length]);

  /**
   * 과목 목록을 새로고침합니다
   */
  const refresh = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  // userId가 변경되면 자동으로 과목 목록 로드
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    subjects,
    isLoading,
    error,
    addCourse,
    refresh,
  };
}
