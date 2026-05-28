import type { AdminStats } from './types';

/** Zeroed commerce admin metrics — no mock/demo values. */
export const EMPTY_ADMIN_STATS: AdminStats = {
  totalOrders: 0,
  totalRevenue: 0,
  activeCustomers: 0,
  activeRestaurants: 0,
  pendingVendors: 0,
  revenueTrend: [],
  categorySales: [],
  recentOrders: [],
};
