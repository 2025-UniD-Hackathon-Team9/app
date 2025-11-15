import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SubjectSelectorProps {
  subjects: Subject[];
}

export default function SubjectSelector({
  subjects,
}: SubjectSelectorProps) {
  const router = useRouter();

  const handleSubjectPress = (subjectId: string) => {
    router.push(`/subject/${subjectId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>과목을 선택하세요</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {subjects.map((subject) => {
          return (
            <Pressable
              key={subject.id}
              style={({ pressed }) => [
                styles.subjectCard,
                pressed && styles.subjectCardPressed,
              ]}
              onPress={() => handleSubjectPress(subject.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: subject.color }
                ]}
              >
                <Text style={styles.icon}>{subject.icon}</Text>
              </View>
              <Text style={styles.subjectName}>
                {subject.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
  },
  subjectCard: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.neutral.white,
    minWidth: 110,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
});
