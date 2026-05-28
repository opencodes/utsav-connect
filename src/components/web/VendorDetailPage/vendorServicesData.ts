import { ListingCardItem } from '../VendorCategoryPage/VendorGridCard';

export interface VendorServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  image: string;
  category: string;
  villagesServed?: string[];
  isPopular?: boolean;
  isFestiveSpecial?: boolean;
}

export interface VendorDetailProfile extends ListingCardItem {
  ratingCount: number;
  responseTime: string;
  distance: number;
  offerText?: string;
  tagline: string;
  services: VendorServiceItem[];
  businessAddress?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  city?: string;
  villagesServed?: string[];
}

type VendorWithExtras = ListingCardItem & {
  ratingCount?: number;
  responseTime?: string;
  distance?: number;
  offerText?: string;
  services?: VendorServiceItem[];
  businessAddress?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  city?: string;
  villagesServed?: string[];
};

export function buildVendorDetailProfile(vendor: ListingCardItem): VendorDetailProfile {
  const extended = vendor as VendorWithExtras;
  return {
    ...vendor,
    ratingCount: extended.ratingCount ?? 0,
    responseTime: extended.responseTime ?? '',
    distance: extended.distance ?? 0,
    offerText: extended.offerText,
    tagline: vendor.location,
    services: extended.services ?? [],
    businessAddress: extended.businessAddress,
    addressLine1: extended.addressLine1,
    addressLine2: extended.addressLine2,
    landmark: extended.landmark,
    pinCode: extended.pinCode,
    state: extended.state,
    district: extended.district,
    city: extended.city,
    villagesServed: extended.villagesServed ?? [],
  };
}
