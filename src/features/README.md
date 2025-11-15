# Features 디렉토리

기능별로 코드를 구성하는 디렉토리입니다.

## 구조

각 기능은 독립적인 모듈로 구성됩니다:

```
features/
└── auth/
    ├── components/      # 인증 관련 컴포넌트
    │   ├── LoginForm.tsx
    │   └── SignupForm.tsx
    ├── hooks/           # 인증 관련 훅
    │   └── useAuth.ts
    ├── types/           # 인증 관련 타입
    │   └── index.ts
    ├── api/             # 인증 API
    │   └── auth.api.ts
    └── index.ts         # export 파일
```

## 예시

```typescript
// features/auth/components/LoginForm.tsx
import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const { login, loading } = useAuth();

  return (
    <View>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={login} disabled={loading} />
    </View>
  );
};

// features/auth/hooks/useAuth.ts
import { useState } from 'react';
import { authApi } from '../api/auth.api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authApi.login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

// features/auth/index.ts
export * from './components/LoginForm';
export * from './hooks/useAuth';
```

## 기능 예시

- `auth/` - 인증 및 권한
- `profile/` - 사용자 프로필
- `posts/` - 게시글 관리
- `chat/` - 채팅 기능
