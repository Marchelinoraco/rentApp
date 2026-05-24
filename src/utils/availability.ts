/**
 * Availability checking utilities for vehicle rental.
 * Determines whether a vehicle is available for a requested period
 * and finds the next available date.
 */

import type { RentalPeriod, BookingRequest } from '../types/booking';
import { addDays } from './dateHelpers';

/**
 * Determines whether two rental periods overlap.
 * Two periods overlap when one starts before the other ends.
 *
 * @param period1 - First rental period
 * @param period2 - Second rental period
 * @returns true if the periods overlap (inclusive boundary check)
 */
export function periodsOverlap(period1: RentalPeriod, period2: RentalPeriod): boolean {
  return (
    period1.startDate <= period2.endDate &&
    period1.endDate >= period2.startDate
  );
}

/**
 * Checks whether a vehicle is available for a requested rental period.
 * Cancelled bookings are ignored.
 *
 * @param vehicleId - ID of the vehicle to check
 * @param requestedPeriod - The desired rental period
 * @param existingBookings - All existing bookings in the system
 * @returns true if the vehicle has no conflicting active bookings
 */
export function checkVehicleAvailability(
  vehicleId: string,
  requestedPeriod: RentalPeriod,
  existingBookings: BookingRequest[]
): boolean {
  const vehicleBookings = existingBookings.filter(
    (booking) => booking.vehicleId === vehicleId && booking.status !== 'cancelled'
  );

  return !vehicleBookings.some((booking) =>
    periodsOverlap(requestedPeriod, {
      startDate: booking.startDate,
      endDate: booking.endDate,
    })
  );
}

/**
 * Finds the next date on which a vehicle is available, starting from fromDate.
 * Returns fromDate itself if there are no conflicting bookings.
 *
 * The algorithm walks through all active bookings sorted by start date and
 * advances the candidate date past any overlapping booking's end date.
 *
 * @param vehicleId - ID of the vehicle to check
 * @param fromDate - The earliest date to consider
 * @param existingBookings - All existing bookings in the system
 * @returns The earliest available date on or after fromDate
 */
export function getNextAvailableDate(
  vehicleId: string,
  fromDate: Date,
  existingBookings: BookingRequest[]
): Date {
  const vehicleBookings = existingBookings
    .filter(
      (booking) =>
        booking.vehicleId === vehicleId &&
        booking.status !== 'cancelled' &&
        booking.endDate >= fromDate
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  if (vehicleBookings.length === 0) {
    return fromDate;
  }

  // Walk through sorted bookings and advance candidate date past any overlap
  let candidate = fromDate;
  for (const booking of vehicleBookings) {
    if (
      periodsOverlap(
        { startDate: candidate, endDate: candidate },
        { startDate: booking.startDate, endDate: booking.endDate }
      )
    ) {
      // Move candidate to the day after this booking ends
      candidate = addDays(booking.endDate, 1);
    }
  }

  return candidate;
}
