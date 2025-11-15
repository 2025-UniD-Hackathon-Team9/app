import React, { useEffect, useRef, memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import type { Subject } from '@/src/types';

/**
 * SubjectSelector 컴포넌트의 Props
 */
interface SubjectSelectorProps {
  /** 표시할 과목 배열 */
  subjects: Subject[];
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 가로 스크롤 가능한 과목 선택 컴포넌트
 * 과목 카드와 새 과목 생성 추가 버튼을 표시합니다
 * React.memo로 최적화되어 props가 변경되지 않으면 리렌더링하지 않습니다
 */
const SubjectSelector = memo(function SubjectSelector({
  subjects,
  isLoading = false,
}: SubjectSelectorProps) {
  const router = useRouter();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
  }, [isLoading]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  // Memoize the press handler to prevent recreation on every render
  const handleSubjectPress = useCallback((subjectId: string) => {
    router.push(`/subject/${subjectId}`);
  }, [router]);

  const handleAddPress = useCallback(() => {
    router.push('/add-subject');
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>과목</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {isLoading ? (
          // 스켈레톤 UI with shimmer animation
          <>
            {[1, 2, 3].map((index) => (
              <View key={index} style={styles.skeletonCard}>
                <Animated.View style={[styles.skeletonIcon, { opacity: shimmerOpacity }]} />
                <Animated.View style={[styles.skeletonText, { opacity: shimmerOpacity }]} />
              </View>
            ))}
          </>
        ) : (
          <>
            {subjects.map((subject) => {
              return (
                <Pressable
                  key={subject.id}
                  style={({ pressed }) => [
                    styles.subjectCard,
                    { backgroundColor: subject.color },
                    pressed && styles.subjectCardPressed,
                  ]}
                  onPress={() => handleSubjectPress(subject.id)}
                >
                  <Text style={styles.icon}>{subject.icon}</Text>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </Pressable>
              );
            })}

            {/* 과목 추가 버튼 */}
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={handleAddPress}
            >
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addText}>추가</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
});

export default SubjectSelector;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 130,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  icon: {
    fontSize: 28,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: -0.3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 110,
    backgroundColor: colors.neutral.white,
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
    borderStyle: 'dashed',
  },
  addButtonPressed: {
    opacity: 0.7,
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    letterSpacing: -0.3,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 130,
    backgroundColor: colors.neutral.gray100,
  },
  skeletonIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonText: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray200,
  },
});
