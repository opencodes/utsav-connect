import { apiRequest } from './client';
import type { AdminStats, MarketingCampaign, Restaurant } from '../types';

export async function fetchAdminStats(): Promise<AdminStats> {
  const data = await apiRequest<{ stats: AdminStats }>('/admin/stats', { auth: true });
  return data.stats;
}

export type AdminCustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: string;
  ordersCount: number;
};

export async function fetchAdminCustomers(): Promise<AdminCustomerRow[]> {
  const data = await apiRequest<{ customers: AdminCustomerRow[] }>('/admin/customers', {
    auth: true,
  });
  return data.customers ?? [];
}

export type AdminOrderRow = {
  id: string;
  customer: string;
  restaurant: string;
  items: string;
  amount: number;
  status: string;
  time: string;
  address: string;
  phone: string;
  partner?: string;
};

function mapAdminOrder(raw: Record<string, unknown>): AdminOrderRow {
  return {
    id: String(raw.orderId ?? raw.id ?? ''),
    customer: String(raw.customerName ?? 'Customer'),
    restaurant: String(raw.restaurantName ?? ''),
    items: String(raw.itemsSummary ?? ''),
    amount: Number(raw.totalAmount ?? raw.amount ?? 0),
    status: String(raw.status ?? 'Pending'),
    time: String(raw.time ?? ''),
    address: String(raw.address ?? '—'),
    phone: String(raw.phone ?? '—'),
    partner: raw.partner ? String(raw.partner) : undefined,
  };
}

export async function fetchAdminOrders(status?: string): Promise<AdminOrderRow[]> {
  const data = await apiRequest<{ orders: Record<string, unknown>[] }>('/admin/orders', {
    auth: true,
    query: { status },
  });
  return (data.orders ?? []).map(mapAdminOrder);
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  await apiRequest(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    auth: true,
    body: { status },
  });
}

export async function createRestaurant(body: Record<string, unknown>): Promise<Restaurant> {
  const data = await apiRequest<{ restaurant: Restaurant }>('/admin/restaurants', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.restaurant;
}

export async function updateRestaurant(
  id: string,
  body: Record<string, unknown>
): Promise<Restaurant> {
  const data = await apiRequest<{ restaurant: Restaurant }>(`/admin/restaurants/${id}`, {
    method: 'PUT',
    auth: true,
    body,
  });
  return data.restaurant;
}

export async function deleteRestaurant(id: string): Promise<void> {
  await apiRequest(`/admin/restaurants/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function fetchCampaigns(): Promise<MarketingCampaign[]> {
  const data = await apiRequest<{ campaigns: MarketingCampaign[] }>('/campaigns');
  return data.campaigns ?? [];
}

export async function createCampaign(body: Record<string, unknown>): Promise<MarketingCampaign> {
  const data = await apiRequest<{ campaign: MarketingCampaign }>('/admin/campaigns', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.campaign;
}

export async function updateCampaign(
  id: string,
  body: Record<string, unknown>
): Promise<MarketingCampaign> {
  const data = await apiRequest<{ campaign: MarketingCampaign }>(`/admin/campaigns/${id}`, {
    method: 'PATCH',
    auth: true,
    body,
  });
  return data.campaign;
}

export type AdminVendorRow = {
  id: string;
  name: string;
  category: string;
  location: string;
  state?: string;
  district?: string;
  contactName?: string;
  contactEmail: string;
  contactPhone: string;
  description?: string;
  status: string;
  image?: string;
  price?: string;
};

export async function fetchAdminVendors(params?: {
  status?: string;
  category?: string;
  q?: string;
}): Promise<AdminVendorRow[]> {
  const data = await apiRequest<{ vendors: Record<string, unknown>[] }>('/admin/vendors', {
    auth: true,
    query: params,
  });
  return (data.vendors ?? []).map((raw) => ({
    id: String(raw.id ?? raw.listingId ?? ''),
    name: String(raw.name ?? ''),
    category: String(raw.category ?? ''),
    location: String(raw.location ?? ''),
    state: raw.state ? String(raw.state) : undefined,
    district: raw.district ? String(raw.district) : undefined,
    contactName: raw.contactName ? String(raw.contactName) : undefined,
    contactEmail: String(raw.contactEmail ?? ''),
    contactPhone: String(raw.contactPhone ?? ''),
    description: raw.description ? String(raw.description) : undefined,
    status: String(raw.status ?? 'pending_review'),
    image: raw.image ? String(raw.image) : undefined,
    price: raw.price ? String(raw.price) : undefined,
  }));
}

export async function updateAdminVendorStatus(
  vendorId: string,
  status: 'pending_review' | 'approved' | 'rejected'
): Promise<AdminVendorRow> {
  const data = await apiRequest<{ vendor: Record<string, unknown> }>(
    `/admin/vendors/${vendorId}/status`,
    {
      method: 'PATCH',
      auth: true,
      body: { status },
    }
  );
  const raw = data.vendor;
  return {
    id: String(raw.id ?? raw.listingId ?? vendorId),
    name: String(raw.name ?? ''),
    category: String(raw.category ?? ''),
    location: String(raw.location ?? ''),
    state: raw.state ? String(raw.state) : undefined,
    district: raw.district ? String(raw.district) : undefined,
    contactName: raw.contactName ? String(raw.contactName) : undefined,
    contactEmail: String(raw.contactEmail ?? ''),
    contactPhone: String(raw.contactPhone ?? ''),
    description: raw.description ? String(raw.description) : undefined,
    status: String(raw.status ?? status),
  };
}

export type AdminVendorCategory = { id: string; name: string };

export async function fetchAdminVendorCategories(): Promise<AdminVendorCategory[]> {
  const data = await apiRequest<{ categories: AdminVendorCategory[] }>('/admin/vendor-categories', {
    auth: true,
  });
  return data.categories ?? [];
}

export async function createAdminVendorCategory(body: {
  id: string;
  name: string;
}): Promise<AdminVendorCategory> {
  const data = await apiRequest<{ category: AdminVendorCategory }>('/admin/vendor-categories', {
    method: 'POST',
    auth: true,
    body,
  });
  return data.category;
}

export async function updateAdminVendorCategory(
  id: string,
  body: { name: string }
): Promise<AdminVendorCategory> {
  const data = await apiRequest<{ category: AdminVendorCategory }>(
    `/admin/vendor-categories/${id}`,
    {
      method: 'PUT',
      auth: true,
      body,
    }
  );
  return data.category;
}

export async function deleteAdminVendorCategory(id: string): Promise<void> {
  await apiRequest(`/admin/vendor-categories/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
