import { View, Text, StyleSheet, ScrollView, Pressable, Animated, StatusBar, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useState, useEffect, useRef } from 'react';
import { getSession, submitSingleQuestion, type SessionQuestion } from '@/src/api/sessions';
import { getCourses } from '@/src/api/courses';
import { useAuth } from '@/src/contexts/AuthContext';
import { SUBJECT_THEME_PALETTE } from '@/src/constants';

export default function ProblemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { id, sessionId } = useLocalSearchParams<{ id: string; sessionId?: string }>();

  if (!id) {
    return null;
  }

  const [subject, setSubject] = useState<{ name: string; icon: string; color: string }>({ name: '과목', icon: '📖', color: colors.primary[500] });
  const [problems, setProblems] = useState<SessionQuestion[]>([]);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  // Shimmer animation
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

  const handleQuit = () => {
    router.back();
  };

  useEffect(() => {
    loadData();
  }, [id, sessionId, user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // 과목 정보 로드
      const courses = await getCourses(user.user_id);
      const course = courses.find(c => c.id.toString() === id);
      if (course) {
        const courseIndex = courses.findIndex(c => c.id === course.id);
        setSubject({
          name: course.title,
          icon: SUBJECT_THEME_PALETTE[courseIndex % SUBJECT_THEME_PALETTE.length]?.icon || '📖',
          color: SUBJECT_THEME_PALETTE[courseIndex % SUBJECT_THEME_PALETTE.length]?.color || colors.primary[500],
        });
      }

      // 세션 ID가 있으면 세션 문제 로드
      if (sessionId) {
        const sessionData = await getSession(parseInt(sessionId));
        setProblems(sessionData.questions);
      } else {
        // 세션 ID가 없으면 에러
        Alert.alert('오류', '세션 ID가 필요합니다.');
        router.back();
        return;
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      Alert.alert('오류', '문제를 불러오는데 실패했습니다.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header Skeleton */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTop}>
            <Animated.View style={[styles.skeletonQuitButton, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonCounter, { opacity: shimmerOpacity }]} />
            <View style={styles.placeholder} />
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.skeletonProgressBar, { opacity: shimmerOpacity }]} />
          </View>
        </View>

        {/* Content Skeleton */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Question Section Skeleton */}
          <View style={styles.questionSection}>
            <Animated.View style={[styles.skeletonBadge, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonQuestion, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonQuestion, { width: '80%', marginTop: 8, opacity: shimmerOpacity }]} />
          </View>

          {/* Options Skeleton */}
          <View style={styles.optionsSection}>
            {[1, 2, 3, 4].map((item) => (
              <Animated.View key={item} style={[styles.skeletonOption, { opacity: shimmerOpacity }]} />
            ))}
          </View>
        </ScrollView>

        {/* Bottom Button Skeleton */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
          <Animated.View style={[styles.skeletonButton, { opacity: shimmerOpacity }]} />
        </View>
      </View>
    );
  }

  // 세션에 문제가 없을 때
  if (sessionId && problems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerTop}>
            <Pressable onPress={handleQuit} style={styles.quitButton}>
              <MaterialIcons name="close" size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.problemCounter}>문제 없음</Text>
            <View style={styles.placeholder} />
          </View>
        </View>
        <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>복습 문제가 없어요</Text>
          <Text style={styles.emptyDescription}>
            필기나 교재 사진을 올려서{'\n'}
            빠르게 복습 문제를 만들어보세요
          </Text>
          <Pressable
            onPress={handleQuit}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>돌아가기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentProblem = problems[currentProblemIndex];
  const progress = (currentProblemIndex + 1) / problems.length;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmit = async () => {
    if (!sessionId || showResult) return;

    // 답안 결정: 객관식이면 선택한 옵션, 그 외에는 텍스트 답변
    let userAnswer = '';
    if (currentProblem.type === '객관식' && selectedOption !== null) {
      userAnswer = currentProblem.options?.[selectedOption] || '';
    } else if (currentProblem.type === 'OX') {
      userAnswer = textAnswer; // 'O' 또는 'X'
    } else if (currentProblem.type === '단답식') {
      userAnswer = textAnswer;
    }

    if (!userAnswer) return;

    // 답안 저장
    const newAnswers = new Map(answers);
    newAnswers.set(currentProblem.id, userAnswer);
    setAnswers(newAnswers);

    // 개별 문제 채점 API 호출
    try {
      console.log('[Problem] Submitting answer:', {
        sessionId: parseInt(sessionId),
        questionId: currentProblem.id,
        userAnswer
      });

      const result = await submitSingleQuestion(
        parseInt(sessionId),
        currentProblem.id,
        userAnswer
      );

      console.log('[Problem] Submit result:', result);

      // 결과 표시
      setIsCorrect(result.correct);
      setCorrectAnswer(result.realAnswer || '');
      setShowResult(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      Alert.alert('오류', '답안 제출에 실패했습니다.');
    }
  };

  const handleRetry = () => {
    // 현재 문제 다시 풀기
    setSelectedOption(null);
    setTextAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setCorrectAnswer('');
  };

  const handleContinue = () => {
    // 다음 문제로 이동 또는 완료
    if (currentProblemIndex === problems.length - 1) {
      Alert.alert(
        '복습 완료! 🎉',
        '오늘 복습 끝! 수고했어요',
        [{ text: '확인', onPress: () => router.back() }]
      );
    } else {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setSelectedOption(null);
      setTextAnswer('');
      setShowResult(false);
      setIsCorrect(false);
      setCorrectAnswer('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={handleQuit} style={styles.quitButton}>
            <MaterialIcons name="close" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.problemCounter}>
            {currentProblemIndex + 1} / {problems.length}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: subject.color,
              },
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Question Section */}
        <View style={styles.questionSection}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectIcon}>{subject.icon}</Text>
            <Text style={styles.subjectName}>{subject.name}</Text>
          </View>
          <Text style={styles.question}>{currentProblem.question_text}</Text>
        </View>

        {/* Answer Section */}
        <View style={styles.optionsSection}>
          {/* 객관식 */}
          {currentProblem.type === '객관식' && currentProblem.options?.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = showResult && !isCorrect && option === correctAnswer;
            const isWrongOption = showResult && isSelected && !isCorrect;

            return (
              <Pressable
                key={index}
                onPress={() => !showResult && handleSelectOption(index)}
                disabled={showResult}
                style={({ pressed }) => [
                  styles.optionButton,
                  isSelected && !showResult && { borderColor: subject.color, borderWidth: 3 },
                  showResult && isSelected && isCorrect && styles.optionButtonCorrect,
                  isWrongOption && styles.optionButtonWrong,
                  isCorrectOption && styles.optionButtonCorrect,
                  !showResult && pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && !showResult && { color: subject.color },
                  ]}
                >
                  {option}
                </Text>
                {showResult && isCorrectOption && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
                {isWrongOption && (
                  <MaterialIcons name="cancel" size={24} color="#FF5252" />
                )}
              </Pressable>
            );
          })}

          {/* OX 문제 */}
          {currentProblem.type === 'OX' && (
            <View style={styles.oxContainer}>
              <Pressable
                onPress={() => !showResult && setTextAnswer('O')}
                disabled={showResult}
                style={({ pressed }) => [
                  styles.oxButton,
                  textAnswer === 'O' && !showResult && { borderColor: subject.color, borderWidth: 3, backgroundColor: `${subject.color}10` },
                  showResult && textAnswer === 'O' && isCorrect && styles.optionButtonCorrect,
                  showResult && textAnswer === 'O' && !isCorrect && styles.optionButtonWrong,
                  showResult && correctAnswer === 'O' && textAnswer !== 'O' && styles.optionButtonCorrect,
                  !showResult && pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[
                  styles.oxText,
                  textAnswer === 'O' && !showResult && { color: subject.color, fontWeight: 'bold' },
                ]}>O</Text>
                {showResult && correctAnswer === 'O' && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" style={styles.oxIcon} />
                )}
                {showResult && textAnswer === 'O' && !isCorrect && (
                  <MaterialIcons name="cancel" size={24} color="#FF5252" style={styles.oxIcon} />
                )}
              </Pressable>
              <Pressable
                onPress={() => !showResult && setTextAnswer('X')}
                disabled={showResult}
                style={({ pressed }) => [
                  styles.oxButton,
                  textAnswer === 'X' && !showResult && { borderColor: subject.color, borderWidth: 3, backgroundColor: `${subject.color}10` },
                  showResult && textAnswer === 'X' && isCorrect && styles.optionButtonCorrect,
                  showResult && textAnswer === 'X' && !isCorrect && styles.optionButtonWrong,
                  showResult && correctAnswer === 'X' && textAnswer !== 'X' && styles.optionButtonCorrect,
                  !showResult && pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[
                  styles.oxText,
                  textAnswer === 'X' && !showResult && { color: subject.color, fontWeight: 'bold' },
                ]}>X</Text>
                {showResult && correctAnswer === 'X' && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" style={styles.oxIcon} />
                )}
                {showResult && textAnswer === 'X' && !isCorrect && (
                  <MaterialIcons name="cancel" size={24} color="#FF5252" style={styles.oxIcon} />
                )}
              </Pressable>
            </View>
          )}

          {/* 단답식 */}
          {currentProblem.type === '단답식' && (
            <View style={styles.shortAnswerContainer}>
              <TextInput
                style={[
                  styles.shortAnswerInput,
                  showResult && isCorrect && styles.shortAnswerCorrect,
                  showResult && !isCorrect && styles.shortAnswerWrong,
                ]}
                placeholder="답을 입력하세요"
                placeholderTextColor={colors.text.tertiary}
                value={textAnswer}
                onChangeText={setTextAnswer}
                multiline
                autoFocus
                editable={!showResult}
              />
              {showResult && !isCorrect && correctAnswer && (
                <View style={styles.correctAnswerBox}>
                  <Text style={styles.correctAnswerLabel}>정답:</Text>
                  <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Result Banner */}
        {showResult && (
          <View style={[
            styles.resultBanner,
            isCorrect ? styles.resultCorrect : styles.resultWrong
          ]}>
            <Text style={styles.resultEmoji}>
              {isCorrect ? '🎉' : '💡'}
            </Text>
            <Text style={styles.resultText}>
              {isCorrect ? '정답! 완벽하게 이해했어요' : '틀렸지만 괜찮아요! 복습으로 기억하세요'}
            </Text>
          </View>
        )}

      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        {!showResult ? (
          <Pressable
            onPress={handleSubmit}
            disabled={
              (currentProblem.type === '객관식' && selectedOption === null) ||
              ((currentProblem.type === 'OX' || currentProblem.type === '단답식') && !textAnswer.trim())
            }
            style={({ pressed }) => [
              styles.submitButton,
              ((currentProblem.type === '객관식' && selectedOption === null) ||
                ((currentProblem.type === 'OX' || currentProblem.type === '단답식') && !textAnswer.trim())) &&
                styles.submitButtonDisabled,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.submitButtonText}>확인</Text>
          </Pressable>
        ) : isCorrect ? (
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.submitButton,
              styles.continueButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.submitButtonText}>
              {currentProblemIndex === problems.length - 1 ? '완료' : '다음 문제'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleRetry}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialIcons name="refresh" size={20} color={colors.neutral.white} />
              <Text style={styles.submitButtonText}>다시 풀기</Text>
            </Pressable>
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.submitButton,
                styles.continueButton,
                { flex: 1 },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.submitButtonText}>
                {currentProblemIndex === problems.length - 1 ? '완료' : '다음 문제'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quitButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.neutral.gray50,
  },
  problemCounter: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  placeholder: {
    width: 36,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },
  questionSection: {
    marginBottom: 32,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  subjectIcon: {
    fontSize: 20,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  optionsSection: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.neutral.white,
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
  },
  optionButtonCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  optionButtonWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  resultCorrect: {
    backgroundColor: '#E8F5E9',
  },
  resultWrong: {
    backgroundColor: '#FFF3E0',
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray100,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
  },
  continueButton: {
    backgroundColor: colors.accent[500],
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral.gray200,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  oxContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  oxButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 150,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oxText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  shortAnswerContainer: {
    marginTop: 8,
  },
  shortAnswerInput: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  shortAnswerCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  shortAnswerWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
  },
  correctAnswerBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  correctAnswerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  oxIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray600,
  },
  // Skeleton UI styles
  skeletonQuitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonCounter: {
    width: 60,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonProgressBar: {
    height: '100%',
    width: '30%',
    borderRadius: 3,
    backgroundColor: colors.neutral.gray200,
  },
  skeletonBadge: {
    width: 100,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray200,
    marginBottom: 20,
  },
  skeletonQuestion: {
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.neutral.gray200,
    marginBottom: 4,
  },
  skeletonOption: {
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray100,
  },
  skeletonButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray200,
  },
});
