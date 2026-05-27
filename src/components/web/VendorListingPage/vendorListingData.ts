import { ListingCardItem } from '../VendorCategoryPage/VendorGridCard';
import { WEDDING_CATEGORIES } from '../VendorCategoryPage/CategoriesGrid';

export interface VendorListingItem extends ListingCardItem {
  categoryLabel: string;
  featuredServices: string[];
  responseTimeMins: number;
  distance: number;
  offerText?: string;
  hasFestiveDeal?: boolean;
  isTopRated?: boolean;
}

const FEATURED_BY_CATEGORY: Record<string, string[]> = {
  venues: ['Banquet halls', 'Lawn weddings', 'Catering tie-ups'],
  photographers: ['Candid shots', 'Cinematic film', 'Album delivery'],
  makeup: ['Bridal HD', 'Family makeup', 'Hair styling'],
  'planning-decor': ['Mandap décor', 'Floral themes', 'Day coordination'],
  food: ['Satvik menu', 'Live counters', 'Tasting session'],
  pandits: ['Vivah sanskar', 'Muhurat', 'Samagri guide'],
  mehndi: ['Bridal mehendi', 'Arabic designs', 'Guest packages'],
  'music-dance': ['Sangeet choreo', 'DJ & band', 'Baraat entry'],
};

const OFFERS: Record<string, string> = {
  venues: 'Early booking — complimentary welcome drinks',
  photographers: 'Free teaser reel on full-day package',
  makeup: 'Bridal trial included with full package',
  food: '10% off for 200+ guest bookings',
};

export function enrichVendorForListing(vendor: ListingCardItem): VendorListingItem {
  const categoryLabel =
    WEDDING_CATEGORIES.find((c) => c.id === vendor.category)?.name ?? 'Vendor';

  return {
    ...vendor,
    categoryLabel,
    featuredServices: FEATURED_BY_CATEGORY[vendor.category] ?? [
      'Consultation',
      'Custom packages',
      'On-day support',
    ],
    responseTimeMins: 120 + (vendor.id.charCodeAt(0) % 4) * 60,
    distance: 2 + (vendor.id.charCodeAt(1) % 8) * 0.6,
    offerText: vendor.rating >= 4.8 ? OFFERS[vendor.category] : undefined,
    hasFestiveDeal: vendor.rating >= 4.8,
    isTopRated: vendor.rating >= 4.8,
  };
}

export function parseVendorPrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
