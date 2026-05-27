import { HERO_VENDOR_CITIES } from '../LandingPage/heroVendorSearch';

/** Cities shown in vendor filters (excludes "All Cities") */
export const VENDOR_FILTER_CITIES = HERO_VENDOR_CITIES.filter((c) => c.value);

const CITY_MATCH_TERMS: Record<string, string[]> = {
  noida: ['noida', 'noida ncr', 'noida extension', 'ghaziabad', 'indirapuram'],
  delhi: ['delhi', 'ncr', 'new delhi', 'kamla nagar', 'chawri', 'chattarpur', 'tilak nagar'],
  gurgaon: ['gurgaon', 'gurugram', 'sohna'],
  faridabad: ['faridabad'],
  jaipur: ['jaipur'],
  mumbai: ['mumbai', 'bandra'],
};

export function getCityLabel(cityValue: string): string {
  if (!cityValue) return 'All cities';
  return VENDOR_FILTER_CITIES.find((c) => c.value === cityValue)?.label ?? cityValue;
}

export function vendorMatchesCity(location: string, cityValue: string): boolean {
  if (!cityValue.trim()) return true;
  const loc = location.toLowerCase();
  const terms = CITY_MATCH_TERMS[cityValue.toLowerCase()] ?? [cityValue.toLowerCase()];
  return terms.some((term) => loc.includes(term));
}
