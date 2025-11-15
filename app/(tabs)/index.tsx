import { ScrollView, View, StyleSheet, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useCallback } from 'react';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import TodaySessionCard from '@/components/home/TodaySessionCard';
import SubjectSelector from '@/components/home/SubjectSelector';
import StudyCalendar from '@/components/home/StudyCalendar';
import { colors } from '@/constants/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCourses, useSessions } from '@/src/hooks';

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Use custom hooks for data fetching with automatic caching and memoization
  const { subjects, courses, isLoading: isLoadingSubjects } = useCourses(user?.user_id);
  const { todaySessionData, studyRecords, isLoading: isLoadingSessions } = useSessions(user?.user_id, courses);

  // Memoize computed values
  const todaySubject = useMemo(() => {
    if (courses.length > 0) {
      return courses[0].title;
    }
    return '학습';
  }, [courses]);

  const isFirstLoad = useMemo(() => {
    return isLoadingSubjects && subjects.length === 0;
  }, [isLoadingSubjects, subjects.length]);

  // Use useCallback to prevent function recreation on every render
  const handlePdfUpload = useCallback(() => {
    router.push('/camera');
  }, [router]);

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
          completedSessions={todaySessionData.completedSessions}
          totalSessions={todaySessionData.totalSessions}
          subject={todaySubject}
          isLoading={isLoadingSubjects || isLoadingSessions}
          isFirstLoad={isFirstLoad}
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
