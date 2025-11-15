import React, { useEffect, useRef, useState, memo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { calculateProgress, getMotivationMessage, getProgressEmoji } from '@/src/utils';

/**
 * TodaySessionCard 컴포넌트의 Props
 */
interface TodaySessionCardProps {
  /** 오늘 완료한 세션 수 */
  completedSessions: number;
  /** 오늘 계획된 전체 세션 수 */
  totalSessions: number;
  /** 과목 이름 */
  subject: string;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 처음 진입 여부 */
  isFirstLoad?: boolean;
}

/**
 * 오늘의 학습 세션 진행 상황을 표시하는 카드 컴포넌트
 * 완료된 세션, 진행률 바, 동기부여 메시지를 표시합니다
 * React.memo로 최적화되어 props가 변경되지 않으면 리렌더링하지 않습니다
 */
const TodaySessionCard = memo(function TodaySessionCard({
  completedSessions,
  totalSessions,
  subject,
  isLoading = false,
  isFirstLoad = false
}: TodaySessionCardProps) {
  const progress = calculateProgress(completedSessions, totalSessions);
  const [showWelcome, setShowWelcome] = useState(isFirstLoad);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 로딩이 끝나면 3초 후 웰컴 메시지에서 실제 데이터로 전환
    if (!isLoading && showWelcome) {
      const timer = setTimeout(() => {
        // Fade out welcome message
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowWelcome(false);
          // Fade in actual data
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, 1000); // 1초 대기

      return () => clearTimeout(timer);
    }
  }, [isLoading, showWelcome]);

  // 웰컴 메시지 표시
  if (showWelcome) {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.welcomeEmoji}>👋</Text>
        <Text style={styles.welcomeTitle}>안녕하세요!</Text>
        <Text style={styles.welcomeMessage}>
          수업 후 5분만 투자하면{'\n'}
          핵심 내용을 완벽하게 기억할 수 있어요
        </Text>
        <View style={styles.welcomeDivider} />
        <Text style={styles.welcomeSubtext}>
          필기 사진만 올리면 바로 복습 시작!
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>오늘의 복습</Text>
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <Text style={styles.emoji}>{getProgressEmoji(completedSessions, totalSessions)}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.numberRow}>
          <Text style={styles.completedNumber}>{completedSessions}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={styles.totalNumber}>{totalSessions}</Text>
          <Text style={styles.unit}>세션</Text>
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

      <Text style={styles.motivationText}>{getMotivationMessage(completedSessions, totalSessions)}</Text>
    </Animated.View>
  );
});

export default TodaySessionCard;

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
  // 스켈레톤 UI 스타일
  skeletonLabel: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray200,
    marginBottom: 4,
  },
  skeletonSubject: {
    width: 120,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonNumber: {
    width: 100,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonProgressBar: {
    height: 12,
    borderRadius: 100,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonMotivation: {
    width: 180,
    height: 15,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray200,
  },
  // 웰컴 메시지 스타일
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.8,
  },
  welcomeMessage: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  welcomeDivider: {
    width: 40,
    height: 3,
    backgroundColor: colors.primary[500],
    borderRadius: 2,
    marginBottom: 16,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[500],
    textAlign: 'center',
  },
});
