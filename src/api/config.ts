const DEFAULT_BASE = 'http://localhost:8080/api/v1';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || DEFAULT_BASE
).replace(/\/$/, '');

export const API_TOKEN_KEY = 'utsav.api.token';

export function getApiToken(): string | null {
  try {
    return window.localStorage.getItem(API_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setApiToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(API_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(API_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}
