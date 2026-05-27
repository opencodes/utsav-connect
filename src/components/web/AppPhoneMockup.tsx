import React from 'react';
import { ShubheAppScreenPreview } from './ShubheAppScreenPreview';

export interface AppPhoneMockupProps {
  className?: string;
}

/** Device frame with branded {APP_NAME} UI preview (not legacy screenshot). */
export const AppPhoneMockup: React.FC<AppPhoneMockupProps> = ({ className = '' }) => (
  <figure className={`m-0 flex justify-center items-end ${className}`} aria-label="Shubhe mobile app preview">
    <div className="relative w-[min(100%,272px)] select-none">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-amber-400/20 blur-2xl"
        aria-hidden
      />

      <div className="relative w-full rounded-[2.85rem] bg-gradient-to-b from-stone-700 via-stone-900 to-stone-950 p-[11px] shadow-[0_28px_56px_-14px_rgba(0,0,0,0.65)] ring-1 ring-white/20">
        <span className="absolute -left-[3px] top-[92px] h-7 w-[3px] rounded-l-sm bg-stone-600" aria-hidden />
        <span className="absolute -left-[3px] top-[128px] h-11 w-[3px] rounded-l-sm bg-stone-600" aria-hidden />
        <span className="absolute -right-[3px] top-[108px] h-14 w-[3px] rounded-r-sm bg-stone-600" aria-hidden />

        <div className="relative w-full overflow-hidden rounded-[2.35rem] bg-stone-950 ring-1 ring-black/40 aspect-[9/19.5]">
          <div
            className="absolute top-2.5 left-1/2 z-20 h-[27px] w-[94px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            aria-hidden
          />

          <div className="absolute inset-0 z-0">
            <ShubheAppScreenPreview />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-transparent"
            aria-hidden
          />

          <div
            className="absolute bottom-2 left-1/2 z-20 h-[5px] w-[32%] max-w-[108px] -translate-x-1/2 rounded-full bg-white/85"
            aria-hidden
          />
        </div>
      </div>
    </div>
  </figure>
);
