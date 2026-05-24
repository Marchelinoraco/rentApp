// Export all types from a central location

export * from './vehicle';
export * from './booking';
export * from './testimonial';

// Contact Form Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

// Component Props Types
export interface VehicleCardProps {
  vehicle: import('./vehicle').Vehicle;
  onSelect: (vehicleId: string) => void;
}

export interface BookingFormProps {
  preselectedVehicleId?: string;
  onSubmitSuccess: (booking: import('./booking').BookingRequest) => void;
}

export interface PriceCalculatorProps {
  vehicleId: string;
  rentalPeriod: import('./booking').RentalPeriod;
  withDriver: boolean;
  onChange: (breakdown: import('./booking').PriceBreakdown) => void;
}

export interface FilterPanelProps {
  filters: import('./vehicle').VehicleFilters;
  onFilterChange: (filters: import('./vehicle').VehicleFilters) => void;
}

export interface TestimonialCardProps {
  testimonial: import('./testimonial').Testimonial;
}

// Notification Types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
