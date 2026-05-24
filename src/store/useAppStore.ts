/**
 * Main Zustand store combining all slices.
 * Provides centralized state management for the entire application.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VehicleSlice } from './slices/vehicleSlice';
import type { BookingSlice } from './slices/bookingSlice';
import { createVehicleSlice } from './slices/vehicleSlice';
import { createBookingSlice } from './slices/bookingSlice';
import type { Notification } from '../types/index';

// UI State interface
interface UIState {
  isLoading: boolean;
  notifications: Notification[];
  setLoading: (loading: boolean) => void;
  showNotification: (message: string, type: Notification['type'], duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Combined store type
export type AppStore = VehicleSlice & BookingSlice & UIState;

// Create the store with all slices
export const useAppStore = create<AppStore>()(
  devtools(
    (set, get, api) => ({
      // Vehicle slice
      ...createVehicleSlice(set, get, api),

      // Booking slice
      ...createBookingSlice(set, get, api),

      // UI state
      isLoading: false,
      notifications: [],

      // UI actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      showNotification: (
        message: string,
        type: Notification['type'],
        duration: number = 5000
      ) => {
        const notification: Notification = {
          id: `notification-${Date.now()}-${Math.random()}`,
          message,
          type,
          duration,
        };

        set((state) => ({
          notifications: [...state.notifications, notification],
        }));

        // Auto-remove notification after duration
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(notification.id);
          }, duration);
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'rental-mobil-store',
    }
  )
);

// Selector hooks for better performance
export const useVehicles = () => useAppStore((state) => state.vehicles);
export const useSelectedVehicle = () => useAppStore((state) => state.selectedVehicle);
export const useFilters = () => useAppStore((state) => state.filters);
export const useSortOption = () => useAppStore((state) => state.sortOption);
export const useBookings = () => useAppStore((state) => state.bookings);
export const useCurrentBooking = () => useAppStore((state) => state.currentBooking);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useNotifications = () => useAppStore((state) => state.notifications);

// Action hooks
export const useVehicleActions = () =>
  useAppStore((state) => ({
    setFilters: state.setFilters,
    setSortOption: state.setSortOption,
    selectVehicle: state.selectVehicle,
    getAvailableVehicles: state.getAvailableVehicles,
    getFilteredAndSortedVehicles: state.getFilteredAndSortedVehicles,
  }));

export const useBookingActions = () =>
  useAppStore((state) => ({
    addBooking: state.addBooking,
    loadBookingsFromStorage: state.loadBookingsFromStorage,
    setCurrentBooking: state.setCurrentBooking,
    clearCurrentBooking: state.clearCurrentBooking,
  }));

export const useUIActions = () =>
  useAppStore((state) => ({
    setLoading: state.setLoading,
    showNotification: state.showNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));
