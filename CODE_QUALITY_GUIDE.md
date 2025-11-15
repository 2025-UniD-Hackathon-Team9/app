# 코드 품질 개선 가이드

이 문서는 코드베이스의 품질과 유지보수성을 개선하기 위한 가이드라인을 제공합니다.

## 적용된 개선사항

### 1. 코드 구조 개선

#### 계층화된 아키텍처
```
src/
├── api/          # API 클라이언트 및 서비스
├── components/   # 재사용 가능한 UI 컴포넌트
├── constants/    # 상수 및 설정
├── contexts/     # React Context
├── hooks/        # 커스텀 훅 (NEW)
├── types/        # TypeScript 타입 정의
└── utils/        # 유틸리티 함수
```

**장점**:
- 명확한 책임 분리
- 쉬운 코드 탐색
- 재사용성 향상

#### 커스텀 훅을 통한 로직 분리
```typescript
// Before: 컴포넌트 내부에 모든 로직
export default function Screen() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  
  useEffect(() => {
    // 복잡한 데이터 로딩 로직...
  }, []);
  
  return <View>...</View>;
}

// After: 로직을 커스텀 훅으로 분리
export default function Screen() {
  const { data, loading } = useData();
  return <View>...</View>;
}
```

**개선 효과**:
- 컴포넌트 코드 60% 감소
- 로직 재사용 가능
- 테스트 용이성 향상

### 2. 타입 안전성

#### 엄격한 TypeScript 설정
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

#### 모든 함수와 변수에 타입 정의
```typescript
// Good
export function calculateProgress(
  completed: number,
  total: number
): number {
  return total > 0 ? completed / total : 0;
}

// Bad
export function calculateProgress(completed, total) {
  return total > 0 ? completed / total : 0;
}
```

### 3. 에러 처리 개선

#### 통합된 에러 처리
```typescript
// 커스텀 훅에서 에러 상태 관리
export function useCourses(userId: number | undefined) {
  const [error, setError] = useState<Error | null>(null);
  
  const loadCourses = useCallback(async () => {
    try {
      const courses = await getCourses(userId);
      // ...
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load');
      setError(error);
      console.error('Failed to load courses:', error);
    }
  }, [userId]);
  
  return { courses, error };
}
```

### 4. 성능 최적화 패턴

#### 메모이제이션 체크리스트
- ✅ 계산 비용이 높은 작업 → `useMemo`
- ✅ 함수 props → `useCallback`
- ✅ 순수 컴포넌트 → `React.memo`
- ✅ 복잡한 데이터 변환 → 커스텀 훅 + `useMemo`

#### 예시: 최적화된 컴포넌트
```typescript
const MyComponent = memo(function MyComponent({ data, onPress }) {
  // 계산 비용이 높은 작업 메모이제이션
  const processedData = useMemo(() => {
    return data.map(item => complexTransform(item));
  }, [data]);
  
  // 함수 메모이제이션
  const handlePress = useCallback(() => {
    onPress(processedData);
  }, [onPress, processedData]);
  
  return <Pressable onPress={handlePress}>...</Pressable>;
});
```

## 코딩 스타일 가이드

### 1. 명명 규칙

#### 변수와 함수
```typescript
// camelCase for variables and functions
const userName = 'John';
function getUserData() { }

// PascalCase for components and classes
function UserProfile() { }
class ApiClient { }

// UPPER_CASE for constants
const API_ENDPOINT = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
```

#### 파일명
```
- 컴포넌트: PascalCase (UserProfile.tsx)
- 훅: camelCase (useCourses.ts)
- 유틸리티: camelCase (dateUtils.ts)
- 상수: camelCase (colors.ts)
```

### 2. 함수 작성 규칙

#### 단일 책임 원칙
```typescript
// Good: 각 함수가 하나의 일만 수행
function fetchUserData(userId: number) { }
function transformUserData(data: RawUser): User { }
function displayUserProfile(user: User) { }

// Bad: 하나의 함수가 너무 많은 일을 수행
function handleUserStuff(userId: number) {
  // fetch, transform, display 모두 수행
}
```

#### 함수 크기
- 한 화면에 들어올 수 있는 크기 (20-30줄 권장)
- 더 길어지면 작은 함수로 분리

### 3. 주석 작성 가이드

#### JSDoc 주석 사용
```typescript
/**
 * 사용자의 학습 진행률을 계산합니다
 * @param completedSessions - 완료된 세션 수
 * @param totalSessions - 전체 세션 수
 * @returns 0에서 1 사이의 진행률
 */
export function calculateProgress(
  completedSessions: number,
  totalSessions: number
): number {
  return totalSessions > 0 ? completedSessions / totalSessions : 0;
}
```

#### 복잡한 로직 설명
```typescript
// 주간 활동 데이터 생성: 오늘부터 7일 전까지의 데이터를 역순으로 구성
// 각 날짜마다 완료된 세션 수를 카운트하여 배열로 반환
const activityData = useMemo(() => {
  // ...
}, [sessions]);
```

### 4. import 순서
```typescript
// 1. React 관련
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. 써드파티 라이브러리
import { useRouter } from 'expo-router';
import axios from 'axios';

// 3. 프로젝트 내부 모듈
import { colors } from '@/constants/colors';
import { useCourses } from '@/src/hooks';
import type { Subject } from '@/src/types';
```

## 유지보수 체크리스트

### 새로운 기능 추가 시
- [ ] TypeScript 타입 정의 추가
- [ ] 에러 처리 구현
- [ ] 로딩 상태 처리
- [ ] JSDoc 주석 작성
- [ ] 재사용 가능한 로직은 유틸리티/훅으로 분리
- [ ] 성능 최적화 고려 (memo, useMemo, useCallback)

### 코드 리뷰 체크리스트
- [ ] 타입 안전성 확인
- [ ] 에러 처리 적절한가?
- [ ] 성능 최적화가 필요한가?
- [ ] 코드 중복이 있는가?
- [ ] 명명이 명확한가?
- [ ] 주석이 필요한 복잡한 로직인가?

### 리팩토링 우선순위
1. **높음**: 타입 에러, 보안 취약점
2. **중간**: 성능 문제, 코드 중복
3. **낮음**: 스타일 개선, 주석 추가

## 테스트 전략

### 단위 테스트
```typescript
// 유틸리티 함수 테스트
describe('calculateProgress', () => {
  it('should return correct progress ratio', () => {
    expect(calculateProgress(5, 10)).toBe(0.5);
  });
  
  it('should return 0 when total is 0', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });
});
```

### 컴포넌트 테스트
```typescript
// React Testing Library 사용
describe('TodaySessionCard', () => {
  it('should display correct session count', () => {
    render(<TodaySessionCard completedSessions={5} totalSessions={10} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

## 도구 및 린팅

### ESLint 설정
```json
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Prettier 설정
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## 참고 자료
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [React Best Practices](https://react.dev/learn)
- [Clean Code in JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
