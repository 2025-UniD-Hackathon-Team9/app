/**
 * 입력 검증 유틸리티
 */

/**
 * 검증 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 이메일 주소 검증
 * @param email - 검증할 이메일 주소
 * @returns 검증 결과
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: '이메일을 입력해주세요.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' };
  }

  return { isValid: true };
}

/**
 * 비밀번호 검증
 * @param password - 검증할 비밀번호
 * @param minLength - 최소 길이 (기본값: 4)
 * @returns 검증 결과
 */
export function validatePassword(password: string, minLength: number = 4): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, error: '비밀번호를 입력해주세요.' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `비밀번호는 최소 ${minLength}자 이상이어야 합니다.` };
  }

  return { isValid: true };
}

/**
 * 텍스트 필드 검증
 * @param value - 검증할 값
 * @param fieldName - 필드 이름
 * @param minLength - 최소 길이 (기본값: 1)
 * @param maxLength - 최대 길이 (선택)
 * @returns 검증 결과
 */
export function validateTextField(
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength?: number
): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName}을(를) 입력해주세요.` };
  }

  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다.` };
  }

  if (maxLength && value.length > maxLength) {
    return { isValid: false, error: `${fieldName}은(는) 최대 ${maxLength}자까지 입력 가능합니다.` };
  }

  return { isValid: true };
}

/**
 * 숫자 범위 검증
 * @param value - 검증할 숫자
 * @param min - 최소값 (선택)
 * @param max - 최대값 (선택)
 * @returns 검증 결과
 */
export function validateNumberRange(
  value: number,
  min?: number,
  max?: number
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: '유효한 숫자를 입력해주세요.' };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `${min} 이상의 값을 입력해주세요.` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `${max} 이하의 값을 입력해주세요.` };
  }

  return { isValid: true };
}

/**
 * URL 검증
 * @param url - 검증할 URL
 * @returns 검증 결과
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim().length === 0) {
    return { isValid: false, error: 'URL을 입력해주세요.' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: '올바른 URL 형식이 아닙니다.' };
  }
}

/**
 * 여러 검증 결과를 합칩니다
 * @param results - 검증 결과 배열
 * @returns 합쳐진 검증 결과
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const firstError = results.find(result => !result.isValid);
  
  if (firstError) {
    return firstError;
  }

  return { isValid: true };
}
