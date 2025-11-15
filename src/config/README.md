# Config 디렉토리

애플리케이션 설정 및 환경 변수를 관리하는 디렉토리입니다.

## 사용 예시

```typescript
// env.ts
export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  API_TIMEOUT: 10000,
  ENV: process.env.EXPO_PUBLIC_ENV || 'development',
} as const;

// constants.ts
export const APP_CONFIG = {
  APP_NAME: 'MyApp',
  VERSION: '1.0.0',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  STORAGE_KEYS: {
    TOKEN: '@app:token',
    USER: '@app:user',
    THEME: '@app:theme',
  },
} as const;

// theme.ts
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#FFFFFF',
    text: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
} as const;
```

## 환경 변수 설정

`.env` 파일 생성:
```
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_ENV=production
```
