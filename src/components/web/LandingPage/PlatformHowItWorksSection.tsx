import React from 'react';
import { CalendarPlus, Search, ClipboardList, Store, UserPlus, BadgeCheck } from 'lucide-react';
import { LandingSection, LandingSectionHeader } from './LandingSection';

interface PlatformHowItWorksSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const iconClass = 'w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0';

export const PlatformHowItWorksSection: React.FC<PlatformHowItWorksSectionProps> = ({ onNavigate }) => {
  const hostSteps = [
    {
      title: 'Create your event',
      description: 'Add ceremony type, dates, city, and guest scale — your digital planning hub starts here.',
      icon: CalendarPlus,
    },
    {
      title: 'Search vendors',
      description: 'Filter by category, budget, and location. Compare portfolios and reviews in one place.',
      icon: Search,
    },
    {
      title: 'Shortlist & coordinate',
      description: 'Save favourites, track enquiries, and keep vendor conversations tied to your event.',
      icon: ClipboardList,
    },
  ];

  const vendorSteps = [
    {
      title: 'Register your business',
      description: 'List your services, service areas, and packages so families can discover you.',
      icon: UserPlus,
    },
    {
      title: 'Get discovered',
      description: 'Appear in category search when hosts plan weddings, pujas, and community functions.',
      icon: Store,
    },
    {
      title: 'Grow with trust',
      description: 'Build your profile with photos, pricing, and verified badges as you complete events.',
      icon: BadgeCheck,
    },
  ];

  return (
    <LandingSection id="how-it-works" tone="white" showTexture={false} showMandala={false}>
      <LandingSectionHeader
        eyebrow="One platform, two journeys"
        title="How our app works"
        description="Families plan ceremonies with clarity. Local vendors reach the right hosts — without scattered calls and paper registers."
      />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h3 className="font-display text-xl text-[#C51C13] dark:text-white mb-1">For event hosts</h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
            Plan shaadi, sangeet, griha pravesh, or community feasts with structured tools.
          </p>
          <ul className="space-y-5">
            {hostSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex gap-4">
                  <Icon className={`${iconClass} mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-stone-900 dark:text-white text-sm">{step.title}</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate('celebrations')}
            className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Start planning an event
          </button>
        </div>

        <div className="lg:border-l lg:border-stone-200/80 lg:dark:border-stone-800 lg:pl-16">
          <h3 className="font-display text-xl text-[#C51C13] dark:text-white mb-1">For service vendors</h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
            Caterers, decorators, photographers, pandits, and more — list once, get found by hosts.
          </p>
          <ul className="space-y-5">
            {vendorSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex gap-4">
                  <Icon className={`${iconClass} mt-0.5`} />
                  <div>
                    <h4 className="font-semibold text-stone-900 dark:text-white text-sm">{step.title}</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#C51C13] text-[#C51C13] dark:text-orange-400 dark:border-orange-500 hover:bg-[#C51C13] hover:text-white dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Register as a vendor
          </button>
        </div>
      </div>
    </LandingSection>
  );
};
