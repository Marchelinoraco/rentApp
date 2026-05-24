import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  initialValue?: string;
}

/**
 * SearchBar component with debounced search input
 * Implements search term highlighting and real-time search in dark themed premium layout
 * Requirements: 1.5, 10.1, 10.2, 10.5
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Cari kendaraan berdasarkan nama, kategori, atau spesifikasi...',
  debounceMs = 300,
  initialValue = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  // Sync external resets into both local states.
  useEffect(() => {
    setSearchQuery(initialValue);
    setDebouncedQuery(initialValue);
  }, [initialValue]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const isSearching = searchQuery !== debouncedQuery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-20">
          <svg
            className="h-5 w-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          fullWidth
          className="pl-11 pr-20 bg-slate-900 border-zinc-800 text-white placeholder-zinc-500 focus:ring-cyan-500/20 focus:border-cyan-500 rounded-xl h-11 text-xs"
          aria-label="Cari kendaraan"
          aria-describedby="search-description"
        />

        {/* Loading Indicator / Clear Button */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 gap-2 z-20">
          {isSearching && searchQuery && (
            <div
              className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"
              aria-label="Mencari..."
            />
          )}
          
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Hapus pencarian"
            >
              <svg
                className="h-4 w-4"
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
          )}
        </div>
      </div>

      {/* Screen reader description */}
      <p id="search-description" className="sr-only">
        Ketik untuk mencari kendaraan. Hasil akan muncul secara otomatis saat Anda mengetik.
      </p>

      {/* Search Tips in Dark Theme */}
      {!searchQuery && (
        <div className="mt-2.5 text-[11px] text-zinc-500 font-medium">
          <p>
            💡 <strong className="text-zinc-400">Tips:</strong> Coba cari armada populer seperti <span className="text-cyan-400/80 hover:text-cyan-400 cursor-pointer">"Fortuner"</span>, <span className="text-cyan-400/80 hover:text-cyan-400 cursor-pointer">"Hiace"</span>, atau kategori <span className="text-cyan-400/80 hover:text-cyan-400 cursor-pointer">"Luxury"</span>
          </p>
        </div>
      )}
    </form>
  );
};
