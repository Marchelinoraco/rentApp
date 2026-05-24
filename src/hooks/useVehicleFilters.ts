/**
 * Custom hook for managing vehicle filter state and applying filters.
 * Integrates with Zustand store and provides filter management utilities.
 * 
 * Requirements: 1.3, 10.3
 */

import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { VehicleFilters, VehicleCategory } from '../types/vehicle';

export interface UseVehicleFiltersReturn {
  filters: VehicleFilters;
  setFilters: (filters: VehicleFilters) => void;
  updateCategory: (categories: VehicleCategory[]) => void;
  updatePriceRange: (min: number, max: number) => void;
  updateAvailability: (availability: boolean) => void;
  updateSearchQuery: (query: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook for managing vehicle filters with granular update methods.
 * Provides both full filter replacement and individual filter updates.
 * 
 * @returns Filter state and update functions
 */
export function useVehicleFilters(): UseVehicleFiltersReturn {
  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);

  /**
   * Updates the category filter.
   */
  const updateCategory = useCallback(
    (categories: VehicleCategory[]) => {
      setFilters({
        ...filters,
        category: categories.length > 0 ? categories : undefined,
      });
    },
    [filters, setFilters]
  );

  /**
   * Updates the price range filter.
   */
  const updatePriceRange = useCallback(
    (min: number, max: number) => {
      setFilters({
        ...filters,
        priceRange: { min, max },
      });
    },
    [filters, setFilters]
  );

  /**
   * Updates the availability filter.
   */
  const updateAvailability = useCallback(
    (availability: boolean) => {
      setFilters({
        ...filters,
        availability,
      });
    },
    [filters, setFilters]
  );

  /**
   * Updates the search query filter.
   */
  const updateSearchQuery = useCallback(
    (query: string) => {
      setFilters({
        ...filters,
        searchQuery: query.trim() || undefined,
      });
    },
    [filters, setFilters]
  );

  /**
   * Clears all active filters.
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  /**
   * Checks if any filters are currently active.
   */
  const hasActiveFilters =
    (filters.category && filters.category.length > 0) ||
    filters.priceRange !== undefined ||
    filters.availability !== undefined ||
    (filters.searchQuery && filters.searchQuery.length > 0) ||
    false;

  return {
    filters,
    setFilters,
    updateCategory,
    updatePriceRange,
    updateAvailability,
    updateSearchQuery,
    clearFilters,
    hasActiveFilters,
  };
}
