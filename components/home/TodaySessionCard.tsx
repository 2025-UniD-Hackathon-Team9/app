import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface TodaySessionCardProps {
  completedSessions: number;
  totalSessions: number;
  subject: string;
}

export default function TodaySessionCard({
  completedSessions,
  totalSessions,
  subject
}: TodaySessionCardProps) {
  const progress = totalSessions > 0 ? completedSessions / totalSessions : 0;

  const getMotivationMessage = () => {
    if (completedSessions === 0) return '오늘도 화이팅! 🎯';
    if (progress < 0.5) return '좋아요! 계속 가볼까요? 💪';
    if (progress < 1) return '거의 다 왔어요! 🔥';
    return '완벽해요! 🎉';
  };

  const getEmoji = () => {
    if (completedSessions === 0) return '📚';
    if (progress < 0.5) return '💪';
    if (progress < 1) return '🔥';
    return '🎉';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{subject}</Text>
          </View>
          <Text style={styles.greeting}>{getMotivationMessage()}</Text>
        </View>

        {/* 메인 프로그레스 */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressEmoji}>{getEmoji()}</Text>
            <View style={styles.progressNumbers}>
              <Text style={styles.completedNumber}>{completedSessions}</Text>
              <Text style={styles.separator}>/</Text>
              <Text style={styles.totalNumber}>{totalSessions}</Text>
            </View>
            <Text style={styles.progressLabel}>문제 완료</Text>
          </View>

          {/* 프로그레스 바 */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progress * 100, 100)}%` }
                ]}
              />
            </View>
          </View>
        </View>

        {/* 성취 배지 */}
        {completedSessions >= totalSessions && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementText}>✨ 오늘의 목표 달성! ✨</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    padding: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  subjectBadge: {
    backgroundColor: colors.primary[50],
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 16,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary[600],
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  completedNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary[500],
    letterSpacing: -2,
  },
  separator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.neutral.gray300,
    marginHorizontal: 8,
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.neutral.gray400,
    letterSpacing: -1,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 100,
  },
  achievementBadge: {
    backgroundColor: colors.primary[50],
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[700],
  },
});
