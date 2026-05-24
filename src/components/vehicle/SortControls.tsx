import React from 'react';
import type { SortOption } from '@/types/vehicle';
import { Select } from '@/components/ui/Select';

export interface SortControlsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  resultCount?: number;
}

/**
 * SortControls component for sorting vehicles in dark themed premium layout
 * Provides sorting by price and name in ascending/descending order
 * Requirements: 1.4
 */
export const SortControls: React.FC<SortControlsProps> = ({
  sortOption,
  onSortChange,
  resultCount,
}) => {
  const sortOptions = [
    { value: 'name-asc', label: 'Nama: A-Z' },
    { value: 'name-desc', label: 'Nama: Z-A' },
    { value: 'price-asc', label: 'Tarif Sewa: Terendah' },
    { value: 'price-desc', label: 'Tarif Sewa: Tertinggi' },
  ];

  const getCurrentSortValue = (): string => {
    return `${sortOption.field}-${sortOption.order}`;
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [
      'price' | 'name',
      'asc' | 'desc'
    ];
    onSortChange({ field, order });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Result Count */}
      {resultCount !== undefined && (
        <div className="text-xs font-semibold text-zinc-400">
          Menampilkan <span className="font-black text-cyan-400">{resultCount}</span> pilihan armada terbaik
        </div>
      )}

      {/* Sort Dropdown */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="sort-select"
          className="text-xs font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap"
        >
          Urutan:
        </label>
        <Select
          id="sort-select"
          options={sortOptions}
          value={getCurrentSortValue()}
          onChange={(e) => handleSortChange(e.target.value)}
          className="min-w-[180px] bg-slate-900 border-zinc-800 text-zinc-200 focus:ring-cyan-500 focus:border-cyan-500 rounded-xl text-xs h-10"
          aria-label="Pilih urutan tampilan"
        />
      </div>
    </div>
  );
};

