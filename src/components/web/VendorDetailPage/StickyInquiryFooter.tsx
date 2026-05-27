import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface StickyInquiryFooterProps {
  selectedCount: number;
  onRequestQuote: () => void;
}

export const StickyInquiryFooter: React.FC<StickyInquiryFooterProps> = ({
  selectedCount,
  onRequestQuote,
}) => {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5"
      id="sticky-inquiry-summary"
    >
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-amber-400/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl relative">
            <MessageCircle className="w-5 h-5 text-white" aria-hidden />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-yellow-400 text-[10px] font-black text-stone-900 rounded-full flex items-center justify-center leading-none">
              {selectedCount}
            </span>
          </div>
          <div className="text-left leading-tight">
            <span className="text-[10px] font-bold text-orange-200">Quote shortlist</span>
            <h5 className="font-extrabold text-base">
              {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
            </h5>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestQuote}
          className="flex items-center gap-1 px-4 py-2 bg-white text-orange-600 font-extrabold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          id="sticky-inquiry-request-button"
        >
          <span>Get quote</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
        </button>
      </div>
    </div>
  );
};
