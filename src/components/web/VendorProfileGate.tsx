import React from 'react';
import { ArrowRight, Store } from 'lucide-react';
import { APP_NAME } from '../../brand';

interface VendorProfileGateProps {
  onNavigate: (page: string, data?: unknown) => void;
}

/** Shown at /profile when the user is not signed in as a vendor. */
export const VendorProfileGate: React.FC<VendorProfileGateProps> = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="vendor-profile-gate">
    <div className="max-w-lg mx-auto px-4 pt-32 pb-16 text-center space-y-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
        <Store className="w-7 h-7 text-[#C51C13] dark:text-orange-400" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="heading-page text-2xl sm:text-3xl text-[#C51C13] dark:text-white">
          Vendor dashboard
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Sign in to manage your {APP_NAME} listing, reply to enquiries, and update your services.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => onNavigate('sign-in')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Sign in as vendor
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('list-your-service')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Register your business
        </button>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Planning an event as a guest?{' '}
        <button
          type="button"
          onClick={() => onNavigate('sign-in')}
          className="text-[#C51C13] dark:text-orange-400 font-semibold hover:underline cursor-pointer"
        >
          Customer sign in
        </button>
      </p>
    </div>
  </div>
);
