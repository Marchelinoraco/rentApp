/**
 * Unit tests for custom hooks.
 * Tests basic functionality of useVehicleFilters, useBookingForm,
 * usePriceCalculator, and useLocalStorage hooks.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVehicleFilters } from '../../src/hooks/useVehicleFilters';
import { useBookingForm } from '../../src/hooks/useBookingForm';
import { usePriceCalculator } from '../../src/hooks/usePriceCalculator';
import { useLocalStorage } from '../../src/hooks/useLocalStorage';

describe('useVehicleFilters', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { useAppStore } = require('../../src/store/useAppStore');
    useAppStore.setState({
      filters: {},
    });
  });

  it('should initialize with empty filters', () => {
    const { result } = renderHook(() => useVehicleFilters());
    expect(result.current.filters).toEqual({});
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should update category filter', () => {
    const { result } = renderHook(() => useVehicleFilters());

    act(() => {
      result.current.updateCategory(['sedan', 'suv']);
    });

    expect(result.current.filters.category).toEqual(['sedan', 'suv']);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should update price range filter', () => {
    const { result } = renderHook(() => useVehicleFilters());

    act(() => {
      result.current.updatePriceRange(100000, 500000);
    });

    expect(result.current.filters.priceRange).toEqual({
      min: 100000,
      max: 500000,
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should update search query filter', () => {
    const { result } = renderHook(() => useVehicleFilters());

    act(() => {
      result.current.updateSearchQuery('Toyota');
    });

    expect(result.current.filters.searchQuery).toBe('Toyota');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useVehicleFilters());

    act(() => {
      result.current.updateCategory(['sedan']);
      result.current.updatePriceRange(100000, 500000);
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.hasActiveFilters).toBe(false);
  });
});

describe('useBookingForm', () => {
  beforeEach(() => {
    // Reset store state
    const { useAppStore } = require('../../src/store/useAppStore');
    useAppStore.setState({
      bookings: [],
    });
  });

  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useBookingForm());

    expect(result.current.formData.customerName).toBe('');
    expect(result.current.formData.email).toBe('');
    expect(result.current.formData.phone).toBe('');
    expect(result.current.formData.vehicleId).toBe('');
    expect(result.current.formData.withDriver).toBe(false);
  });

  it('should initialize with preselected vehicle', () => {
    const { result } = renderHook(() => useBookingForm('vehicle-123'));

    expect(result.current.formData.vehicleId).toBe('vehicle-123');
  });

  it('should update form fields', () => {
    const { result } = renderHook(() => useBookingForm());

    act(() => {
      result.current.updateField('customerName', 'John Doe');
      result.current.updateField('email', 'john@example.com');
    });

    expect(result.current.formData.customerName).toBe('John Doe');
    expect(result.current.formData.email).toBe('john@example.com');
  });

  it('should validate form and return errors for empty fields', () => {
    const { result } = renderHook(() => useBookingForm());

    let validationResult;
    act(() => {
      validationResult = result.current.validateForm();
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useBookingForm());

    act(() => {
      result.current.updateField('customerName', 'John Doe');
      result.current.updateField('email', 'john@example.com');
    });

    expect(result.current.formData.customerName).toBe('John Doe');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.customerName).toBe('');
    expect(result.current.formData.email).toBe('');
  });
});

describe('usePriceCalculator', () => {
  it('should calculate price for valid rental period', () => {
    const startDate = new Date('2024-01-15');
    const endDate = new Date('2024-01-20');

    const { result } = renderHook(() =>
      usePriceCalculator({
        vehicleId: 'v1',
        rentalPeriod: { startDate, endDate },
        withDriver: false,
      })
    );

    // Wait for calculation to complete
    expect(result.current.priceBreakdown).not.toBeNull();
    if (result.current.priceBreakdown) {
      expect(result.current.priceBreakdown.numberOfDays).toBe(5);
      expect(result.current.priceBreakdown.driverFee).toBe(0);
    }
  });

  it('should include driver fee when withDriver is true', () => {
    const startDate = new Date('2024-01-15');
    const endDate = new Date('2024-01-20');

    const { result } = renderHook(() =>
      usePriceCalculator({
        vehicleId: 'v1',
        rentalPeriod: { startDate, endDate },
        withDriver: true,
      })
    );

    expect(result.current.priceBreakdown).not.toBeNull();
    if (result.current.priceBreakdown) {
      expect(result.current.priceBreakdown.driverFee).toBeGreaterThan(0);
    }
  });

  it('should return error for invalid vehicle ID', () => {
    const startDate = new Date('2024-01-15');
    const endDate = new Date('2024-01-20');

    const { result } = renderHook(() =>
      usePriceCalculator({
        vehicleId: 'invalid-id',
        rentalPeriod: { startDate, endDate },
        withDriver: false,
      })
    );

    expect(result.current.error).not.toBeNull();
    expect(result.current.priceBreakdown).toBeNull();
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with initial value', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current.value).toBe('initial-value');
    expect(result.current.isLoading).toBe(false);
  });

  it('should save and retrieve value from localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current.setValue('new-value');
    });

    expect(result.current.value).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current.setValue('new-value');
    });

    expect(localStorage.getItem('test-key')).not.toBeNull();

    act(() => {
      result.current.removeValue();
    });

    expect(localStorage.getItem('test-key')).toBeNull();
    expect(result.current.value).toBe('initial-value');
  });

  it('should handle complex objects', () => {
    const initialValue = { name: 'Test', count: 0 };
    const { result } = renderHook(() =>
      useLocalStorage('test-object', initialValue)
    );

    const newValue = { name: 'Updated', count: 5 };

    act(() => {
      result.current.setValue(newValue);
    });

    expect(result.current.value).toEqual(newValue);
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-counter', 0));

    act(() => {
      result.current.setValue((prev) => prev + 1);
    });

    expect(result.current.value).toBe(1);

    act(() => {
      result.current.setValue((prev) => prev + 1);
    });

    expect(result.current.value).toBe(2);
  });
});
