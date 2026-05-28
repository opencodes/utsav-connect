import { apiRequest } from './client';
import { setApiToken } from './config';

export type PlatformUser = {
  id: string;
  username: string;
  role: 'root' | 'admin';
  name: string;
  email: string;
  active: boolean;
};

export type PlatformAuthSession = {
  token: string;
  user: PlatformUser;
};

export async function signInPlatform(
  username: string,
  password: string
): Promise<PlatformAuthSession> {
  const data = await apiRequest<PlatformAuthSession>('/auth/platform/sign-in', {
    method: 'POST',
    body: { username, password },
  });
  setApiToken(data.token);
  return data;
}

export async function fetchPlatformMe(): Promise<PlatformUser> {
  const data = await apiRequest<{ user: PlatformUser }>('/auth/me', { auth: true });
  return data.user;
}

export type RootAdminRow = PlatformUser;

export async function fetchRootAdmins(): Promise<RootAdminRow[]> {
  const data = await apiRequest<{ admins: RootAdminRow[] }>('/root/admins', { auth: true });
  return data.admins ?? [];
}

export async function createRootAdmin(body: {
  username: string;
  password: string;
  name: string;
  email?: string;
}): Promise<RootAdminRow> {
  const data = await apiRequest<{ admin: RootAdminRow }>('/root/admins', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.admin;
}

export function clearPlatformSession(): void {
  setApiToken(null);
}

export async function updateRootAdmin(
  id: string,
  body: { name?: string; email?: string; password?: string; active?: boolean }
): Promise<RootAdminRow> {
  const data = await apiRequest<{ admin: RootAdminRow }>(`/root/admins/${id}`, {
    method: 'PATCH',
    auth: true,
    body,
  });
  return data.admin;
}
