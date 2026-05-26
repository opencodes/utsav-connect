import React from 'react';
import AppSS from '../../assets/app-ss.png';

interface AppPhoneMockupProps {
  variant?: 'device' | 'screenshot';
  className?: string;
}

export const AppPhoneMockup: React.FC<AppPhoneMockupProps> = ({ variant = 'device', className = '' }) => {
  if (variant === 'screenshot') {
    return (
      <div className={`relative rounded-2xl overflow-hidden border border-stone-800 shadow-xl ${className}`}>
        <img
          src={AppSS}
          alt="Shubhe app preview"
          className="w-full h-auto object-cover object-top"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      {/* Interactive device chassis */}
      <div className="relative w-64 sm:w-72 aspect-[9/18] bg-stone-950 rounded-t-[36px] border-t-[8px] border-x-[8px] border-stone-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col pt-3">
        {/* Speaker & Dynamic island notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-stone-950 rounded-full z-20 flex items-center justify-between px-3">
          <div className="w-8 h-1 bg-stone-900 rounded-full" />
          <div className="w-2 h-2 bg-stone-900 rounded-full" />
        </div>

        {/* Screen canvas */}
        <div className="relative flex-1 w-full bg-stone-900 overflow-hidden flex flex-col rounded-t-[28px] border-t border-stone-800/40 select-none">
          <img
            src={AppSS}
            alt="Shubhe App Screenshot"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />

          {/* Delicate reflection highlighting mock display realism */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
};
