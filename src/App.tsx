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
  MOCK_VENDOR_SESSION,
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
import { MOCK_USER_PROFILE } from './data';
import type { CustomerType } from './types';
import {
  type NavigateData,
  type ParsedRoute,
  pageToPath,
  parseLocation,
  pushRoute,
  replaceRoute,
} from './routing';
import { purgeLegacyPlannerSeedData } from './plannerStorage';

function getInitialRoute(): ParsedRoute {
  return parseLocation();
}

const COMMERCE_ADMIN_TABS = new Set([
  'dashboard',
  'restaurants',
  'orders',
  'customers',
  'marketing',
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
      };
    } catch {
      return {};
    }
  };

  const storedAuth = readStoredAuth();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Customer states info
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);
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
    ...MOCK_USER_PROFILE,
    ...(storedAuth.userProfile ?? {}),
  }));
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(storedAuth.isLoggedIn));
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(() => Boolean(storedAuth.isVendorLoggedIn));
  const isEventPlannerCustomer = isPlannerCustomer(
    isLoggedIn,
    userProfile.customerType
  );
  const [signInInitialMode, setSignInInitialMode] = useState<SignInMode>('customer');
  const [vendorSession, setVendorSession] = useState<VendorDashboardSession>(() => ({
    ...MOCK_VENDOR_SESSION,
    ...(storedAuth.vendorSession ?? {}),
  }));
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

  useEffect(() => {
    if (isAdminMode) {
      purgeLegacyPlannerSeedData();
    }
  }, [isAdminMode]);

  // Unified global callbacks & state helpers
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const applyRoute = useCallback(
    (route: ParsedRoute, options?: { scroll?: boolean }) => {
      if (route.admin) {
        if (!isLoggedIn) {
          setSignInInitialMode('customer');
          setIsAdminMode(false);
          setCurrentPage('sign-in');
          if (window.location.pathname === '/admin') {
            replaceRoute(pageToPath('sign-in'));
          }
          return;
        }
        purgeLegacyPlannerSeedData();
        setCurrentAdminTab((tab) => plannerDefaultTab(tab));
        setIsAdminMode(true);
        return;
      }

      setIsAdminMode(false);

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
    [isLoggedIn]
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsVendorLoggedIn(false);
    setUserProfile((prev) => ({ ...prev, customerType: 'standard' }));
    setIsAdminMode(false);
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
        })
      );
    } catch {
      // ignore storage errors (private mode / blocked)
    }
  }, [isLoggedIn, isVendorLoggedIn, userProfile, vendorSession]);

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
    if (route.admin) {
      if (!isLoggedIn) {
        const path = pageToPath('sign-in');
        if (window.location.pathname === '/admin') {
          replaceRoute(path);
        }
        setIsAdminMode(false);
        setCurrentPage('sign-in');
        setSignInInitialMode('customer');
      } else {
        setIsAdminMode(true);
        setCurrentAdminTab((tab) => plannerDefaultTab(tab));
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

  const openPlannerWorkspace = () => {
    // Ensure planner storage exists and has the user's event (temporary localStorage persistence)
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

  const handleSignIn = ({ phone, email }: { phone: string; email: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      phone: formatCustomerPhone(phone),
      email,
      customerType: 'event-planner',
    }));
    setIsLoggedIn(true);
    setIsVendorLoggedIn(false);
    openPlannerWorkspace();
  };

  const handleEventPlannerRegister = (payload: {
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
    setUserProfile((prev) => ({
      ...prev,
      name: payload.fullName,
      email: payload.email,
      phone: formatCustomerPhone(payload.phone),
      customerType: 'event-planner',
    }));
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
    openPlannerWorkspace();
  };

  const handleVendorSignIn = ({ phone, email }: { phone: string; email: string }) => {
    setVendorSession((prev) => ({
      ...prev,
      phone: phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      email,
    }));
    setIsVendorLoggedIn(true);
    const path = pageToPath('profile');
    pushRoute(path);
    applyRoute({ page: 'profile' });
  };

  const handleEnterAdmin = () => {
    if (!isLoggedIn) {
      const path = pageToPath('sign-in');
      pushRoute(path);
      applyRoute({ page: 'sign-in' });
      setSignInInitialMode('customer');
      return;
    }
    purgeLegacyPlannerSeedData();
    setCurrentAdminTab((tab) => plannerDefaultTab(tab));
    setIsAdminMode(true);
    pushRoute('/admin');
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
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

  const handleAddOrderToHistory = (items: any[], total: number, restName: string, restImg: string) => {
    const newOrder = {
      id: `FED-${Math.floor(Math.random() * 9000) + 1000}-X`,
      restaurantName: restName,
      restaurantImage: restImg,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending' as const,
      items,
      totalAmount: total,
    };

    setUserProfile((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
    }));
  };

  return (
    <div
      className={`min-h-screen font-sans ${isDarkMode ? 'bg-stone-900 text-stone-100' : 'bg-stone-50 text-stone-900'}`}
      id="app-wrapper"
    >
      
      

      {/* 2. LAYOUT SPLIT: CUSTOMER PORTAL vs ENTERPRISE ADMIN SUITE */}
      {!isAdminMode ? (
        
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
                  />
                )}

                {currentPage === 'sign-in' && (
                  <SignInPage
                    initialMode={signInInitialMode}
                    onSignIn={handleSignIn}
                    onVendorSignIn={handleVendorSignIn}
                    onNavigate={handleNavigatePage}
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
                  {currentAdminTab === 'dashboard' && (
                    <AdminDashboard onNavigateTab={setCurrentAdminTab} />
                  )}

                  {currentAdminTab === 'restaurants' && (
                    <AdminManagement />
                  )}

                  {currentAdminTab === 'orders' && (
                    <AdminOrders />
                  )}

                  {currentAdminTab === 'customers' && (
                    <AdminCustomers />
                  )}

                  {currentAdminTab === 'marketing' && (
                    <AdminMarketing />
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
