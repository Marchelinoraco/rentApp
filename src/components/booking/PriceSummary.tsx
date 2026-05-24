import React from 'react';
import type { PriceBreakdown } from '@/types/booking';
import { CheckCircle } from 'lucide-react';

export interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  vehicleName?: string;
  className?: string;
}

/**
 * PriceSummary component displaying final price breakdown
 * Used in booking confirmation to show the complete cost summary
 * Requirements: 4.3
 */
export const PriceSummary: React.FC<PriceSummaryProps> = ({
  priceBreakdown,
  vehicleName,
  className = '',
}) => {
  // Format currency in Indonesian Rupiah
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`.trim()}>
      {/* Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-primary-900">
            Ringkasan Pembayaran
          </h3>
        </div>
        {vehicleName && (
          <p className="text-sm text-primary-700 mt-1">
            {vehicleName}
          </p>
        )}
      </div>

      {/* Price breakdown */}
      <div className="px-6 py-5 space-y-4">
        {/* Duration */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Durasi Rental</span>
          <span className="text-sm font-medium text-gray-900">
            {priceBreakdown.numberOfDays} hari
          </span>
        </div>

        {/* Base rental cost */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Biaya Rental
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(priceBreakdown.baseRentalCost)}
          </span>
        </div>

        {/* Driver fee (if applicable) */}
        {priceBreakdown.driverFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Biaya Sopir
            </span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(priceBreakdown.driverFee)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">
              Total Pembayaran
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(priceBreakdown.totalCost)}
            </span>
          </div>
        </div>

        {/* Additional notes */}
        <div className="bg-gray-50 rounded-md p-3 mt-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Catatan:</strong> Harga sudah termasuk pajak. 
            Pembayaran dapat dilakukan saat pengambilan kendaraan.
          </p>
        </div>
      </div>
    </div>
  );
};
