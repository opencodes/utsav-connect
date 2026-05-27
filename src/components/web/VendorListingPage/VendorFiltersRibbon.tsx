import React from 'react';
import { ArrowUpDown, Check, MapPin, Sparkles, Star } from 'lucide-react';
import { VENDOR_FILTER_CITIES } from '../VendorCategoryPage/vendorCityFilter';

interface VendorFiltersRibbonProps {
  filterTopRated: boolean;
  setFilterTopRated: (val: boolean) => void;
  filterOffers: boolean;
  setFilterOffers: (val: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  allCategories: string[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  sortBy: 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance' | null;
  setSortBy: (sort: 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance' | null) => void;
}

export const VendorFiltersRibbon: React.FC<VendorFiltersRibbonProps> = ({
  filterTopRated,
  setFilterTopRated,
  filterOffers,
  setFilterOffers,
  selectedCategory,
  setSelectedCategory,
  allCategories,
  selectedCity,
  setSelectedCity,
  sortBy,
  setSortBy,
}) => {
  return (
    <div
      className="sticky top-20 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur shadow-sm p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4"
      id="vendor-filters-ribbon"
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterTopRated(!filterTopRated)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            filterTopRated
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <Star className="w-3.5 h-3.5 shrink-0" />
          <span>Top rated 4.8+</span>
          {filterTopRated && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setFilterOffers(!filterOffers)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            filterOffers
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Offers & deals</span>
          {filterOffers && <Check className="w-3.5 h-3.5" />}
        </button>

        <div className="relative flex items-center">
          <MapPin className="absolute left-2.5 w-3.5 h-3.5 text-orange-600 pointer-events-none" aria-hidden />
          <label htmlFor="vendor-list-city" className="sr-only">
            City
          </label>
          <select
            id="vendor-list-city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="pl-8 pr-2 py-1.5 text-xs font-bold rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">All cities</option>
            {VENDOR_FILTER_CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase font-mono mr-1">
            Categories:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
            }`}
          >
            All
          </button>
          {allCategories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-orange-600 shrink-0" aria-hidden />
        <span className="text-xs font-bold text-stone-550 dark:text-stone-405">Sort by:</span>
        <select
          value={sortBy || ''}
          onChange={(e) =>
            setSortBy(
              (e.target.value as 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance') || null
            )
          }
          className="text-xs font-bold bg-transparent border border-orange-100 dark:border-stone-700 dark:bg-stone-800 p-1.5 rounded-lg text-stone-750 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
        >
          <option value="">Popularity / standard</option>
          <option value="rating">Top rated (⭐)</option>
          <option value="time">Fastest response (⏱️)</option>
          <option value="costAsc">Price: low to high</option>
          <option value="costDesc">Price: high to low</option>
          <option value="distance">Distance: nearest</option>
        </select>
      </div>
    </div>
  );
};
