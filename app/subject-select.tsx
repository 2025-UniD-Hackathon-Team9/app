import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { SUBJECT_THEME_PALETTE } from '@/src/constants';
import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { getCourses } from '@/src/api/courses';
import { processDocument } from '@/src/api/documents';
import type { Subject } from '@/src/types';

export default function SubjectSelectScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;

    setIsLoadingSubjects(true);
    try {
      const courses = await getCourses(user.user_id);

      const convertedSubjects: Subject[] = courses.map((course, index) => ({
        id: course.id.toString(),
        name: course.title,
        icon: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.icon || '📚',
        color: SUBJECT_THEME_PALETTE[index % SUBJECT_THEME_PALETTE.length]?.color || '#7C3AED',
      }));

      setSubjects(convertedSubjects);
    } catch (error) {
      console.error('Failed to load courses:', error);
      Alert.alert('오류', '과목을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedSubject || !user || !photoUri) {
      Alert.alert('과목 선택', '과목을 선택해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 URI를 Blob으로 변환
      const response = await fetch(photoUri);
      const blob = await response.blob();

      // 백엔드로 전송
      const result = await processDocument(
        blob,
        user.user_id,
        parseInt(selectedSubject)
      );

      Alert.alert(
        '업로드 완료',
        `문제가 생성되었습니다.\n문제 수: ${result.questionCount}개`,
        [
          {
            text: '확인',
            onPress: () => {
              router.back(); // subject-select 모달 닫기
              router.back(); // camera 모달 닫기
              // 문제 페이지로 이동
              router.push(`/subject/${selectedSubject}/problem?sessionId=${result.sessionId}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('오류', '업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>과목 선택</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 촬영한 사진 미리보기 */}
        {photoUri && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>촬영한 이미지</Text>
            <View style={styles.imageContainer}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            </View>
          </View>
        )}

        {/* 과목 선택 */}
        <View style={styles.subjectSection}>
          <Text style={styles.sectionTitle}>어떤 과목인가요?</Text>
          <Text style={styles.sectionSubtitle}>촬영한 내용에 해당하는 과목을 선택하세요</Text>

          {isLoadingSubjects ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>과목 불러오는 중...</Text>
            </View>
          ) : subjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>등록된 과목이 없습니다.</Text>
              <Text style={styles.emptySubtext}>홈 화면에서 과목을 추가해주세요.</Text>
            </View>
          ) : (
            <View style={styles.subjectGrid}>
              {subjects.map((subject) => {
                const isSelected = selectedSubject === subject.id;
                return (
                  <Pressable
                    key={subject.id}
                    style={[
                      styles.subjectCard,
                      isSelected && {
                        borderColor: subject.color,
                        borderWidth: 3,
                        backgroundColor: `${subject.color}10`,
                      },
                    ]}
                    onPress={() => setSelectedSubject(subject.id)}
                  >
                    <View style={[styles.subjectIconContainer, { backgroundColor: subject.color }]}>
                      <Text style={styles.subjectIcon}>{subject.icon}</Text>
                    </View>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    {isSelected && (
                      <View style={[styles.checkMark, { backgroundColor: subject.color }]}>
                        <MaterialIcons name="check" size={16} color={colors.neutral.white} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.uploadButton,
            (!selectedSubject || isUploading) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!selectedSubject || isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? '업로드 중...' : '업로드'}
          </Text>
        </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  previewSection: {
    padding: 20,
    backgroundColor: colors.neutral.white,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.neutral.gray100,
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  subjectSection: {
    padding: 20,
    backgroundColor: colors.neutral.white,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '47%',
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray100,
    position: 'relative',
  },
  subjectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIcon: {
    fontSize: 32,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray100,
  },
  uploadButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonDisabled: {
    backgroundColor: colors.neutral.gray300,
    shadowOpacity: 0,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
