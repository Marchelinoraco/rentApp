/**
 * localStorage utilities for persisting bookings and contact messages.
 * All functions handle errors gracefully and return safe fallback values.
 */

import type { BookingRequest } from '../types/booking';
import type { ContactMessage } from '../types/index';
import { STORAGE_KEYS } from '../data/constants';

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

/**
 * Appends a booking to the localStorage bookings list.
 * Handles QuotaExceededError and other storage errors gracefully.
 *
 * @param booking - The booking to persist
 */
export function saveBooking(booking: BookingRequest): void {
  try {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded when saving booking:', error);
    } else {
      console.error('Failed to save booking to localStorage:', error);
    }
  }
}

/**
 * Retrieves all bookings from localStorage, converting date strings back to
 * Date objects. Returns an empty array if no data exists or on any error.
 *
 * @returns Array of BookingRequest objects
 */
export function getBookings(): BookingRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) return [];

    type RawBooking = Omit<BookingRequest, 'startDate' | 'endDate' | 'createdAt'> & {
      startDate: string;
      endDate: string;
      createdAt: string;
    };
    const parsed = JSON.parse(data) as RawBooking[];
    return parsed.map((b) => ({
      ...b,
      startDate: new Date(b.startDate),
      endDate: new Date(b.endDate),
      createdAt: new Date(b.createdAt),
    }));
  } catch (error) {
    console.error('Failed to retrieve bookings from localStorage:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Contact Messages
// ---------------------------------------------------------------------------

/**
 * Appends a contact message to the localStorage messages list.
 * Handles QuotaExceededError and other storage errors gracefully.
 *
 * @param message - The contact message to persist
 */
export function saveContactMessage(message: ContactMessage): void {
  try {
    const messages = getContactMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(messages));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded when saving contact message:', error);
    } else {
      console.error('Failed to save contact message to localStorage:', error);
    }
  }
}

/**
 * Retrieves all contact messages from localStorage, converting date strings
 * back to Date objects. Returns an empty array if no data exists or on error.
 *
 * @returns Array of ContactMessage objects
 */
export function getContactMessages(): ContactMessage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
    if (!data) return [];

    type RawMessage = Omit<ContactMessage, 'createdAt'> & { createdAt: string };
    const parsed = JSON.parse(data) as RawMessage[];
    return parsed.map((m) => ({
      ...m,
      createdAt: new Date(m.createdAt),
    }));
  } catch (error) {
    console.error('Failed to retrieve contact messages from localStorage:', error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Removes all application data from localStorage (bookings, messages, filters).
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear localStorage data:', error);
  }
}
