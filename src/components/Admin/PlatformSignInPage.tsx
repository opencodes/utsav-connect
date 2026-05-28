import React, { useState } from 'react';
import { KeyRound, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { signInPlatform } from '../../api/platform';
import { ApiError } from '../../api/client';

interface PlatformSignInPageProps {
  onSuccess: (role: 'root' | 'admin') => void;
  onBack?: () => void;
}

export const PlatformSignInPage: React.FC<PlatformSignInPageProps> = ({
  onSuccess,
  onBack,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const session = await signInPlatform(username.trim(), password);
      const role = session.user.role;
      if (role !== 'root' && role !== 'admin') {
        setError('This account cannot access the platform console.');
        return;
      }
      onSuccess(role);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Sign in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-100 dark:bg-stone-950 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C51C13] bg-white dark:bg-stone-900 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800">
            <Shield className="w-3 h-3" aria-hidden />
            Platform access
          </span>
          <h1 className="font-display text-3xl text-stone-900 dark:text-white mt-3">
            Admin &amp; root sign in
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
            Root users manage admin accounts. Admins use credentials created by root to open the
            operations workspace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 shadow-sm"
        >
          <div>
            <label htmlFor="platform-username" className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Username
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" aria-hidden />
              <input
                id="platform-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl dark:bg-stone-950 dark:border-stone-700"
                placeholder="root or admin username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="platform-password" className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" aria-hidden />
              <input
                id="platform-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-xl dark:bg-stone-950 dark:border-stone-700"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C51C13] hover:bg-[#A2110A] disabled:opacity-60 text-white font-semibold text-sm"
          >
            {loading ? 'Signing in…' : 'Sign in'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            >
              Back to site
            </button>
          ) : null}
        </form>

        <p className="mt-6 flex items-start gap-2 text-xs text-stone-500">
          <KeyRound className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
          Default root credentials come from <code className="text-[10px]">ROOT_USERNAME</code> and{' '}
          <code className="text-[10px]">ROOT_PASSWORD</code> in the API <code className="text-[10px]">.env</code>.
          Change them in production.
        </p>
      </div>
    </div>
  );
};
