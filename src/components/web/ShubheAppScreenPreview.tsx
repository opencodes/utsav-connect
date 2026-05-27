import React from 'react';
import { APP_NAME } from '../../brand';

/** Branded in-device UI preview (replaces legacy screenshot until app-ss.png is updated). */
export const ShubheAppScreenPreview: React.FC = () => (
  <div className="flex h-full w-full flex-col bg-[#FFF8F0] text-stone-900 overflow-hidden">
    <header className="shrink-0 bg-[#C51C13] px-3 pt-8 pb-3">
      <p className="font-display text-lg text-white leading-none">{APP_NAME}</p>
      <p className="text-[10px] text-amber-100/90 mt-1">Ceremony planning & vendors</p>
    </header>

    <div className="flex-1 overflow-hidden p-3 space-y-2.5">
      <div className="rounded-xl bg-[#C51C13] p-3 text-white shadow-sm">
        <p className="text-[10px] text-amber-100/90 uppercase tracking-wide">Upcoming</p>
        <p className="font-display text-sm mt-0.5 leading-snug">Aarav & Ishani Wedding</p>
        <p className="text-[10px] text-amber-50/90 mt-1">Nov 24 · Udaipur</p>
        <div className="mt-2 flex gap-2 text-center">
          {[
            { n: '142', l: 'Days' },
            { n: '08', l: 'Hrs' },
            { n: '45', l: 'Mins' },
          ].map((item) => (
            <div key={item.l} className="flex-1 rounded-lg bg-white/10 py-1">
              <p className="text-sm font-bold leading-none">{item.n}</p>
              <p className="text-[8px] uppercase text-amber-100/80">{item.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-2.5">
        <p className="text-[10px] font-bold text-[#C51C13] uppercase tracking-wide">Planning checklist</p>
        <ul className="mt-2 space-y-1.5">
          {['Book pandit for mahurat', 'Finalize bridal lehenga'].map((task) => (
            <li key={task} className="flex items-start gap-2 text-[10px] text-stone-700 leading-snug">
              <span className="mt-0.5 h-3 w-3 shrink-0 rounded border border-[#C51C13]/50" aria-hidden />
              {task}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {['Vendors', 'Guests'].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-amber-200/80 bg-amber-50 px-2 py-2 text-center text-[10px] font-semibold text-[#A2110A]"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  </div>
);
