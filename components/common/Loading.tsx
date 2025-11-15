/**
 * 로딩 컴포넌트
 * 일관된 로딩 UI를 제공합니다
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface LoadingProps {
  /** 로딩 메시지 */
  message?: string;
  /** 로딩 인디케이터 크기 */
  size?: 'small' | 'large';
  /** 컨테이너 스타일 */
  style?: ViewStyle;
  /** 전체 화면 로딩 여부 */
  fullscreen?: boolean;
}

/**
 * 로딩 인디케이터 컴포넌트
 * 
 * @example
 * ```tsx
 * <Loading message="데이터를 불러오는 중..." />
 * <Loading fullscreen />
 * ```
 */
export function Loading({ 
  message, 
  size = 'large', 
  style,
  fullscreen = false 
}: LoadingProps) {
  const containerStyle = fullscreen 
    ? [styles.container, styles.fullscreen, style] 
    : [styles.container, style];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={colors.primary[500]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

/**
 * 인라인 로딩 컴포넌트 (작은 크기)
 */
export function InlineLoading({ message, style }: Omit<LoadingProps, 'size' | 'fullscreen'>) {
  return (
    <View style={[styles.inlineContainer, style]}>
      <ActivityIndicator size="small" color={colors.primary[500]} />
      {message && <Text style={styles.inlineMessage}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  inlineMessage: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
});
