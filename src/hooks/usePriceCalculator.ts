/**
 * Custom hook for real-time price calculation.
 * Automatically recalculates price when rental parameters change.
 * 
 * Requirements: 4.4
 */

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { calculateRentalPrice } from '../utils/priceCalculation';
import type { PriceBreakdown, RentalPeriod } from '../types/booking';

export interface UsePriceCalculatorParams {
  vehicleId: string;
  rentalPeriod: RentalPeriod;
  withDriver: boolean;
}

export interface UsePriceCalculatorReturn {
  priceBreakdown: PriceBreakdown | null;
  isCalculating: boolean;
  recalculate: () => void;
  error: string | null;
}

/**
 * Hook for calculating rental prices in real-time.
 * Automatically recalculates when vehicle, dates, or driver option changes.
 * 
 * @param params - Rental parameters (vehicleId, rentalPeriod, withDriver)
 * @returns Price breakdown and calculation state
 */
export function usePriceCalculator(
  params: UsePriceCalculatorParams
): UsePriceCalculatorReturn {
  const { vehicleId, rentalPeriod, withDriver } = params;
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vehicles = useAppStore((state) => state.vehicles);

  /**
   * Calculates the price breakdown based on current parameters.
   */
  const calculate = useCallback(() => {
    setIsCalculating(true);
    setError(null);

    try {
      // Find the vehicle
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) {
        setError('Kendaraan tidak ditemukan');
        setPriceBreakdown(null);
        return;
      }

      // Validate dates
      if (!rentalPeriod.startDate || !rentalPeriod.endDate) {
        setError('Tanggal rental harus diisi');
        setPriceBreakdown(null);
        return;
      }

      // Validate date order
      if (rentalPeriod.endDate <= rentalPeriod.startDate) {
        setError('Tanggal selesai harus setelah tanggal mulai');
        setPriceBreakdown(null);
        return;
      }

      // Calculate price
      const breakdown = calculateRentalPrice({
        dailyRate: vehicle.dailyRate,
        startDate: rentalPeriod.startDate,
        endDate: rentalPeriod.endDate,
        withDriver,
      });

      setPriceBreakdown(breakdown);
    } catch (err) {
      console.error('Error calculating price:', err);
      setError('Terjadi kesalahan saat menghitung harga');
      setPriceBreakdown(null);
    } finally {
      setIsCalculating(false);
    }
  }, [vehicleId, rentalPeriod, withDriver, vehicles]);

  /**
   * Recalculate price (can be called manually if needed).
   */
  const recalculate = useCallback(() => {
    calculate();
  }, [calculate]);

  /**
   * Auto-recalculate when parameters change.
   */
  useEffect(() => {
    calculate();
  }, [calculate]);

  return {
    priceBreakdown,
    isCalculating,
    recalculate,
    error,
  };
}
