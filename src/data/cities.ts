export type CityOption = {
  value: string;
  label: string;
};

export const DEFAULT_CITY_VALUE = 'all';
export const DEFAULT_LOCATION_LABEL = 'Sitamarhi, Bihar';
export const DEFAULT_CITY_REGION_LABEL = 'Sitamarhi, Bihar';
export const DEFAULT_COUNTRY_CITY_LABEL = 'Sitamarhi, India';
export const CONTACT_CITY_PLACEHOLDER = 'e.g. Sitamarhi, Bihar';
export const TRENDING_AREA_LABEL = 'Sitamarhi';
export const RESTAURANT_HUB_ADDRESS =
  'Sitamarhi, Bihar, opposite major water fountain (Utsav hub)';

export const OFFICE_ADDRESS_LINES = [
  'Sitamarhi, Bihar, 843101',
  'Bihar, India',
] as const;

/**
 * Single source of truth for cities across the app.
 *
 * - `value`: stable URL/storage-safe identifier (prefer lowercase slugs)
 * - `label`: UI label
 */
export const CITY_OPTIONS: CityOption[] = [
  { value: 'all', label: 'India' },
  { value: 'sitamarhi', label: 'Sitamarhi' },
  { value: 'madhubani', label: 'Madhubani' },
];

export const HERO_VENDOR_CITIES: CityOption[] = CITY_OPTIONS;

export const POPULAR_LOCALITIES: ReadonlyArray<{ label: string; city: string }> = [
  { label: 'India', city: 'all' },
  { label: 'Sitamarhi', city: 'sitamarhi' },
  { label: 'Madhubani', city: 'madhubani' },
];

export const CITY_MATCH_TERMS: Record<string, string[]> = {
  all: ['all'],
  sitamarhi: ['sitamarhi'],
  madhubani: ['madhubani'],
};

