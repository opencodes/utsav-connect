import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LandingSection, LandingSectionHeader } from './LandingSection';

const VENDOR_CATEGORIES = [
  { id: 'venues', name: 'Venues & Banquets', icon: '🏰', count: 40 },
  { id: 'food', name: 'Catering & Halwai', icon: '👨‍🍳', count: 25 },
  { id: 'planning-decor', name: 'Decor & Mandap', icon: '🌸', count: 30 },
  { id: 'photographers', name: 'Photo & Video', icon: '📸', count: 15 },
  { id: 'makeup', name: 'Bridal & Beauty', icon: '💄', count: 22 },
  { id: 'music-dance', name: 'Music & Sangeet', icon: '💃', count: 12 },
  { id: 'pandits', name: 'Pandits & Rituals', icon: '🪔', count: 18 },
];

interface VendorCategoriesSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export const VendorCategoriesSection: React.FC<VendorCategoriesSectionProps> = ({ onNavigate }) => {
  return (
    <LandingSection id="vendor-categories-preview" tone="marigold" showTexture={false} showMandala={false}>
      <LandingSectionHeader
        eyebrow="Vendor marketplace"
        title="Browse by service category"
        description="Find trusted professionals for every part of your ceremony — from venue and décor to catering and photography."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {VENDOR_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onNavigate('vendor-categories', { categoryId: cat.id })}
            className="flex flex-col items-center p-2 sm:p-3 text-stone-800 dark:text-stone-100 hover:text-[#C51C13] dark:hover:text-orange-400 transition-colors cursor-pointer"
            id={`vendor-cat-${cat.id}`}
          >
            <span className="text-3xl sm:text-4xl mb-2 sm:mb-3" aria-hidden>
              {cat.icon}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-center line-clamp-2">{cat.name}</span>
            <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-1">
              {cat.count}+ vendors
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => onNavigate('vendor-categories')}
          id="vendor-cat-view-all"
          className="flex flex-col items-center justify-center gap-2 p-2 sm:p-3 min-h-[120px] text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
        >
          <ArrowRight className="w-8 h-8" />
          <span className="text-xs sm:text-sm font-semibold text-center">View all categories</span>
        </button>
      </div>
    </LandingSection>
  );
};
