import React from 'react';

export type PageBannerVariant = 'celebration' | 'contact' | 'planner' | 'vendor';

const VARIANT_STYLES: Record<
  PageBannerVariant,
  {
    overlay: string;
    eyebrow: string;
    eyebrowLine: string;
    description: string;
    glowA: string;
    glowB: string;
    accentBar: string;
  }
> = {
  celebration: {
    overlay: 'bg-stone-900/85',
    eyebrow: 'text-stone-300',
    eyebrowLine: 'bg-stone-500',
    description: 'text-stone-200/95',
    glowA: 'bg-transparent',
    glowB: 'bg-transparent',
    accentBar: 'bg-stone-700',
  },
  contact: {
    overlay: 'bg-stone-900/85',
    eyebrow: 'text-stone-300',
    eyebrowLine: 'bg-stone-500',
    description: 'text-stone-200/90',
    glowA: 'bg-transparent',
    glowB: 'bg-transparent',
    accentBar: 'bg-stone-700',
  },
  planner: {
    overlay: 'bg-stone-900/85',
    eyebrow: 'text-stone-300',
    eyebrowLine: 'bg-stone-500',
    description: 'text-stone-200/95',
    glowA: 'bg-transparent',
    glowB: 'bg-transparent',
    accentBar: 'bg-stone-700',
  },
  vendor: {
    overlay: 'bg-stone-900/85',
    eyebrow: 'text-stone-300',
    eyebrowLine: 'bg-stone-500',
    description: 'text-stone-200/90',
    glowA: 'bg-transparent',
    glowB: 'bg-transparent',
    accentBar: 'bg-stone-700',
  },
};

export interface PageBannerProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  variant?: PageBannerVariant;
  /** Full-bleed background (edge-to-edge). */
  bleed?: boolean;
  /** `screen` = full viewport height below the sticky header */
  size?: 'default' | 'screen';
  children?: React.ReactNode;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  id,
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = '',
  variant = 'celebration',
  bleed = false,
  size = 'default',
  children,
}) => {
  const styles = VARIANT_STYLES[variant];
  const isFullBleedBackground = bleed || size === 'screen';
  const heightClass =
    size === 'screen'
      ? 'min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.25rem)]'
      : 'min-h-[220px] sm:min-h-[260px] md:min-h-[300px]';
  const sectionWidthClass = isFullBleedBackground
    ? 'w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2'
    : 'w-full';

  return (
    <section
      className={`${sectionWidthClass} relative ${heightClass} overflow-hidden border-b border-stone-200/80 dark:border-stone-800`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className={`absolute inset-0 ${styles.overlay}`} aria-hidden />
      <div
        className={`absolute -top-20 -right-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none ${styles.glowA}`}
        aria-hidden
      />
      <div
        className={`absolute -bottom-24 -left-12 w-80 h-80 rounded-full blur-[90px] pointer-events-none ${styles.glowB}`}
        aria-hidden
      />
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${styles.accentBar}`}
        aria-hidden
      />
      <div
        className={`relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 flex flex-col justify-end min-h-[inherit] ${
          size === 'screen' ? 'pt-24 sm:pt-28 pb-12 sm:pb-16' : 'pt-24 sm:pt-28 pb-10 sm:pb-12 lg:pb-14'
        }`}
      >
        <span
          className={`inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] mb-3 ${styles.eyebrow}`}
        >
          <span className={`h-px w-6 ${styles.eyebrowLine}`} aria-hidden />
          {eyebrow}
          <span className={`h-px w-6 ${styles.eyebrowLine}`} aria-hidden />
        </span>
        <h1
          id={`${id}-title`}
          className="heading-page text-3xl sm:text-4xl lg:text-[2.75rem] text-white drop-shadow-sm max-w-3xl"
        >
          {title}
        </h1>
        <p
          className={`text-sm sm:text-base leading-relaxed mt-3 ${styles.description} max-w-2xl`}
        >
          {description}
        </p>
        {children ? <div className="mt-6 space-y-4">{children}</div> : null}
      </div>
    </section>
  );
};
