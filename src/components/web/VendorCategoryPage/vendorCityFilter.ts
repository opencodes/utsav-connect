import { HERO_VENDOR_CITIES } from '../LandingPage/heroVendorSearch';
import { CITY_MATCH_TERMS, DEFAULT_CITY_VALUE } from '../../../data/cities';

/** Cities shown in vendor filters (excludes "All Cities") */
export const VENDOR_FILTER_CITIES = HERO_VENDOR_CITIES.filter((c) => c.value);

export function isAllCityValue(cityValue: string): boolean {
  return cityValue.trim().toLowerCase() === DEFAULT_CITY_VALUE;
}

export function getCityLabel(cityValue: string): string {
  if (!cityValue) return 'All cities';
  return VENDOR_FILTER_CITIES.find((c) => c.value === cityValue)?.label ?? cityValue;
}

export function vendorMatchesCity(location: string, cityValue: string): boolean {
  if (!cityValue.trim() || isAllCityValue(cityValue)) return true;
  const loc = location.toLowerCase();
  const terms = CITY_MATCH_TERMS[cityValue.toLowerCase()] ?? [cityValue.toLowerCase()];
  return terms.some((term) => loc.includes(term));
}
