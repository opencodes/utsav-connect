import React from 'react';
import { RangoliMandala } from '../GoldenDeco';

export type LandingSectionTone =
  | 'cream'
  | 'marigold'
  | 'sand'
  | 'blush'
  | 'wine'
  | 'parchment';

/** Maps tone → CSS texture class (see index.css `.landing-section-tone--*`) */
const TONE_CLASS: Record<LandingSectionTone, string> = {
  cream: 'landing-section-tone--cream',
  marigold: 'landing-section-tone--marigold',
  sand: 'landing-section-tone--sand',
  blush: 'landing-section-tone--blush',
  wine: 'landing-section-tone--wine',
  parchment: 'landing-section-tone--parchment',
};

/** Flat layout helpers — no card chrome, content sits on section background */
export const landingBlockClass = 'py-1';

export const landingSplitClass =
  'pt-8 sm:pt-10 border-t border-stone-400/40 dark:border-stone-600';

interface LandingSectionProps {
  id?: string;
  tone?: LandingSectionTone;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  /** Decorative top band between sections */
  showDivider?: boolean;
  /** CSS texture overlay (see index.css `::before` on tone classes) */
  showTexture?: boolean;
  /** Corner rangoli accents */
  showMandala?: boolean;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  id,
  tone = 'cream',
  children,
  className = '',
  innerClassName = '',
  showDivider = false,
  showTexture = true,
  showMandala = true,
}) => (
  <section
    id={id}
    className={`landing-section-tone ${TONE_CLASS[tone]} ${showTexture ? '' : 'landing-section-tone--flat'} w-full border-b-2 border-stone-300/70 dark:border-stone-700 ${className}`}
  >
    {showDivider && (
      <div
        className="absolute top-0 inset-x-0 h-0.5 bg-[#C51C13]/40 z-10 pointer-events-none"
        aria-hidden
      />
    )}

    {showMandala && (
      <>
        <div className="landing-section-mandala absolute top-8 right-[4%] z-[1] w-56 h-56 md:w-72 md:h-72 opacity-[0.05] pointer-events-none select-none text-orange-500">
          <RangoliMandala className="w-full h-full" />
        </div>
        <div className="landing-section-mandala absolute bottom-6 left-[3%] z-[1] w-48 h-48 opacity-[0.04] pointer-events-none select-none text-amber-500">
          <RangoliMandala className="w-full h-full" />
        </div>
      </>
    )}

    <div
      className={`landing-section-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 ${innerClassName}`}
    >
      {children}
    </div>
  </section>
);

interface LandingSectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  action?: React.ReactNode;
}

export const LandingSectionHeader: React.FC<LandingSectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  action,
}) => {
  const isCenter = align === 'center';
  const titleColor = light ? 'text-white' : 'text-[#C51C13] dark:text-white';
  const descColor = light ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400';
  const eyebrowColor = light ? 'text-amber-300' : 'text-orange-600 dark:text-amber-400';

  return (
    <div
      className={`flex flex-col gap-4 mb-10 sm:mb-12 ${
        isCenter ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between text-left items-start'
      }`}
    >
      <div
        className={`space-y-3 flex flex-col w-full ${
          isCenter ? 'items-center text-center max-w-3xl mx-auto' : 'items-start text-left max-w-2xl'
        }`}
      >
        <span
          className={`inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor} ${
            isCenter ? 'justify-center' : ''
          }`}
        >
          <span className="h-px w-6 bg-gradient-to-r from-orange-500 to-amber-400 shrink-0" aria-hidden />
          {eyebrow}
          <span className="h-px w-6 bg-gradient-to-r from-amber-400 to-orange-500 shrink-0" aria-hidden />
        </span>
        <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight tracking-tight ${titleColor}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-sm sm:text-base leading-relaxed ${descColor}`}>{description}</p>
        )}
      </div>
      {action && <div className={isCenter ? 'flex justify-center w-full' : 'shrink-0'}>{action}</div>}
    </div>
  );
};
