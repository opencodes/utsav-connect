import { apiRequest } from './client';
import type { OrderHistoryItem, SavedAddress, UserProfile } from '../types';

export async function fetchUserProfile(): Promise<UserProfile> {
  const data = await apiRequest<{
    profile: {
      name: string;
      email: string;
      phone: string;
      customerType?: UserProfile['customerType'];
      role?: UserProfile['role'];
      walletBalance: number;
      royaltyPoints: number;
      addresses: SavedAddress[];
      orders: OrderHistoryItem[];
      supportTickets: UserProfile['supportTickets'];
    };
  }>('/users/me', { auth: true });

  const p = data.profile;
  return {
    name: p.name,
    email: p.email,
    phone: p.phone,
    customerType: p.customerType ?? 'standard',
    role: p.role ?? 'customer',
    walletBalance: p.walletBalance ?? 0,
    royaltyPoints: p.royaltyPoints ?? 0,
    addresses: p.addresses ?? [],
    orders: p.orders ?? [],
    supportTickets: p.supportTickets ?? [],
  };
}

export async function updateUserProfile(
  patch: Partial<Pick<UserProfile, 'name' | 'email' | 'phone' | 'walletBalance' | 'royaltyPoints' | 'customerType'>>
): Promise<UserProfile> {
  const data = await apiRequest<{ profile: UserProfile }>('/users/me', {
    method: 'PATCH',
    auth: true,
    body: patch,
  });
  return data.profile;
}

export async function addUserAddress(address: Omit<SavedAddress, 'id'> & { type?: string }): Promise<SavedAddress> {
  const data = await apiRequest<{ address: SavedAddress }>('/users/me/addresses', {
    method: 'POST',
    auth: true,
    body: address,
  });
  return data.address;
}
