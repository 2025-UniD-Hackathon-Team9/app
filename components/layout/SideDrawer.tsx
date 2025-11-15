import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

const DRAWER_WIDTH = 280;
const SCREEN_WIDTH = Dimensions.get('window').width;

const SUBJECTS = [
  { id: 'math', name: '수학', icon: '📐' },
  { id: 'physics', name: '물리', icon: '⚛️' },
  { id: 'chemistry', name: '화학', icon: '🧪' },
  { id: 'english', name: '영어', icon: '📚' },
  { id: 'korean', name: '국어', icon: '✏️' },
];

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>과목 선택</Text>
        </View>

        <View style={styles.menuItems}>
          {SUBJECTS.map((subject) => (
            <Pressable
              key={subject.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                router.push(`/subject/${subject.id}`);
                onClose();
              }}
            >
              <Text style={styles.menuItemIcon}>{subject.icon}</Text>
              <Text style={styles.menuItemText}>{subject.name}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.neutral.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.primary[500],
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: 12,
  },
  menuItemPressed: {
    backgroundColor: colors.neutral.gray50,
  },
  menuItemIcon: {
    fontSize: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
