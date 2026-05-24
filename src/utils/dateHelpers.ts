/**
 * Date helper utilities using date-fns.
 * Provides formatting, comparison, and manipulation functions
 * for rental date handling.
 */

import {
  format,
  addDays as dateFnsAddDays,
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';

/**
 * Formats a date using the given format string.
 * Defaults to 'dd MMMM yyyy' (e.g. "15 Januari 2024") using Indonesian locale.
 *
 * @param date - The date to format
 * @param formatStr - Optional date-fns format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatStr: string = 'dd MMMM yyyy'): string {
  return format(date, formatStr, { locale: localeId });
}

/**
 * Formats a date as 'dd/MM/yyyy' (e.g. "15/01/2024").
 *
 * @param date - The date to format
 * @returns Short formatted date string
 */
export function formatDateShort(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

/**
 * Formats a date range as "startDay - endDay MonthName Year"
 * when both dates share the same month and year, or as two full dates otherwise.
 * Example: "15 - 20 Januari 2024"
 *
 * @param startDate - Start of the rental period
 * @param endDate - End of the rental period
 * @returns Human-readable date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startDay = format(startDate, 'dd');
  const endFull = format(endDate, 'dd MMMM yyyy', { locale: localeId });

  // If same month and year, use compact format
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDay} - ${endFull}`;
  }

  // Different months: show full dates for both
  const startFull = format(startDate, 'dd MMMM yyyy', { locale: localeId });
  return `${startFull} - ${endFull}`;
}

/**
 * Returns true if the given date is strictly before today (ignoring time).
 *
 * @param date - The date to check
 * @returns true if date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = getTodayNormalized();
  return normalizeDate(date) < today;
}

/**
 * Returns true if endDate is strictly after startDate.
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns true if endDate > startDate
 */
export function isEndAfterStart(startDate: Date, endDate: Date): boolean {
  return endDate > startDate;
}

/**
 * Calculates the number of days between two dates.
 * Uses Math.ceil so partial days count as full days.
 * Returns a minimum of 1.
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days (minimum 1)
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const diff = differenceInCalendarDays(endDate, startDate);
  return Math.max(1, Math.ceil(diff));
}

/**
 * Returns a new Date with the specified number of days added.
 *
 * @param date - Base date
 * @param days - Number of days to add (can be negative)
 * @returns New Date object
 */
export function addDays(date: Date, days: number): Date {
  return dateFnsAddDays(date, days);
}

/**
 * Returns a new Date with the time component set to 00:00:00.000.
 *
 * @param date - The date to normalize
 * @returns New Date with zeroed time
 */
export function normalizeDate(date: Date): Date {
  return startOfDay(date);
}

/**
 * Returns today's date with the time component zeroed (00:00:00.000).
 *
 * @returns Today's date normalized to midnight
 */
export function getTodayNormalized(): Date {
  return startOfDay(new Date());
}
