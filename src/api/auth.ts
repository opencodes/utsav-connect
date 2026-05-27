import { apiRequest } from './client';
import { setApiToken } from './config';
import type { CustomerType } from '../types';

export type ApiUser = {
  id: string;
  role: string;
  customerType?: CustomerType;
  name: string;
  email: string;
  phone: string;
  walletBalance?: number;
  royaltyPoints?: number;
  vendorId?: string | null;
  businessName?: string | null;
  contactName?: string | null;
};

export type AuthSession = {
  token: string;
  user: ApiUser;
};

export async function signInCustomer(
  phone: string,
  email: string,
  profile?: { name?: string; customerType?: CustomerType }
): Promise<AuthSession> {
  const data = await apiRequest<AuthSession>('/auth/sign-in', {
    method: 'POST',
    body: {
      phone,
      email,
      name: profile?.name,
      customerType: profile?.customerType ?? 'standard',
    },
  });
  setApiToken(data.token);
  return data;
}

export async function signInVendor(
  phone: string,
  email: string,
  vendorMeta?: {
    vendorId?: string;
    businessName?: string;
    contactName?: string;
  }
): Promise<AuthSession & { vendorSession?: ApiUser }> {
  const data = await apiRequest<AuthSession & { vendorSession?: ApiUser }>(
    '/auth/vendor/sign-in',
    {
      method: 'POST',
      body: { phone, email, ...vendorMeta },
    }
  );
  setApiToken(data.token);
  return data;
}

export async function registerEventPlanner(payload: Record<string, unknown>): Promise<AuthSession> {
  const data = await apiRequest<AuthSession>('/auth/register/planner', {
    method: 'POST',
    body: payload,
  });
  setApiToken(data.token);
  return data;
}

export async function fetchAuthMe(): Promise<{ user: ApiUser }> {
  return apiRequest<{ user: ApiUser }>('/auth/me', { auth: true });
}

export function clearApiSession(): void {
  setApiToken(null);
}
