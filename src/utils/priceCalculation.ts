/**
 * Price calculation utilities for vehicle rental.
 * Computes base rental cost, driver fee, and total cost
 * based on rental period and options.
 */

import type { PriceBreakdown } from '../types/booking';
import { DRIVER_FEE_PER_DAY, MIN_RENTAL_DAYS } from '../data/constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface CalculateRentalPriceParams {
  dailyRate: number;
  startDate: Date;
  endDate: Date;
  withDriver: boolean;
}

/**
 * Calculates the full price breakdown for a vehicle rental.
 *
 * - numberOfDays = Math.max(MIN_RENTAL_DAYS, Math.ceil((endDate - startDate) / ms_per_day))
 * - baseRentalCost = dailyRate * numberOfDays
 * - driverFee = withDriver ? DRIVER_FEE_PER_DAY * numberOfDays : 0
 * - totalCost = Math.round(baseRentalCost + driverFee)
 *
 * @param params - Rental parameters including daily rate, dates, and driver option
 * @returns PriceBreakdown with all cost components
 */
export function calculateRentalPrice(params: CalculateRentalPriceParams): PriceBreakdown {
  const { dailyRate, startDate, endDate, withDriver } = params;

  const rawDays = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  const numberOfDays = Math.max(MIN_RENTAL_DAYS, rawDays);

  const baseRentalCost = dailyRate * numberOfDays;
  const driverFee = withDriver ? DRIVER_FEE_PER_DAY * numberOfDays : 0;
  const totalCost = Math.round(baseRentalCost + driverFee);

  return {
    baseRentalCost,
    driverFee,
    numberOfDays,
    totalCost,
  };
}
