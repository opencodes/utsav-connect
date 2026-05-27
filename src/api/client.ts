import { API_BASE_URL, getApiToken } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
};

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${base}${normalized}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = false, query } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getApiToken();
    if (!token) {
      throw new ApiError('Sign in required', 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload as { message?: string })?.message ||
      (payload as { error?: string })?.error ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  const envelope = payload as ApiEnvelope<T>;
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    return envelope.data;
  }

  return payload as T;
}

/** Health lives outside /api/v1 */
export async function fetchHealth(): Promise<{
  status: string;
  mongodb: string;
}> {
  const root = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  const response = await fetch(`${root}/health`);
  const json = (await response.json()) as ApiEnvelope<{
    status: string;
    mongodb: string;
  }>;
  return json.data;
}
