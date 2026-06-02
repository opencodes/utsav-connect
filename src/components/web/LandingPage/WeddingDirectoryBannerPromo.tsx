
import React from 'react';
import { Sparkles } from 'lucide-react';
import { RangoliMandala } from '../GoldenDeco';
import { LandingSection, LandingSectionHeader } from './LandingSection';

interface WeddingDirectoryBannerPromoProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export const WeddingDirectoryBannerPromo: React.FC<WeddingDirectoryBannerPromoProps> = ({ onNavigate }) => {
  return (
    <LandingSection id="wedding-directory-banner-promo" tone="cream" showMandala={false} showTexture={false}>
      <div className="relative flex flex-col items-center text-center gap-8">
        <LandingSectionHeader
          eyebrow="Vendor directory"
          title="Search vendors by ritual & region"
          description="Browse 15+ categories — venues, catering, décor, photography, music, pandits, and more. Filter by city, budget, and reviews when you plan your next event."
        />

        <button
          type="button"
          onClick={() => onNavigate('vendor-categories')}
          className="relative z-10 px-6 py-3.5 bg-primary hover:bg-[#A2110A] text-white font-semibold text-sm tracking-wide rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Search all vendors
        </button>
      </div>
    </LandingSection>
  );
};
