# Components 디렉토리

재사용 가능한 UI 컴포넌트를 관리하는 디렉토리입니다.

## 구조

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

- 재사용 가능한 컴포넌트만 포함
- Props를 통한 커스터마이징 지원
- TypeScript로 타입 정의
- 스토리북이나 문서화 고려

## 예시

```typescript
// components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
```
