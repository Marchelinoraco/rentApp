/**
 * Vehicle slice for Zustand store.
 * Manages vehicle catalog state, filters, sorting, and selection.
 */

import type { StateCreator } from 'zustand';
import type { Vehicle, VehicleFilters, SortOption } from '../../types/vehicle';
import type { RentalPeriod } from '../../types/booking';
import { MOCK_VEHICLES } from '../../data/vehicles';
import { filterVehicles, sortVehicles } from '../../utils/filtering';

export interface VehicleSlice {
  // State
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  filters: VehicleFilters;
  sortOption: SortOption;

  // Actions
  setFilters: (filters: VehicleFilters) => void;
  setSortOption: (option: SortOption) => void;
  selectVehicle: (vehicleId: string | null) => void;
  getAvailableVehicles: (period: RentalPeriod) => Vehicle[];
  getFilteredAndSortedVehicles: () => Vehicle[];
}

export const createVehicleSlice: StateCreator<VehicleSlice> = (set, get) => ({
  // Initial state
  vehicles: MOCK_VEHICLES,
  selectedVehicle: null,
  filters: {},
  sortOption: {
    field: 'name',
    order: 'asc',
  },

  // Actions
  setFilters: (filters: VehicleFilters) => {
    set({ filters });
  },

  setSortOption: (option: SortOption) => {
    set({ sortOption: option });
  },

  selectVehicle: (vehicleId: string | null) => {
    if (vehicleId === null) {
      set({ selectedVehicle: null });
      return;
    }

    const vehicle = get().vehicles.find((v) => v.id === vehicleId);
    set({ selectedVehicle: vehicle || null });
  },

  getAvailableVehicles: (_period: RentalPeriod) => {
    const { vehicles } = get();
    // Note: This requires bookings from the booking slice
    // For now, we'll return all vehicles marked as available
    // The actual availability check will be done in components
    // that have access to the full store
    return vehicles.filter((v) => v.availabilityStatus === 'available');
  },

  getFilteredAndSortedVehicles: () => {
    const { vehicles, filters, sortOption } = get();
    // Note: filterVehicles requires bookings for availability filter
    // For now, we'll pass an empty array and handle it in components
    const filtered = filterVehicles(vehicles, filters, []);
    const sorted = sortVehicles(filtered, sortOption);
    return sorted;
  },
});
