import React from 'react';
import { Users, Wallet, ArrowRight, CalendarPlus, ClipboardCheck } from 'lucide-react';
import { APP_NAME } from '../../../brand';
import { LandingSection, LandingSectionHeader, landingSplitClass } from './LandingSection';

interface EventPlannerPromoSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const PLANNING_STEPS = [
  {
    title: 'Create your event',
    description: 'Add ceremony name, dates, city, and scale — your digital mandap for the whole function.',
    icon: CalendarPlus,
  },
  {
    title: 'Guests & rituals',
    description: 'Build guest lists, RSVP tracking, sub-events, and ritual timelines in one place.',
    icon: Users,
  },
  {
    title: 'Budget & bhoj',
    description: 'Set a budget, log expenses, and plan feast quantities per guest with satvik menus.',
    icon: Wallet,
  },
  {
    title: 'Vendors & inventory',
    description: 'Shortlist halwai, tent, décor, track bartan, cylinders, and chuman before the big day.',
    icon: ClipboardCheck,
  },
];

const iconClass = 'w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0';

export const EventPlannerPromoSection: React.FC<EventPlannerPromoSectionProps> = ({ onNavigate }) => {
  return (
    <LandingSection id="event-planning-guide" tone="cream" className="scroll-mt-28" showMandala={false}>
      <LandingSectionHeader
        align="center"
        eyebrow={`${APP_NAME} event planner`}
        title="How event planning works"
        description="From the first lagan discussion to the final aarti — organise every detail in four simple steps, then use built-in tools for guests, budget, feast, and vendors."
      />

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-0 mb-10 sm:mb-12 list-none p-0 m-0">
        {PLANNING_STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex flex-col items-center text-center min-w-0">
              <Icon className={`${iconClass} mb-3`} aria-hidden />

              <h3 className="font-display text-lg sm:text-xl text-[#C51C13] dark:text-white leading-snug min-h-[3.25rem]">
                {item.title}
              </h3>

              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed max-w-[16rem] mx-auto">
                {item.description}
              </p>
            </li>
          );
        })}
      </ol>

      <div className={landingSplitClass}>
        <div className="flex flex-col items-center text-center gap-6">
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Free to start.</span> Open the
            planner and add your first event — guests, budget, feast, and vendors are covered in{' '}
            <button
              type="button"
              onClick={() => document.getElementById('platform-overview')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[#C51C13] dark:text-orange-400 font-semibold underline-offset-2 hover:underline cursor-pointer"
            >
              How our app works
            </button>
            .
          </p>
          <button
            type="button"
            onClick={() => onNavigate('celebrations')}
            id="btn-landing-open-planner"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white font-semibold text-sm transition-colors cursor-pointer shrink-0"
          >
            <CalendarPlus className="w-5 h-5" />
            Start planning
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </LandingSection>
  );
};
