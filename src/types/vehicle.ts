// Vehicle Types

export type VehicleCategory = 'sedan' | 'suv' | 'mpv' | 'hatchback' | 'luxury';

export interface VehicleSpecifications {
  seats: number;
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  year: number;
  luggage: number;
}

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  images: string[];
  dailyRate: number;
  specifications: VehicleSpecifications;
  features: string[];
  rentalTerms: string[];
  availabilityStatus: 'available' | 'unavailable';
}

// Filter and Search Types
export interface VehicleFilters {
  category?: VehicleCategory[];
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: boolean;
  searchQuery?: string;
}

export interface SortOption {
  field: 'price' | 'name';
  order: 'asc' | 'desc';
}
