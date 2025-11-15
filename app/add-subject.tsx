import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useState } from 'react';

const AVAILABLE_ICONS = ['📐', '⚛️', '🧪', '📚', '✏️', '🎨', '🎵', '⚽', '🌍', '💻', '📖', '🔬', '🏛️', '📊'];

const AVAILABLE_COLORS = [
  colors.primary[500],
  '#FF6B6B',
  '#4ECDC4',
  '#95E1D3',
  '#F38181',
  '#FF9F43',
  '#54A0FF',
  '#5F27CD',
  '#00D2D3',
  '#1DD1A1',
  '#EE5A6F',
  '#C44569',
];

export default function AddSubjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [subjectName, setSubjectName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  const handleSave = () => {
    // TODO: 과목 저장 로직
    console.log('Saving subject:', { name: subjectName, icon: selectedIcon, color: selectedColor });
    router.back();
  };

  const canSave = subjectName.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>과목 추가</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 과목 이름 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>과목 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 미적분학, 세계사 등"
            placeholderTextColor={colors.text.disabled}
            value={subjectName}
            onChangeText={setSubjectName}
            maxLength={20}
          />
        </View>

        {/* 아이콘 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>아이콘</Text>
          <View style={styles.iconGrid}>
            {AVAILABLE_ICONS.map((icon) => (
              <Pressable
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 색상 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>색상</Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <MaterialIcons name="check" size={24} color={colors.neutral.white} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* 미리보기 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>미리보기</Text>
          <View style={[styles.preview, { backgroundColor: selectedColor }]}>
            <Text style={styles.previewIcon}>{selectedIcon}</Text>
            <Text style={styles.previewName}>{subjectName || '과목 이름'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>추가하기</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.neutral.gray50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.neutral.white,
    padding: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  input: {
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.neutral.gray50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray100,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral.gray100,
  },
  iconOptionSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  iconText: {
    fontSize: 32,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.neutral.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  previewIcon: {
    fontSize: 28,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: -0.3,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray100,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.neutral.gray200,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
});
