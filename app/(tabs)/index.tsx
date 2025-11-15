import { ScrollView, View, StyleSheet, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import TodaySessionCard from '@/components/home/TodaySessionCard';
import SubjectSelector from '@/components/home/SubjectSelector';
import StudyCalendar from '@/components/home/StudyCalendar';
import { colors } from '@/constants/colors';
import { DEFAULT_SUBJECTS } from '@/src/constants';
import type { StudyRecord } from '@/src/types';

// 샘플 데이터
const SAMPLE_STUDY_RECORDS: StudyRecord[] = [
  { date: '2025-11-01', sessionsCompleted: 2 },
  { date: '2025-11-03', sessionsCompleted: 5 },
  { date: '2025-11-04', sessionsCompleted: 3 },
  { date: '2025-11-07', sessionsCompleted: 4 },
  { date: '2025-11-08', sessionsCompleted: 1 },
  { date: '2025-11-10', sessionsCompleted: 6 },
  { date: '2025-11-12', sessionsCompleted: 3 },
  { date: '2025-11-13', sessionsCompleted: 5 },
  { date: '2025-11-15', sessionsCompleted: 2 },
];

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          <Text style={styles.headerTitle}>앱 이름</Text>
        </View>

        <TodaySessionCard
          completedSessions={2}
          totalSessions={5}
          subject="수학"
        />

        <SubjectSelector
          subjects={DEFAULT_SUBJECTS}
        />

        <StudyCalendar
          studyRecords={SAMPLE_STUDY_RECORDS}
          currentMonth={new Date(2025, 10, 1)} // 2025년 11월
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
