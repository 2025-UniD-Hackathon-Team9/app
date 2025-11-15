import { ScrollView, View, StyleSheet, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import TodaySessionCard from '@/components/home/TodaySessionCard';
import SubjectSelector from '@/components/home/SubjectSelector';
import StudyCalendar from '@/components/home/StudyCalendar';
import { colors } from '@/constants/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCourses, useStudyRecords, useTodaySessions } from '@/src/hooks';

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // 커스텀 훅을 사용하여 데이터 관리
  const { subjects, courses, isLoading: isLoadingSubjects } = useCourses(user?.user_id);
  const courseIds = courses.map(c => c.id);
  const { studyRecords } = useStudyRecords(user?.user_id, courseIds);
  const { 
    completedSessions: todayCompletedSessions, 
    totalSessions: todayTotalSessions,
    mainSubject: todaySubject 
  } = useTodaySessions(user?.user_id, courses);

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
