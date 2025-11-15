import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import Svg, { Circle } from 'react-native-svg';

interface TodaySessionCardProps {
  completedSessions: number;
  totalSessions: number;
  subject: string;
}

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TodaySessionCard({
  completedSessions,
  totalSessions,
  subject
}: TodaySessionCardProps) {
  const progress = totalSessions > 0 ? completedSessions / totalSessions : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <LinearGradient
      colors={[colors.primary[500], colors.primary[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="local-fire-department" size={28} color={colors.neutral.white} />
          <View>
            <Text style={styles.greeting}>오늘 하루도 화이팅!</Text>
            <Text style={styles.subject}>{subject} 공부중</Text>
          </View>
        </View>
      </View>

      <View style={styles.circleContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {/* Background circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={colors.accent[500]}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.circleContent}>
          <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
          <Text style={styles.completedText}>
            {completedSessions}/{totalSessions}
          </Text>
          <Text style={styles.sessionLabel}>세션</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {completedSessions >= totalSessions ? (
          <View style={styles.badge}>
            <MaterialIcons name="celebration" size={20} color={colors.accent[500]} />
            <Text style={styles.badgeText}>목표 달성 완료! 🎉</Text>
          </View>
        ) : (
          <View style={styles.badge}>
            <MaterialIcons name="trending-up" size={20} color={colors.accent[500]} />
            <Text style={styles.badgeText}>
              {totalSessions - completedSessions}개 세션만 더 하면 완료!
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  subject: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  circleContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  completedText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  sessionLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  footer: {
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
  },
});
