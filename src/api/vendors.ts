import { apiRequest } from './client';
import type { ListingCardItem } from '../components/web/VendorCategoryPage/VendorGridCard';

export async function fetchVendors(params?: {
  category?: string;
  city?: string;
  q?: string;
}): Promise<ListingCardItem[]> {
  const data = await apiRequest<{ vendors: ListingCardItem[] }>('/vendors', {
    query: {
      category: params?.category,
      city: params?.city,
      q: params?.q,
    },
  });
  return data.vendors ?? [];
}

export async function fetchVendor(id: string): Promise<ListingCardItem | null> {
  try {
    const data = await apiRequest<{ vendor: ListingCardItem }>(`/vendors/${id}`);
    return data.vendor ?? null;
  } catch {
    return null;
  }
}

export async function registerVendor(body: Record<string, unknown>): Promise<ListingCardItem> {
  const data = await apiRequest<{ vendor: ListingCardItem }>('/vendors/register', {
    method: 'POST',
    body,
  });
  return data.vendor;
}

export async function submitVendorEnquiry(
  vendorId: string,
  body: {
    guestName: string;
    eventType?: string;
    eventDate?: string;
    guests?: string;
    message?: string;
  }
): Promise<{ enquiry: { id: string } }> {
  return apiRequest(`/vendors/${vendorId}/enquiries`, {
    method: 'POST',
    body: {
      guestName: body.guestName,
      eventType: body.eventType ?? 'Wedding',
      eventDate: body.eventDate ?? '',
      guests: body.guests ?? '',
      message: body.message ?? '',
    },
  });
}

export type VendorEnquiry = {
  id: string;
  vendorId: string;
  guestName: string;
  eventType: string;
  eventDate: string;
  guests: string;
  status: string;
  receivedAt: string;
  message: string;
};

export async function fetchVendorEnquiries(vendorId: string): Promise<VendorEnquiry[]> {
  const data = await apiRequest<{ enquiries: VendorEnquiry[] }>(
    `/vendors/${vendorId}/enquiries`,
    { auth: true }
  );
  return data.enquiries ?? [];
}
