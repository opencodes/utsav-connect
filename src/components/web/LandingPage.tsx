import React from 'react';
import { HeroSection } from './Landing/HeroSection';
import { VendorCategoriesSection } from './Landing/VendorCategoriesSection';
import { EventPlannerPromoSection } from './Landing/EventPlannerPromoSection';
import { PlatformHowItWorksSection } from './Landing/PlatformHowItWorksSection';
import { VendorRegisterSection } from './Landing/VendorRegisterSection';
import { WeddingDirectoryBannerPromo } from './Landing/WeddingDirectoryBannerPromo';
import { CustomerTestimonialsSection } from './Landing/CustomerTestimonialsSection';

interface LandingPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div id="landing-page-container" className="w-full">
      <HeroSection onNavigate={onNavigate} embeddedInShell />
      <EventPlannerPromoSection onNavigate={onNavigate} />
      <VendorCategoriesSection onNavigate={onNavigate} />
      <PlatformHowItWorksSection onNavigate={onNavigate} />
      <VendorRegisterSection onNavigate={onNavigate} />
      <WeddingDirectoryBannerPromo onNavigate={onNavigate} />
      <CustomerTestimonialsSection />
    </div>
  );
};
