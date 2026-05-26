import React from 'react';
import {
  CalendarDays,
  Users,
  Wallet,
  UtensilsCrossed,
  Store,
  Package,
  Gift,
  ArrowRight,
  CalendarPlus,
  ListOrdered,
  ClipboardCheck,
} from 'lucide-react';
import { APP_NAME } from '../../../brand';
import { LandingSection, LandingSectionHeader, landingBlockClass, landingSplitClass } from './LandingSection';

interface EventPlannerPromoSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const PLANNING_STEPS = [
  {
    step: '01',
    title: 'Create your event',
    description: 'Add ceremony name, dates, city, and scale — your digital mandap for the whole function.',
    icon: CalendarPlus,
  },
  {
    step: '02',
    title: 'Guests & rituals',
    description: 'Build guest lists, RSVP tracking, sub-events, and ritual timelines in one place.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Budget & bhoj',
    description: 'Set a budget, log expenses, and plan feast quantities per guest with satvik menus.',
    icon: Wallet,
  },
  {
    step: '04',
    title: 'Vendors & inventory',
    description: 'Shortlist halwai, tent, décor, track bartan, cylinders, and chuman before the big day.',
    icon: ClipboardCheck,
  },
];

const PLANNER_FEATURES = [
  {
    icon: CalendarDays,
    title: 'Events & rituals',
    description: 'Main ceremony, sangeet, and sub-events on one timeline.',
  },
  {
    icon: Users,
    title: 'Guests & RSVP',
    description: 'Guest lists, groups, room allotments, and live RSVP tracking.',
  },
  {
    icon: Wallet,
    title: 'Budget tracker',
    description: 'Set limits, log expenses, and stay on top of every payment.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Feast / bhoj planning',
    description: 'Menu quantities, satvik servings, and catering estimates per guest.',
  },
  {
    icon: Store,
    title: 'Vendor shortlist',
    description: 'Halwai, tent, décor, and more — linked to your active event.',
  },
  {
    icon: Package,
    title: 'Bartan & inventory',
    description: 'Track plates, cylinders, and misc items for the big day.',
  },
  {
    icon: Gift,
    title: 'Chuman & return gifts',
    description: 'Assign gifts and mark what has been handed to each family.',
  },
];

const iconClass = 'w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0';

export const EventPlannerPromoSection: React.FC<EventPlannerPromoSectionProps> = ({ onNavigate }) => {
  return (
    <LandingSection id="event-planning-guide" tone="cream" className="scroll-mt-28">
      <LandingSectionHeader
        eyebrow={`${APP_NAME} event planner`}
        title="How event planning works"
        description="From the first lagan discussion to the final aarti — organise every detail in four simple steps, then use built-in tools for guests, budget, feast, and vendors."
      />

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
        {PLANNING_STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.step} className={`flex flex-col ${landingBlockClass}`}>
              <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest">
                Step {item.step}
              </span>
              <Icon className={`${iconClass} mt-3 mb-2`} />
              <h3 className="font-display text-base text-[#C51C13] dark:text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed flex-1">
                {item.description}
              </p>
            </li>
          );
        })}
      </ol>

      <div className={landingSplitClass}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <ListOrdered className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">
            Planner features included
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5 mb-8">
          {PLANNER_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-3">
                <Icon className={iconClass} />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-white">{feature.title}</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800">
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl text-center sm:text-left mx-auto sm:mx-0">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Free to start.</span> Open the
            planner and add your first event — no vendor search required to begin.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('celebrations')}
            id="btn-landing-open-planner"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white font-semibold text-sm transition-colors cursor-pointer shrink-0 mx-auto sm:mx-0"
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
