import React, { FormEvent } from 'react';
import { ArrowUpDown, Check, Search, Sparkles, Star } from 'lucide-react';
import type { CategoryItem } from '../VendorCategoryPage/CategoriesGrid';
import { VENDOR_FILTER_CITIES } from '../VendorCategoryPage/vendorCityFilter';

export interface VendorSearchDraft {
  query: string;
  categoryId: string;
  city: string;
  sortBy: '' | 'rating' | 'time' | 'costAsc' | 'costDesc' | 'distance';
  ratingFilter: '' | 'top48';
  offersFilter: '' | 'offers';
}

interface VendorSearchBarProps {
  categories: CategoryItem[];
  draft: VendorSearchDraft;
  onDraftChange: (draft: VendorSearchDraft) => void;
  onSearch: () => void;
  onClear: () => void;
}

const selectClass =
  'text-xs font-bold bg-transparent border border-orange-100 dark:border-stone-700 dark:bg-stone-800 p-1.5 rounded-lg text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer min-w-[7.5rem]';

export const VendorSearchBar: React.FC<VendorSearchBarProps> = ({
  categories,
  draft,
  onDraftChange,
  onSearch,
  onClear,
}) => {
  const patch = (partial: Partial<VendorSearchDraft>) => {
    onDraftChange({ ...draft, ...partial });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const hasDraftFilters = Boolean(
    draft.query.trim() ||
      draft.categoryId ||
      draft.city ||
      draft.sortBy ||
      draft.ratingFilter ||
      draft.offersFilter
  );

  const inputClass =
    'w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-20 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur shadow-sm p-4 rounded-xl border border-orange-100/40 dark:border-stone-800 flex flex-col gap-4"
      id="vendor-filters-ribbon"
      aria-labelledby="vendor-filters-ribbon-heading"
    >
      <h2 id="vendor-filters-ribbon-heading" className="sr-only">
        Search and filter vendors
      </h2>

      <div className="relative w-full">
        <label htmlFor="vendor-filter-search" className="sr-only">
          Search vendors
        </label>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary dark:text-orange-400 pointer-events-none"
          aria-hidden
        />
        <input
          id="vendor-filter-search"
          type="search"
          value={draft.query}
          onChange={(e) => patch({ query: e.target.value })}
          placeholder="Search vendor name, service, or locality..."
          className={inputClass}
        />
        {draft.query ? (
          <button
            type="button"
            onClick={() => patch({ query: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            patch({ ratingFilter: draft.ratingFilter === 'top48' ? '' : 'top48' })
          }
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            draft.ratingFilter === 'top48'
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>4.8+ rated</span>
          {draft.ratingFilter === 'top48' && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() =>
            patch({ offersFilter: draft.offersFilter === 'offers' ? '' : 'offers' })
          }
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
            draft.offersFilter === 'offers'
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Offers &amp; deals</span>
          {draft.offersFilter === 'offers' && <Check className="w-3.5 h-3.5" />}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 font-mono">
            Category:
          </span>
          <select
            id="vendor-filter-category"
            value={draft.categoryId}
            onChange={(e) => patch({ categoryId: e.target.value })}
            className={selectClass}
            aria-label="Category"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 font-mono">
            City:
          </span>
          <select
            id="vendor-filter-city"
            value={draft.city}
            onChange={(e) => patch({ city: e.target.value })}
            className={selectClass}
            aria-label="City"
          >
            <option value="">All cities</option>
            {VENDOR_FILTER_CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-orange-600 shrink-0" aria-hidden />
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">Sort by:</span>
        <select
          id="vendor-filter-sort"
          value={draft.sortBy}
          onChange={(e) =>
            patch({
              sortBy: e.target.value as VendorSearchDraft['sortBy'],
            })
          }
          className={selectClass}
          aria-label="Sort by"
        >
          <option value="">Popularity / standard</option>
          <option value="rating">Top rated</option>
          <option value="time">Fastest response</option>
          <option value="costAsc">Price: low to high</option>
          <option value="costDesc">Price: high to low</option>
          <option value="distance">Distance: nearest</option>
        </select>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 shrink-0" aria-hidden />
          Search
        </button>

        {hasDraftFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
          >
            Reset all
          </button>
        )}
      </div>
      </div>
    </form>
  );
};
