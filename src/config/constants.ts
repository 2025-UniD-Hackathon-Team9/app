/**
 * 앱 전역 상수
 */

export const APP_CONFIG = {
  APP_NAME: 'MyApp',
  VERSION: '1.0.0',

  // 페이지네이션
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  // 스토리지 키
  STORAGE_KEYS: {
    TOKEN: '@app:token',
    USER: '@app:user',
    THEME: '@app:theme',
    LANGUAGE: '@app:language',
  },

  // API 타임아웃
  API_TIMEOUT: 10000,

  // 이미지
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

/**
 * 환경 변수
 */
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  ENV: process.env.EXPO_PUBLIC_ENV || 'development',
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
} as const;
