import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from "@/constants/colors";

const SUBJECT_INFO: { [key: string]: { name: string; icon: string; color: string } } = {
  math: { name: '수학', icon: '📐', color: colors.primary[500] },
  physics: { name: '물리', icon: '⚛️', color: '#FF6B6B' },
  chemistry: { name: '화학', icon: '🧪', color: '#4ECDC4' },
  english: { name: '영어', icon: '📚', color: '#95E1D3' },
  korean: { name: '국어', icon: '✏️', color: '#F38181' },
};

// 샘플 활동 데이터 (최근 7일)
const SAMPLE_ACTIVITY_DATA = [
  { date: '2025-11-09', sessions: 0 },
  { date: '2025-11-10', sessions: 6 },
  { date: '2025-11-11', sessions: 0 },
  { date: '2025-11-12', sessions: 3 },
  { date: '2025-11-13', sessions: 5 },
  { date: '2025-11-14', sessions: 0 },
  { date: '2025-11-15', sessions: 2 },
];

export default function SubjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subject = SUBJECT_INFO[id] || { name: '과목', icon: '📖', color: colors.primary[500] };

  const getActivityLevel = (sessions: number): number => {
    if (sessions === 0) return 0;
    if (sessions < 3) return 1;
    if (sessions < 5) return 2;
    return 3;
  };

  const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  const getActivityColor = (level: number) => {
    if (level === 0) return colors.neutral.gray100;
    const baseColor = subject.color;
    // 간단하게 opacity로 레벨 표현
    if (level === 1) return `${baseColor}40`; // 25% opacity
    if (level === 2) return `${baseColor}80`; // 50% opacity
    return baseColor; // 100% opacity
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        {/* 뒤로가기 버튼 */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
        </Pressable>

        {/* 타이틀 섹션 */}
        <View style={styles.titleSection}>
          <View style={[styles.iconContainer, { backgroundColor: subject.color }]}>
            <Text style={styles.icon}>{subject.icon}</Text>
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>{subject.name}</Text>
          </View>
        </View>

        {/* 주간 활동 그래프 */}
        <View style={styles.activitySection}>
          <Text style={styles.activitySectionTitle}>최근 7일 활동</Text>
          <View style={styles.activityGrid}>
            {SAMPLE_ACTIVITY_DATA.map((day, index) => {
              const level = getActivityLevel(day.sessions);
              const isToday = index === SAMPLE_ACTIVITY_DATA.length - 1;
              return (
                <View key={day.date} style={styles.activityDayContainer}>
                  <View
                    style={[
                      styles.activityDay,
                      { backgroundColor: getActivityColor(level) },
                      isToday && { borderWidth: 2, borderColor: subject.color },
                    ]}
                  >
                    {day.sessions > 0 && (
                      <Text style={[
                        styles.activityNumber,
                        level === 1 && { color: subject.color }
                      ]}>
                        {day.sessions}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.activityDayLabel,
                    isToday && { color: subject.color, fontWeight: '700' }
                  ]}>
                    {getDayOfWeek(day.date)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 학습 내용</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>아직 학습한 내용이 없습니다</Text>
            <Text style={styles.emptySubText}>PDF를 업로드하여 학습을 시작하세요</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>퀴즈 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: subject.color }]}>0</Text>
              <Text style={styles.statLabel}>총 퀴즈</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: subject.color }]}>0%</Text>
              <Text style={styles.statLabel}>정답률</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>틀린 문제</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>틀린 문제가 없습니다</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={() => router.push(`/subject/${id}/problem`)}
            style={({ pressed }) => [
              styles.testButton,
              { backgroundColor: subject.color },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.testButtonText}>문제 테스트</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  header: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.neutral.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: -0.8,
  },
  activitySection: {
    paddingTop: 8,
  },
  activitySectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  activityDayContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  activityDay: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  activityDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  emptyState: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 17,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 15,
    color: colors.text.disabled,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  testButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.black,
  },
});
