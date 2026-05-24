/**
 * Booking slice for Zustand store.
 * Manages booking state and localStorage persistence.
 */

import type { StateCreator } from 'zustand';
import type { BookingRequest } from '../../types/booking';
import { getBookings, saveBooking } from '../../utils/localStorage';

export interface BookingSlice {
  // State
  bookings: BookingRequest[];
  currentBooking: Partial<BookingRequest> | null;

  // Actions
  addBooking: (booking: BookingRequest) => void;
  loadBookingsFromStorage: () => void;
  setCurrentBooking: (booking: Partial<BookingRequest> | null) => void;
  clearCurrentBooking: () => void;
}

export const createBookingSlice: StateCreator<BookingSlice> = (set) => ({
  // Initial state
  bookings: [],
  currentBooking: null,

  // Actions
  addBooking: (booking: BookingRequest) => {
    // Save to localStorage
    saveBooking(booking);

    // Update state
    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
  },

  loadBookingsFromStorage: () => {
    const bookings = getBookings();
    set({ bookings });
  },

  setCurrentBooking: (booking: Partial<BookingRequest> | null) => {
    set({ currentBooking: booking });
  },

  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },
});
