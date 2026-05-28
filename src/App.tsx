import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Customers views imports
import { CustomerHeader } from './components/web/CustomerHeader';
import { Footer } from './components/web/Footer';
import { LandingPage } from './components/web/LandingPage';
import { RestaurantListingPage } from './components/web/RestaurantListingPage';
import { RestaurantDetailPage } from './components/web/RestaurantDetailPage';
import { CartPage } from './components/web/CartPage';
import { UserProfilePage } from './components/web/UserProfilePage';
import { VendorProfilePage } from './components/web/VendorProfilePage';
import { VendorProfileGate } from './components/web/VendorProfileGate';
import {
  EMPTY_VENDOR_SESSION,
  type VendorDashboardSession,
} from './components/web/VendorProfilePage/vendorProfileData';
import { VendorCategoryPage } from './components/web/VendorCategoryPage';
import { VendorListPage } from './components/web/VendorListPage';
import { VendorDetailsPage } from './components/web/VendorDetailsPage';
import { PlannedEventsShowcase } from './components/web/PlannedEventsShowcase';
import { PortfolioPage } from './components/web/PortfolioPage';
import { AboutUsPage } from './components/web/AboutUsPage';
import { ContactUsPage } from './components/web/ContactUsPage';
import { VendorRegistrationPage } from './components/web/VendorRegistrationPage';
import { HowItWorksPage } from './components/web/HowItWorksPage';
import { TermsPage } from './components/web/TermsPage';
import { PrivacyPolicyPage } from './components/web/PrivacyPolicyPage';
import { CancellationPolicyPage } from './components/web/CancellationPolicyPage';
import { SignInPage, type SignInMode } from './components/web/SignInPage';
import { EventPlannerRegistrationPage } from './components/web/EventPlannerRegistrationPage';
import { MarigoldToran, RangoliMandala } from './components/web/GoldenDeco';
import { LANDING_HERO_SHELL_CLASS } from './components/web/landingHeroShell';

// Admin panel views imports
import { AdminSidebar } from './components/Admin/Sidebar/AdminSidebar';
import { AdminHeader } from './components/Admin/Header/AdminHeader';
import { AdminDashboard } from './components/Admin/Dashboard/AdminDashboard';
import { PlannerDashboard } from './components/PlannerDashboard';
import { AdminManagement } from './components/Admin/Management/AdminManagement';
import { AdminOrders } from './components/Admin/Orders/AdminOrders';
import { AdminCustomers } from './components/Admin/Customers/AdminCustomers';
import { AdminMarketing } from './components/Admin/Marketing/AdminMarketing';
import { AdminVendors } from './components/Admin/Vendors/AdminVendors';
import { AdminVendorCategories } from './components/Admin/Vendors/AdminVendorCategories';
import { AdminEmptyState } from './components/Admin/AdminEmptyState';
import { buildAdminSessionDisplay } from './components/Admin/adminSessionDisplay';
import { PlatformSignInPage } from './components/Admin/PlatformSignInPage';
import { RootSidebar } from './components/Admin/Root/RootSidebar';
import { RootAdminUsers } from './components/Admin/Root/RootAdminUsers';
import { fetchPlatformMe, type PlatformUser } from './api/platform';

// Wedding & Traditional Planner Imports
import { PlannerEvents } from './components/PlannerEvents';
import { PlannerEventsCreate } from './components/PlannerEventsCreate';
import { PlannerEventsHistory } from './components/PlannerEventsHistory';
import { PlannerGuests } from './components/PlannerGuests';
import { PlannerFeast } from './components/PlannerFeast';
import { PlannerVendors } from './components/PlannerVendors';
import { PlannerBudget } from './components/PlannerBudget';
import { PlannerChuman } from './components/PlannerChuman';
import { PlannerInventory } from './components/PlannerInventory';

// Types & Data
import { FoodItem, CartItem, UserProfile } from './types';
import { EMPTY_USER_PROFILE } from './data';
import type { CustomerType } from './types';
import {
  type AdminRouteAccess,
  adminTabPath,
  COMMERCE_ADMIN_TAB_IDS,
  type NavigateData,
  type ParsedRoute,
  pageToPath,
  parseLocation,
  pushRoute,
  replaceRoute,
  resolveAdminTab,
} from './routing';
import { hydratePlannerFromApi, purgeLegacyPlannerSeedData } from './plannerStorage';
import {
  signInCustomer,
  signInVendor,
  registerEventPlanner,
  fetchAuthMe,
} from './api/auth';
import { getApiToken, setApiToken } from './api/config';
import {
  applyPersistedAuthToState,
  authKindFromState,
  clearAuthSession,
  hasPersistedSession,
  isAuthUnauthorizedError,
  readPersistedAuth,
  resolveAuthKind,
  writePersistedAuth,
} from './authStorage';
import { fetchUserProfile } from './api/users';
import { createOrder } from './api/orders';
import { ApiError } from './api/client';
import { DEFAULT_CITY_VALUE, DEFAULT_LOCATION_LABEL } from './data/cities';

function getInitialRoute(): ParsedRoute {
  return parseLocation();
}

const COMMERCE_ADMIN_TABS = new Set<string>(COMMERCE_ADMIN_TAB_IDS);

function isPlannerCustomer(loggedIn: boolean, customerType?: CustomerType): boolean {
  return loggedIn && customerType === 'event-planner';
}

function canAccessAdminRoute(
  isPlatformOperator: boolean,
  isLoggedIn: boolean,
  customerType: CustomerType | undefined,
  adminAccess?: AdminRouteAccess
): boolean {
  if (adminAccess === 'platform') {
    return true;
  }
  if (adminAccess === 'planner') {
    return true;
  }
  return isPlatformOperator || isPlannerCustomer(isLoggedIn, customerType);
}

export default function App() {
  const initialRoute = getInitialRoute();

  const storedAuth = readPersistedAuth();
  const storedSessionActive = hasPersistedSession(storedAuth);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    if (!initialRoute.admin || !storedSessionActive) {
      return false;
    }
    return canAccessAdminRoute(
      storedAuth.platformUser?.role === 'admin' || storedAuth.platformUser?.role === 'root',
      Boolean(storedAuth.isLoggedIn),
      storedAuth.userProfile?.customerType
    );
  });
  const [isRootMode, setIsRootMode] = useState(
    () => Boolean(initialRoute.root && storedAuth.platformUser?.role === 'root')
  );

  // Customer states info
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (initialRoute.page === 'platform-sign-in') return 'platform-sign-in';
    return initialRoute.page;
  });
  const [selectedCity, setSelectedCity] = useState(
    initialRoute.vendorSearch?.city || DEFAULT_CITY_VALUE
  );
  const [currentLocation, setCurrentLocation] = useState<string>(DEFAULT_LOCATION_LABEL);
  const [selectedRestId, setSelectedRestId] = useState<string>(
    initialRoute.restaurantId || 'rest-1'
  );
  const [selectedVendorId, setSelectedVendorId] = useState<string>(initialRoute.vendorId || '');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    ...EMPTY_USER_PROFILE,
    ...(storedAuth.userProfile ?? {}),
  }));
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => storedSessionActive && resolveAuthKind(storedAuth) === 'customer'
  );
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    () => storedSessionActive && resolveAuthKind(storedAuth) === 'vendor'
  );
  const [authHydrated, setAuthHydrated] = useState(false);
  const isEventPlannerCustomer = isPlannerCustomer(
    isLoggedIn,
    userProfile.customerType
  );
  const [platformUser, setPlatformUser] = useState<PlatformUser | null>(
    () => storedAuth.platformUser ?? null
  );
  const isPlatformOperator =
    platformUser?.role === 'admin' || platformUser?.role === 'root';
  const isRootUser = platformUser?.role === 'root';

  const adminSessionDisplay = useMemo(
    () =>
      buildAdminSessionDisplay({
        plannerWorkspace: isEventPlannerCustomer,
        platformUser,
        userProfile,
      }),
    [isEventPlannerCustomer, platformUser, userProfile]
  );

  const handleSelectAdminTab = useCallback(
    (tab: string) => {
      const normalized = resolveAdminTab(tab, {
        plannerWorkspace: isEventPlannerCustomer,
        platformAdmin: isPlatformOperator,
      });
      setCurrentAdminTab(normalized);
      const path = adminTabPath(normalized);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (currentPath !== path) {
        pushRoute(path);
      }
    },
    [isEventPlannerCustomer, isPlatformOperator]
  );

  const applyAdminTabFromRoute = useCallback(
    (adminTab: string | undefined, routePlannerAccess?: boolean) => {
      const plannerWorkspace = routePlannerAccess === true || isEventPlannerCustomer;
      const normalized = resolveAdminTab(adminTab, {
        plannerWorkspace,
        platformAdmin: isPlatformOperator,
      });
      setCurrentAdminTab(normalized);
      const path = adminTabPath(normalized);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (currentPath === '/admin' || currentPath !== path) {
        replaceRoute(path);
      }
    },
    [isEventPlannerCustomer, isPlatformOperator]
  );
  const [signInInitialMode, setSignInInitialMode] = useState<SignInMode>('customer');
  const [signInCustomerPrefill, setSignInCustomerPrefill] = useState('');
  const [signInSuccessMessage, setSignInSuccessMessage] = useState('');
  const [vendorSession, setVendorSession] = useState<VendorDashboardSession>(() => ({
    ...EMPTY_VENDOR_SESSION,
    ...(storedAuth.vendorSession ?? {}),
    vendorId: (storedAuth.vendorSession as { vendorId?: string })?.vendorId ?? '',
  }));
  const [authLoading, setAuthLoading] = useState(false);
  const [vendorSearchFilters, setVendorSearchFilters] = useState({
    search: initialRoute.vendorSearch?.search ?? '',
    categoryId: initialRoute.vendorSearch?.categoryId ?? '',
    city: initialRoute.vendorSearch?.city ?? '',
  });
  const [eventPlannerSearch, setEventPlannerSearch] = useState({
    eventName: initialRoute.eventPlannerSearch?.eventName ?? '',
    location: initialRoute.eventPlannerSearch?.location ?? '',
    date: initialRoute.eventPlannerSearch?.date ?? '',
    eventType: initialRoute.eventPlannerSearch?.eventType ?? '',
  });
  const [eventPlannerRegisterPrefill, setEventPlannerRegisterPrefill] = useState<{
    eventName?: string;
    location?: string;
    date?: string;
    eventType?: string;
    city?: string;
  }>({});
  const [registerFromHome, setRegisterFromHome] = useState(false);

  // Admin dynamic states
  const [currentAdminTab, setCurrentAdminTab] = useState<string>(
    () => initialRoute.adminTab ?? 'dashboard'
  );
  const [currentRootTab, setCurrentRootTab] = useState<string>('admin-users');

  useEffect(() => {
    if (isAdminMode) {
      purgeLegacyPlannerSeedData();
    }
  }, [isAdminMode]);

  useEffect(() => {
    const cached = readPersistedAuth();
    const token = getApiToken();
    if (!token) {
      setAuthHydrated(true);
      return;
    }

    applyPersistedAuthToState(cached, EMPTY_USER_PROFILE, EMPTY_VENDOR_SESSION, {
      setIsLoggedIn,
      setIsVendorLoggedIn,
      setPlatformUser,
      setUserProfile,
      setVendorSession,
    });

    let cancelled = false;
    void (async () => {
      try {
        const { user } = await fetchAuthMe();
        if (cancelled) return;

        if (user.role === 'vendor') {
          const nextVendor: VendorDashboardSession = {
            vendorId: user.vendorId ?? '',
            businessName: user.businessName ?? '',
            contactName: user.contactName ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
          };
          setPlatformUser(null);
          setIsLoggedIn(false);
          setIsVendorLoggedIn(true);
          setVendorSession(nextVendor);
          writePersistedAuth({
            authKind: 'vendor',
            isLoggedIn: false,
            isVendorLoggedIn: true,
            vendorSession: nextVendor,
            platformUser: null,
            token: getApiToken(),
          });
          return;
        }

        if (user.role === 'admin' || user.role === 'root') {
          const account = await fetchPlatformMe();
          if (cancelled) return;
          setPlatformUser(account);
          setIsLoggedIn(false);
          setIsVendorLoggedIn(false);
          writePersistedAuth({
            authKind: 'platform',
            isLoggedIn: false,
            isVendorLoggedIn: false,
            platformUser: account,
            token: getApiToken(),
          });
          return;
        }

        const profile = await fetchUserProfile();
        if (cancelled) return;
        setUserProfile(profile);
        setPlatformUser(null);
        setIsLoggedIn(true);
        setIsVendorLoggedIn(false);
        writePersistedAuth({
          authKind: 'customer',
          isLoggedIn: true,
          isVendorLoggedIn: false,
          userProfile: profile,
          platformUser: null,
          token: getApiToken(),
        });
      } catch (err) {
        if (cancelled) return;
        if (isAuthUnauthorizedError(err)) {
          clearAuthSession();
          setIsLoggedIn(false);
          setIsVendorLoggedIn(false);
          setPlatformUser(null);
          setUserProfile({ ...EMPTY_USER_PROFILE, customerType: 'standard' });
          setVendorSession({ ...EMPTY_VENDOR_SESSION });
        }
        // Network / server errors: keep cached session from storage (already applied).
      } finally {
        if (!cancelled) setAuthHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Unified global callbacks & state helpers
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const applyRoute = useCallback(
    (route: ParsedRoute, options?: { scroll?: boolean }) => {
      if (route.root) {
        if (!isRootUser) {
          setIsRootMode(false);
          setCurrentPage('platform-sign-in');
          if (window.location.pathname === '/root') {
            replaceRoute('/platform/sign-in');
          }
          return;
        }
        setIsRootMode(true);
        setIsAdminMode(false);
        return;
      }

      if (route.admin) {
        const allowAdmin = canAccessAdminRoute(
          isPlatformOperator,
          isLoggedIn,
          userProfile.customerType,
          route.adminAccess
        );
        if (!allowAdmin) {
          setIsAdminMode(false);
          setCurrentPage('platform-sign-in');
          if (window.location.pathname.startsWith('/admin')) {
            replaceRoute('/platform/sign-in');
          }
          return;
        }
        purgeLegacyPlannerSeedData();
        applyAdminTabFromRoute(
          route.adminTab,
          route.adminAccess === 'planner' || isEventPlannerCustomer
        );
        setIsAdminMode(true);
        setIsRootMode(false);
        return;
      }

      setIsAdminMode(false);
      setIsRootMode(false);

      let page = route.page;
      if (page === 'account' && !isLoggedIn) {
        page = 'sign-in';
      }
      if (page === 'vendor-details' && !route.vendorId) {
        page = 'vendor-list';
      }

      setCurrentPage(page);

      if (route.restaurantId) {
        setSelectedRestId(route.restaurantId);
      }
      if (route.vendorId) {
        setSelectedVendorId(route.vendorId);
      }
      if (route.vendorSearch) {
        setVendorSearchFilters(route.vendorSearch);
        if (route.vendorSearch.city) {
          setSelectedCity(route.vendorSearch.city);
        }
      }
      if (route.eventPlannerSearch) {
        setEventPlannerSearch(route.eventPlannerSearch);
      }

      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [
      applyAdminTabFromRoute,
      isEventPlannerCustomer,
      isLoggedIn,
      isPlatformOperator,
      isRootUser,
      userProfile.customerType,
    ]
  );

  const handleSignOutPlatform = useCallback(() => {
    clearAuthSession();
    setPlatformUser(null);
    setIsLoggedIn(false);
    setIsVendorLoggedIn(false);
    setUserProfile({ ...EMPTY_USER_PROFILE, customerType: 'standard' });
    setVendorSession({ ...EMPTY_VENDOR_SESSION });
    setSignInSuccessMessage('');
    setSignInCustomerPrefill('');
    setIsAdminMode(false);
    setIsRootMode(false);
    const path = pageToPath('landing');
    pushRoute(path);
    applyRoute({ page: 'landing' });
  }, [applyRoute]);

  const handlePlatformSignInSuccess = useCallback(
    (role: 'root' | 'admin') => {
      void fetchPlatformMe().then((account) => {
        setPlatformUser(account);
        setIsLoggedIn(false);
        setIsVendorLoggedIn(false);
        writePersistedAuth({
          authKind: 'platform',
          isLoggedIn: false,
          isVendorLoggedIn: false,
          platformUser: account,
          token: getApiToken(),
        });
        if (role === 'root') {
          setIsRootMode(true);
          setIsAdminMode(false);
          setCurrentRootTab('admin-users');
          pushRoute('/root');
          applyRoute({ page: 'landing', root: true });
        } else {
          setIsRootMode(false);
          setIsAdminMode(true);
          setCurrentAdminTab('dashboard');
          pushRoute(adminTabPath('dashboard'));
          applyRoute({
            page: 'landing',
            admin: true,
            adminAccess: 'platform',
            adminTab: 'dashboard',
          });
        }
      });
    },
    [applyRoute]
  );

  const handleLogout = () => {
    clearAuthSession();
    setIsLoggedIn(false);
    setIsVendorLoggedIn(false);
    setUserProfile({ ...EMPTY_USER_PROFILE, customerType: 'standard' });
    setVendorSession({ ...EMPTY_VENDOR_SESSION });
    setPlatformUser(null);
    setSignInSuccessMessage('');
    setSignInCustomerPrefill('');
    setIsAdminMode(false);
    setIsRootMode(false);
    const path = pageToPath('landing');
    pushRoute(path);
    applyRoute({ page: 'landing' });
  };

  useEffect(() => {
    if (!authHydrated) return;
    if (!getApiToken() && !isLoggedIn && !isVendorLoggedIn && !platformUser) {
      return;
    }
    writePersistedAuth({
      authKind: authKindFromState({ isLoggedIn, isVendorLoggedIn, platformUser }),
      isLoggedIn,
      isVendorLoggedIn,
      userProfile: {
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        customerType: userProfile.customerType,
        walletBalance: userProfile.walletBalance,
      },
      vendorSession: {
        vendorId: vendorSession.vendorId,
        businessName: vendorSession.businessName,
        contactName: vendorSession.contactName,
        phone: vendorSession.phone,
        email: vendorSession.email,
      },
      platformUser,
      token: getApiToken(),
    });
  }, [authHydrated, isLoggedIn, isVendorLoggedIn, userProfile, vendorSession, platformUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const onPopState = () => {
      applyRoute(parseLocation(), { scroll: true });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyRoute]);

  useEffect(() => {
    if (!authHydrated) return;

    const route = parseLocation();
    if (route.root && isRootUser) {
      setIsRootMode(true);
    }
    if (route.admin) {
      const allowAdmin = canAccessAdminRoute(
        isPlatformOperator,
        isLoggedIn,
        userProfile.customerType
      );
      if (!allowAdmin) {
        if (window.location.pathname.startsWith('/admin')) {
          replaceRoute('/platform/sign-in');
        }
        setIsAdminMode(false);
        setCurrentPage('platform-sign-in');
      } else {
        setIsAdminMode(true);
        applyAdminTabFromRoute(route.adminTab);
      }
    }
    if (route.page === 'account' && !isLoggedIn && !isVendorLoggedIn) {
      replaceRoute('/sign-in');
      setCurrentPage('sign-in');
    }
    if (window.location.hash && (route.page === 'landing' || currentPage === 'landing')) {
      const id = window.location.hash.slice(1);
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [
    applyAdminTabFromRoute,
    authHydrated,
    currentPage,
    isEventPlannerCustomer,
    isLoggedIn,
    isPlatformOperator,
    isRootUser,
    isVendorLoggedIn,
    userProfile.customerType,
  ]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    window.dispatchEvent(new CustomEvent('hero-city-change', { detail: { city } }));
  };

  const handleNavigatePage = (pageName: string, data?: NavigateData) => {
    if (data?.signInAs === 'planner' || data?.eventPlannerSignup || data?.signInAs === 'customer') {
      setSignInInitialMode('customer');
    } else if (data?.signInAs === 'vendor') {
      setSignInInitialMode('vendor');
    } else if (pageName !== 'sign-in') {
      setSignInInitialMode('customer');
    }

    if (pageName === 'account' && !isLoggedIn) {
      const path = pageToPath('sign-in', data, selectedCity);
      pushRoute(path);
      applyRoute({ page: 'sign-in' });
      return;
    }

    if (data?.restaurantId) {
      setSelectedRestId(data.restaurantId);
    }
    if (data?.vendorId) {
      setSelectedVendorId(data.vendorId);
    }
    if (pageName === 'vendor-list') {
      setVendorSearchFilters({
        search: data?.search ?? '',
        categoryId: data?.categoryId ?? '',
        city: data?.city ?? selectedCity,
      });
    } else if (pageName !== 'vendor-list') {
      setVendorSearchFilters({ search: '', categoryId: '', city: '' });
    }
    if (pageName === 'celebrations') {
      setEventPlannerSearch({
        eventName: data?.eventName ?? '',
        location: data?.location ?? '',
        date: data?.date ?? '',
        eventType: data?.eventType ?? '',
      });
    } else if (pageName !== 'celebrations') {
      setEventPlannerSearch({ eventName: '', location: '', date: '', eventType: '' });
    }
    if (pageName === 'event-planner-register') {
      setEventPlannerRegisterPrefill({
        eventName: data?.eventName,
        location: data?.location,
        date: data?.date,
        eventType: data?.eventType,
        city: data?.city ?? selectedCity,
      });
      setRegisterFromHome(Boolean(data?.fromHome));
    }

    const path = pageToPath(pageName, data, selectedCity);
    pushRoute(path);
    applyRoute(
      {
        page: pageName,
        restaurantId: data?.restaurantId,
        vendorId: data?.vendorId,
        vendorSearch:
          pageName === 'vendor-list' || pageName === 'vendor-categories'
            ? {
                search: data?.search ?? '',
                categoryId: data?.categoryId ?? '',
                city: data?.city ?? selectedCity,
              }
            : undefined,
        eventPlannerSearch:
          pageName === 'celebrations'
            ? {
                eventName: data?.eventName ?? '',
                location: data?.location ?? '',
                date: data?.date ?? '',
                eventType: data?.eventType ?? '',
              }
            : undefined,
      },
      { scroll: true }
    );
  };

  const openPlannerWorkspace = async () => {
    if (getApiToken()) {
      try {
        await hydratePlannerFromApi();
      } catch {
        // keep local planner data if API unavailable
      }
    }

    // Ensure planner storage exists and has the user's event (local + API sync)
    try {
      const eventsKey = 'utsav_planner_events';
      const subKey = 'utsav_planner_sub_events';
      const ritKey = 'utsav_planner_rituals';

      const existingEventsRaw = window.localStorage.getItem(eventsKey);
      const existingEvents = existingEventsRaw ? (JSON.parse(existingEventsRaw) as any[]) : [];
      if (!existingEventsRaw) {
        window.localStorage.setItem(eventsKey, JSON.stringify([]));
      }
      if (!window.localStorage.getItem(subKey)) {
        window.localStorage.setItem(subKey, JSON.stringify([]));
      }
      if (!window.localStorage.getItem(ritKey)) {
        window.localStorage.setItem(ritKey, JSON.stringify([]));
      }

      const hasEventDraft =
        eventPlannerSearch.eventName || eventPlannerSearch.location || eventPlannerSearch.date || eventPlannerSearch.eventType;

      if (hasEventDraft) {
        const current = existingEventsRaw ? existingEvents : [];
        const newId = 'evt-user';
        const descParts = [
          eventPlannerSearch.location ? `Location: ${eventPlannerSearch.location}` : '',
          eventPlannerSearch.eventType ? `Type: ${eventPlannerSearch.eventType}` : '',
        ].filter(Boolean);

        const userEvent = {
          id: newId,
          name: eventPlannerSearch.eventName || 'My event',
          date: eventPlannerSearch.date || new Date().toISOString().slice(0, 10),
          description: descParts.join(' · '),
          isActive: true,
        };

        const without = current.filter((e) => e?.id !== newId).map((e) => ({ ...e, isActive: false }));
        window.localStorage.setItem(eventsKey, JSON.stringify([userEvent, ...without]));
      }
    } catch {
      // ignore storage errors (private mode / blocked)
    }

    purgeLegacyPlannerSeedData();
    setCurrentAdminTab('planner-dashboard');
    setIsAdminMode(true);
    pushRoute(adminTabPath('planner-dashboard'));
    applyRoute({
      page: 'landing',
      admin: true,
      adminAccess: 'planner',
      adminTab: 'planner-dashboard',
    });
  };

  const formatCustomerPhone = (phone: string) =>
    phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`;

  const handleSignIn = async ({
    identifier,
    password,
    customerType = 'event-planner',
  }: {
    identifier: string;
    password: string;
    customerType?: CustomerType;
  }) => {
    setAuthLoading(true);
    try {
      const raw = identifier.trim();
      const session = await signInCustomer(
        raw.includes('@')
          ? { email: raw.toLowerCase() }
          : { phone: raw },
        password,
        { customerType }
      );
      setApiToken(session.token);
      setPlatformUser(null);
      setIsAdminMode(false);
      setIsRootMode(false);
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setIsLoggedIn(true);
      setIsVendorLoggedIn(false);
      writePersistedAuth({
        authKind: 'customer',
        isLoggedIn: true,
        isVendorLoggedIn: false,
        userProfile: profile,
        platformUser: null,
        token: session.token,
      });
      if (profile.customerType === 'event-planner') {
        await openPlannerWorkspace();
      } else {
        const path = pageToPath('account');
        pushRoute(path);
        applyRoute({ page: 'account' });
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Sign in failed. Is the API running?';
      alert(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEventPlannerRegister = async (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    companyName?: string;
    primaryEventType: string;
    city: string;
    serviceCities?: string;
    bio: string;
    draftEvent?: {
      eventName?: string;
      location?: string;
      date?: string;
      eventType?: string;
    };
  }) => {
    setAuthLoading(true);
    try {
      await registerEventPlanner({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        confirmPassword: payload.password,
        companyName: payload.companyName,
        primaryEventType: payload.primaryEventType,
        city: payload.city,
        serviceCities: payload.serviceCities,
        bio: payload.bio,
        draftEvent: payload.draftEvent
          ? {
              eventName: payload.draftEvent.eventName,
              location: payload.draftEvent.location,
              date: payload.draftEvent.date,
              eventType: payload.draftEvent.eventType ?? payload.primaryEventType,
            }
          : undefined,
      });
      clearAuthSession();
      setIsLoggedIn(false);
      setIsVendorLoggedIn(false);
      if (payload.draftEvent) {
        setEventPlannerSearch({
          eventName: payload.draftEvent.eventName ?? '',
          location: payload.draftEvent.location ?? '',
          date: payload.draftEvent.date ?? '',
          eventType: payload.draftEvent.eventType ?? payload.primaryEventType,
        });
      }
      setSignInInitialMode('customer');
      setSignInCustomerPrefill(payload.email.trim().toLowerCase());
      setSignInSuccessMessage(
        'Account and event saved. Sign in with your email or phone and the password you just created.'
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed.';
      throw new Error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVendorSignIn = async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    setAuthLoading(true);
    try {
      const raw = identifier.trim();
      const session = await signInVendor(
        raw.includes('@')
          ? { email: raw.toLowerCase() }
          : { phone: raw },
        password,
        {
        vendorId: vendorSession.vendorId,
        businessName: vendorSession.businessName,
        contactName: vendorSession.contactName,
        }
      );
      const vs = session.vendorSession ?? session.user;
      const nextVendor: VendorDashboardSession = {
        vendorId: vs.vendorId ?? vendorSession.vendorId,
        businessName: vs.businessName ?? vendorSession.businessName,
        contactName: vs.contactName ?? vendorSession.contactName,
        email: vs.email ?? (raw.includes('@') ? raw.toLowerCase() : ''),
        phone: vs.phone ?? (!raw.includes('@') ? formatCustomerPhone(raw) : ''),
      };
      setVendorSession(nextVendor);
      setIsVendorLoggedIn(true);
      setIsLoggedIn(false);
      writePersistedAuth({
        authKind: 'vendor',
        isLoggedIn: false,
        isVendorLoggedIn: true,
        vendorSession: nextVendor,
        platformUser: null,
        token: session.token,
      });
      const path = pageToPath('profile');
      pushRoute(path);
      applyRoute({ page: 'profile' });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Vendor sign in failed.';
      alert(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEnterAdmin = () => {
    if (isEventPlannerCustomer && isLoggedIn) {
      purgeLegacyPlannerSeedData();
      handleSelectAdminTab('planner-dashboard');
      setIsAdminMode(true);
      applyRoute({
        page: 'landing',
        admin: true,
        adminAccess: 'planner',
        adminTab: 'planner-dashboard',
      });
      return;
    }
    if (isPlatformOperator) {
      purgeLegacyPlannerSeedData();
      setIsAdminMode(true);
      handleSelectAdminTab('dashboard');
      applyRoute({
        page: 'landing',
        admin: true,
        adminAccess: 'platform',
        adminTab: 'dashboard',
      });
      return;
    }
    pushRoute('/platform/sign-in');
    setCurrentPage('platform-sign-in');
    setIsAdminMode(false);
    setIsRootMode(false);
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    if (isRootUser) {
      setIsRootMode(true);
      pushRoute('/root');
      applyRoute({ page: 'landing', root: true });
      return;
    }
    if (isPlatformOperator) {
      handleSignOutPlatform();
      return;
    }
    const path = pageToPath('landing');
    pushRoute(path);
    applyRoute({ page: 'landing' });
  };

  const handleAddToCart = (item: FoodItem, restId: string, restName: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem.id === item.id);
      if (existing) {
        return prev.map((c) => (c.foodItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { foodItem: item, quantity: 1, restaurantId: restId, restaurantName: restName }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem.id === itemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((c) => c.foodItem.id !== itemId);
      }
      return prev.map((c) => (c.foodItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateWallet = (newBalance: number) => {
    setUserProfile((prev) => ({ ...prev, walletBalance: newBalance }));
  };

  const handleAddOrderToHistory = async (
    items: { name: string; quantity: number; price: number }[],
    total: number,
    restName: string,
    restImg: string,
    restaurantId: string
  ) => {
    try {
      const order = await createOrder({
        customerName: userProfile.name || 'Guest',
        restaurantId,
        restaurantName: restName,
        restaurantImage: restImg,
        items,
        totalAmount: total,
      });
      setUserProfile((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
      }));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not place order.';
      alert(msg);
      throw err;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans ${isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'}`}
      id="app-wrapper"
    >
      
      

      {/* 2. LAYOUT SPLIT: CUSTOMER PORTAL vs ENTERPRISE ADMIN SUITE */}
      {isRootMode ? (
        <div id="admin-portal-view">
          <RootSidebar
            currentTab={currentRootTab}
            onSelectTab={setCurrentRootTab}
            onExit={handleSignOutPlatform}
            session={adminSessionDisplay}
            onOpenAdminWorkspace={() => {
              setIsAdminMode(true);
              setIsRootMode(false);
              setCurrentAdminTab('dashboard');
              pushRoute(adminTabPath('dashboard'));
              applyRoute({
                page: 'landing',
                admin: true,
                adminAccess: 'platform',
                adminTab: 'dashboard',
              });
            }}
          />
          <div id="admin-main">
            <AdminHeader currentTabName={currentRootTab} session={adminSessionDisplay} />
            <main className="p-6">
              {currentRootTab === 'admin-users' && <RootAdminUsers />}
            </main>
          </div>
        </div>
      ) : !isAdminMode ? (
        
        /* ================= CUSTOMER PORTAL INTERFACE ================= */
        <div className="flex flex-col min-h-screen relative overflow-hidden" id="customer-portal-view">
          
          {/* Subtle background Diwali light effect */}
          <div className="absolute top-0 right-[-100px] w-80 h-80 opacity-5 pointer-events-none">
            <RangoliMandala className="w-full h-full text-orange-500" />
          </div>

          {currentPage === 'landing' ? (
            <div id="landing-hero-shell" className={LANDING_HERO_SHELL_CLASS}>
              <CustomerHeader
                onNavigate={handleNavigatePage}
                currentPage={currentPage}
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onSwitchToAdmin={handleEnterAdmin}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                isVendorLoggedIn={isVendorLoggedIn}
                isEventPlannerCustomer={isEventPlannerCustomer}
                userProfile={userProfile}
                blendWithHero
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <LandingPage
                    onNavigate={handleNavigatePage}
                    selectedCity={selectedCity}
                    onCityChange={handleCityChange}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <>
              <CustomerHeader
                onNavigate={handleNavigatePage}
                currentPage={currentPage}
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onSwitchToAdmin={handleEnterAdmin}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                isVendorLoggedIn={isVendorLoggedIn}
                isEventPlannerCustomer={isEventPlannerCustomer}
                userProfile={userProfile}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    {currentPage === 'restaurants' && (
                  <RestaurantListingPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                  />
                )}

                {currentPage === 'restaurant-detail' && (
                  <RestaurantDetailPage
                    restaurantId={selectedRestId}
                    onNavigate={handleNavigatePage}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    cart={cart}
                  />
                )}

                {currentPage === 'cart' && (
                  <CartPage
                    cart={cart}
                    onNavigate={handleNavigatePage}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onClearCart={handleClearCart}
                    userProfile={userProfile}
                    onUpdateWallet={handleUpdateWallet}
                    onAddOrderToHistory={handleAddOrderToHistory}
                    restaurantId={selectedRestId}
                    isLoggedIn={isLoggedIn}
                    onRequireSignIn={() => {
                      setSignInInitialMode('customer');
                      handleNavigatePage('sign-in');
                    }}
                  />
                )}

                {currentPage === 'platform-sign-in' && (
                  <PlatformSignInPage
                    onSuccess={handlePlatformSignInSuccess}
                    onBack={() => {
                      pushRoute('/');
                      applyRoute({ page: 'landing' });
                    }}
                  />
                )}

                {currentPage === 'sign-in' && (
                  <SignInPage
                    initialMode={signInInitialMode}
                    initialCustomerIdentifier={signInCustomerPrefill}
                    successMessage={signInSuccessMessage}
                    onSignIn={async (payload) => {
                      setSignInSuccessMessage('');
                      await handleSignIn(payload);
                    }}
                    onVendorSignIn={handleVendorSignIn}
                    onNavigate={handleNavigatePage}
                    isLoading={authLoading}
                  />
                )}

                {currentPage === 'profile' &&
                  (isVendorLoggedIn ? (
                    <VendorProfilePage
                      session={vendorSession}
                      onNavigate={handleNavigatePage}
                    />
                  ) : (
                    <VendorProfileGate onNavigate={handleNavigatePage} />
                  ))}

                {currentPage === 'account' && isLoggedIn && (
                  <UserProfilePage
                    userProfile={userProfile}
                    onUpdateWallet={handleUpdateWallet}
                    onNavigate={handleNavigatePage}
                    isEventPlannerCustomer={isEventPlannerCustomer}
                    onOpenPlannerWorkspace={openPlannerWorkspace}
                  />
                )}

                {currentPage === 'vendor-categories' && (
                  <VendorCategoryPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                    initialCity={selectedCity}
                  />
                )}

                {currentPage === 'vendor-list' && (
                  <VendorListPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                    initialSearchQuery={vendorSearchFilters.search}
                    initialCategoryId={vendorSearchFilters.categoryId}
                    initialCity={vendorSearchFilters.city || selectedCity}
                  />
                )}

                {currentPage === 'vendor-details' && selectedVendorId && (
                  <VendorDetailsPage
                    onNavigate={handleNavigatePage}
                    vendorId={selectedVendorId}
                    initialCity={selectedCity}
                  />
                )}

                {currentPage === 'celebrations' && (
                  <PlannedEventsShowcase
                    onNavigate={handleNavigatePage}
                    initialEventName={eventPlannerSearch.eventName}
                    initialLocation={eventPlannerSearch.location}
                    initialDate={eventPlannerSearch.date}
                    initialEventType={eventPlannerSearch.eventType}
                  />
                )}

                {currentPage === 'portfolio' && (
                  <PortfolioPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'about' && (
                  <AboutUsPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'contact' && (
                  <ContactUsPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'list-your-service' && (
                  <VendorRegistrationPage
                    onNavigate={handleNavigatePage}
                    initialCity={selectedCity}
                  />
                )}

                {currentPage === 'event-planner-register' && (
                  <EventPlannerRegistrationPage
                    onNavigate={handleNavigatePage}
                    initialCity={selectedCity}
                    initialPrefill={eventPlannerRegisterPrefill}
                    startAtAccountStep={registerFromHome}
                    onRegisterComplete={handleEventPlannerRegister}
                    isRegistering={authLoading}
                  />
                )}

                {currentPage === 'how-it-works' && (
                  <HowItWorksPage
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'terms' && (
                  <TermsPage />
                )}

                {currentPage === 'privacy' && (
                  <PrivacyPolicyPage />
                )}

                {currentPage === 'cancellation' && (
                  <CancellationPolicyPage />
                )}
                  </motion.div>
                </AnimatePresence>
              </main>
            </>
          )}

          <Footer
            isDarkMode={isDarkMode}
            currentPage={currentPage}
            onNavigate={handleNavigatePage}
          />
        </div>
      ) : (
        
        /* ================= ENTERPRISE ADMIN PANEL INTERFACE ================= */
        <div id="admin-portal-view">
          <AdminSidebar
            currentAdminTab={currentAdminTab}
            onSelectTab={handleSelectAdminTab}
            onExitAdmin={handleExitAdmin}
            plannerWorkspace={isEventPlannerCustomer}
            platformAdmin={isPlatformOperator}
            session={adminSessionDisplay}
          />

          <div id="admin-main">
            <AdminHeader
              currentTabName={currentAdminTab}
              plannerWorkspace={isEventPlannerCustomer}
              session={adminSessionDisplay}
            />

            <main>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAdminTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  {currentAdminTab === 'dashboard' && isPlatformOperator && (
                    <AdminDashboard onNavigateTab={handleSelectAdminTab} />
                  )}

                  {currentAdminTab === 'restaurants' && isPlatformOperator && (
                    <AdminManagement />
                  )}

                  {currentAdminTab === 'orders' && isPlatformOperator && (
                    <AdminOrders />
                  )}

                  {currentAdminTab === 'customers' && isPlatformOperator && (
                    <AdminCustomers />
                  )}

                  {currentAdminTab === 'marketing' && isPlatformOperator && (
                    <AdminMarketing />
                  )}

                  {currentAdminTab === 'vendor-approvals' && isPlatformOperator && (
                    <AdminVendors />
                  )}

                  {currentAdminTab === 'vendor-categories' && isPlatformOperator && (
                    <AdminVendorCategories />
                  )}

                  {!isPlatformOperator &&
                    !isEventPlannerCustomer &&
                    COMMERCE_ADMIN_TABS.has(currentAdminTab) && (
                      <AdminEmptyState
                        title="Platform sign-in required"
                        description="Sign in at /platform/sign-in with an admin account created by root."
                      />
                    )}

                  {currentAdminTab === 'planner-dashboard' && (
                    <PlannerDashboard onNavigateTab={handleSelectAdminTab} />
                  )}

                  {currentAdminTab === 'planner-events' && (
                    <PlannerEvents />
                  )}

                  {currentAdminTab === 'planner-events-create' && (
                    <PlannerEventsCreate />
                  )}

                  {currentAdminTab === 'planner-events-history' && (
                    <PlannerEventsHistory />
                  )}

                  {currentAdminTab === 'planner-guests' && (
                    <PlannerGuests />
                  )}

                  {currentAdminTab === 'planner-feast' && (
                    <PlannerFeast />
                  )}

                  {currentAdminTab === 'planner-vendors' && (
                    <PlannerVendors />
                  )}

                  {currentAdminTab === 'planner-budget' && (
                    <PlannerBudget />
                  )}

                  {currentAdminTab === 'planner-chuman' && (
                    <PlannerChuman />
                  )}

                  {currentAdminTab === 'planner-inventory' && (
                    <PlannerInventory />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

          </div>

        </div>
      )}

    </div>
  );
}
