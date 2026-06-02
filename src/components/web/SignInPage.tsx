import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Store, User } from 'lucide-react';
import { APP_NAME } from '../../brand';
import { routeHref } from '../../routing';

export type SignInMode = 'customer' | 'vendor';

interface SignInPageProps {
  onSignIn: (payload: {
    identifier: string;
    password: string;
    customerType?: 'standard' | 'event-planner';
  }) => void | Promise<void>;
  onVendorSignIn: (payload: { identifier: string; password: string }) => void | Promise<void>;
  onNavigate: (page: string, data?: unknown) => void;
  initialMode?: SignInMode;
  initialCustomerIdentifier?: string;
  successMessage?: string;
  isLoading?: boolean;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignIn,
  onVendorSignIn,
  onNavigate,
  initialMode = 'customer',
  initialCustomerIdentifier = '',
  successMessage = '',
  isLoading = false,
}) => {
  const [mode, setMode] = useState<SignInMode>(initialMode);
  const [vendorIdentifier, setVendorIdentifier] = useState('');
  const [customerIdentifier, setCustomerIdentifier] = useState(initialCustomerIdentifier);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialCustomerIdentifier) {
      setCustomerIdentifier(initialCustomerIdentifier);
    }
  }, [initialCustomerIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'vendor') {
      const identifier = vendorIdentifier.trim();
      if (!identifier) {
        setError('Enter your email or phone.');
        return;
      }
      if (!password.trim()) {
        setError('Enter your password.');
        return;
      }
      setError('');
      try {
        await onVendorSignIn({ identifier, password: password.trim() });
      } catch {
        setError('Sign in failed. Check the API is running at localhost:8080.');
      }
      return;
    }
    const identifier = customerIdentifier.trim();
    if (!identifier) {
      setError('Enter your email or phone.');
      return;
    }
    if (!password.trim()) {
      setError('Enter your password.');
      return;
    }
    setError('');
    try {
      await onSignIn({ identifier, password: password.trim(), customerType: 'event-planner' });
    } catch {
      setError('Sign in failed. Check the API is running at localhost:8080.');
    }
  };

  const modeDescription =
    mode === 'customer'
      ? 'Sign in to plan your events — guests, budget, vendors, feast & timelines.'
      : 'Manage your business listing, enquiries, and services.';

  const submitLabel =
    mode === 'vendor' ? 'Sign in to vendor dashboard' : 'Sign in to event planner';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 dark:bg-stone-900 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-bold text-primary bg-orange-50 dark:bg-stone-800 px-3 py-1 rounded-full">
            Account
          </span>
          <h1 className="font-display text-3xl text-stone-900 dark:text-white mt-3">
            Sign in to {APP_NAME}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">{modeDescription}</p>
        </div>

        {successMessage && mode === 'customer' && (
          <div
            className="mb-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 px-4 py-3 text-sm text-green-800 dark:text-green-200"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-stone-200 dark:border-stone-700 p-1 mb-6 bg-white dark:bg-stone-850">
          <button
            type="button"
            onClick={() => {
              setMode('customer');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'customer'
                ? 'bg-primary text-white'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <User className="w-4 h-4 shrink-0" aria-hidden />
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('vendor');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'vendor'
                ? 'bg-primary text-white'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" aria-hidden />
            Vendor
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 sm:p-8 shadow-sm space-y-5"
        >
          {mode === 'vendor' ? (
            <div>
              <label
                htmlFor="signin-vendor-identifier"
                className="block text-xs font-bold tracking-wide text-stone-500 mb-1.5"
              >
                Email or phone
              </label>
              <input
                id="signin-vendor-identifier"
                type="text"
                autoComplete="username"
                value={vendorIdentifier}
                onChange={(e) => setVendorIdentifier(e.target.value)}
                placeholder="business@example.com or 9876543210"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="signin-customer-identifier"
                className="block text-xs font-bold tracking-wide text-stone-500 mb-1.5"
              >
                Email or phone
              </label>
              <input
                id="signin-customer-identifier"
                type="text"
                autoComplete="username"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                placeholder="you@example.com or 9876543210"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="signin-password"
              className="block text-xs font-bold tracking-wide text-stone-500 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-3 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
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
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary hover:bg-[#A2110A] disabled:opacity-60 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            {isLoading ? 'Signing in…' : submitLabel}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => window.location.assign(routeHref('/platform/sign-in'))}
            className="w-full py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            id="btn-open-admin-workspace"
          >
            Platform admin / root sign in
          </button>

          <p className="flex items-start gap-2 text-xs text-stone-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden />
            Root users create admin accounts. Admins sign in with username and password at{' '}
            <code className="text-[10px]">/platform/sign-in</code>.
          </p>
        </form>

        <p className="text-center text-sm text-stone-600 dark:text-stone-400 mt-6">
          {mode === 'vendor' ? (
            <>
              New vendor?{' '}
              <button
                type="button"
                onClick={() => onNavigate('list-your-service')}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Register your business
              </button>
            </>
          ) : (
            <>
              New customer?{' '}
              <button
                type="button"
                onClick={() => onNavigate('event-planner-register')}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Register to plan events
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
