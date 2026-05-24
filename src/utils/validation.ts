/**
 * Validation utilities for form inputs and data integrity.
 * Provides email, phone, date range, and booking form validation,
 * plus XSS sanitization.
 */

import type { BookingRequest } from '../types/booking';
import type { FormValidationResult, ValidationError } from '../types/booking';

/**
 * Validates an email address format.
 * @param email - The email string to validate
 * @returns true if the email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates an Indonesian phone number.
 * Accepts formats: 08xx... or +628xx... (10–13 digits total).
 * @param phone - The phone string to validate
 * @returns true if the phone format is valid
 */
export function validateIndonesianPhone(phone: string): boolean {
  // Strip spaces and dashes before testing
  const cleaned = phone.replace(/[-\s]/g, '');
  // Must start with 0, 62, or +62, followed by 8, then 8–11 more digits
  const phoneRegex = /^(\+62|62|0)[8][0-9]{8,11}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates a rental date range.
 * - startDate must not be in the past (compared to today at midnight)
 * - endDate must be strictly after startDate
 * @param startDate - Rental start date
 * @param endDate - Rental end date
 * @returns FormValidationResult with any errors found
 */
export function validateDateRange(startDate: Date, endDate: Date): FormValidationResult {
  const errors: ValidationError[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    errors.push({
      field: 'startDate',
      message: 'Tanggal mulai tidak boleh di masa lalu',
    });
  }

  if (endDate <= startDate) {
    errors.push({
      field: 'endDate',
      message: 'Tanggal selesai harus setelah tanggal mulai',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all fields of a booking form submission.
 * @param data - Partial booking request data to validate
 * @returns FormValidationResult with all validation errors
 */
export function validateBookingForm(data: Partial<BookingRequest>): FormValidationResult {
  const errors: ValidationError[] = [];

  if (!data.customerName || data.customerName.trim().length === 0) {
    errors.push({ field: 'customerName', message: 'Nama harus diisi' });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Email tidak valid' });
  }

  if (!data.phone || !validateIndonesianPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Nomor telepon tidak valid' });
  }

  if (!data.vehicleId) {
    errors.push({ field: 'vehicleId', message: 'Pilih kendaraan' });
  }

  if (!data.startDate || !data.endDate) {
    errors.push({ field: 'dates', message: 'Tanggal rental harus diisi' });
  } else {
    const dateValidation = validateDateRange(data.startDate, data.endDate);
    errors.push(...dateValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes a string by escaping HTML special characters to prevent XSS.
 * @param input - Raw user input string
 * @returns Sanitized string safe for display
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
