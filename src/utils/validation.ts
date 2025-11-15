/**
 * 유효성 검사 유틸리티 함수
 */

/**
 * 이메일 형식을 검증합니다
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 형식을 검증합니다 (한국)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * 비밀번호 강도를 검증합니다
 * - 최소 8자 이상
 * - 영문, 숫자, 특수문자 포함
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasLetter && hasNumber && hasSpecial;
};

/**
 * URL 형식을 검증합니다
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 빈 문자열인지 확인합니다
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * 숫자만 포함되어 있는지 확인합니다
 */
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};
