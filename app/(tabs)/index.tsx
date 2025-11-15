import { ScrollView, View, StyleSheet, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import TodaySessionCard from '@/components/home/TodaySessionCard';
import SubjectSelector from '@/components/home/SubjectSelector';
import StudyCalendar from '@/components/home/StudyCalendar';
import { colors } from '@/constants/colors';
import { SUBJECT_THEME_PALETTE } from '@/src/constants';
import type { StudyRecord, Subject } from '@/src/types';
import { getCourses } from '@/src/api/courses';
import { useAuth } from '@/src/contexts/AuthContext';
import { getSessionHistory } from '@/src/api/sessions';

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [todayCompletedSessions, setTodayCompletedSessions] = useState(0);
  const [todayTotalSessions, setTodayTotalSessions] = useState(0);
  const [todaySubject, setTodaySubject] = useState('학습');

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;

    setIsLoadingSubjects(true);
    try {
      const courses = await getCourses(user.user_id);

      // 백엔드 Course 데이터를 Subject 타입으로 변환
      const convertedSubjects: Subject[] = courses.map((course, index) => ({
        id: course.id.toString(),
        name: course.title,
        icon: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
        color: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
      }));

      setSubjects(convertedSubjects);

      // 모든 과목의 세션 히스토리 조회 및 합산
      await loadAllStudyRecords(courses.map(c => c.id));

      // 오늘의 세션 데이터 계산
      await loadTodaySessions(courses);
    } catch (error) {
      console.error('Failed to load courses:', error);
      // 에러 발생 시 빈 배열 유지
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const loadAllStudyRecords = async (courseIds: number[]) => {
    if (!user) return;

    try {
      // 모든 과목의 세션 히스토리를 병렬로 조회
      const allSessionsPromises = courseIds.map(courseId =>
        getSessionHistory(user.user_id, courseId)
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
    } catch (error) {
      console.error('Failed to load study records:', error);
    }
  };

  const loadTodaySessions = async (courses: any[]) => {
    if (!user || courses.length === 0) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // 모든 과목의 오늘 세션 조회
      const allSessionsPromises = courses.map(course =>
        getSessionHistory(user.user_id, course.id)
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

      setTodayCompletedSessions(completedToday);
      setTodayTotalSessions(totalToday);

      // 가장 많이 학습한 과목 찾기
      if (courses.length > 0) {
        setTodaySubject(courses[0].title);
      }
    } catch (error) {
      console.error('Failed to load today sessions:', error);
    }
  };

  const handlePdfUpload = () => {
    router.push('/camera');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 커스텀 헤더 */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        {/*  <Text style={styles.headerTitle}>제때제때</Text>*/}
        </View>

        <TodaySessionCard
          completedSessions={todayCompletedSessions}
          totalSessions={todayTotalSessions}
          subject={todaySubject}
        />

        <SubjectSelector
          subjects={subjects}
          isLoading={isLoadingSubjects}
        />

        <StudyCalendar
          studyRecords={studyRecords}
          currentMonth={new Date()}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
      <FloatingActionButton onPress={handlePdfUpload} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.neutral.gray50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: -0.8,
  },
  bottomSpacing: {
    height: 20,
  },
});
