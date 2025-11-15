import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

const SUBJECT_INFO: { [key: string]: { name: string; icon: string; color: string } } = {
  math: { name: '수학', icon: '📐', color: colors.primary[500] },
  physics: { name: '물리', icon: '⚛️', color: '#FF6B6B' },
  chemistry: { name: '화학', icon: '🧪', color: '#4ECDC4' },
  english: { name: '영어', icon: '📚', color: '#95E1D3' },
  korean: { name: '국어', icon: '✏️', color: '#F38181' },
};

export default function SubjectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const subject = SUBJECT_INFO[id] || { name: '과목', icon: '📖', color: colors.primary[500] };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: subject.color }]}>
          <Text style={styles.icon}>{subject.icon}</Text>
        </View>
        <Text style={styles.title}>{subject.name}</Text>
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
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>총 퀴즈</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0%</Text>
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
              pressed && styles.testButtonPressed,
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.neutral.white,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[500],
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  testButton: {
    backgroundColor: colors.accent[500],
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
  testButtonPressed: {
    backgroundColor: colors.accent[600],
    opacity: 0.9,
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.black,
  },
});
