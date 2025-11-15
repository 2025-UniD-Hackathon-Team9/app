# Types 디렉토리

TypeScript 타입 정의를 관리하는 디렉토리입니다.

## 구조

```
types/
├── index.ts          # 모든 타입을 export
├── common.ts         # 공통 타입
├── api.ts            # API 관련 타입
├── navigation.ts     # 네비게이션 타입
└── [feature].ts      # 기능별 타입
```

## 사용 예시

```typescript
// common.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// api.ts
export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// navigation.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
```
