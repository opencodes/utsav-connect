import { apiRequest } from './client';
import { clearAuthSession } from '../authStorage';
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
  params: { phone?: string; email?: string },
  password: string,
  profile?: { name?: string; customerType?: CustomerType }
): Promise<AuthSession> {
  const data = await apiRequest<AuthSession>('/auth/sign-in', {
    method: 'POST',
    body: {
      phone: params.phone,
      email: params.email,
      password,
      name: profile?.name,
      customerType: profile?.customerType ?? 'standard',
    },
  });
  setApiToken(data.token);
  return data;
}

export async function signInVendor(
  params: { phone?: string; email?: string },
  password: string,
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
      body: {
        phone: params.phone,
        email: params.email,
        password,
        ...vendorMeta,
      },
    }
  );
  setApiToken(data.token);
  return data;
}

export type PlannerRegisterResult = {
  registered: boolean;
  user: ApiUser;
  workspace?: { eventId: string; eventName: string };
};

/** Saves planner account + first event only when registration form is submitted (end of flow). */
export async function registerEventPlanner(
  payload: Record<string, unknown>
): Promise<PlannerRegisterResult> {
  return apiRequest<PlannerRegisterResult>('/auth/register/planner', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchAuthMe(): Promise<{ user: ApiUser }> {
  return apiRequest<{ user: ApiUser }>('/auth/me', { auth: true });
}

export function clearApiSession(): void {
  clearAuthSession();
}
