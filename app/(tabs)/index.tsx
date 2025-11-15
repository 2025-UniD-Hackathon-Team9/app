import { ScrollView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import TodaySessionCard from '@/components/home/TodaySessionCard';
import SubjectSelector from '@/components/home/SubjectSelector';
import StudyCalendar from '@/components/home/StudyCalendar';
import { colors } from '@/constants/colors';

const SUBJECTS = [
  { id: 'math', name: '수학', icon: '📐', color: colors.primary[500] },
  { id: 'physics', name: '물리', icon: '⚛️', color: '#FF6B6B' },
  { id: 'chemistry', name: '화학', icon: '🧪', color: '#4ECDC4' },
  { id: 'english', name: '영어', icon: '📚', color: '#95E1D3' },
  { id: 'korean', name: '국어', icon: '✏️', color: '#F38181' },
];

// 샘플 데이터
const SAMPLE_STUDY_RECORDS = [
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

  const handlePdfUpload = () => {
    router.push('/camera');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TodaySessionCard
          completedSessions={2}
          totalSessions={5}
          subject="수학"
        />

        <SubjectSelector
          subjects={SUBJECTS}
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
  bottomSpacing: {
    height: 20,
  },
});
