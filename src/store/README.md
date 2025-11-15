# Store 디렉토리

전역 상태 관리를 위한 디렉토리입니다.

## 상태 관리 옵션

1. **Context API** - 간단한 상태 관리
2. **Zustand** - 가볍고 사용하기 쉬운 라이브러리 (추천)
3. **Redux Toolkit** - 복잡한 상태 관리

## Zustand 예시

```typescript
// useUserStore.ts
import { create } from 'zustand';
import type { User } from '../types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 사용
import { useUserStore } from '@/store/useUserStore';

const MyComponent = () => {
  const { user, setUser } = useUserStore();
  // ...
};
```

## Context API 예시

```typescript
// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```
