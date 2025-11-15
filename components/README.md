# Components 디렉토리

재사용 가능한 UI 컴포넌트를 관리하는 디렉토리입니다.

## 현재 구조

```
components/
├── home/              # 홈 화면 관련 컴포넌트
│   ├── TodaySessionCard.tsx    # 오늘의 학습 세션 카드
│   ├── SubjectSelector.tsx     # 과목 선택기
│   └── StudyCalendar.tsx       # 학습 활동 달력
└── layout/            # 레이아웃 컴포넌트
    └── FloatingActionButton.tsx # 플로팅 액션 버튼
```

## 향후 구조 (권장)

```
components/
├── common/          # 공통 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── ui/              # UI 요소
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   └── Icon.tsx
└── layout/          # 레이아웃 컴포넌트
    ├── Header.tsx
    ├── Footer.tsx
    └── Container.tsx
```

## 원칙

- **재사용 가능**: 여러 곳에서 사용될 수 있는 컴포넌트만 포함
- **Props로 커스터마이징**: 유연한 사용을 위한 Props 인터페이스 정의
- **타입 안전**: TypeScript 인터페이스로 Props 타입 정의
- **문서화**: JSDoc 주석으로 컴포넌트 설명 추가
- **중앙화된 데이터**: `/src/types`, `/src/constants`에서 타입과 상수 가져오기
- **유틸리티 사용**: `/src/utils`의 함수 활용하여 로직 중복 방지

## 모범 사례 예시

```typescript
// components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { BORDER_RADIUS, SPACING } from '@/src/constants';

/**
 * Props for the Button component
 */
interface ButtonProps {
  /** Button text */
  title: string;
  /** Callback when button is pressed */
  onPress: () => void;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary';
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Reusable button component with variants
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.secondary[500],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
});
```

