import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
  const { id } = useLocalSearchParams<{ id: string }>();
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleQuit} style={styles.quitButton}>
          <MaterialIcons name="close" size={28} color={colors.text.primary} />
        </Pressable>

        <View style={styles.progressBarContainer}>
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
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={false}
      >
        {/* Subject Info */}
        <View style={styles.subjectInfo}>
          <View style={[styles.iconContainer, { backgroundColor: subject.color }]}>
            <Text style={styles.icon}>{subject.icon}</Text>
          </View>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <Text style={styles.problemCounter}>
            {currentProblemIndex + 1} / {SAMPLE_PROBLEMS.length}
          </Text>
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
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
                  isSelected && styles.optionButtonSelected,
                  showCorrect && styles.optionButtonCorrect,
                  showWrong && styles.optionButtonWrong,
                  !showResult && pressed && styles.optionButtonPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionNumberCircle,
                    isSelected && styles.optionNumberCircleSelected,
                    showCorrect && styles.optionNumberCircleCorrect,
                    showWrong && styles.optionNumberCircleWrong,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionNumber,
                      (isSelected || showCorrect || showWrong) && styles.optionNumberSelected,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    (showCorrect || showWrong) && styles.optionTextResult,
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

        {/* Result Message */}
        {showResult && (
          <View style={[styles.resultMessage, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '😢'}</Text>
            <Text style={styles.resultText}>{isCorrect ? '좋아요!' : '오답입니다'}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        {!showResult ? (
          <Pressable
            onPress={handleSubmit}
            disabled={selectedOption === null}
            style={({ pressed }) => [
              styles.submitButton,
              selectedOption === null && styles.submitButtonDisabled,
              pressed && selectedOption !== null && styles.submitButtonPressed,
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
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {currentProblemIndex === SAMPLE_PROBLEMS.length - 1 ? '완료' : '계속하기'}
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
    backgroundColor: colors.neutral.white,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  quitButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    overflow: 'hidden',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  subjectInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  problemCounter: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  questionSection: {
    marginBottom: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    lineHeight: 36,
    textAlign: 'center',
  },
  optionsSection: {
    gap: 12,
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  optionButtonPressed: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[300],
  },
  optionButtonSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  optionButtonCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  optionButtonWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
  },
  optionNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionNumberCircleSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  optionNumberCircleCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionNumberCircleWrong: {
    backgroundColor: '#FF5252',
    borderColor: '#FF5252',
  },
  optionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  optionNumberSelected: {
    color: colors.neutral.white,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  optionTextResult: {
    fontWeight: '600',
  },
  resultMessage: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultCorrect: {
    backgroundColor: '#E8F5E9',
  },
  resultWrong: {
    backgroundColor: '#FFEBEE',
  },
  resultEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
  },
  submitButtonDisabled: {
    backgroundColor: colors.border.light,
    opacity: 0.6,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  continueButton: {
    backgroundColor: colors.accent[500],
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
});
