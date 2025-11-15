/**
 * 애플리케이션 설정
 * 환경 변수를 중앙에서 관리하고 타입 안전성을 제공합니다
 */

/**
 * 환경 타입
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * 애플리케이션 설정 인터페이스
 */
interface AppConfig {
  /** API 서버 URL */
  apiUrl: string;
  /** 현재 환경 */
  environment: Environment;
  /** 개발 환경 자동 로그인 활성화 여부 */
  autoLoginEnabled: boolean;
  /** 자동 로그인 이메일 */
  autoLoginEmail?: string;
  /** 자동 로그인 비밀번호 */
  autoLoginPassword?: string;
  /** 디버그 로깅 활성화 여부 */
  debugLoggingEnabled: boolean;
}

/**
 * 환경 변수에서 안전하게 값을 가져오는 헬퍼 함수
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 애플리케이션 설정 객체
 */
export const config: AppConfig = {
  apiUrl: getEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:8080'),
  environment: (getEnvVar('EXPO_PUBLIC_ENV', 'development') as Environment),
  autoLoginEnabled: getEnvVar('EXPO_PUBLIC_AUTO_LOGIN_ENABLED', 'false') === 'true',
  autoLoginEmail: getEnvVar('EXPO_PUBLIC_AUTO_LOGIN_EMAIL'),
  autoLoginPassword: getEnvVar('EXPO_PUBLIC_AUTO_LOGIN_PASSWORD'),
  debugLoggingEnabled: getEnvVar('EXPO_PUBLIC_ENV', 'development') === 'development',
};

/**
 * 개발 환경 여부 확인
 */
export const isDevelopment = (): boolean => config.environment === 'development';

/**
 * 프로덕션 환경 여부 확인
 */
export const isProduction = (): boolean => config.environment === 'production';

/**
 * 디버그 로그 출력 (개발 환경에서만)
 */
export const debugLog = (...args: any[]): void => {
  if (config.debugLoggingEnabled) {
    console.log('[DEBUG]', ...args);
  }
};
