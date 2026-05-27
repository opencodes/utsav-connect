import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Customers views imports
import { CustomerHeader } from './components/web/CustomerHeader';
import { Footer } from './components/web/Footer';
import { LandingPage } from './components/web/LandingPage';
import { RestaurantListingPage } from './components/web/RestaurantListingPage';
import { RestaurantDetailPage } from './components/web/RestaurantDetailPage';
import { CartPage } from './components/web/CartPage';
import { UserProfilePage } from './components/web/UserProfilePage';
import { VendorCategoryPage } from './components/web/VendorCategoryPage';
import { PlannedEventsShowcase } from './components/web/PlannedEventsShowcase';
import { PortfolioPage } from './components/web/PortfolioPage';
import { AboutUsPage } from './components/web/AboutUsPage';
import { ContactUsPage } from './components/web/ContactUsPage';
import { HowItWorksPage } from './components/web/HowItWorksPage';
import { TermsPage } from './components/web/TermsPage';
import { PrivacyPolicyPage } from './components/web/PrivacyPolicyPage';
import { CancellationPolicyPage } from './components/web/CancellationPolicyPage';
import { SignInPage } from './components/web/SignInPage';
import { MarigoldToran, RangoliMandala } from './components/web/GoldenDeco';
import { LANDING_HERO_SHELL_CLASS } from './components/web/landingHeroShell';

// Admin panel views imports
import { AdminSidebar } from './components/Admin/Sidebar/AdminSidebar';
import { AdminHeader } from './components/Admin/Header/AdminHeader';
import { AdminDashboard } from './components/Admin/Dashboard/AdminDashboard';
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

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Customer states info
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedCity, setSelectedCity] = useState('noida');
  const [currentLocation, setCurrentLocation] = useState<string>('Sector 56, Noida, UP');
  const [selectedRestId, setSelectedRestId] = useState<string>('rest-1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendorSearchFilters, setVendorSearchFilters] = useState({
    search: '',
    categoryId: '',
    city: '',
  });
  const [eventPlannerSearch, setEventPlannerSearch] = useState({
    eventName: '',
    location: '',
    date: '',
    eventType: '',
  });

  // Admin dynamic states
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');

  // Unified global callbacks & state helpers
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    window.dispatchEvent(new CustomEvent('hero-city-change', { detail: { city } }));
  };

  const handleNavigatePage = (
    pageName: string,
    data?: {
      restaurantId?: string;
      search?: string;
      categoryId?: string;
      city?: string;
      eventName?: string;
      location?: string;
      date?: string;
      eventType?: string;
    }
  ) => {
    if (data?.restaurantId) {
      setSelectedRestId(data.restaurantId);
    }
    if (pageName === 'vendor-categories') {
      setVendorSearchFilters({
        search: data?.search ?? '',
        categoryId: data?.categoryId ?? '',
        city: data?.city ?? '',
      });
    } else if (pageName !== 'vendor-categories') {
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
    if (pageName === 'profile' && !isLoggedIn) {
      setCurrentPage('sign-in');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = ({ phone, email }: { phone: string; email: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      phone: phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`,
      email,
    }));
    setIsLoggedIn(true);
    setCurrentPage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onSwitchToAdmin={() => setIsAdminMode(true)}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
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
                onSwitchToAdmin={() => setIsAdminMode(true)}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
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
                  <SignInPage onSignIn={handleSignIn} onNavigate={handleNavigatePage} />
                )}

                {currentPage === 'profile' && isLoggedIn && (
                  <UserProfilePage
                    userProfile={userProfile}
                    onUpdateWallet={handleUpdateWallet}
                    onNavigate={handleNavigatePage}
                  />
                )}

                {currentPage === 'vendor-categories' && (
                  <VendorCategoryPage
                    onNavigate={handleNavigatePage}
                    isDarkMode={isDarkMode}
                    initialSearchQuery={vendorSearchFilters.search}
                    initialCategoryId={vendorSearchFilters.categoryId}
                    initialCity={vendorSearchFilters.city}
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
        <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-stone-900" id="admin-portal-view">
          
          <AdminSidebar
            currentAdminTab={currentAdminTab}
            onSelectTab={setCurrentAdminTab}
            onExitAdmin={() => setIsAdminMode(false)}
          />

          {/* Main workspace container (Header + body) */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            <AdminHeader currentTabName={currentAdminTab} />

            {/* Admin view Router */}
            <main className="flex-1 p-6 overflow-y-auto space-y-6">
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
