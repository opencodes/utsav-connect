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
    overlay:
      'bg-gradient-to-br from-[#C51C13]/92 via-amber-900/78 to-stone-950/88',
    eyebrow: 'text-[#FFCB44]',
    eyebrowLine: 'bg-gradient-to-r from-[#FFCB44] via-amber-300 to-orange-400',
    description: 'text-amber-50/95',
    glowA: 'bg-[#FFCB44]/25',
    glowB: 'bg-orange-500/20',
    accentBar: 'bg-gradient-to-r from-[#FFCB44] via-[#C51C13] to-amber-600',
  },
  contact: {
    overlay:
      'bg-gradient-to-r from-stone-950/92 via-[#5c1814]/88 to-[#C51C13]/82',
    eyebrow: 'text-amber-200/95',
    eyebrowLine: 'bg-gradient-to-r from-amber-200 via-[#FFCB44] to-orange-300',
    description: 'text-stone-100/90',
    glowA: 'bg-[#C51C13]/30',
    glowB: 'bg-amber-500/18',
    accentBar: 'bg-gradient-to-r from-stone-400/80 via-[#FFCB44] to-[#C51C13]',
  },
  planner: {
    overlay:
      'bg-gradient-to-br from-amber-950/88 via-[#C51C13]/86 to-[#4a1512]/92',
    eyebrow: 'text-[#FFCB44]',
    eyebrowLine: 'bg-gradient-to-r from-[#FFCB44] via-orange-300 to-amber-200',
    description: 'text-amber-50/95',
    glowA: 'bg-orange-400/22',
    glowB: 'bg-[#FFCB44]/20',
    accentBar: 'bg-gradient-to-r from-amber-400 via-[#C51C13] to-[#4a1512]',
  },
  vendor: {
    overlay:
      'bg-gradient-to-br from-stone-950/92 via-[#C51C13]/85 to-amber-950/88',
    eyebrow: 'text-amber-200/95',
    eyebrowLine: 'bg-gradient-to-r from-amber-200 via-[#FFCB44] to-orange-400',
    description: 'text-stone-100/90',
    glowA: 'bg-[#FFCB44]/22',
    glowB: 'bg-[#C51C13]/28',
    accentBar: 'bg-gradient-to-r from-[#FFCB44] via-[#C51C13] to-amber-700',
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
