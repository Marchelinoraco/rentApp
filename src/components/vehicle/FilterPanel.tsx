import React from 'react';
import type { VehicleFilters, VehicleCategory } from '@/types/vehicle';
import { Select } from '@/components/ui/Select';

export interface FilterPanelProps {
  filters: VehicleFilters;
  onFilterChange: (filters: VehicleFilters) => void;
}

/**
 * FilterPanel component for filtering vehicles in a premium glassmorphic layout
 * Provides category, price range, and availability filters with instant reactive updates
 * Requirements: 1.3, 10.3
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  // Category options
  const categoryOptions: { value: VehicleCategory; label: string }[] = [
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'mpv', label: 'MPV' },
    { value: 'suv', label: 'SUV' },
    { value: 'luxury', label: 'Luxury VIP' },
  ];

  // Price range presets
  const priceRangeOptions = [
    { value: '', label: 'Semua Harga' },
    { value: '0-300000', label: 'Di bawah Rp 300.000' },
    { value: '300000-500000', label: 'Rp 300.000 - Rp 500.000' },
    { value: '500000-800000', label: 'Rp 500.000 - Rp 800.000' },
    { value: '800000-999999999', label: 'Di atas Rp 800.000' },
  ];

  const panelFilters: VehicleFilters = {
    category: filters.category,
    priceRange: filters.priceRange,
    availability: filters.availability,
  };

  const handleCategoryToggle = (category: VehicleCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    const newFilters = {
      ...panelFilters,
      category: newCategories.length > 0 ? newCategories : undefined,
    };
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (value: string) => {
    if (!value) {
      const newFilters = { ...panelFilters };
      delete newFilters.priceRange;
      onFilterChange(newFilters);
      return;
    }

    const [min, max] = value.split('-').map(Number);
    const newFilters = {
      ...panelFilters,
      priceRange: { min, max },
    };
    onFilterChange(newFilters);
  };

  const handleAvailabilityToggle = () => {
    const newFilters = {
      ...panelFilters,
      availability: !filters.availability,
    };
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.category && filters.category.length > 0) ||
    filters.priceRange !== undefined ||
    filters.availability === true ||
    Boolean(filters.searchQuery?.trim());

  // Get current price range value for select
  const getCurrentPriceRangeValue = (): string => {
    if (!filters.priceRange) return '';
    return `${filters.priceRange.min}-${filters.priceRange.max}`;
  };


  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 space-y-6 border border-white/[0.04] shadow-2xl relative overflow-hidden">
      {/* Decorative radial background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-base font-black text-white uppercase tracking-wider">Filter Pencarian</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            aria-label="Hapus semua filter"
          >
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Kategori</h3>
        <div className="grid grid-cols-2 gap-2">
          {categoryOptions.map((option) => {
            const isSelected = filters.category?.includes(option.value) || false;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleCategoryToggle(option.value)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold text-center border transition-all duration-300 ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'bg-slate-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
                aria-label={`Filter kategori ${option.label}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 relative z-10">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Rentang Tarif</h3>
        <Select
          options={priceRangeOptions}
          value={getCurrentPriceRangeValue()}
          onChange={(e) => handlePriceRangeChange(e.target.value)}
          fullWidth
          className="bg-slate-900 border-zinc-800 text-zinc-200 focus:ring-cyan-500 focus:border-cyan-500 rounded-xl text-xs h-10"
          aria-label="Pilih rentang harga"
        />
      </div>

      {/* Availability Filter */}
      <div className="relative z-10">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.availability || false}
            onChange={handleAvailabilityToggle}
            className="w-4 h-4 text-cyan-500 border-zinc-800 bg-slate-900 rounded focus:ring-cyan-500/20 cursor-pointer accent-cyan-500"
            aria-label="Hanya tampilkan kendaraan yang tersedia"
          />
          <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors select-none">
            Hanya yang tersedia
          </span>
        </label>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-zinc-800/80 relative z-10">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2.5">Filter Aktif</p>
          <div className="flex flex-wrap gap-1.5">
            {filters.category?.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded-lg border border-cyan-500/20"
              >
                {categoryOptions.find((o) => o.value === cat)?.label}
                <button
                  onClick={() => handleCategoryToggle(cat)}
                  className="hover:text-white transition-colors"
                  aria-label={`Hapus filter ${cat}`}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            {filters.priceRange && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded-lg border border-cyan-500/20">
                Rp {filters.priceRange.min / 1000}k - {filters.priceRange.max > 9999999 ? '∞' : `${filters.priceRange.max / 1000}k`}
              </span>
            )}
            {filters.availability && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded-lg border border-cyan-500/20">
                Tersedia
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded-lg border border-cyan-500/20">
                Cari: {filters.searchQuery}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
