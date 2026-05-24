import React from 'react';
import type { Vehicle } from '@/types/vehicle';
import { VehicleCard } from './VehicleCard';

export interface VehicleGridProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string) => void;
  isLoading?: boolean;
}

/**
 * VehicleGrid component displays a responsive grid of VehicleCard components
 * Handles empty state when no vehicles are available
 * Requirements: 1.1, 10.4
 */
export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  onVehicleSelect,
  isLoading = false,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-zinc-400">Memuat kendaraan...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md px-4">
          <svg
            className="mx-auto h-24 w-24 text-zinc-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">
            Tidak ada kendaraan ditemukan
          </h3>
          <p className="text-zinc-400 mb-4">
            Tidak ada kendaraan yang sesuai dengan kriteria pencarian Anda.
          </p>
          <div className="text-sm text-zinc-500">
            <p className="font-medium mb-2">Saran:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Coba perluas rentang harga</li>
              <li>Pilih kategori lain</li>
              <li>Hapus beberapa filter</li>
              <li>Gunakan kata kunci pencarian yang berbeda</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Grid display
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Daftar kendaraan"
    >
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} role="listitem">
          <VehicleCard vehicle={vehicle} onSelect={onVehicleSelect} />
        </div>
      ))}
    </div>
  );
};
