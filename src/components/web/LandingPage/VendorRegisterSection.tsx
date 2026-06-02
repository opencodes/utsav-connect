import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { APP_NAME } from '../../../brand';
import { LandingSection, LandingSectionHeader } from './LandingSection';

interface VendorRegisterSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const BENEFITS = [
  'Free profile listing in your city & category',
  'Reach families planning weddings & pujas',
  'Showcase packages, photos, and availability',
  'Receive enquiries tied to real events',
];

export const VendorRegisterSection: React.FC<VendorRegisterSectionProps> = ({ onNavigate }) => {
  return (
    <LandingSection id="vendor-register" tone="blush" showTexture={false} showMandala={false}>
      <LandingSectionHeader
        align="center"
        eyebrow="Vendor onboarding"
        title={`Offer your services on ${APP_NAME}`}
        description="Whether you run a tent house, catering kitchen, photo studio, or pandit seva — register your business and let hosts find you when they plan their next ceremony."
      />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="space-y-6 max-w-md mx-auto lg:mx-0 w-full">
          <ul className="space-y-3 text-left">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-amber-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
            <button
              type="button"
              onClick={() => onNavigate('list-your-service')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary hover:bg-[#A2110A] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Apply to list your business
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('vendor-categories')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-stone-300 dark:border-stone-600 text-orange-800 dark:text-stone-200 font-semibold text-sm hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              See who&apos;s already listed
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80"
            alt="Event vendors setting up a traditional celebration"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium leading-relaxed text-center">
            Join halwais, decorators, venues, and artists already helping families celebrate across North India.
          </p>
        </div>
      </div>
    </LandingSection>
  );
};
