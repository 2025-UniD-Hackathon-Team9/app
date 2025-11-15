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
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>오늘의 학습</Text>
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <Text style={styles.emoji}>{getEmoji()}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.numberRow}>
          <Text style={styles.completedNumber}>{completedSessions}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.totalNumber}>{totalSessions}</Text>
          <Text style={styles.unit}>문제</Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(progress * 100, 100)}%` }
            ]}
          />
        </View>
      </View>

      <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  subject: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  emoji: {
    fontSize: 40,
  },
  progressContainer: {
    marginBottom: 20,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  completedNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary[500],
    letterSpacing: -1.5,
  },
  separator: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.neutral.gray300,
    marginHorizontal: 6,
  },
  totalNumber: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.neutral.gray400,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginLeft: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 100,
  },
  motivationText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});
