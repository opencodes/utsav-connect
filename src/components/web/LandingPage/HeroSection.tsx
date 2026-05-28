import React, { useState, useEffect } from 'react';
import { Search, CalendarPlus, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { APP_NAME } from '../../../brand';
import { RangoliMandala } from '../GoldenDeco';
import heroBanner from '../../../assets/banner-1.png';
import { HERO_VENDOR_CITIES, HeroVendorSearchPayload } from './heroVendorSearch';
import { POPULAR_LOCALITIES } from '../../../data/cities';
import { useVendorCategories } from '../../../hooks/useVendorCategories';
import { getHeroCategoryOptions } from '../../../vendorCategories';
import { HERO_EVENT_TYPES, HeroEventSearchPayload } from './heroEventSearch';

interface HeroSectionProps {
  onNavigate: (page: string, data?: unknown) => void;
  /** Hero sits inside landing-hero-shell; shell provides the gradient */
  embeddedInShell?: boolean;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

type HeroSearchTab = 'vendors' | 'planner';

const QUICK_VENDOR_TAGS = [
  { label: 'Halwai', categoryId: 'food' },
  { label: 'Venues', categoryId: 'venues' },
  { label: 'Decor', categoryId: 'planning-decor' },
  { label: 'Photographers', categoryId: 'photographers' },
] as const;

const plannerFieldLabel =
  'block text-[11px] font-bold tracking-wide text-stone-500 mb-1.5';

const vendorFieldLabel = plannerFieldLabel;

function HeroSkyline() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full max-w-xl h-32 sm:h-40 text-white/[0.07] pointer-events-none"
      viewBox="0 0 400 120"
      preserveAspectRatio="xMinYMax meet"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 120V72h24v48H0zm40-48h20v72H40V72zm32 24h28v48H72V96zm48-36h24v84h-24V60zm56 12h32v72h-32V72zm64-24h20v96h-20V48zm48 36h36v60h-36V84zm56-60h28v120h-28V24zm48 48h24v72h-24V72zm40-36h32v108h-32V36zM400 120H0"
      />
    </svg>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  embeddedInShell = false,
  selectedCity,
  onCityChange,
}) => {
  const { categories } = useVendorCategories();
  const heroCategoryOptions = getHeroCategoryOptions(categories);
  const [activeTab, setActiveTab] = useState<HeroSearchTab>('vendors');

  const [city, setCity] = useState(selectedCity);
  const [categoryId, setCategoryId] = useState('');
  const [keyword, setKeyword] = useState('');

  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');

  const cityHeadline =
    HERO_VENDOR_CITIES.find((c) => c.value === city)?.label ?? '—';

  useEffect(() => {
    setCity(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const onCityChangeEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ city?: string }>).detail;
      if (detail?.city) setCity(detail.city);
    };
    window.addEventListener('hero-city-change', onCityChangeEvent);
    return () => window.removeEventListener('hero-city-change', onCityChangeEvent);
  }, []);

  const updateCity = (cityValue: string) => {
    setCity(cityValue);
    onCityChange(cityValue);
  };

  const handleVendorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: HeroVendorSearchPayload = {};
    if (keyword.trim()) payload.search = keyword.trim();
    if (categoryId) payload.categoryId = categoryId;
    if (city) payload.city = city;
    onNavigate('vendor-list', Object.keys(payload).length > 0 ? payload : undefined);
  };

  const handleEventPlannerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('event-planner-register', {
      fromHome: true,
      eventName: eventName.trim() || undefined,
      location: eventLocation.trim() || undefined,
      date: eventDate || undefined,
      eventType: eventType || undefined,
      city: city || selectedCity,
    });
  };

  const applyPopularCity = (cityValue: string) => {
    updateCity(cityValue);
    setActiveTab('vendors');
  };

  const applyQuickCategory = (catId: string) => {
    setCategoryId(catId);
    setActiveTab('vendors');
  };

  const goToVendorRegistration = () => {
    onNavigate('list-your-service');
  };

  return (
    <section
      className={`relative w-full overflow-hidden ${
        embeddedInShell
          ? 'border-b border-orange-900/30'
          : 'border-b border-orange-900/30 bg-gradient-to-br from-[#C51C13] via-stone-900 to-amber-800'
      }`}
      id="landing-hero"
    >
      {!embeddedInShell && (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#C51C13] via-stone-900 to-amber-800"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,203,68,0.22)_0%,_transparent_55%)] pointer-events-none"
            aria-hidden
          />
        </>
      )}
      <HeroSkyline />
      <div className="absolute top-8 left-[4%] pointer-events-none select-none z-0 opacity-[0.07]">
        <RangoliMandala className="w-48 h-48 text-orange-300" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,42%)] gap-8 lg:gap-6 xl:gap-10 items-center py-10 sm:py-12 lg:py-14 min-h-[min(88vh,720px)] lg:min-h-[520px]">
          {/* Left: copy + search (Housing.com layout) */}
          <div className="text-left font-sans order-1">
            <h1 className="hero-headline font-display text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-5xl font-normal text-white leading-[1.12] tracking-tight max-w-xl">
              <span className="hero-headline-line line-clamp-1">
                {activeTab === 'vendors'
                  ? 'Vendors & services'
                  : 'Plan your ceremony'}
              </span>
              <span className="hero-headline-line hero-headline-accent line-clamp-1 mt-1 text-[#FFCB44]">
                {activeTab === 'vendors' ? `in ${cityHeadline}` : `with ${APP_NAME}`}
              </span>
            </h1>

            <p className="hero-headline-sub text-amber-50/95 text-sm sm:text-base max-w-lg mt-3 leading-relaxed line-clamp-2">
              {activeTab === 'vendors'
                ? 'Thousands of trusted halwai, décor, venues & pandits — new listings added daily and verified for Mithila weddings.'
                : 'Organise guests, budget, rituals and vendors in one place. Tell us your event details to get started.'}
            </p>

            <div className="mt-8 w-full max-w-3xl" id="hero-search-form">
              <div className="hero-search-card">
                <div className="hero-search-tabs" role="tablist" aria-label="Search mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'vendors'}
                    aria-controls="hero-vendor-search-panel"
                    id="hero-tab-vendors"
                    className={`hero-search-tab ${activeTab === 'vendors' ? 'hero-search-tab-active' : ''}`}
                    onClick={() => setActiveTab('vendors')}
                  >
                    Search vendors
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'planner'}
                    aria-controls="hero-planner-search-panel"
                    id="hero-tab-planner"
                    className={`hero-search-tab ${activeTab === 'planner' ? 'hero-search-tab-active' : ''}`}
                    onClick={() => setActiveTab('planner')}
                  >
                    Event planner
                  </button>
                </div>

                <div className="hero-search-panel-body">
                  <div
                    id="hero-vendor-search-panel"
                    role="tabpanel"
                    aria-labelledby="hero-tab-vendors"
                    aria-hidden={activeTab !== 'vendors'}
                    className={`hero-search-panel hero-vendor-panel ${
                      activeTab !== 'vendors' ? 'hero-search-panel-hidden' : ''
                    }`}
                  >
                    <form
                      onSubmit={handleVendorSearch}
                      className="hero-vendor-form hero-search-card-body"
                    >
                      <div className="hero-vendor-grid">
                        <div className="hero-vendor-field">
                          <label htmlFor="hero-search-city" className={vendorFieldLabel}>
                            City
                          </label>
                          <div className="hero-vendor-select-wrap">
                            <select
                              id="hero-search-city"
                              value={city}
                              onChange={(e) => updateCity(e.target.value)}
                              className="hero-vendor-input hero-vendor-select"
                            >
                              {HERO_VENDOR_CITIES.filter((c) => c.value).map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="hero-vendor-select-chevron" aria-hidden />
                          </div>
                        </div>

                        <div className="hero-vendor-field">
                          <label htmlFor="hero-search-category" className={vendorFieldLabel}>
                            Category
                          </label>
                          <div className="hero-vendor-select-wrap">
                            <select
                              id="hero-search-category"
                              value={categoryId}
                              onChange={(e) => setCategoryId(e.target.value)}
                              className="hero-vendor-input hero-vendor-select"
                            >
                              {heroCategoryOptions.map((c) => (
                                <option key={c.value || 'all'} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="hero-vendor-select-chevron" aria-hidden />
                          </div>
                        </div>

                        <div className="hero-vendor-field hero-vendor-field-keyword">
                          <label htmlFor="hero-search-keyword" className={vendorFieldLabel}>
                            Keyword
                          </label>
                          <div className="hero-vendor-input-wrap">
                            <Search className="hero-vendor-input-icon" aria-hidden />
                            <input
                              id="hero-search-keyword"
                              type="search"
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              placeholder="Halwai, tent house, venue…"
                              className="hero-vendor-input hero-vendor-input-with-icon"
                            />
                          </div>
                        </div>

                        <div className="hero-vendor-field hero-vendor-field-submit">
                          <span className={vendorFieldLabel} aria-hidden="true">
                            &nbsp;
                          </span>
                          <button type="submit" id="btn-hero-vendor-search" className="hero-vendor-submit">
                            <Search className="w-5 h-5 shrink-0" strokeWidth={2.25} />
                            Search
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-2 px-0.5">
                        Tip: leave keyword empty to browse all vendors in {cityHeadline}.
                      </p>
                    </form>

                    <div className="hero-vendor-popular">
                      <p className="hero-vendor-popular-label">Popular</p>
                      <div className="hero-vendor-popular-pills">
                        {POPULAR_LOCALITIES.map((loc) => (
                          <button
                            key={loc.city}
                            type="button"
                            onClick={() => applyPopularCity(loc.city)}
                            className="hero-popular-pill-in-card"
                          >
                            {loc.label}
                          </button>
                        ))}
                        {QUICK_VENDOR_TAGS.map((tag) => (
                          <button
                            key={tag.categoryId}
                            type="button"
                            onClick={() => applyQuickCategory(tag.categoryId)}
                            className="hero-popular-pill-in-card hero-popular-pill-in-card-muted"
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleEventPlannerSearch}
                    id="hero-planner-search-panel"
                    role="tabpanel"
                    aria-labelledby="hero-tab-planner"
                    aria-hidden={activeTab !== 'planner'}
                    className={`hero-search-panel hero-planner-card hero-search-card-body ${
                      activeTab !== 'planner' ? 'hero-search-panel-hidden' : ''
                    }`}
                  >
                    <div className="hero-planner-grid">
                      <div className="hero-planner-field hero-planner-field-full">
                        <label htmlFor="hero-event-name" className={plannerFieldLabel}>
                          Event name
                        </label>
                        <input
                          id="hero-event-name"
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="e.g. Priya & Rahul Wedding"
                          className="hero-planner-input"
                        />
                      </div>

                      <div className="hero-planner-field">
                        <label htmlFor="hero-event-location" className={plannerFieldLabel}>
                          Location
                        </label>
                        <div className="hero-planner-input-wrap">
                          <MapPin className="hero-planner-input-icon" aria-hidden />
                          <input
                            id="hero-event-location"
                            type="text"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            placeholder="City or venue area"
                            className="hero-planner-input hero-planner-input-with-icon"
                          />
                        </div>
                      </div>

                      <div className="hero-planner-field">
                        <label htmlFor="hero-event-date" className={plannerFieldLabel}>
                          Date
                        </label>
                        <div className="hero-planner-input-wrap">
                          <Calendar className="hero-planner-input-icon" aria-hidden />
                          <input
                            id="hero-event-date"
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="hero-planner-input hero-planner-input-with-icon hero-planner-input-date"
                          />
                        </div>
                      </div>

                      <div className="hero-planner-field hero-planner-field-full">
                        <label htmlFor="hero-event-type" className={plannerFieldLabel}>
                          Type of event
                        </label>
                        <div className="hero-planner-select-wrap">
                          <select
                            id="hero-event-type"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="hero-planner-input hero-planner-select"
                          >
                            {HERO_EVENT_TYPES.map((t) => (
                              <option key={t.value || 'none'} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="hero-planner-select-chevron" aria-hidden />
                        </div>
                      </div>
                    </div>

                    <button type="submit" id="btn-hero-planner-search" className="hero-planner-submit">
                      <CalendarPlus className="w-5 h-5 shrink-0" strokeWidth={2.25} />
                      Register &amp; plan your event
                    </button>
                    <p className="text-[11px] text-stone-500 mt-2">
                      Create your free account, then open your planning workspace — guests, budget,
                      vendors &amp; timelines.
                    </p>
                    <p className="text-[11px] text-stone-500 mt-3 pt-3 border-t border-stone-200/80">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('sign-in')}
                        className="text-[#C51C13] font-semibold hover:underline cursor-pointer"
                      >
                        Sign in to continue planning
                      </button>
                      {' · '}
                      <button
                        type="button"
                        onClick={() => onNavigate('celebrations')}
                        className="text-[#C51C13] font-semibold hover:underline cursor-pointer"
                      >
                        Browse public events
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right: branded hero banner */}
          <div className="relative flex justify-center lg:justify-end order-2 pt-4 lg:pt-0">
            <div className="hero-image-frame hero-image-frame--banner">
              <img
                src={heroBanner}
                alt={`${APP_NAME} — शुभे हे शुभे, Mithila ceremonies`}
                className="hero-image-frame-photo hero-image-frame-photo--banner"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Bottom owner/vendor strip */}
        <div className="border-t border-orange-200/20 py-3 sm:py-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left text-sm text-amber-100/90">
          <span>Are you a ceremony vendor?</span>
          <button
            type="button"
            onClick={goToVendorRegistration}
            className="font-bold text-[#FFCB44] hover:text-amber-200 underline-offset-2 hover:underline cursor-pointer"
          >
            List your service on {APP_NAME}
          </button>
          <span className="hidden sm:inline text-white/40">·</span>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="text-white/70 hover:text-white text-sm cursor-pointer"
          >
            Talk to our team
          </button>
        </div>
      </div>
    </section>
  );
};
