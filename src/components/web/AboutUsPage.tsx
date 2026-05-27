import React from 'react';
import { ArrowRight, Award, Mail, Search, Sparkles, Users } from 'lucide-react';
import { APP_NAME, SUPPORT_EMAIL } from '../../brand';
import { LandingSection, LandingSectionHeader } from './LandingPage/LandingSection';
import { PageBanner } from './PageBanner';

interface AboutUsPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const STATS = [
  { value: '500+', label: 'Listed vendors' },
  { value: '150+', label: 'Events hosted' },
  { value: '15k+', label: 'Guests served' },
];

const VALUES = [
  {
    icon: Users,
    title: 'Verified marketplace',
    description:
      'Browse venues, caterers, décor, photography, pandits, and more — with ratings, packages, and city filters.',
  },
  {
    icon: Sparkles,
    title: 'Built for Indian celebrations',
    description:
      'Weddings, festivals, and society functions — tools and categories that match how families actually plan.',
  },
  {
    icon: Award,
    title: 'Quotes without the chaos',
    description:
      'Shortlist vendors, send enquiries, and keep planning in one place instead of scattered chats and PDFs.',
  },
];

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="about-us-page">
      <PageBanner
        id="about-page-banner"
        variant="celebration"
        eyebrow={`About ${APP_NAME}`}
        title="One place to discover vendors you can trust"
        description={`${APP_NAME} helps families and hosts compare services, request quotes, and plan weddings and festive events — from banquet halls and halwais to photographers and pandits.`}
        imageSrc="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80"
        imageAlt="Indian wedding celebration"
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('vendor-categories')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFCB44] hover:bg-amber-300 text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            Browse categories
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('how-it-works')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-white/50 bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors cursor-pointer"
          >
            How it works
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/95 backdrop-blur-sm px-3 py-2 border border-white/40 shadow-sm min-w-[7rem]"
            >
              <p className="text-lg font-bold text-[#C51C13] leading-none">{stat.value}</p>
              <p className="text-[10px] font-medium text-stone-600 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageBanner>

      {/* Values */}
      <LandingSection id="about-values" tone="white" showTexture={false} showMandala={false}>
        <LandingSectionHeader
          align="left"
          eyebrow="Why we exist"
          title="Planning should feel clear, not overwhelming"
          description="We focus on discovery, trust signals, and simple next steps — so you spend less time chasing vendors and more time celebrating."
        />
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 p-6 space-y-4"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
              </div>
              <div className="space-y-2">
                <h3 className="heading-card text-lg text-stone-900 dark:text-white">{title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </LandingSection>

      {/* Story */}
      <LandingSection id="about-story" tone="parchment" showTexture={false} showMandala={false}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-5 text-left">
            <div className="space-y-3">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-orange-600 dark:text-amber-400">
                Our story
              </span>
              <h2 className="heading-section text-2xl sm:text-3xl text-[#C51C13] dark:text-white">
                From WhatsApp forwards to a real marketplace
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                {APP_NAME} started when hosts couldn&apos;t compare pricing, availability, or reviews across
                cities. Vendors lost leads in group chats. We built a shared place where both sides meet with
                clarity.
              </p>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Today families search by category and city, save favourites, and request quotes. Vendors list
              packages, respond faster, and build reputation through completed events — across NCR and
              growing partner regions.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C51C13] dark:text-orange-400 hover:underline"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden />
              {SUPPORT_EMAIL}
            </a>
          </div>
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-700 shadow-md aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </LandingSection>

      {/* How we help */}
      <LandingSection id="about-platform" tone="cream" showTexture={false} showMandala={false}>
        <div className="rounded-2xl bg-white dark:bg-stone-800 border border-orange-100/80 dark:border-stone-700 p-6 sm:p-10 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-left">
              <h2 className="heading-section text-2xl sm:text-3xl text-[#C51C13] dark:text-white">
                Explore the platform
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Start with vendor categories, dive into listings with filters, open vendor profiles for services
                and reviews, or plan an event from scratch.
              </p>
              <ul className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
                <li className="flex gap-3">
                  <Search className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <span>Search by category, city, rating, and offers</span>
                </li>
                <li className="flex gap-3">
                  <Users className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <span>Compare vendors side by side before you enquire</span>
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <span>Plan events with tools built for hosts and vendors</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('vendor-categories')}
                className="w-full px-5 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Find vendors
              </button>
              <button
                type="button"
                onClick={() => onNavigate('celebrations')}
                className="w-full px-5 py-3 rounded-lg border border-[#C51C13] text-[#C51C13] dark:text-orange-400 dark:border-orange-500 hover:bg-orange-50 dark:hover:bg-stone-900 text-sm font-semibold transition-colors cursor-pointer"
              >
                Plan an event
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="w-full px-5 py-3 rounded-lg text-stone-700 dark:text-stone-200 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-700/50 transition-colors cursor-pointer"
              >
                Contact our team
              </button>
            </div>
          </div>
        </div>
      </LandingSection>
    </div>
  );
};
