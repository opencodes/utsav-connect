import React from 'react';
import { HeroSection } from './LandingPage/HeroSection';
import { VendorCategoriesSection } from './LandingPage/VendorCategoriesSection';
import { EventPlannerPromoSection } from './LandingPage/EventPlannerPromoSection';
import { PlatformHowItWorksSection } from './LandingPage/PlatformHowItWorksSection';
import { VendorRegisterSection } from './LandingPage/VendorRegisterSection';
import { WeddingDirectoryBannerPromo } from './LandingPage/WeddingDirectoryBannerPromo';
import { CustomerTestimonialsSection } from './LandingPage/CustomerTestimonialsSection';

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
