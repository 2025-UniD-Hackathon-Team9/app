/**
 * Date utility functions
 */

import { DAYS_OF_WEEK } from '@/src/constants';

/**
 * Formats a date string to YYYY-MM-DD format
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets the day of week name in Korean for a given date
 * @param date - Date string in YYYY-MM-DD format or Date object
 * @returns Korean day of week (e.g., '월', '화')
 */
export function getDayOfWeek(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return DAYS_OF_WEEK[dateObj.getDay()];
}

/**
 * Gets the number of days in a month
 * @param date - Date object representing the month
 * @returns Object containing days in month and starting day of week
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
 * Checks if a date is today
 * @param day - Day of month
 * @param month - Month (0-11)
 * @param year - Year
 * @returns True if the date is today
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
 * Formats a month name in Korean
 * @param date - Date object
 * @returns Formatted month name (e.g., '2025년 11월')
 */
export function formatMonthName(date: Date): string {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
}
