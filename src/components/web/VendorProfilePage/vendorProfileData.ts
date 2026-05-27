import { ALL_MOCK_VENDORS } from '../VendorCategoryPage/mockData';
import { buildVendorDetailProfile } from '../VendorDetailPage/vendorServicesData';

/** Default logged-in vendor listing (demo). */
export const DEFAULT_VENDOR_LISTING_ID = 'vn-4';

export interface VendorEnquiry {
  id: string;
  guestName: string;
  eventType: string;
  eventDate: string;
  guests: string;
  status: 'New' | 'Replied' | 'Booked' | 'Closed';
  receivedAt: string;
  message: string;
}

export interface VendorDashboardSession {
  vendorId: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
}

export const MOCK_VENDOR_SESSION: VendorDashboardSession = {
  vendorId: DEFAULT_VENDOR_LISTING_ID,
  businessName: 'Shakuntalam Lawn & Resort',
  contactName: 'Rajesh Kumar',
  email: 'bookings@shakuntalam.in',
  phone: '+91 98765 43210',
};

export const MOCK_VENDOR_ENQUIRIES: VendorEnquiry[] = [
  {
    id: 'ENQ-2401',
    guestName: 'Priya & Arjun',
    eventType: 'Wedding reception',
    eventDate: '2026-11-14',
    guests: '250–300',
    status: 'New',
    receivedAt: '2 hours ago',
    message: 'Looking for lawn + catering package. Prefer vegetarian menu with live chaat counter.',
  },
  {
    id: 'ENQ-2398',
    guestName: 'Mehta family',
    eventType: 'Sangeet + wedding',
    eventDate: '2026-12-02',
    guests: '400+',
    status: 'Replied',
    receivedAt: 'Yesterday',
    message: 'Need full-day venue with mandap setup. Please share availability and per-plate pricing.',
  },
  {
    id: 'ENQ-2391',
    guestName: 'Ananya Sharma',
    eventType: 'Engagement',
    eventDate: '2026-09-20',
    guests: '80–100',
    status: 'Booked',
    receivedAt: '5 days ago',
    message: 'Intimate evening event. Hall only, own decorator.',
  },
];

export function getVendorDashboardListing(vendorId: string) {
  const listing = ALL_MOCK_VENDORS.find((v) => v.id === vendorId);
  if (!listing) return null;
  return buildVendorDetailProfile(listing);
}
