// Booking Types

export interface RentalPeriod {
  startDate: Date;
  endDate: Date;
}

export interface BookingRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  withDriver: boolean;
  totalPrice: number;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// Price Calculation Types
export interface PriceBreakdown {
  baseRentalCost: number;
  driverFee: number;
  numberOfDays: number;
  totalCost: number;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
