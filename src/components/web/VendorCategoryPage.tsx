import React, { useMemo } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { APP_NAME } from '../../brand';
import { useVendorCategories } from '../../hooks/useVendorCategories';
import { CategoriesGrid, CategoryItem } from './VendorCategoryPage/CategoriesGrid';
import { TrendingVendorsSection } from './VendorCategoryPage/TrendingVendorsSection';
import { getCityLabel } from './VendorCategoryPage/vendorCityFilter';

interface VendorCategoryPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  isDarkMode: boolean;
  initialCity?: string;
}

export const VendorCategoryPage: React.FC<VendorCategoryPageProps> = ({
  onNavigate,
  initialCity = '',
}) => {
  const cityLabel = useMemo(() => getCityLabel(initialCity), [initialCity]);
  const { categories, loading } = useVendorCategories();

  const handleSelectCategory = (cat: CategoryItem) => {
    onNavigate('vendor-list', { categoryId: cat.id, city: initialCity });
  };

  const handleSelectVendor = (vendorId: string, categoryId: string) => {
    onNavigate('vendor-details', { vendorId, categoryId });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900" id="vendor-category-page">
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] font-semibold text-primary">{APP_NAME} marketplace</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-2">
            <div className="space-y-2 max-w-xl">
              <h1 className="heading-page text-3xl sm:text-4xl text-stone-900 dark:text-white">
                Browse vendor categories
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Pick a service to compare vendors, filter by city, and request quotes.
              </p>
              {initialCity && (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden />
                  {cityLabel}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('vendor-list', { city: initialCity })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg transition cursor-pointer"
            >
              View all vendors
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
          <h2 className="heading-section text-xl sm:text-2xl text-stone-900 dark:text-white">
            Vendor categories
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {loading ? 'Loading…' : `${categories.length} service types`}
          </p>
        </div>

        <CategoriesGrid
          categories={categories}
          loading={loading}
          selectedCategoryId={null}
          onSelectCategory={handleSelectCategory}
        />

        <TrendingVendorsSection
          categories={categories}
          city={initialCity}
          onSelectCategory={handleSelectCategory}
          onSelectVendor={(vendor) => handleSelectVendor(vendor.id, vendor.category)}
        />
      </div>
    </div>
  );
};
