# Hooks 디렉토리

재사용 가능한 커스텀 React 훅을 모아두는 디렉토리입니다.

## 명명 규칙

- 모든 훅은 `use`로 시작합니다
- 파일명: `use[HookName].ts`
- 예: `useAuth.ts`, `useFetch.ts`

## 사용 예시

```typescript
// useAuth.ts
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 인증 로직
  }, []);

  return { user, loading };
};

// useFetch.ts
export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // fetch 로직...

  return { data, loading, error };
};
```
