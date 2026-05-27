import React from 'react';
import { Search } from 'lucide-react';

interface ServiceCategoryToggleListProps {
  serviceCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  serviceSearch: string;
  setServiceSearch: (search: string) => void;
}

export const ServiceCategoryToggleList: React.FC<ServiceCategoryToggleListProps> = ({
  serviceCategories,
  selectedCategory,
  setSelectedCategory,
  serviceSearch,
  setServiceSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
      <div className="flex flex-wrap items-center gap-2 self-start">
        {serviceCategories.map((catName) => (
          <button
            key={catName}
            type="button"
            onClick={() => setSelectedCategory(catName)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === catName
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-white hover:bg-orange-50 dark:bg-stone-850 dark:hover:bg-stone-805 text-stone-700 dark:text-stone-300 border border-orange-100/45 dark:border-stone-800'
            }`}
          >
            {catName}
          </button>
        ))}
      </div>

      <div className="w-full sm:max-w-xs relative bg-white dark:bg-stone-850 p-1.5 rounded-xl border border-orange-100 dark:border-stone-800">
        <label htmlFor="vendor-service-search" className="sr-only">
          Search services
        </label>
        <input
          id="vendor-service-search"
          type="search"
          placeholder="Search service name..."
          value={serviceSearch}
          onChange={(e) => setServiceSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1 text-xs text-stone-900 dark:text-white bg-transparent outline-none focus:outline-none"
        />
        <Search className="absolute left-3 top-3 w-4 h-4 text-orange-600" aria-hidden />
      </div>
    </div>
  );
};
