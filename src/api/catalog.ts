import { apiRequest } from './client';

export type CatalogCoupon = {
  code: string;
  discount: string;
  desc: string;
};

export type VendorCategoryItem = {
  id: string;
  name: string;
};

export async function fetchCoupons(): Promise<CatalogCoupon[]> {
  const data = await apiRequest<{ coupons: CatalogCoupon[] }>('/catalog/coupons');
  return data.coupons ?? [];
}

export async function fetchVendorCategories(): Promise<VendorCategoryItem[]> {
  const data = await apiRequest<{ categories: VendorCategoryItem[] }>(
    '/catalog/vendor-categories'
  );
  return data.categories ?? [];
}
