/**
 * Filtering, sorting, and search utilities for the vehicle catalog.
 */

import type { Vehicle, VehicleFilters, SortOption } from '../types/vehicle';
import type { BookingRequest } from '../types/booking';

/**
 * Filters a list of vehicles based on the provided filter criteria.
 *
 * - Category: only vehicles whose category is in the selected set
 * - Price range: only vehicles whose dailyRate falls within [min, max]
 * - Search query: matches against name, category, and features (case-insensitive)
 * - Availability: only vehicles with availabilityStatus === 'available'
 *
 * The `bookings` parameter is accepted for future availability-period filtering
 * but is not used in the current implementation (availability is based on
 * the vehicle's own `availabilityStatus` field).
 *
 * @param vehicles - Full list of vehicles
 * @param filters - Active filter criteria
 * @param bookings - Existing bookings (reserved for future use)
 * @returns Filtered array of vehicles
 */
export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters,
  _bookings: BookingRequest[]
): Vehicle[] {
  let filtered = [...vehicles];

  // Category filter
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((v) => filters.category!.includes(v.category));
  }

  // Price range filter
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    filtered = filtered.filter((v) => v.dailyRate >= min && v.dailyRate <= max);
  }

  // Search query filter
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query) ||
        v.features.some((f) => f.toLowerCase().includes(query))
    );
  }

  // Availability filter
  if (filters.availability) {
    filtered = filtered.filter((v) => v.availabilityStatus === 'available');
  }

  return filtered;
}

/**
 * Sorts a list of vehicles by price or name in ascending or descending order.
 * Returns a new array; the original is not mutated.
 *
 * @param vehicles - Vehicles to sort
 * @param sortOption - Field and direction to sort by
 * @returns Sorted array of vehicles
 */
export function sortVehicles(vehicles: Vehicle[], sortOption: SortOption): Vehicle[] {
  const sorted = [...vehicles];

  sorted.sort((a, b) => {
    if (sortOption.field === 'price') {
      return sortOption.order === 'asc'
        ? a.dailyRate - b.dailyRate
        : b.dailyRate - a.dailyRate;
    } else {
      // field === 'name'
      const cmp = a.name.localeCompare(b.name);
      return sortOption.order === 'asc' ? cmp : -cmp;
    }
  });

  return sorted;
}

/**
 * Wraps all occurrences of a search term in `<mark>` tags for highlighting.
 * The match is case-insensitive; the original casing of the text is preserved.
 *
 * @param text - The text to search within
 * @param searchQuery - The term to highlight
 * @returns Text with matching terms wrapped in `<mark>` tags
 */
export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery || searchQuery.trim().length === 0) return text;

  // Escape special regex characters in the search query
  const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
