import type { PlatformUser } from './api/platform';
import { ApiError } from './api/client';
import { API_TOKEN_KEY, getApiToken, setApiToken } from './api/config';
import type { VendorDashboardSession } from './components/web/VendorProfilePage/vendorProfileData';
import type { UserProfile } from './types';

export type AuthKind = 'customer' | 'vendor' | 'platform';

const AUTH_STORAGE_KEY = 'utsav.auth.v1';
const LEGACY_AUTH_KEY = 'utsav.auth.v1';

export type PersistedAuth = {
  authKind?: AuthKind | null;
  isLoggedIn?: boolean;
  isVendorLoggedIn?: boolean;
  userProfile?: Partial<UserProfile>;
  vendorSession?: Partial<VendorDashboardSession>;
  platformUser?: PlatformUser | null;
  token?: string | null;
};

function readRawAuth(): string | null {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem(LEGACY_AUTH_KEY);
  } catch {
    return null;
  }
}

function migrateLegacyAuthBlob(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacy && !sessionStorage.getItem(AUTH_STORAGE_KEY)) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, legacy);
    }
    localStorage.removeItem(LEGACY_AUTH_KEY);
  } catch {
    // ignore
  }
}

export function readPersistedAuth(): PersistedAuth {
  migrateLegacyAuthBlob();
  try {
    const raw = readRawAuth();
    if (!raw) {
      const token = getApiToken();
      return token ? { token } : {};
    }
    const parsed = JSON.parse(raw) as PersistedAuth;
    const token = parsed.token || getApiToken();
    if (token) {
      setApiToken(token);
    }
    return { ...parsed, token: token ?? null };
  } catch {
    const token = getApiToken();
    return token ? { token } : {};
  }
}

export function writePersistedAuth(snapshot: PersistedAuth): void {
  const existing = readPersistedAuth();
  const token = getApiToken() ?? snapshot.token ?? existing.token ?? null;
  const authKind =
    snapshot.authKind ??
    existing.authKind ??
    resolveAuthKind({
      ...existing,
      ...snapshot,
      token,
      isLoggedIn: snapshot.isLoggedIn ?? existing.isLoggedIn,
      isVendorLoggedIn: snapshot.isVendorLoggedIn ?? existing.isVendorLoggedIn,
    });

  if (!token && !authKind) {
    return;
  }

  const payload: PersistedAuth = {
    authKind,
    isLoggedIn: snapshot.isLoggedIn ?? existing.isLoggedIn ?? authKind === 'customer',
    isVendorLoggedIn:
      snapshot.isVendorLoggedIn ?? existing.isVendorLoggedIn ?? authKind === 'vendor',
    userProfile: snapshot.userProfile ?? existing.userProfile,
    vendorSession: snapshot.vendorSession ?? existing.vendorSession,
    platformUser:
      snapshot.platformUser !== undefined ? snapshot.platformUser : existing.platformUser,
    token,
  };

  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    localStorage.removeItem(LEGACY_AUTH_KEY);
    if (token) {
      setApiToken(token);
    }
  } catch {
    // ignore storage errors (private mode / blocked)
  }
}

/** Remove token and all saved auth from session/local storage (call on logout). */
export function clearAuthSession(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(API_TOKEN_KEY);
    localStorage.removeItem(LEGACY_AUTH_KEY);
    localStorage.removeItem(API_TOKEN_KEY);
  } catch {
    // ignore storage errors (private mode / blocked)
  }
  setApiToken(null);
}

/** @deprecated Use clearAuthSession */
export const clearPersistedAuth = clearAuthSession;

export function resolveAuthKind(snapshot: PersistedAuth): AuthKind | null {
  if (snapshot.authKind) {
    return snapshot.authKind;
  }
  if (snapshot.isVendorLoggedIn) {
    return 'vendor';
  }
  if (snapshot.platformUser?.role === 'admin' || snapshot.platformUser?.role === 'root') {
    return 'platform';
  }
  if (snapshot.isLoggedIn) {
    return 'customer';
  }
  if (snapshot.token && snapshot.userProfile?.email) {
    return 'customer';
  }
  if (snapshot.token && snapshot.vendorSession?.vendorId) {
    return 'vendor';
  }
  if (snapshot.token && snapshot.platformUser) {
    return 'platform';
  }
  return null;
}

export function hasPersistedSession(snapshot: PersistedAuth): boolean {
  const token = snapshot.token || getApiToken();
  return Boolean(token && resolveAuthKind(snapshot));
}

export function authKindFromState(input: {
  isLoggedIn: boolean;
  isVendorLoggedIn: boolean;
  platformUser: PlatformUser | null;
}): AuthKind | null {
  if (input.isVendorLoggedIn) {
    return 'vendor';
  }
  if (input.platformUser?.role === 'admin' || input.platformUser?.role === 'root') {
    return 'platform';
  }
  if (input.isLoggedIn) {
    return 'customer';
  }
  return null;
}

/** True when the API rejected the token (logout). Network errors should not clear session. */
export function isAuthUnauthorizedError(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 401 || err.status === 403);
}

export type AuthStateSetters = {
  setIsLoggedIn: (v: boolean) => void;
  setIsVendorLoggedIn: (v: boolean) => void;
  setPlatformUser: (v: PlatformUser | null) => void;
  setUserProfile: (v: UserProfile) => void;
  setVendorSession: (v: VendorDashboardSession) => void;
};

export function applyPersistedAuthToState(
  snapshot: PersistedAuth,
  emptyUser: UserProfile,
  emptyVendor: VendorDashboardSession,
  setters: AuthStateSetters
): boolean {
  const kind = resolveAuthKind(snapshot);
  const token = snapshot.token || getApiToken();
  if (!token || !kind) {
    return false;
  }

  setApiToken(token);

  if (kind === 'vendor') {
    setters.setPlatformUser(null);
    setters.setIsLoggedIn(false);
    setters.setIsVendorLoggedIn(true);
    setters.setVendorSession({
      ...emptyVendor,
      ...(snapshot.vendorSession ?? {}),
    });
    return true;
  }

  if (kind === 'platform' && snapshot.platformUser) {
    setters.setPlatformUser(snapshot.platformUser);
    setters.setIsLoggedIn(false);
    setters.setIsVendorLoggedIn(false);
    return true;
  }

  setters.setPlatformUser(null);
  setters.setIsVendorLoggedIn(false);
  setters.setIsLoggedIn(true);
  setters.setUserProfile({
    ...emptyUser,
    ...(snapshot.userProfile ?? {}),
    customerType: snapshot.userProfile?.customerType ?? emptyUser.customerType ?? 'standard',
  });
  return true;
}
