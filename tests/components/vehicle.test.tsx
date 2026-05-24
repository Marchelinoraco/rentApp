import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  VehicleCard,
  VehicleGrid,
  VehicleGallery,
  FilterPanel,
  SearchBar,
  SortControls,
} from '@/components/vehicle';
import type { Vehicle, VehicleFilters, SortOption } from '@/types/vehicle';

describe('Vehicle Components', () => {
  const mockVehicle: Vehicle = {
    id: 'v1',
    name: 'Toyota Avanza',
    category: 'mpv',
    images: ['/test-image.jpg'],
    dailyRate: 300000,
    specifications: {
      seats: 7,
      transmission: 'manual',
      fuelType: 'petrol',
      year: 2023,
      luggage: 3,
    },
    features: ['AC', 'Audio System'],
    rentalTerms: ['Minimum rental 1 day'],
    availabilityStatus: 'available',
  };

  describe('VehicleCard', () => {
    it('should render vehicle information', () => {
      const onSelect = vi.fn();
      render(<VehicleCard vehicle={mockVehicle} onSelect={onSelect} />);

      expect(screen.getByText('Toyota Avanza')).toBeInTheDocument();
      expect(screen.getByText(/300\.000/)).toBeInTheDocument();
      expect(screen.getByText('Tersedia')).toBeInTheDocument();
    });

    it('should render unavailable vehicle', () => {
      const unavailableVehicle = { ...mockVehicle, availabilityStatus: 'unavailable' as const };
      const onSelect = vi.fn();
      render(<VehicleCard vehicle={unavailableVehicle} onSelect={onSelect} />);

      expect(screen.getByText('Sewa Penuh')).toBeInTheDocument();
    });
  });

  describe('VehicleGrid', () => {
    it('should render multiple vehicles', () => {
      const vehicles = [mockVehicle, { ...mockVehicle, id: 'v2', name: 'Honda Civic' }];
      const onSelect = vi.fn();
      render(<VehicleGrid vehicles={vehicles} onVehicleSelect={onSelect} />);

      expect(screen.getByText('Toyota Avanza')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });

    it('should render empty state when no vehicles', () => {
      const onSelect = vi.fn();
      render(<VehicleGrid vehicles={[]} onVehicleSelect={onSelect} />);

      expect(screen.getByText('Tidak ada kendaraan ditemukan')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      const onSelect = vi.fn();
      render(<VehicleGrid vehicles={[]} onVehicleSelect={onSelect} isLoading={true} />);

      expect(screen.getByText('Memuat kendaraan...')).toBeInTheDocument();
    });
  });

  describe('VehicleGallery', () => {
    it('should render gallery with images', () => {
      render(<VehicleGallery images={['/img1.jpg', '/img2.jpg']} vehicleName="Test Vehicle" />);

      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('should render empty state when no images', () => {
      render(<VehicleGallery images={[]} vehicleName="Test Vehicle" />);

      expect(screen.getByText('Tidak ada gambar tersedia')).toBeInTheDocument();
    });
  });

  describe('FilterPanel', () => {
    it('should render filter options', () => {
      const filters: VehicleFilters = {};
      const onFilterChange = vi.fn();
      render(<FilterPanel filters={filters} onFilterChange={onFilterChange} />);

      expect(screen.getByText('Filter Pencarian')).toBeInTheDocument();
      expect(screen.getByText('Kategori')).toBeInTheDocument();
      expect(screen.getByText('Rentang Tarif')).toBeInTheDocument();
      expect(screen.getByText('Hanya yang tersedia')).toBeInTheDocument();
    });

    it('should emit category filter changes', async () => {
      const user = userEvent.setup();
      const filters: VehicleFilters = {};
      const onFilterChange = vi.fn();
      render(<FilterPanel filters={filters} onFilterChange={onFilterChange} />);

      await user.click(screen.getByRole('button', { name: /filter kategori mpv/i }));

      expect(onFilterChange).toHaveBeenCalledWith({ category: ['mpv'] });
    });
  });

  describe('SearchBar', () => {
    it('should render search input', () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('SortControls', () => {
    it('should render sort options', () => {
      const sortOption: SortOption = { field: 'name', order: 'asc' };
      const onSortChange = vi.fn();
      render(<SortControls sortOption={sortOption} onSortChange={onSortChange} />);

      expect(screen.getByText('Urutan:')).toBeInTheDocument();
    });

    it('should display result count', () => {
      const sortOption: SortOption = { field: 'name', order: 'asc' };
      const onSortChange = vi.fn();
      render(<SortControls sortOption={sortOption} onSortChange={onSortChange} resultCount={10} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText(/pilihan armada terbaik/)).toBeInTheDocument();
    });
  });
});
