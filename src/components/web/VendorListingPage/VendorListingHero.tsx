import React from 'react';
import { Search } from 'lucide-react';
import { APP_NAME } from '../../../brand';

interface VendorListingHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const VendorListingHero: React.FC<VendorListingHeroProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div
      className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-2xl p-6 sm:p-10 shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
      id="vendor-listing-hero"
    >
      <div className="space-y-2 text-center md:text-left z-10">
        <span className="text-yellow-300 font-extrabold text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          🪔 {APP_NAME} vendor marketplace 🪔
        </span>
        <h2 className="serif text-2xl sm:text-3xl font-black italic tracking-normal leading-none">
          Find trusted vendors for your celebration
        </h2>
        <p className="text-orange-50 text-xs sm:text-sm font-semibold max-w-lg">
          Venues, catering, décor, photography, pandits, and more — compare ratings, packages, and
          request quotes.
        </p>
      </div>

      <div className="w-full md:max-w-md relative z-10 bg-white dark:bg-stone-800 p-1.5 rounded-full shadow-lg">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vendor name, service, or locality..."
          className="w-full pl-12 pr-10 py-2.5 bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-full focus:outline-none text-sm"
          aria-label="Search vendors"
        />
        <Search className="absolute left-4.5 top-5 w-4.5 h-4.5 text-orange-600" aria-hidden />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-4 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
