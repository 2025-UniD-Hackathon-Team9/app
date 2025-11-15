import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

/**
 * Props for the FloatingActionButton component
 */
interface FloatingActionButtonProps {
  /** Callback function when button is pressed */
  onPress: () => void;
}

/**
 * Floating action button component positioned at bottom-right of screen
 * Typically used for primary actions like adding new content
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
