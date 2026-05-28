import React, { useCallback, useEffect, useState } from 'react';
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
import { PlatformSignInPage } from './components/Admin/PlatformSignInPage';
import { RootSidebar } from './components/Admin/Root/RootSidebar';
import { RootAdminUsers } from './components/Admin/Root/RootAdminUsers';
import {
  clearPlatformSession,
  fetchPlatformMe,
  type PlatformUser,
} from './api/platform';

// Wedding & Traditional Planner Imports
import { PlannerEvents } from './components/PlannerEvents';
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
  type NavigateData,
  type ParsedRoute,
  pageToPath,
  parseLocation,
  pushRoute,
  replaceRoute,
} from './routing';
import { hydratePlannerFromApi, purgeLegacyPlannerSeedData } from './plannerStorage';
import {
  signInCustomer,
  signInVendor,
  registerEventPlanner,
  clearApiSession,
} from './api/auth';
import { getApiToken, setApiToken } from './api/config';
import { fetchUserProfile } from './api/users';
import { createOrder } from './api/orders';
import { ApiError } from './api/client';

function getInitialRoute(): ParsedRoute {
  return parseLocation();
}

const COMMERCE_ADMIN_TABS = new Set([
  'dashboard',
  'restaurants',
  'orders',
  'customers',
  'marketing',
  'vendor-approvals',
  'vendor-categories',
]);

function plannerDefaultTab(current: string): string {
  return COMMERCE_ADMIN_TABS.has(current) ? 'planner-dashboard' : current;
}

function isPlannerCustomer(loggedIn: boolean, customerType?: CustomerType): boolean {
  return loggedIn && customerType === 'event-planner';
}

export default function App() {
  const initialRoute = getInitialRoute();

  const AUTH_STORAGE_KEY = 'utsav.auth.v1';

  const readStoredAuth = (): {
    isLoggedIn?: boolean;
    isVendorLoggedIn?: boolean;
    userProfile?: Partial<UserProfile>;
    vendorSession?: Partial<VendorDashboardSession>;
    platformUser?: PlatformUser | null;
  } => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return {
        isLoggedIn: typeof parsed.isLoggedIn === 'boolean' ? parsed.isLoggedIn : undefined,
        isVendorLoggedIn:
          typeof parsed.isVendorLoggedIn === 'boolean' ? parsed.isVendorLoggedIn : undefined,
        userProfile:
          parsed.userProfile && typeof parsed.userProfile === 'object'
            ? (parsed.userProfile as Partial<UserProfile>)
            : undefined,
        vendorSession:
          parsed.vendorSession && typeof parsed.vendorSession === 'object'
            ? (parsed.vendorSession as Partial<VendorDashboardSession>)
            : undefined,
        platformUser:
          parsed.platformUser && typeof parsed.platformUser === 'object'
            ? (parsed.platformUser as PlatformUser)
            : undefined,
      };
    } catch {
      return {};
    }
  };

  const storedAuth = readStoredAuth();
  const storedToken = (() => {
    try {
      return getApiToken();
    } catch {
      return null;
    }
  })();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRootMode, setIsRootMode] = useState(
    () => Boolean(initialRoute.root && storedAuth.platformUser?.role === 'root')
  );

  // Customer states info
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (initialRoute.page === 'platform-sign-in') return 'platform-sign-in';
    return initialRoute.page;
  });
  const [selectedCity, setSelectedCity] = useState(
    initialRoute.vendorSearch?.city || 'noida'
  );
  const [currentLocation, setCurrentLocation] = useState<string>('Sector 56, Noida, UP');
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
    () => Boolean(storedAuth.isLoggedIn && storedToken)
  );
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(() => Boolean(storedAuth.isVendorLoggedIn));
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
  const [signInInitialMode, setSignInInitialMode] = useState<SignInMode>('customer');
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
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');
  const [currentRootTab, setCurrentRootTab] = useState<string>('admin-users');

  useEffect(() => {
    if (isAdminMode) {
      purgeLegacyPlannerSeedData();
    }
  }, [isAdminMode]);

  useEffect(() => {
    if (!getApiToken()) return;
    let cancelled = false;
    void fetchPlatformMe()
      .then((account) => {
        if (cancelled) return;
        if (account.role === 'admin' || account.role === 'root') {
          setPlatformUser(account);
        }
      })
      .catch(() => {
        // not a platform token
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !getApiToken() || isPlatformOperator) return;
    let cancelled = false;
    void fetchUserProfile()
      .then((profile) => {
        if (!cancelled) setUserProfile(profile);
      })
      .catch(() => {
        // token invalid — user can sign in again
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isPlatformOperator]);

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
        if (!isPlatformOperator) {
          setIsAdminMode(false);
          setCurrentPage('platform-sign-in');
          if (window.location.pathname === '/admin') {
            replaceRoute('/platform/sign-in');
          }
          return;
        }
        purgeLegacyPlannerSeedData();
        setCurrentAdminTab((tab) => {
          if (isEventPlannerCustomer) return plannerDefaultTab(tab);
          return COMMERCE_ADMIN_TABS.has(tab) ? tab : 'dashboard';
        });
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
    [isEventPlannerCustomer, isPlatformOperator, isRootUser]
  );

  const handleSignOutPlatform = useCallback(() => {
    clearPlatformSession();
    setPlatformUser(null);
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
          pushRoute('/admin');
          applyRoute({ page: 'landing', admin: true });
        }
      });
    },
    [applyRoute]
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsVendorLoggedIn(false);
    setUserProfile({ ...EMPTY_USER_PROFILE, customerType: 'standard' });
    setIsAdminMode(false);
    setIsRootMode(false);
    setPlatformUser(null);
    clearApiSession();
    clearPlatformSession();
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore storage errors (private mode / blocked)
    }
    const path = pageToPath('landing');
    pushRoute(path);
    applyRoute({ page: 'landing' });
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
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
            phone: vendorSession.phone,
            email: vendorSession.email,
          },
          platformUser,
        })
      );
    } catch {
      // ignore storage errors (private mode / blocked)
    }
  }, [isLoggedIn, isVendorLoggedIn, userProfile, vendorSession, platformUser]);

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
    const route = parseLocation();
    if (route.root && isRootUser) {
      setIsRootMode(true);
    }
    if (route.admin) {
      if (!isPlatformOperator) {
        if (window.location.pathname === '/admin') {
          replaceRoute('/platform/sign-in');
        }
        setIsAdminMode(false);
        setCurrentPage('platform-sign-in');
      } else {
        setIsAdminMode(true);
        setCurrentAdminTab((tab) =>
          isEventPlannerCustomer ? plannerDefaultTab(tab) : COMMERCE_ADMIN_TABS.has(tab) ? tab : 'dashboard'
        );
      }
    }
    if (route.page === 'account' && !isLoggedIn) {
      replaceRoute('/sign-in');
      setCurrentPage('sign-in');
    }
    if (window.location.hash && (route.page === 'landing' || currentPage === 'landing')) {
      const id = window.location.hash.slice(1);
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for deep links
  }, []);

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
    pushRoute('/admin');
    applyRoute({ page: 'landing', admin: true });
  };

  const formatCustomerPhone = (phone: string) =>
    phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`;

  const handleSignIn = async ({
    phone,
    email,
    customerType = 'event-planner',
  }: {
    phone: string;
    email: string;
    customerType?: CustomerType;
  }) => {
    setAuthLoading(true);
    try {
      const session = await signInCustomer(phone, email, { customerType });
      setApiToken(session.token);
      setPlatformUser(null);
      setIsAdminMode(false);
      setIsRootMode(false);
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setIsLoggedIn(true);
      setIsVendorLoggedIn(false);
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
    companyName?: string;
    primaryEventType: string;
    city: string;
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
        companyName: payload.companyName,
        primaryEventType: payload.primaryEventType,
        city: payload.city,
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
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setIsLoggedIn(true);
      setIsVendorLoggedIn(false);
      if (payload.draftEvent) {
        setEventPlannerSearch({
          eventName: payload.draftEvent.eventName ?? '',
          location: payload.draftEvent.location ?? '',
          date: payload.draftEvent.date ?? '',
          eventType: payload.draftEvent.eventType ?? payload.primaryEventType,
        });
      }
      await openPlannerWorkspace();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed.';
      alert(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVendorSignIn = async ({ phone, email }: { phone: string; email: string }) => {
    setAuthLoading(true);
    try {
      const session = await signInVendor(phone, email, {
        vendorId: vendorSession.vendorId,
        businessName: vendorSession.businessName,
        contactName: vendorSession.contactName,
      });
      const vs = session.vendorSession ?? session.user;
      setVendorSession({
        vendorId: vs.vendorId ?? vendorSession.vendorId,
        businessName: vs.businessName ?? vendorSession.businessName,
        contactName: vs.contactName ?? vendorSession.contactName,
        email: vs.email ?? email,
        phone: vs.phone ?? formatCustomerPhone(phone),
      });
      setIsVendorLoggedIn(true);
      setIsLoggedIn(false);
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
      setCurrentAdminTab((tab) => plannerDefaultTab(tab));
      setIsAdminMode(true);
      pushRoute('/admin');
      applyRoute({ page: 'landing', admin: true });
      return;
    }
    if (isPlatformOperator) {
      purgeLegacyPlannerSeedData();
      setCurrentAdminTab('dashboard');
      setIsAdminMode(true);
      pushRoute('/admin');
      applyRoute({ page: 'landing', admin: true });
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
    handleSignOutPlatform();
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
            onOpenAdminWorkspace={() => {
              setIsAdminMode(true);
              setIsRootMode(false);
              setCurrentAdminTab('dashboard');
              pushRoute('/admin');
            }}
          />
          <div id="admin-main">
            <AdminHeader currentTabName={currentRootTab} />
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
                    onSignIn={handleSignIn}
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
            onSelectTab={setCurrentAdminTab}
            onExitAdmin={handleExitAdmin}
            plannerWorkspace={isEventPlannerCustomer}
            platformAdmin={isPlatformOperator}
          />

          <div id="admin-main">
            <AdminHeader
              currentTabName={currentAdminTab}
              plannerWorkspace={isEventPlannerCustomer}
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
                    <AdminDashboard onNavigateTab={setCurrentAdminTab} />
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
                    <PlannerDashboard onNavigateTab={setCurrentAdminTab} />
                  )}

                  {currentAdminTab === 'planner-events' && (
                    <PlannerEvents />
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
