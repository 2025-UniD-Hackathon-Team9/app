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
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  subjectCard: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.neutral.white,
    minWidth: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
