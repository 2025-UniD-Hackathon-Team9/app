import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, Animated, Easing } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from "@/constants/colors";
import { SUBJECT_THEME_PALETTE } from '@/src/constants';
import type { StudyRecord } from '@/src/types';
import { getActivityColor, getDayOfWeek, getActivityLevel } from '@/src/utils';
import { extractDateFromISO } from '@/src/utils/dateUtils';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getCourses } from '@/src/api/courses';
import { useAuth } from '@/src/contexts/AuthContext';
import { getSessionHistory, type SessionHistory } from '@/src/api/sessions';

export default function SubjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [subject, setSubject] = useState<{ id: string; name: string; icon: string; color: string }>({
    id: id,
    name: '과목',
    icon: '📖',
    color: colors.primary[500]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Memoize loadCourse to avoid recreating on every render
  const loadCourse = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const courses = await getCourses(user.user_id);
      const course = courses.find(c => c.id.toString() === id);

      if (course) {
        // 백엔드 Course 데이터를 Subject 타입으로 변환
        const courseIndex = courses.findIndex(c => c.id === course.id);
        setSubject({
          id: course.id.toString(),
          name: course.title,
          icon: SUBJECT_THEME_PALETTE[courseIndex % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
          color: SUBJECT_THEME_PALETTE[courseIndex % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
        });
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  // Memoize loadSessions to avoid recreating on every render
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      const sessionHistory = await getSessionHistory(user.user_id, parseInt(id));
      setSessions(sessionHistory);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, [user, id]);

  useEffect(() => {
    if (user) {
      loadCourse();
      loadSessions();
    }
  }, [user, loadCourse, loadSessions]);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  // Memoize quiz statistics to avoid recalculation on every render
  const quizStats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.status === 'Completed');
    const totalQuizzes = completedSessions.length;
    const averageScore = totalQuizzes > 0
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / totalQuizzes)
      : 0;
    
    return { totalQuizzes, averageScore };
  }, [sessions]);

  // Memoize recent activity data computation
  const activityData = useMemo((): StudyRecord[] => {
    const today = new Date();
    const recentDays: StudyRecord[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Count completed sessions on this date using optimized date extraction
      const sessionsOnDate = sessions.filter(s => {
        const sessionDate = extractDateFromISO(s.created_at);
        return sessionDate === dateString && s.status === 'Completed';
      }).length;

      recentDays.push({
        date: dateString,
        sessionsCompleted: sessionsOnDate,
      });
    }

    return recentDays;
  }, [sessions]);

  // Use useCallback to memoize the shake animation trigger
  const triggerShake = useCallback(() => {
    // iOS 스타일 흔들림 애니메이션 - 가속도가 있는 자연스러운 흔들림
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  // Memoize session press handler
  const handleSessionPress = useCallback((sessionId: number) => {
    router.push(`/subject/${id}/problem?sessionId=${sessionId}`);
  }, [router, id]);

  // Memoize test button press handler
  const handleTestButtonPress = useCallback(() => {
    if (sessions.length > 0) {
      router.push(`/subject/${id}/problem?sessionId=${sessions[0].id}`);
    } else {
      triggerShake();
    }
  }, [sessions, router, id, triggerShake]);

  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          {/* 뒤로가기 버튼 */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>

          {/* 타이틀 섹션 스켈레톤 */}
          <View style={styles.titleSection}>
            <Animated.View style={[styles.skeletonIconContainer, { opacity: shimmerOpacity }]} />
            <View style={styles.titleTextContainer}>
              <Animated.View style={[styles.skeletonTitle, { opacity: shimmerOpacity }]} />
            </View>
          </View>

          {/* 주간 활동 그래프 스켈레톤 */}
          <View style={styles.activitySection}>
            <Animated.View style={[styles.skeletonSectionTitle, { opacity: shimmerOpacity }]} />
            <View style={styles.activityGrid}>
              {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                <View key={index} style={styles.activityDayContainer}>
                  <Animated.View style={[styles.skeletonActivityDay, { opacity: shimmerOpacity }]} />
                  <Animated.View style={[styles.skeletonDayLabel, { opacity: shimmerOpacity }]} />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Animated.View style={[styles.skeletonSectionTitle, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonCard, { opacity: shimmerOpacity }]} />
          </View>

          <View style={styles.section}>
            <Animated.View style={[styles.skeletonSectionTitle, { opacity: shimmerOpacity }]} />
            <View style={styles.statsGrid}>
              <Animated.View style={[styles.skeletonStatCard, { opacity: shimmerOpacity }]} />
              <Animated.View style={[styles.skeletonStatCard, { opacity: shimmerOpacity }]} />
            </View>
          </View>

          <View style={styles.section}>
            <Animated.View style={[styles.skeletonSectionTitle, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonCard, { opacity: shimmerOpacity }]} />
          </View>
        </View>
      </ScrollView>
    );
  }

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
          <Text style={styles.activitySectionTitle}>이번 주 복습 기록</Text>
          <View style={styles.activityGrid}>
            {activityData.map((day, index) => {
              const level = getActivityLevel(day.sessionsCompleted);
              const isToday = index === activityData.length - 1;
              return (
                <View key={day.date} style={styles.activityDayContainer}>
                  <View
                    style={[
                      styles.activityDay,
                      { backgroundColor: getActivityColor(subject.color, level, colors.neutral.gray100) },
                      isToday && { borderWidth: 2, borderColor: subject.color },
                    ]}
                  >
                    {day.sessionsCompleted > 0 && (
                      <Text style={[
                        styles.activityNumber,
                        level === 1 && { color: subject.color }
                      ]}>
                        {day.sessionsCompleted}
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
          <Text style={styles.sectionTitle}>복습 기록</Text>
          {sessions.length > 0 ? (
            <View style={styles.sessionList}>
              {sessions.map((session) => (
                <Pressable
                  key={session.id}
                  style={({ pressed }) => [
                    styles.sessionCard,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => handleSessionPress(session.id)}
                >
                  <View style={styles.sessionHeader}>
                    <View style={[styles.sessionStatusBadge, session.status === 'Completed' && { backgroundColor: colors.primary[100] }]}>
                      <Text style={[styles.sessionStatusText, session.status === 'Completed' && { color: colors.primary[500] }]}>
                        {session.status === 'Completed' ? '완료' : session.status === 'InProgress' ? '진행중' : '미시작'}
                      </Text>
                    </View>
                    {session.score !== undefined && (
                      <Text style={[styles.sessionScore, { color: subject.color }]}>
                        {session.score}점
                      </Text>
                    )}
                  </View>
                  <Text style={styles.sessionDate}>
                    {new Date(session.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>아직 복습 기록이 없어요</Text>
              <Text style={styles.emptySubText}>수업 필기를 찍어서 5분 안에 복습 완료!</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 성취도</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: subject.color }]}>{quizStats.totalQuizzes}</Text>
              <Text style={styles.statLabel}>복습 횟수</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: subject.color }]}>{quizStats.averageScore}점</Text>
              <Text style={styles.statLabel}>평균 점수</Text>
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
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnim }]
            }}
          >
            <Pressable
              onPress={handleTestButtonPress}
              style={({ pressed }) => [
                styles.testButton,
                sessions.length === 0
                  ? styles.testButtonDisabled
                  : { backgroundColor: subject.color },
                pressed && sessions.length > 0 && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.testButtonText}>
                5분 복습 시작
              </Text>
            </Pressable>
          </Animated.View>
          {sessions.length === 0 && (
            <Text style={styles.testButtonHint}>
              필기 사진을 올리면 바로 복습할 수 있어요
            </Text>
          )}
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
  testButtonDisabled: {
    backgroundColor: colors.neutral.gray200,
    shadowOpacity: 0,
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.black,
  },
  testButtonHint: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
  // 스켈레톤 UI 스타일
  skeletonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonTitle: {
    width: 120,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonSectionTitle: {
    width: 100,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray200,
    marginBottom: 16,
  },
  skeletonActivityDay: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonDayLabel: {
    width: 20,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonCard: {
    backgroundColor: colors.neutral.gray100,
    borderRadius: 20,
    padding: 40,
    height: 120,
  },
  skeletonStatCard: {
    flex: 1,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 20,
    padding: 24,
    height: 120,
  },
  // 세션 목록 스타일
  sessionList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray100,
  },
  sessionStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  sessionScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sessionDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
