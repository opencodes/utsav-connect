import React from 'react';
import { ArrowUpDown, Check, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { getCityLabel, VENDOR_FILTER_CITIES } from './vendorCityFilter';

interface VendorFiltersRibbonProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  filterRating48: boolean;
  onToggleRating48: () => void;
  sortByOption: 'rating' | 'costAsc' | 'costDesc' | null;
  onSortChange: (sort: 'rating' | 'costAsc' | 'costDesc' | null) => void;
  resultCount: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const VendorFiltersRibbon: React.FC<VendorFiltersRibbonProps> = ({
  selectedCity,
  onCityChange,
  filterRating48,
  onToggleRating48,
  sortByOption,
  onSortChange,
  resultCount,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div
      className="sticky top-[4.25rem] z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur border-y border-stone-200/80 dark:border-stone-800"
      id="vendor-filters-ribbon"
    >
      <div className="flex flex-col gap-3 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#C51C13] shrink-0" aria-hidden />

            <label htmlFor="vendor-city-filter" className="sr-only">
              Filter by city
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C51C13] pointer-events-none"
                aria-hidden
              />
              <select
                id="vendor-city-filter"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-800 dark:text-stone-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C51C13]"
              >
                <option value="">All cities</option>
                {VENDOR_FILTER_CITIES.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onToggleRating48}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                filterRating48
                  ? 'bg-[#C51C13] text-white border-[#C51C13]'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
              }`}
            >
              <span>Top rated 4.8+</span>
              {filterRating48 && <Check className="w-3.5 h-3.5" aria-hidden />}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-stone-500 hover:text-[#C51C13] flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#C51C13] shrink-0" aria-hidden />
            <label htmlFor="vendor-sort" className="text-xs font-semibold text-stone-500 sr-only sm:not-sr-only">
              Sort
            </label>
            <select
              id="vendor-sort"
              value={sortByOption || ''}
              onChange={(e) =>
                onSortChange((e.target.value as 'rating' | 'costAsc' | 'costDesc') || null)
              }
              className="py-1.5 px-3 text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C51C13]"
            >
              <option value="">Recommended</option>
              <option value="rating">Highest rated</option>
              <option value="costAsc">Price: low to high</option>
              <option value="costDesc">Price: high to low</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-stone-700 dark:text-stone-200">{resultCount}</span>{' '}
          {resultCount === 1 ? 'vendor' : 'vendors'}
          {selectedCity ? ` in ${getCityLabel(selectedCity)}` : ''}
        </p>
      </div>
    </div>
  );
};
