// Verification file to ensure all booking components export correctly
import { BookingForm } from './BookingForm';
import { PriceCalculator } from './PriceCalculator';
import { PriceSummary } from './PriceSummary';
import { BookingConfirmation } from './BookingConfirmation';

export const bookingComponents = {
  BookingForm,
  PriceCalculator,
  PriceSummary,
  BookingConfirmation,
};

// Type check
export const bookingComponentTypeCheck: {
  BookingForm: typeof BookingForm;
  PriceCalculator: typeof PriceCalculator;
  PriceSummary: typeof PriceSummary;
  BookingConfirmation: typeof BookingConfirmation;
} = bookingComponents;

console.log('All booking components verified:', Object.keys(bookingComponents));
