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

export type VendorServicePayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export type VendorProfileUpdatePayload = {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  pinCode: string;
  state: string;
  district: string;
  primaryLocation?: string;
  villagesServed?: string[];
  image?: string;
};

export async function updateVendorProfile(
  vendorId: string,
  body: VendorProfileUpdatePayload
): Promise<{ vendor: ListingCardItem & Record<string, unknown> }> {
  return apiRequest(`/vendors/${vendorId}`, {
    method: 'PATCH',
    body,
    auth: true,
  });
}

export async function addVendorService(
  vendorId: string,
  service: VendorServicePayload
): Promise<{ service: VendorServicePayload & { id: string; rating?: number; ratingCount?: number } }> {
  return apiRequest(`/vendors/${vendorId}/services`, {
    method: 'POST',
    body: service,
    auth: true,
  });
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
