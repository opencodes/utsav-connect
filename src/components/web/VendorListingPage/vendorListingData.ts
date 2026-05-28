import { getCategoryLabel } from '../../../vendorCategories';
import { ListingCardItem } from '../VendorCategoryPage/VendorGridCard';

export interface VendorListingItem extends ListingCardItem {
  categoryLabel: string;
  featuredServices: string[];
  responseTimeMins: number;
  distance: number;
  offerText?: string;
  hasFestiveDeal?: boolean;
  isTopRated?: boolean;
}

export function enrichVendorForListing(vendor: ListingCardItem): VendorListingItem {
  return {
    ...vendor,
    categoryLabel: getCategoryLabel(vendor.category),
    featuredServices: [],
    responseTimeMins: 0,
    distance: 0,
    offerText: undefined,
    hasFestiveDeal: false,
    isTopRated: vendor.rating >= 4.8,
  };
}

export function parseVendorPrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
