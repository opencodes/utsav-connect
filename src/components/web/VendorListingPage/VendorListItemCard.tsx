import React from 'react';
import { Star, Clock } from 'lucide-react';
import { VendorListingItem } from './vendorListingData';
import vendorPlaceholder from '../../../assets/vendor-placeholder.png';

interface VendorListItemCardProps {
  vendor: VendorListingItem;
  onClick: () => void;
}

export const VendorListItemCard: React.FC<VendorListItemCardProps> = ({ vendor, onClick }) => {
  const imageSrc = vendor.image || vendorPlaceholder;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all border border-orange-100/40 dark:border-stone-800 cursor-pointer flex flex-col sm:flex-row h-full min-h-[11.5rem] sm:min-h-[10.5rem] group"
    >
      <div className="relative w-full sm:w-48 h-44 sm:h-auto sm:self-stretch shrink-0 overflow-hidden bg-stone-100">
        <img
          src={imageSrc}
          alt={vendor.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {vendor.offerText && (
          <div className="absolute bottom-2 left-2 bg-[#C51C13] text-white font-bold text-[10px] px-2 py-1 rounded shadow line-clamp-2 max-w-[90%]">
            {vendor.offerText}
          </div>
        )}
        {vendor.isTopRated && (
          <div className="absolute top-2 left-2 bg-green-800 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
            TOP RATED
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col min-h-0 min-w-0 text-left">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
              {vendor.name}
            </h4>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-extrabold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" aria-hidden />
              <span>{vendor.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-1">
            {vendor.categoryLabel} • {vendor.location}
          </p>

          <div className="flex flex-nowrap gap-1 mt-3 min-h-[1.625rem] overflow-hidden">
            {vendor.featuredServices.slice(0, 3).map((service) => (
              <span
                key={service}
                className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full truncate max-w-[7rem] shrink-0"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 mt-3 shrink-0 text-xs font-bold text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" aria-hidden />
            <span>{vendor.responseTimeMins} mins response</span>
          </div>
          <span>{vendor.distance.toFixed(1)} km</span>
          <span className="text-orange-600 dark:text-orange-400">{vendor.price}</span>
        </div>
      </div>
    </div>
  );
};
