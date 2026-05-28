/** Customer portal URL routing (History API, no extra deps). */

export interface NavigateData {
  restaurantId?: string;
  vendorId?: string;
  search?: string;
  categoryId?: string;
  city?: string;
  eventName?: string;
  location?: string;
  date?: string;
  eventType?: string;
  signInAs?: 'customer' | 'vendor' | 'planner';
  /** After event-planner registration, next customer sign-in enables planning tools. */
  eventPlannerSignup?: boolean;
  /** Homepage hero sent user here with event details already captured. */
  fromHome?: boolean;
}

export interface VendorSearchState {
  search: string;
  categoryId: string;
  city: string;
}

export interface EventPlannerSearchState {
  eventName: string;
  location: string;
  date: string;
  eventType: string;
}

export type AdminRouteAccess = 'platform' | 'planner';

/** Platform commerce tabs under /admin/{id} */
export const COMMERCE_ADMIN_TAB_IDS = [
  'dashboard',
  'restaurants',
  'orders',
  'customers',
  'marketing',
  'vendor-approvals',
  'vendor-categories',
] as const;

/** Event planner workspace tabs under /admin/{id} */
export const PLANNER_ADMIN_TAB_IDS = [
  'planner-dashboard',
  'planner-events',
  'planner-events-create',
  'planner-events-history',
  'planner-guests',
  'planner-feast',
  'planner-vendors',
  'planner-budget',
  'planner-chuman',
  'planner-inventory',
] as const;

const ALL_ADMIN_TAB_IDS = new Set<string>([
  ...COMMERCE_ADMIN_TAB_IDS,
  ...PLANNER_ADMIN_TAB_IDS,
]);

export function adminTabPath(tab: string): string {
  return `/admin/${encodeURIComponent(tab.trim())}`;
}

export function isCommerceAdminTab(tab: string): boolean {
  return (COMMERCE_ADMIN_TAB_IDS as readonly string[]).includes(tab);
}

export function isPlannerAdminTab(tab: string): boolean {
  return (PLANNER_ADMIN_TAB_IDS as readonly string[]).includes(tab);
}

/** Pick a valid tab for the current admin session (planner vs platform). */
export function resolveAdminTab(
  tab: string | undefined,
  options: { plannerWorkspace: boolean; platformAdmin: boolean }
): string {
  const requested = tab?.trim() ?? '';
  if (requested && ALL_ADMIN_TAB_IDS.has(requested)) {
    if (options.plannerWorkspace && !options.platformAdmin) {
      return isPlannerAdminTab(requested) ? requested : 'planner-dashboard';
    }
    if (options.platformAdmin && !options.plannerWorkspace) {
      return isCommerceAdminTab(requested) ? requested : 'dashboard';
    }
    if (isCommerceAdminTab(requested) || isPlannerAdminTab(requested)) {
      return requested;
    }
  }
  if (options.plannerWorkspace) {
    return 'planner-dashboard';
  }
  if (options.platformAdmin) {
    return 'dashboard';
  }
  return 'planner-dashboard';
}

export interface ParsedRoute {
  page: string;
  admin?: boolean;
  adminTab?: string;
  /** Bypasses stale auth state when opening admin right after sign-in. */
  adminAccess?: AdminRouteAccess;
  root?: boolean;
  restaurantId?: string;
  vendorId?: string;
  vendorSearch?: VendorSearchState;
  eventPlannerSearch?: EventPlannerSearchState;
}

const EMPTY_VENDOR_SEARCH: VendorSearchState = { search: '', categoryId: '', city: '' };
const EMPTY_EVENT_SEARCH: EventPlannerSearchState = {
  eventName: '',
  location: '',
  date: '',
  eventType: '',
};

function vendorSearchFromParams(params: URLSearchParams): VendorSearchState {
  return {
    search: params.get('q') ?? '',
    categoryId: params.get('category') ?? '',
    city: params.get('city') ?? '',
  };
}

function eventSearchFromParams(params: URLSearchParams): EventPlannerSearchState {
  return {
    eventName: params.get('event') ?? '',
    location: params.get('location') ?? '',
    date: params.get('date') ?? '',
    eventType: params.get('type') ?? '',
  };
}

/** Map internal page id → browser path (+ query). */
export function pageToPath(
  page: string,
  data?: NavigateData,
  fallbackCity = ''
): string {
  const params = new URLSearchParams();

  switch (page) {
    case 'landing':
      return '/';
    case 'vendor-categories': {
      const city = data?.city ?? fallbackCity;
      if (city) params.set('city', city);
      const qs = params.toString();
      return `/vendors/categories${qs ? `?${qs}` : ''}`;
    }
    case 'vendor-list': {
      if (data?.search) params.set('q', data.search);
      if (data?.categoryId) params.set('category', data.categoryId);
      const city = data?.city ?? fallbackCity;
      if (city) params.set('city', city);
      const qs = params.toString();
      return `/vendors${qs ? `?${qs}` : ''}`;
    }
    case 'vendor-details':
      return data?.vendorId
        ? `/vendors/${encodeURIComponent(data.vendorId)}`
        : '/vendors';
    case 'restaurants':
      return '/restaurants';
    case 'restaurant-detail':
      return data?.restaurantId
        ? `/restaurants/${encodeURIComponent(data.restaurantId)}`
        : '/restaurants';
    case 'cart':
      return '/cart';
    case 'sign-in':
      return '/sign-in';
    case 'platform-sign-in':
      return '/platform/sign-in';
    case 'profile':
      return '/profile';
    case 'account':
      return '/account';
    case 'celebrations': {
      if (data?.eventName) params.set('event', data.eventName);
      if (data?.location) params.set('location', data.location);
      if (data?.date) params.set('date', data.date);
      if (data?.eventType) params.set('type', data.eventType);
      const qs = params.toString();
      return `/events${qs ? `?${qs}` : ''}`;
    }
    case 'portfolio':
      return '/portfolio';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'list-your-service':
      return '/list-your-service';
    case 'event-planner-register':
      return '/event-planner/register';
    case 'how-it-works':
      return '/how-it-works';
    case 'terms':
      return '/terms';
    case 'privacy':
      return '/privacy';
    case 'cancellation':
      return '/cancellation';
    default:
      return '/';
  }
}

/** Parse current `window.location` into app route state. */
export function parseLocation(
  pathname = window.location.pathname,
  search = window.location.search
): ParsedRoute {
  const params = new URLSearchParams(search);
  const path = pathname.replace(/\/+$/, '') || '/';

  const adminTabMatch = path.match(/^\/admin\/([^/]+)$/);
  if (adminTabMatch) {
    return {
      page: 'landing',
      admin: true,
      adminTab: decodeURIComponent(adminTabMatch[1]),
    };
  }

  if (path === '/admin') {
    return { page: 'landing', admin: true };
  }

  if (path === '/root') {
    return { page: 'landing', root: true };
  }

  if (path === '/platform/sign-in') {
    return { page: 'platform-sign-in' };
  }

  if (path === '/' || path === '/home') {
    return { page: 'landing' };
  }

  if (path === '/vendors/categories') {
    return {
      page: 'vendor-categories',
      vendorSearch: { ...EMPTY_VENDOR_SEARCH, city: params.get('city') ?? '' },
    };
  }

  if (path === '/vendors') {
    return { page: 'vendor-list', vendorSearch: vendorSearchFromParams(params) };
  }

  const vendorMatch = path.match(/^\/vendors\/([^/]+)$/);
  if (vendorMatch) {
    return {
      page: 'vendor-details',
      vendorId: decodeURIComponent(vendorMatch[1]),
    };
  }

  if (path === '/restaurants') {
    return { page: 'restaurants' };
  }

  const restMatch = path.match(/^\/restaurants\/([^/]+)$/);
  if (restMatch) {
    return {
      page: 'restaurant-detail',
      restaurantId: decodeURIComponent(restMatch[1]),
    };
  }

  const staticPages: Record<string, string> = {
    '/cart': 'cart',
    '/sign-in': 'sign-in',
    '/platform/sign-in': 'platform-sign-in',
    '/profile': 'profile',
    '/account': 'account',
    '/events': 'celebrations',
    '/portfolio': 'portfolio',
    '/about': 'about',
    '/contact': 'contact',
    '/list-your-service': 'list-your-service',
    '/event-planner/register': 'event-planner-register',
    '/how-it-works': 'how-it-works',
    '/terms': 'terms',
    '/privacy': 'privacy',
    '/cancellation': 'cancellation',
  };

  if (staticPages[path]) {
    const page = staticPages[path];
    if (page === 'celebrations') {
      return { page, eventPlannerSearch: eventSearchFromParams(params) };
    }
    return { page };
  }

  return { page: 'landing' };
}

export function pushRoute(path: string) {
  window.history.pushState({ path }, '', path);
}

export function replaceRoute(path: string) {
  window.history.replaceState({ path }, '', path);
}
