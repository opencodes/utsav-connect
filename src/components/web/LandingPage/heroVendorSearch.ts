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

export const HERO_VENDOR_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'venues', label: 'Venues & Banquets' },
  { value: 'food', label: 'Catering & Halwai' },
  { value: 'planning-decor', label: 'Decor & Mandap' },
  { value: 'photographers', label: 'Photo & Video' },
  { value: 'makeup', label: 'Bridal & Beauty' },
  { value: 'music-dance', label: 'Music & Sangeet' },
  { value: 'pandits', label: 'Pandits & Rituals' },
];
