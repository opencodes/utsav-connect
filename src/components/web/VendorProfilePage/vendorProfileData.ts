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

export const EMPTY_VENDOR_SESSION: VendorDashboardSession = {
  vendorId: '',
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
};
