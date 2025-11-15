# Utils 디렉토리

유틸리티 함수 및 헬퍼 함수를 모아두는 디렉토리입니다.

## 원칙

- 순수 함수로 작성
- 재사용 가능한 로직
- 테스트 가능하도록 작성

## 구조

```
utils/
├── date.ts           # 날짜 관련 유틸
├── string.ts         # 문자열 처리
├── validation.ts     # 유효성 검사
├── format.ts         # 포맷팅 함수
└── storage.ts        # 로컬 스토리지 유틸
```

## 사용 예시

```typescript
// date.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// validation.ts
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  get: async <T>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
};
```
