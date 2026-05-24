import React from 'react';
import { Fuel, Gauge, Users, ArrowRight } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';
import { Card } from '@/components/ui/Card';

export interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
}

/**
 * VehicleCard component displays vehicle information in an elevated premium card format
 * Shows vehicle name, category, image, daily rate, specifications and availability status
 * Requirements: 1.1, 1.6
 */
export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const isAvailable = vehicle.availabilityStatus === 'available';

  const handleClick = () => {
    if (!isAvailable) return;
    onSelect(vehicle.id);
  };

  // Format price to Indonesian Rupiah format
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const placeholder = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%23050505"/%3E%3Cstop offset="1" stop-color="%230e7490"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="640" height="420"/%3E%3Cg fill="none" stroke="%2306b6d4" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M112 254h414l-43-88c-12-25-37-40-65-40H239c-28 0-53 15-65 40l-62 88Z"/%3E%3Ccircle cx="212" cy="284" r="34"/%3E%3Ccircle cx="459" cy="284" r="34"/%3E%3C/g%3E%3Ctext x="320" y="82" text-anchor="middle" fill="%2322d3ee" font-family="system-ui, sans-serif" font-size="28" font-weight="700"%3E${encodeURIComponent(vehicle.name)}%3C/text%3E%3C/svg%3E`;

  return (
    <Card
      padding="none"
      shadow="none"
      className={`premium-card group flex flex-col h-full ${
        isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
      }`}
      onClick={isAvailable ? handleClick : undefined}
    >
      {/* Decorative Glow inside Card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full filter blur-xl group-hover:bg-cyan-500/10 transition-all duration-300" />
      
      {/* Vehicle Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-900/50 border-b border-zinc-800">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.name} - ${vehicle.category}`}
          className="h-full w-full object-contain p-5 transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = placeholder;
          }}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold shadow-lg ${
              isAvailable
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md'
                : 'bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-md'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {isAvailable ? 'Tersedia' : 'Sewa Penuh'}
          </span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className="inline-flex items-center rounded-lg bg-slate-950/80 border border-zinc-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 backdrop-blur-md"
          >
            {vehicle.category}
          </span>
        </div>
      </div>

      {/* Info Details Section */}
      <div className="p-5 flex-1 flex flex-col relative z-20 bg-slate-950/20">
        <h3 className="mb-4 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-1">
          {vehicle.name}
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-400 font-semibold mb-5">
          <div className="rounded-xl bg-slate-900/60 border border-zinc-800 p-2 text-center flex flex-col items-center justify-center gap-1 group-hover:border-zinc-700/50 transition-colors" title="Kapasitas Penumpang">
            <Users className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span>{vehicle.specifications.seats} Kursi</span>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-zinc-800 p-2 text-center flex flex-col items-center justify-center gap-1 group-hover:border-zinc-700/50 transition-colors" title="Jenis Transmisi">
            <Gauge className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span className="capitalize">{vehicle.specifications.transmission}</span>
          </div>

          <div className="rounded-xl bg-slate-900/60 border border-zinc-800 p-2 text-center flex flex-col items-center justify-center gap-1 group-hover:border-zinc-700/50 transition-colors" title="Bahan Bakar">
            <Fuel className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span className="capitalize">{vehicle.specifications.fuelType}</span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-auto border-t border-zinc-800/80 pt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tarif Sewa / Hari</p>
            <span className="mt-1 block text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
              {formatPrice(vehicle.dailyRate)}
            </span>
          </div>

          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
              isAvailable
                ? 'bg-cyan-500 text-slate-950 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-white/10 group-hover:translate-x-0.5'
                : 'bg-zinc-800 text-zinc-600'
            }`}
          >
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Card>
  );
};
