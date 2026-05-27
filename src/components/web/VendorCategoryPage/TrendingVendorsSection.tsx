import React, { useMemo } from 'react';
import { ArrowRight, Flame, MapPin, Star, TrendingUp } from 'lucide-react';
import { WEDDING_CATEGORIES, CategoryItem } from './CategoriesGrid';
import { ALL_MOCK_VENDORS } from './mockData';
import { ListingCardItem } from './VendorGridCard';

/** Trending vendors are shown from these 1–2 categories only */
export const TRENDING_VENDOR_CATEGORY_IDS = ['venues', 'photographers'] as const;

const VENDORS_PER_ROW = 5;

interface TrendingVendorsSectionProps {
  onSelectCategory: (cat: CategoryItem) => void;
  onSelectVendor: (vendor: ListingCardItem) => void;
}

interface TrendingVendorCardProps {
  vendor: ListingCardItem;
  rank: number;
  onClick: () => void;
}

const TrendingVendorCard: React.FC<TrendingVendorCardProps> = ({ vendor, rank, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white dark:bg-stone-800 border border-orange-100/50 dark:border-stone-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left cursor-pointer"
    >
      <div className="relative h-28 sm:h-32 shrink-0 bg-stone-100 dark:bg-stone-900 overflow-hidden">
        <img
          src={vendor.image}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-bold shadow">
          <TrendingUp className="w-2.5 h-2.5" aria-hidden />#{rank}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3 min-w-0">
        <h4 className="font-bold text-[11px] sm:text-xs text-stone-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#C51C13] dark:group-hover:text-orange-400 transition-colors min-h-[2.5rem]">
          {vendor.name}
        </h4>
        <p className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
          <MapPin className="w-2.5 h-2.5 text-orange-500 shrink-0" aria-hidden />
          <span className="truncate">{vendor.location}</span>
        </p>
        <div className="flex items-center justify-between gap-1 mt-auto pt-1">
          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-green-700 dark:text-green-400">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" aria-hidden />
            {vendor.rating.toFixed(1)}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-orange-600 dark:text-orange-400 truncate max-w-[55%]">
            {vendor.price}
          </span>
        </div>
      </div>
    </button>
  );
};

export const TrendingVendorsSection: React.FC<TrendingVendorsSectionProps> = ({
  onSelectCategory,
  onSelectVendor,
}) => {
  const trendingByCategory = useMemo(() => {
    return TRENDING_VENDOR_CATEGORY_IDS.map((categoryId) => {
      const cat = WEDDING_CATEGORIES.find((c) => c.id === categoryId);
      const vendors = ALL_MOCK_VENDORS.filter((v) => v.category === categoryId)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, VENDORS_PER_ROW);
      return cat && vendors.length > 0 ? { cat, vendors } : null;
    }).filter((row): row is NonNullable<typeof row> => row !== null);
  }, []);

  if (trendingByCategory.length === 0) return null;

  return (
    <section
      className="space-y-6 pt-4 border-t border-stone-200 dark:border-stone-800"
      id="trending-vendors-section"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden />
          <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400">
            Trending vendors
          </span>
        </div>
        <h3 className="heading-section text-lg sm:text-xl text-stone-900 dark:text-white">
          Top picks in {trendingByCategory.map(({ cat }) => cat.name).join(' & ')}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Highly rated vendors from our most booked categories this season.
        </p>
      </div>

      <div className="space-y-8">
        {trendingByCategory.map(({ cat, vendors }) => (
          <div key={cat.id} className="space-y-3" id={`trending-vendors-${cat.id}`}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
                {cat.name}
              </h4>
              <button
                type="button"
                onClick={() => onSelectCategory(cat)}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer shrink-0"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 items-stretch">
              {vendors.map((vendor, index) => (
                <TrendingVendorCard
                  key={vendor.id}
                  vendor={vendor}
                  rank={index + 1}
                  onClick={() => onSelectVendor(vendor)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
