const DEFAULT_BASE = 'http://localhost:8080/api/v1';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || DEFAULT_BASE
).replace(/\/$/, '');

/** JWT stored in sessionStorage (survives refresh, cleared when tab closes). */
export const API_TOKEN_KEY = 'utsav.api.token';

const LEGACY_TOKEN_KEY = 'utsav.api.token';

function readStorageToken(store: Storage): string | null {
  try {
    return store.getItem(API_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getApiToken(): string | null {
  try {
    let token = readStorageToken(sessionStorage);
    if (token) {
      return token;
    }
    const legacy = readStorageToken(localStorage);
    if (legacy) {
      sessionStorage.setItem(API_TOKEN_KEY, legacy);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      return legacy;
    }
    return null;
  } catch {
    return null;
  }
}

export function setApiToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(API_TOKEN_KEY, token);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } else {
      sessionStorage.removeItem(API_TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors (private mode / blocked)
  }
}
