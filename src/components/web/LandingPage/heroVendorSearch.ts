export interface HeroVendorSearchPayload {
  search?: string;
  categoryId?: string;
  city?: string;
}

export const HERO_VENDOR_CITIES = [
  { value: '', label: 'All Cities' },
  { value: 'noida', label: 'Noida' },
  { value: 'delhi', label: 'Delhi NCR' },
  { value: 'gurgaon', label: 'Gurgaon' },
  { value: 'faridabad', label: 'Faridabad' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'mumbai', label: 'Mumbai' },
];

