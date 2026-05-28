import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Landmark,
  CalendarPlus,
  LogOut,
  MapPin,
  ChevronDown,
  Store,
} from 'lucide-react';
import LogoSvg from '../../assets/logo.svg';
import LogoLightSvg from '../../assets/logo-light.svg';
import { APP_NAME } from '../../brand';
import { HERO_VENDOR_CITIES } from './LandingPage/heroVendorSearch';
import { DEFAULT_CITY_VALUE } from '../../data/cities';

interface CustomerHeaderProps {
  onNavigate: (page: string, data?: unknown) => void;
  currentPage: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchToAdmin: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  isVendorLoggedIn?: boolean;
  isEventPlannerCustomer?: boolean;
  userProfile: { name: string; walletBalance: number };
  /** Nav sits on the landing hero gradient (same block as hero) */
  blendWithHero?: boolean;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const PRIMARY_NAV: { label: string; value: string; alsoActive?: string[] }[] = [
  { label: 'Home', value: 'landing' },
  { label: 'Vendors', value: 'vendor-categories', alsoActive: ['vendor-list', 'vendor-details'] },
  { label: 'About', value: 'about' },
  { label: 'Contact', value: 'contact' },
];

const HEADER_CITIES = HERO_VENDOR_CITIES.filter((c) => c.value);

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  onNavigate,
  currentPage,
  isDarkMode,
  onToggleDarkMode,
  onSwitchToAdmin,
  onLogout,
  isLoggedIn,
  isVendorLoggedIn = false,
  isEventPlannerCustomer = false,
  userProfile,
  blendWithHero = false,
  selectedCity,
  onCityChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const [cityMenuRect, setCityMenuRect] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);

  const onHeroGradient = blendWithHero && !scrolledPastHero;
  const logoSrc = onHeroGradient ? LogoSvg : LogoLightSvg;

  useEffect(() => {
    if (!blendWithHero) {
      setScrolledPastHero(false);
      return;
    }
    const update = () => {
      const hero = document.getElementById('landing-hero');
      if (!hero) return;
      setScrolledPastHero(hero.getBoundingClientRect().bottom <= 72);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [blendWithHero]);

  useLayoutEffect(() => {
    if (!cityMenuOpen || !cityButtonRef.current) {
      setCityMenuRect(null);
      return;
    }
    const updateRect = () => {
      const rect = cityButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCityMenuRect({
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: Math.max(rect.width, 176),
      });
    };
    updateRect();
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [cityMenuOpen]);

  const cityLabel =
    HEADER_CITIES.find((c) => c.value === selectedCity)?.label ??
    HEADER_CITIES.find((c) => c.value === DEFAULT_CITY_VALUE)?.label ??
    selectedCity;

  const goTo = (page: string, data?: unknown) => {
    onNavigate(page, data);
    setMobileMenuOpen(false);
  };

  const isNavActive = (value: string, alsoActive: string[] = []) =>
    currentPage === value || alsoActive.includes(currentPage);

  const navLinkClass = (active: boolean) => {
    if (onHeroGradient) {
      return `relative px-3 py-5 text-sm font-semibold transition-colors cursor-pointer ${
        active
          ? 'text-[#FFCB44] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#FFCB44] after:rounded-full'
          : 'text-amber-100/75 hover:text-white'
      }`;
    }
    return `relative px-3 py-5 text-sm font-semibold transition-colors cursor-pointer ${
      active
        ? 'text-[#C51C13] dark:text-orange-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#C51C13] dark:after:bg-orange-400 after:rounded-full'
        : 'text-stone-700 dark:text-stone-300 hover:text-[#C51C13] dark:hover:text-orange-400'
    }`;
  };

  const handleCitySelect = (cityValue: string) => {
    onCityChange(cityValue);
    setCityMenuOpen(false);
    if (currentPage !== 'landing') {
      goTo('vendor-list', { city: cityValue });
    }
  };

  const goToEventPlanning = () => {
    if (isEventPlannerCustomer) {
      onSwitchToAdmin();
      setMobileMenuOpen(false);
      return;
    }
    onNavigate('event-planner-register');
    setMobileMenuOpen(false);
  };

  const goToVendorSearch = () => {
    if (currentPage === 'landing') {
      document.getElementById('hero-tab-vendors')?.click();
      document.getElementById('landing-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      goTo('vendor-list', { city: selectedCity });
    }
  };

  const listYourService = () => {
    if (isVendorLoggedIn) {
      goTo('profile');
    } else {
      goTo('list-your-service');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        onHeroGradient
          ? 'bg-transparent border-b border-white/15 shadow-none'
          : 'bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 shadow-sm'
      }`}
      id="ceremony-main-header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-[4.25rem]">
          {/* Logo + city (Housing.com left cluster) */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => goTo('landing')}
              className="flex items-center shrink-0 cursor-pointer group"
              id="header-logo"
              aria-label={`${APP_NAME} home`}
            >
              <img
                src={logoSrc}
                alt={APP_NAME}
                className="h-8 sm:h-9 w-auto select-none transition-transform duration-200 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
            </button>

            <div
              className={`hidden sm:block w-px h-8 ${onHeroGradient ? 'bg-white/25' : 'bg-stone-200 dark:bg-stone-700'}`}
              aria-hidden
            />

            <div className="relative hidden sm:block">
              <button
                ref={cityButtonRef}
                type="button"
                onClick={() => setCityMenuOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                  onHeroGradient
                    ? 'hover:bg-white/10'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
                aria-expanded={cityMenuOpen}
                aria-haspopup="listbox"
              >
                <MapPin
                  className={`w-4 h-4 shrink-0 ${onHeroGradient ? 'text-[#FFCB44]' : 'text-[#C51C13]'}`}
                />
                <span
                  className={`text-sm font-bold truncate max-w-[7rem] lg:max-w-none ${
                    onHeroGradient ? 'text-white' : 'text-stone-900 dark:text-white'
                  }`}
                >
                  {cityLabel}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 ${onHeroGradient ? 'text-amber-200/80' : 'text-stone-400'}`}
                />
              </button>
              {cityMenuOpen &&
                cityMenuRect &&
                createPortal(
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-[90] cursor-default bg-transparent"
                      aria-label="Close city menu"
                      onClick={() => setCityMenuOpen(false)}
                    />
                    <ul
                      className="fixed z-[100] py-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl max-h-64 overflow-y-auto"
                      style={{
                        top: cityMenuRect.top,
                        left: cityMenuRect.left,
                        minWidth: cityMenuRect.minWidth,
                      }}
                      role="listbox"
                    >
                      {HEADER_CITIES.map((c) => (
                        <li key={c.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selectedCity === c.value}
                            onClick={() => handleCitySelect(c.value)}
                            className={`w-full text-left px-3 py-2 text-sm font-medium cursor-pointer ${
                              selectedCity === c.value
                                ? 'text-[#C51C13] bg-orange-50 dark:bg-stone-800'
                                : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                            }`}
                          >
                            {c.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>,
                  document.body
                )}
            </div>
          </div>

          {/* Center nav */}
          <nav
            className="hidden lg:flex items-center justify-center flex-1 gap-1 xl:gap-2"
            id="desktop-main-navigation"
            aria-label="Main"
          >
            {PRIMARY_NAV.map((link) => (
              <button
                key={link.value}
                type="button"
                onClick={() => goTo(link.value)}
                className={navLinkClass(isNavActive(link.value, link.alsoActive ?? []))}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={listYourService}
              className={`hidden md:inline-flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${
                onHeroGradient
                  ? 'border-white/35 text-white hover:bg-white/10'
                  : 'border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-100 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-stone-800'
              }`}
              id="header-list-service-btn"
            >
              <Store
                className={`w-4 h-4 shrink-0 ${onHeroGradient ? 'text-[#FFCB44]' : 'text-[#C51C13]'}`}
              />
              <span className="hidden xl:inline">
                {isVendorLoggedIn ? 'Vendor dashboard' : 'List your service'}
              </span>
              <span className="xl:hidden">{isVendorLoggedIn ? 'Dashboard' : 'List service'}</span>
              <span className="text-[10px] font-black bg-[#FFCB44] text-red-950 px-1.5 py-0.5 rounded">
                Free
              </span>
            </button>

            <button
              type="button"
              onClick={goToEventPlanning}
              id="header-event-planning-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">
                {isEventPlannerCustomer ? 'Planner workspace' : 'Event planning'}
              </span>
              <span className="lg:hidden">{isEventPlannerCustomer ? 'Workspace' : 'Plan event'}</span>
            </button>

            {isVendorLoggedIn && (
              <button
                type="button"
                onClick={() => goTo('profile')}
                className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full border transition-colors cursor-pointer ${
                  onHeroGradient
                    ? 'bg-white/10 border-white/30 hover:bg-white/20'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-600 hover:border-orange-300'
                }`}
                title="Vendor dashboard"
              >
                <Store className={`w-4 h-4 ${onHeroGradient ? 'text-[#FFCB44]' : 'text-[#C51C13]'}`} />
              </button>
            )}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => onSwitchToAdmin()}
                className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full border transition-colors cursor-pointer ${
                  onHeroGradient
                    ? 'bg-white/10 border-white/30 hover:bg-white/20'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-600 hover:border-orange-300'
                }`}
                title={`${userProfile.name} — planner workspace`}
              >
                <User className={`w-4 h-4 ${onHeroGradient ? 'text-[#FFCB44]' : 'text-[#C51C13]'}`} />
              </button>
            ) : (
              !isVendorLoggedIn && (
                <button
                  type="button"
                  onClick={() => goTo('sign-in')}
                  className={`hidden sm:inline-flex px-3 py-2 text-sm font-semibold cursor-pointer ${
                    onHeroGradient
                      ? 'text-amber-100 hover:text-white'
                      : 'text-[#C51C13] hover:text-[#A2110A]'
                  }`}
                >
                  Sign in
                </button>
              )
            )}

            {(isLoggedIn || isVendorLoggedIn || isEventPlannerCustomer) && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  onHeroGradient
                    ? 'text-amber-100 hover:bg-white/10 hover:text-white border border-white/25'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-600'
                }`}
                id="header-logout-btn"
                title="Log out"
              >
                <LogOut className="w-4 h-4 shrink-0" aria-hidden />
                <span className="hidden lg:inline">Log out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                onHeroGradient
                  ? 'hover:bg-white/10 text-amber-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                onHeroGradient
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
              }`}
              id="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 sm:hidden">
            <MapPin className="w-4 h-4 text-[#C51C13]" />
            <label htmlFor="header-mobile-city" className="sr-only">
              City
            </label>
            <select
              id="header-mobile-city"
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="flex-1 text-sm font-semibold bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2"
            >
              {HEADER_CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={goToEventPlanning}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#C51C13] text-white text-sm font-semibold"
            >
              <CalendarPlus className="w-4 h-4" />
              Event planning
            </button>
            <button
              type="button"
              onClick={goToVendorSearch}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-600 text-sm font-semibold"
            >
              <Search className="w-4 h-4" />
              Search vendors
            </button>
            <button
              type="button"
              onClick={listYourService}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-orange-300 text-sm font-semibold text-[#C51C13]"
            >
              <Store className="w-4 h-4" />
              {isVendorLoggedIn ? 'Vendor dashboard' : 'List your service — Free'}
            </button>
          </div>

          <nav className="border-t border-stone-100 dark:border-stone-800 pt-2 space-y-0.5">
            {PRIMARY_NAV.map((link) => (
              <button
                key={link.value}
                type="button"
                onClick={() => goTo(link.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isNavActive(link.value, link.alsoActive ?? [])
                    ? 'text-[#C51C13] bg-orange-50 dark:bg-stone-800'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            {!isLoggedIn && !isVendorLoggedIn && !isEventPlannerCustomer && (
              <button
                type="button"
                onClick={() => goTo('sign-in')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#C51C13] bg-orange-50 dark:bg-stone-800"
              >
                Sign in
              </button>
            )}
            {isEventPlannerCustomer && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#C51C13] bg-orange-50 dark:bg-stone-800"
              >
                Planner workspace
              </button>
            )}
            {isVendorLoggedIn && (
              <button
                type="button"
                onClick={() => goTo('profile')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#C51C13] bg-orange-50 dark:bg-stone-800"
              >
                Vendor dashboard
              </button>
            )}
            {(isLoggedIn || isVendorLoggedIn || isEventPlannerCustomer) && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" aria-hidden />
                Log out
              </button>
            )}
          </nav>

          {!isEventPlannerCustomer && (
            <button
              type="button"
              onClick={() => {
                onNavigate('event-planner-register');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 dark:bg-stone-800 dark:border-stone-700 dark:text-amber-400"
            >
              <Landmark className="w-4 h-4" />
              Become an event planner
            </button>
          )}
        </div>
      )}
    </header>
  );
};
