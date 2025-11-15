# API 디렉토리

API 호출 및 네트워크 통신을 관리하는 디렉토리입니다.

## 구조

```
api/
├── client.ts          # API 클라이언트 설정 (axios, fetch)
├── endpoints.ts       # API 엔드포인트 상수
└── [feature]/         # 기능별 API 함수
    ├── user.api.ts
    ├── post.api.ts
    └── ...
```

## 사용 예시

```typescript
// client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// user.api.ts
import { apiClient } from './client';

export const userApi = {
  getProfile: (userId: string) =>
    apiClient.get(`/users/${userId}`),

  updateProfile: (userId: string, data: UserData) =>
    apiClient.put(`/users/${userId}`, data),
};
```
