import { View, Text, StyleSheet, ScrollView, Pressable, Animated, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useState } from 'react';

const SAMPLE_PROBLEMS = [
  {
    id: 1,
    question: '다음 중 가장 옳은 것은?',
    options: ['보기 1', '보기 2', '보기 3', '보기 4'],
    correct: 0,
  },
  {
    id: 2,
    question: '다음을 계산하시오',
    options: ['답 1', '답 2', '답 3', '답 4'],
    correct: 1,
  },
  {
    id: 3,
    question: '올바른 발음은?',
    options: ['선택지 1', '선택지 2', '선택지 3', '선택지 4'],
    correct: 2,
  },
];

const SUBJECT_INFO: { [key: string]: { name: string; icon: string; color: string } } = {
  math: { name: '수학', icon: '📐', color: colors.primary[500] },
  physics: { name: '물리', icon: '⚛️', color: '#FF6B6B' },
  chemistry: { name: '화학', icon: '🧪', color: '#4ECDC4' },
  english: { name: '영어', icon: '📚', color: '#95E1D3' },
  korean: { name: '국어', icon: '✏️', color: '#F38181' },
};

export default function ProblemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id:string }>();

  if (!id) {
    return null;
  }

  const subject = SUBJECT_INFO[id] || { name: '과목', icon: '📖', color: colors.primary[500] };

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentProblem = SAMPLE_PROBLEMS[currentProblemIndex];
  const progress = (currentProblemIndex + 1) / SAMPLE_PROBLEMS.length;

  const handleSelectOption = (index: number) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === currentProblem.correct;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentProblemIndex < SAMPLE_PROBLEMS.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      router.back();
    }
  };

  const handleQuit = () => {
    router.back();
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
            {currentProblemIndex + 1} / {SAMPLE_PROBLEMS.length}
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
          <Text style={styles.question}>{currentProblem.question}</Text>
        </View>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectAnswer = index === currentProblem.correct;
            const showCorrect = showResult && isCorrectAnswer;
            const showWrong = showResult && isSelected && !isCorrectAnswer;

            return (
              <Pressable
                key={index}
                onPress={() => handleSelectOption(index)}
                disabled={showResult}
                style={({ pressed }) => [
                  styles.optionButton,
                  isSelected && !showResult && { borderColor: subject.color },
                  showCorrect && styles.optionButtonCorrect,
                  showWrong && styles.optionButtonWrong,
                  !showResult && pressed && { opacity: 0.7 },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && !showResult && { color: subject.color },
                    showCorrect && { color: '#4CAF50' },
                    showWrong && { color: '#FF5252' },
                  ]}
                >
                  {option}
                </Text>
                {showCorrect && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                )}
                {showWrong && (
                  <MaterialIcons name="cancel" size={24} color="#FF5252" />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Result Feedback */}
        {showResult && (
          <View style={[styles.resultBanner, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '💡'}</Text>
            <Text style={styles.resultText}>
              {isCorrect ? '정답입니다!' : '틀렸습니다. 다시 확인해보세요.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        {!showResult ? (
          <Pressable
            onPress={handleSubmit}
            disabled={selectedOption === null}
            style={({ pressed }) => [
              styles.submitButton,
              selectedOption === null && styles.submitButtonDisabled,
              pressed && selectedOption !== null && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.submitButtonText}>확인</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.submitButton,
              styles.continueButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.submitButtonText}>
              {currentProblemIndex === SAMPLE_PROBLEMS.length - 1 ? '완료' : '다음'}
            </Text>
          </Pressable>
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
});
