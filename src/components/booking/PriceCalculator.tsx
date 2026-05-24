import React from 'react';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import type { RentalPeriod } from '@/types/booking';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export interface PriceCalculatorProps {
  vehicleId: string;
  rentalPeriod: RentalPeriod;
  withDriver: boolean;
  onChange?: (totalPrice: number) => void;
  className?: string;
}

/**
 * PriceCalculator component for real-time price calculation
 * Displays price breakdown (base rental, driver fee, total)
 * Updates on date or option changes
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  vehicleId,
  rentalPeriod,
  withDriver,
  onChange,
  className = '',
}) => {
  const { priceBreakdown, isCalculating, error } = usePriceCalculator({
    vehicleId,
    rentalPeriod,
    withDriver,
  });

  // Notify parent component of price changes
  React.useEffect(() => {
    if (priceBreakdown && onChange) {
      onChange(priceBreakdown.totalCost);
    }
  }, [priceBreakdown, onChange]);

  // Format currency in Indonesian Rupiah
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isCalculating) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`.trim()}>
        <LoadingSpinner size="medium" />
        <span className="ml-3 text-zinc-400 text-sm">Menghitung harga...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage
          message={error}
          title="Gagal Menghitung Harga"
          variant="banner"
          severity="error"
        />
      </div>
    );
  }

  if (!priceBreakdown) {
    return null;
  }

  return (
    <div className={`rounded-xl bg-zinc-900/40 border border-zinc-800/60 p-5 ${className}`.trim()}>
      <div className="space-y-3.5">
        {/* Number of days */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400 font-medium">Durasi Rental</span>
          <span className="font-bold text-white">
            {priceBreakdown.numberOfDays} hari
          </span>
        </div>

        {/* Base rental cost */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400 font-medium">
            Biaya Rental ({priceBreakdown.numberOfDays} hari)
          </span>
          <span className="font-bold text-white">
            {formatCurrency(priceBreakdown.baseRentalCost)}
          </span>
        </div>

        {/* Driver fee */}
        {withDriver && priceBreakdown.driverFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400 font-medium">
              Biaya Sopir ({priceBreakdown.numberOfDays} hari)
            </span>
            <span className="font-bold text-white">
              {formatCurrency(priceBreakdown.driverFee)}
            </span>
          </div>
        )}

        {/* Divider + Total */}
        <div className="border-t border-zinc-700/50 pt-3.5 mt-3.5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-white uppercase tracking-wider">
              Total Biaya
            </span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
              {formatCurrency(priceBreakdown.totalCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-zinc-800/40">
        <p className="text-[10px] text-zinc-600 font-medium">
          * Harga sudah termasuk pajak
        </p>
        <p className="text-[10px] text-zinc-600 font-medium">
          * Minimum rental 1 hari
        </p>
      </div>
    </div>
  );
};
