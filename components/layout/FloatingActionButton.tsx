import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

/**
 * FloatingActionButton 컴포넌트의 Props
 */
interface FloatingActionButtonProps {
  /** 버튼 클릭 시 호출되는 콜백 함수 */
  onPress: () => void;
}

/**
 * 화면 오른쪽 하단에 위치한 플로팅 액션 버튼 컴포넌트
 * 일반적으로 새 콘텐츠 추가와 같은 주요 동작에 사용됩니다
 */
export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        pressed && styles.fabPressed
      ]}
    >
      <MaterialIcons name="add" size={34} color={colors.neutral.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  fabPressed: {
    backgroundColor: colors.primary[600],
    transform: [{ scale: 0.95 }],
  },
});
