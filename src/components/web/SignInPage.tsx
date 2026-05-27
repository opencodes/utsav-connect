import React, { useState } from 'react';
import { Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { APP_NAME } from '../../brand';

interface SignInPageProps {
  onSignIn: (payload: { phone: string; email: string }) => void;
  onNavigate: (page: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSignIn, onNavigate }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    onSignIn({ phone: phone.trim(), email: email.trim() });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 dark:bg-stone-900 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#C51C13] bg-orange-50 dark:bg-stone-800 px-3 py-1 rounded-full">
            Account
          </span>
          <h1 className="font-display text-3xl text-stone-900 dark:text-white mt-3">Sign in to {APP_NAME}</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
            Use your mobile and email to access your events, wallet, and saved vendors.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div>
            <label htmlFor="signin-phone" className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">
              Mobile number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden />
              <input
                id="signin-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signin-email" className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden />
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="flex items-start gap-2 text-xs text-stone-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden />
            Demo sign-in for preview. OTP verification will be added before production launch.
          </p>
        </form>

        <p className="text-center text-sm text-stone-600 dark:text-stone-400 mt-6">
          New to {APP_NAME}?{' '}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="font-semibold text-[#C51C13] hover:underline cursor-pointer"
          >
            Explore the homepage
          </button>
        </p>
      </div>
    </div>
  );
};
