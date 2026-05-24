import React from 'react';
import { CheckCircle, Calendar, User, Phone, Mail, Car } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { BookingRequest } from '@/types/booking';
import type { Vehicle } from '@/types/vehicle';
import { PriceSummary } from './PriceSummary';
import { Button } from '@/components/ui/Button';
import { calculateRentalPrice } from '@/utils/priceCalculation';

export interface BookingConfirmationProps {
  booking: BookingRequest;
  vehicle?: Vehicle;
  onNewBooking?: () => void;
  onViewVehicles?: () => void;
  className?: string;
}

/**
 * BookingConfirmation component displaying booking details after successful submission
 * Shows customer info, vehicle details, rental period, and price summary
 * Requirements: 3.5
 */
export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  vehicle,
  onNewBooking,
  onViewVehicles,
  className = '',
}) => {
  // Calculate price breakdown for display
  const priceBreakdown = React.useMemo(() => {
    if (!vehicle) return null;
    
    return calculateRentalPrice({
      dailyRate: vehicle.dailyRate,
      startDate: booking.startDate,
      endDate: booking.endDate,
      withDriver: booking.withDriver,
    });
  }, [vehicle, booking]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return format(date, 'EEEE, dd MMMM yyyy', { locale: idLocale });
  };

  return (
    <div className={`max-w-3xl mx-auto ${className}`.trim()}>
      {/* Success header */}
      <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="w-12 h-12 text-green-600" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Booking Berhasil!
            </h2>
            <p className="text-green-800 mb-1">
              Terima kasih atas pemesanan Anda. Booking ID Anda adalah:
            </p>
            <p className="text-lg font-mono font-semibold text-green-900 bg-white px-3 py-2 rounded inline-block">
              {booking.id}
            </p>
          </div>
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Detail Pemesanan
        </h3>

        <div className="space-y-4">
          {/* Customer info */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-gray-500">Nama Pemesan</p>
              <p className="text-base font-medium text-gray-900">{booking.customerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-900">{booking.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="text-base font-medium text-gray-900">{booking.phone}</p>
            </div>
          </div>

          {/* Vehicle info */}
          {vehicle && (
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-500">Kendaraan</p>
                <p className="text-base font-medium text-gray-900">{vehicle.name}</p>
                <p className="text-sm text-gray-600">
                  {vehicle.specifications.seats} kursi • {vehicle.specifications.transmission === 'automatic' ? 'Automatic' : 'Manual'}
                </p>
              </div>
            </div>
          )}

          {/* Rental period */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-gray-500">Periode Rental</p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(booking.startDate)}
              </p>
              <p className="text-sm text-gray-600">sampai</p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(booking.endDate)}
              </p>
            </div>
          </div>

          {/* Driver option */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <div className={`w-4 h-4 rounded-full ${booking.withDriver ? 'bg-primary-600' : 'bg-gray-300'}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Opsi Sopir</p>
              <p className="text-base font-medium text-gray-900">
                {booking.withDriver ? 'Dengan Sopir' : 'Tanpa Sopir'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price summary */}
      {priceBreakdown && (
        <PriceSummary
          priceBreakdown={priceBreakdown}
          vehicleName={vehicle?.name}
          className="mb-6"
        />
      )}

      {/* Next steps */}
      <div className="bg-primary-50 rounded-lg p-6 mb-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">
          Langkah Selanjutnya
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-primary-800">
          <li>Kami akan menghubungi Anda melalui email atau telepon untuk konfirmasi</li>
          <li>Siapkan dokumen yang diperlukan (KTP, SIM)</li>
          <li>Lakukan pembayaran saat pengambilan kendaraan</li>
          <li>Kendaraan siap digunakan sesuai jadwal yang dipilih</li>
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onNewBooking && (
          <Button
            variant="primary"
            size="large"
            onClick={onNewBooking}
            fullWidth
            className="sm:flex-1"
          >
            Buat Booking Baru
          </Button>
        )}
        {onViewVehicles && (
          <Button
            variant="outline"
            size="large"
            onClick={onViewVehicles}
            fullWidth
            className="sm:flex-1"
          >
            Lihat Kendaraan Lain
          </Button>
        )}
      </div>

      {/* Contact info */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Ada pertanyaan? Hubungi kami di{' '}
          <a href="tel:+628954052225577" className="text-primary-600 hover:text-primary-700 font-medium">
            +62 895-4052-225577
          </a>
          {' '}atau{' '}
          <a href="mailto:info@ourrentcar.com" className="text-primary-600 hover:text-primary-700 font-medium">
            info@ourrentcar.com
          </a>
        </p>
      </div>
    </div>
  );
};
