import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import { PriceCalculator } from './PriceCalculator';
import type { BookingRequest, RentalPeriod } from '@/types/booking';
import {
  User,
  Mail,
  Phone,
  Car,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Users,
  Fuel,
  Gauge,
  Briefcase,
} from 'lucide-react';

// Zod validation schema
const bookingFormSchema = z.object({
  customerName: z.string().min(1, 'Nama harus diisi').trim(),
  email: z.string().min(1, 'Email harus diisi').email('Email tidak valid'),
  phone: z
    .string()
    .min(1, 'Nomor telepon harus diisi')
    .regex(/^(\+62|62|0)[8][0-9]{8,11}$/, 'Nomor telepon tidak valid (contoh: 08123456789)'),
  vehicleId: z.string().min(1, 'Pilih kendaraan'),
  startDate: z.string().min(1, 'Tanggal mulai harus diisi'),
  endDate: z.string().min(1, 'Tanggal selesai harus diisi'),
  withDriver: z.boolean(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export interface BookingFormProps {
  preselectedVehicleId?: string;
  onSubmitSuccess?: (booking: BookingRequest) => void;
  className?: string;
}

// Step indicator component
function StepIndicator({
  step,
  label,
  isActive,
  isCompleted,
}: {
  step: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`
          flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-500
          ${
            isCompleted
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              : isActive
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-500'
          }
        `}
      >
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <span
        className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 hidden sm:inline
          ${isCompleted ? 'text-emerald-400' : isActive ? 'text-cyan-400' : 'text-zinc-500'}
        `}
      >
        {label}
      </span>
      {step < 4 && (
        <ChevronRight
          className={`h-3.5 w-3.5 hidden sm:inline ${isActive || isCompleted ? 'text-zinc-600' : 'text-zinc-800'}`}
        />
      )}
    </div>
  );
}

// Dark themed form field wrapper
function FormField({
  label,
  icon: Icon,
  error,
  required,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
        <Icon className="h-3.5 w-3.5 text-cyan-500/70" />
        {label}
        {required && <span className="text-fuchsia-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 font-medium">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * BookingForm component with all booking fields
 * Implements form validation using React Hook Form and Zod
 * Handles form submission and localStorage storage
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 3.8
 */
export const BookingForm: React.FC<BookingFormProps> = ({
  preselectedVehicleId,
  onSubmitSuccess,
  className = '',
}) => {
  const vehicles = useAppStore((state) => state.vehicles);
  const addBooking = useAppStore((state) => state.addBooking);
  const showNotification = useAppStore((state) => state.showNotification);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      vehicleId: preselectedVehicleId || '',
      startDate: '',
      endDate: '',
      withDriver: false,
    },
  });

  // Watch form values for real-time price calculation
  const watchedVehicleId = watch('vehicleId');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedWithDriver = watch('withDriver');

  const bookingHeroVehicles = React.useMemo(() => {
    const featuredVehicles = ['Innova Zenix Q', 'Alphard', 'Fortuner TRD/GR']
      .map((name) => vehicles.find((vehicle) => vehicle.name === name))
      .filter((vehicle): vehicle is NonNullable<typeof vehicle> => Boolean(vehicle));

    return featuredVehicles.length > 0 ? featuredVehicles : vehicles.slice(0, 1);
  }, [vehicles]);

  // Get selected vehicle
  const selectedVehicle = React.useMemo(() => {
    return vehicles.find((v) => v.id === watchedVehicleId);
  }, [vehicles, watchedVehicleId]);

  // Prepare rental period for price calculator
  const rentalPeriod: RentalPeriod = React.useMemo(() => {
    return {
      startDate: watchedStartDate ? new Date(watchedStartDate) : new Date(),
      endDate: watchedEndDate ? new Date(watchedEndDate) : new Date(),
    };
  }, [watchedStartDate, watchedEndDate]);

  // Determine active step based on filled fields
  React.useEffect(() => {
    const name = watch('customerName');
    const email = watch('email');
    const phone = watch('phone');

    if (watchedStartDate && watchedEndDate) {
      setActiveStep(4);
    } else if (watchedVehicleId) {
      setActiveStep(3);
    } else if (name && email && phone) {
      setActiveStep(2);
    } else {
      setActiveStep(1);
    }
  }, [
    watch('customerName'),
    watch('email'),
    watch('phone'),
    watchedVehicleId,
    watchedStartDate,
    watchedEndDate,
  ]);

  // Validate date range
  const validateDateRange = (): boolean => {
    if (!watchedStartDate || !watchedEndDate) return true;

    const start = new Date(watchedStartDate);
    const end = new Date(watchedEndDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (start < now) {
      showNotification('Tanggal mulai tidak boleh di masa lalu', 'error');
      return false;
    }

    if (end <= start) {
      showNotification('Tanggal selesai harus setelah tanggal mulai', 'error');
      return false;
    }

    return true;
  };

  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Validate date range
      if (!validateDateRange()) {
        setIsSubmitting(false);
        return;
      }

      // Clean phone number (remove spaces and dashes)
      const cleanedPhone = data.phone.replace(/[-\s]/g, '');

      // Create booking request
      const booking: BookingRequest = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerName: data.customerName,
        email: data.email,
        phone: cleanedPhone,
        vehicleId: data.vehicleId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        withDriver: data.withDriver,
        totalPrice: totalPrice,
        createdAt: new Date(),
        status: 'pending',
      };

      // Save to store (which also saves to localStorage)
      addBooking(booking);

      // Show success notification
      showNotification('Booking berhasil disimpan!', 'success');

      // Call success callback
      if (onSubmitSuccess) {
        onSubmitSuccess(booking);
      }
    } catch (error) {
      console.error('Error submitting booking form:', error);
      showNotification('Terjadi kesalahan saat menyimpan booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  // Today's date string for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`.trim()}>
      {/* Hero Banner with Car Image */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/8 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-fuchsia-500/5 rounded-full filter blur-[60px]" />

        <div className="relative grid md:grid-cols-[1fr_1fr] items-center">
          <div className="p-6 md:p-8 space-y-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="h-3 w-3" />
              Formulir Pemesanan
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Pesan Kendaraan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                Impian Anda
              </span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Isi formulir di bawah untuk memesan armada premium pilihan Anda. Proses cepat dan
              konfirmasi instan via WhatsApp.
            </p>
          </div>
          <div className="relative h-48 md:h-64 overflow-hidden">
            {bookingHeroVehicles.map((vehicle, index) => (
              <img
                key={vehicle.id}
                src={vehicle.images[0]}
                alt={vehicle.name}
                className="hero-rotator-item absolute inset-0 h-full w-full scale-110 object-contain object-center opacity-80 drop-shadow-[0_18px_45px_rgba(6,182,212,0.12)] md:scale-125 md:opacity-100"
                style={{ animationDelay: `${index * 4}s` }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent md:from-slate-950/80 md:via-transparent" />
          </div>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between gap-2 p-4 rounded-xl border border-white/[0.04] bg-zinc-900/40 backdrop-blur-sm">
        <StepIndicator
          step={1}
          label="Data Diri"
          isActive={activeStep === 1}
          isCompleted={activeStep > 1}
        />
        <StepIndicator
          step={2}
          label="Pilih Mobil"
          isActive={activeStep === 2}
          isCompleted={activeStep > 2}
        />
        <StepIndicator
          step={3}
          label="Jadwal"
          isActive={activeStep === 3}
          isCompleted={activeStep > 3}
        />
        <StepIndicator
          step={4}
          label="Konfirmasi"
          isActive={activeStep === 4}
          isCompleted={false}
        />
      </div>

      {/* Personal Info Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Informasi Pribadi
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Data penyewa utama</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <FormField label="Nama Lengkap" icon={User} error={errors.customerName?.message} required>
            <input
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300"
              {...register('customerName')}
            />
          </FormField>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Email" icon={Mail} error={errors.email?.message} required>
              <input
                type="email"
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300"
                {...register('email')}
              />
            </FormField>

            <FormField label="Nomor Telepon" icon={Phone} error={errors.phone?.message} required>
              <input
                type="tel"
                placeholder="08123456789"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300"
                {...register('phone')}
              />
              <p className="text-[10px] text-zinc-600 mt-1 font-medium">Format: 08xx-xxxx-xxxx</p>
            </FormField>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Car className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Pilih Kendaraan
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                Tersedia {vehicles.length} armada
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <FormField label="Kendaraan" icon={Car} error={errors.vehicleId?.message} required>
            <select
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
              {...register('vehicleId')}
            >
              <option value="" className="bg-zinc-900 text-zinc-400">
                — Pilih kendaraan —
              </option>
              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                  disabled={vehicle.availabilityStatus === 'unavailable'}
                  className="bg-zinc-900 text-white"
                >
                  {vehicle.name} — {formatCurrency(vehicle.dailyRate)}/hari
                </option>
              ))}
            </select>
          </FormField>

          {/* Selected Vehicle Card */}
          {selectedVehicle && (
            <div className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 to-slate-900/60 overflow-hidden transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
              <div className="grid md:grid-cols-[280px_1fr] gap-0">
                {/* Vehicle Image */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-zinc-900 md:h-full md:min-h-[300px]">
                  {selectedVehicle.images[0] && (
                    <img
                      src={selectedVehicle.images[0]}
                      alt={selectedVehicle.name}
                      className="h-full w-full scale-110 object-contain object-center p-1 md:scale-[1.18] md:p-3"
                      onError={(e) => {
                        e.currentTarget.src = '/images/booking-hero-car.png';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900/30" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[9px] font-black uppercase tracking-widest text-cyan-400">
                    {selectedVehicle.category}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-white">{selectedVehicle.name}</h4>
                    <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 mt-1">
                      {formatCurrency(selectedVehicle.dailyRate)}
                      <span className="text-xs text-zinc-500 font-semibold"> / hari</span>
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        icon: Users,
                        label: 'Kapasitas',
                        value: `${selectedVehicle.specifications.seats} Kursi`,
                      },
                      {
                        icon: Gauge,
                        label: 'Transmisi',
                        value:
                          selectedVehicle.specifications.transmission === 'automatic'
                            ? 'Otomatis'
                            : 'Manual',
                      },
                      {
                        icon: Fuel,
                        label: 'BBM',
                        value:
                          selectedVehicle.specifications.fuelType.charAt(0).toUpperCase() +
                          selectedVehicle.specifications.fuelType.slice(1),
                      },
                      {
                        icon: Briefcase,
                        label: 'Bagasi',
                        value: `${selectedVehicle.specifications.luggage} Koper`,
                      },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/40 border border-zinc-800/60"
                      >
                        <spec.icon className="h-3.5 w-3.5 text-cyan-500/60 shrink-0" />
                        <div>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                            {spec.label}
                          </p>
                          <p className="text-xs text-zinc-200 font-bold">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  {selectedVehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVehicle.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 rounded-md bg-zinc-800/50 border border-zinc-700/40 text-[10px] font-semibold text-zinc-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rental Period Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Periode Rental
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                Jadwal sewa kendaraan
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Tanggal Mulai"
              icon={CalendarDays}
              error={errors.startDate?.message}
              required
            >
              <input
                type="date"
                min={todayStr}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300 [color-scheme:dark]"
                {...register('startDate')}
              />
            </FormField>

            <FormField
              label="Tanggal Selesai"
              icon={CalendarDays}
              error={errors.endDate?.message}
              required
            >
              <input
                type="date"
                min={watchedStartDate || todayStr}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-800/80 transition-all duration-300 [color-scheme:dark]"
                {...register('endDate')}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Driver Option Section */}
      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Opsi Sopir</h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Layanan tambahan</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Controller
            name="withDriver"
            control={control}
            render={({ field }) => (
              <label
                htmlFor="withDriver"
                className={`
                  flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300
                  ${
                    field.value
                      ? 'border-cyan-500/30 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]'
                      : 'border-zinc-800/50 bg-zinc-900/20 hover:border-zinc-700/50'
                  }
                `}
              >
                {/* Custom Toggle Switch */}
                <div className="relative shrink-0">
                  <input
                    type="checkbox"
                    id="withDriver"
                    checked={field.value}
                    onChange={field.onChange}
                    className="sr-only peer"
                  />
                  <div
                    className={`
                    w-12 h-7 rounded-full transition-all duration-300
                    ${
                      field.value
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-zinc-700'
                    }
                  `}
                  />
                  <div
                    className={`
                    absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300
                    ${field.value ? 'left-[22px]' : 'left-0.5'}
                  `}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">Dengan Sopir Profesional</span>
                    {field.value && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Tambahan <span className="text-cyan-400 font-bold">Rp 150.000</span>/hari —
                    sopir berpengalaman yang menguasai rute Balikpapan & IKN
                  </p>
                </div>
              </label>
            )}
          />
        </div>
      </div>

      {/* Price Calculator */}
      {watchedVehicleId && watchedStartDate && watchedEndDate && (
        <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Rincian Harga
                </h3>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                  Estimasi biaya sewa transparan
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <PriceCalculator
              vehicleId={watchedVehicleId}
              rentalPeriod={rentalPeriod}
              withDriver={watchedWithDriver}
              onChange={setTotalPrice}
              className="!bg-transparent !border-0 !p-0"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !watchedVehicleId || !watchedStartDate || !watchedEndDate}
          className={`
            relative w-full min-h-[56px] flex items-center justify-center gap-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300
            ${
              isSubmitting || !watchedVehicleId || !watchedStartDate || !watchedEndDate
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:scale-[1.01] active:scale-[0.99] glow-cyan-btn'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Memproses Booking...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Konfirmasi Booking Sewa</span>
            </>
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1">
        {['Tanpa Biaya Tersembunyi', 'Konfirmasi Cepat', 'Pembatalan Gratis'].map((badge) => (
          <div
            key={badge}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-500/60" />
            {badge}
          </div>
        ))}
      </div>

      {/* Terms and conditions */}
      <div className="text-[10px] text-zinc-600 text-center leading-relaxed">
        Dengan melakukan booking, Anda menyetujui{' '}
        <a
          href="/terms"
          className="text-cyan-500/70 hover:text-cyan-400 underline underline-offset-2 transition-colors"
        >
          syarat dan ketentuan
        </a>{' '}
        yang berlaku.
      </div>
    </form>
  );
};
