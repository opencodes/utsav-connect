import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface StickyCartFooterProps {
  cartCount: number;
  cartTotal: number;
  onNavigate: (page: string, data?: any) => void;
}

export const StickyCartFooter: React.FC<StickyCartFooterProps> = ({
  cartCount,
  cartTotal,
  onNavigate,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-bottom-5" id="sticky-cart-summary">
      <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-white text-[10px] font-black text-stone-900 rounded-full flex items-center justify-center leading-none">
              {cartCount}
            </span>
          </div>
          <div className="text-left leading-tight">
            <span className="text-[10px] font-bold text-stone-400">Active Festive Basket</span>
            <h5 className="font-extrabold text-base">₹{cartTotal} (+ taxes & delivery)</h5>
          </div>
        </div>

        <button
          onClick={() => onNavigate('cart')}
          className="flex items-center gap-1 px-4 py-2 bg-white text-stone-900 font-extrabold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          id="sticky-cart-checkout-button"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
