import React from 'react';
import { Heart, Star, Clock } from 'lucide-react';
import { VendorDetailProfile } from './vendorServicesData';
import { getCategoryLabel } from '../../../vendorCategories';
import { formatStateDistrict } from '../../../indiaLocations';

interface VendorDetailHeroProps {
  vendor: VendorDetailProfile;
  isFavorite: boolean;
  setIsFavorite: (fav: boolean) => void;
}

function categoryLabel(categoryId: string): string {
  return getCategoryLabel(categoryId) || 'Vendor';
}

export const VendorDetailHero: React.FC<VendorDetailHeroProps> = ({
  vendor,
  isFavorite,
  setIsFavorite,
}) => {
  const category = categoryLabel(vendor.category);

  return (
    <section
      className="bg-white dark:bg-stone-850 rounded-3xl overflow-hidden shadow-lg border border-orange-100/30 dark:border-stone-800"
      id="detail-vendor-hero"
    >
      <div className="h-48 relative bg-stone-900">
        {vendor.image ? (
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-full object-cover filter brightness-[0.75]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-full h-full bg-stone-900"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white transition-all shadow-md active:scale-95 cursor-pointer"
          aria-label={isFavorite ? 'Remove from saved' : 'Save vendor'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-6 sm:p-8 -mt-10 relative bg-white dark:bg-stone-850 rounded-t-3xl border-t border-orange-50 dark:border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
              ✓ VERIFIED {category.toUpperCase()}
            </span>
            <h2 className="serif text-2xl sm:text-3xl font-black italic text-[#C51C13] dark:text-white">
              {vendor.name}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">{category}</p>
            <p className="text-xs text-stone-400">
              {vendor.businessAddress
                ? `Address: ${vendor.businessAddress}${
                    vendor.state && vendor.district
                      ? `, ${formatStateDistrict(vendor.state, vendor.district)}`
                      : ''
                  }`
                : vendor.state && vendor.district
                  ? `Location: ${formatStateDistrict(vendor.state, vendor.district)}`
                  : `Location: ${vendor.location}`}
            </p>
            {vendor.villagesServed && vendor.villagesServed.length > 0 && (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Villages served: {vendor.villagesServed.join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 bg-orange-50/50 dark:bg-stone-900 p-4 rounded-2xl border border-orange-100/40 dark:border-stone-800 shrink-0">
            <div className="text-center pr-4 border-r border-orange-200/40">
              <div className="flex items-center justify-center gap-1 font-black text-green-700 dark:text-green-400 text-lg">
                <Star className="w-5 h-5 fill-current shrink-0 text-amber-500" />
                <span>{vendor.rating.toFixed(1)}</span>
              </div>
              <a
                href="#vendor-reviews-section"
                className="text-[10px] font-semibold text-stone-400 mt-0.5 hover:text-orange-600 dark:hover:text-orange-400 underline-offset-2 hover:underline"
              >
                {vendor.ratingCount}+ ratings
              </a>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 font-black text-stone-800 dark:text-stone-200 text-lg">
                <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{vendor.responseTime}</span>
              </div>
              <div className="text-[10px] font-semibold text-stone-400 mt-0.5">Quote response</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-bold text-stone-605 dark:text-stone-300 border-t border-stone-102 dark:border-stone-800 pt-4">
          <span>
            Distance:{' '}
            <b className="text-stone-800 dark:text-white font-black">{vendor.distance.toFixed(1)} km</b>
          </span>
          <span>•</span>
          <span>
            Starting: <b className="text-stone-800 dark:text-white font-black">{vendor.price}</b>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 block" /> Shubhe verified vendor
          </span>
        </div>
      </div>
    </section>
  );
};
