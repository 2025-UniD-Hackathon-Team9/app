/**
 * 날짜 유틸리티 함수
 */

import { DAYS_OF_WEEK } from '@/src/constants';

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 포맷합니다
 * @param date - 포맷할 Date 객체
 * @returns 포맷된 날짜 문자열
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 주어진 날짜의 한글 요일 이름을 가져옵니다
 * @param date - YYYY-MM-DD 형식의 날짜 문자열 또는 Date 객체
 * @returns 한글 요일 (예: '월', '화')
 */
export function getDayOfWeek(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return DAYS_OF_WEEK[dateObj.getDay()];
}

/**
 * 월의 일수를 가져옵니다
 * @param date - 월을 나타내는 Date 객체
 * @returns 월의 일수와 시작 요일을 포함한 객체
 */
export function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  return { daysInMonth, startingDayOfWeek };
}

/**
 * 날짜가 오늘인지 확인합니다
 * @param day - 월의 일
 * @param month - 월 (0-11)
 * @param year - 연도
 * @returns 해당 날짜가 오늘이면 true
 */
export function isToday(day: number, month: number, year: number): boolean {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
}

/**
 * 한글로 월 이름을 포맷합니다
 * @param date - Date 객체
 * @returns 포맷된 월 이름 (예: '2025년 11월')
 */
export function formatMonthName(date: Date): string {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
}
