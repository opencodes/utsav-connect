import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { APP_NAME } from '../../brand';
import { AnimatedDiya } from './GoldenDeco';
import { fetchVendors } from '../../api/vendors';
import { useVendorCategories } from '../../hooks/useVendorCategories';
import type { ListingCardItem } from './VendorCategoryPage/VendorGridCard';
import { vendorMatchesCity } from './VendorCategoryPage/vendorCityFilter';
import { HERO_VENDOR_CITIES } from './LandingPage/heroVendorSearch';
import { PageBanner } from './PageBanner';
import { VendorSearchBar, VendorSearchDraft } from './VendorListingPage/VendorSearchBar';
import { VendorListItemCard } from './VendorListingPage/VendorListItemCard';
import {
  enrichVendorForListing,
  parseVendorPrice,
} from './VendorListingPage/vendorListingData';

interface VendorListPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  isDarkMode: boolean;
  initialSearchQuery?: string;
  initialCategoryId?: string;
  initialCity?: string;
}

function draftFromApplied(
  searchQuery: string,
  categoryId: string,
  city: string,
  sortBy: VendorSearchDraft['sortBy'],
  ratingFilter: VendorSearchDraft['ratingFilter'],
  offersFilter: VendorSearchDraft['offersFilter']
): VendorSearchDraft {
  return {
    query: searchQuery,
    categoryId,
    city,
    sortBy,
    ratingFilter,
    offersFilter,
  };
}

const EMPTY_DRAFT: VendorSearchDraft = {
  query: '',
  categoryId: '',
  city: '',
  sortBy: '',
  ratingFilter: '',
  offersFilter: '',
};

export const VendorListPage: React.FC<VendorListPageProps> = ({
  onNavigate,
  initialSearchQuery = '',
  initialCategoryId = '',
  initialCity = '',
}) => {
  const { categories, getLabel } = useVendorCategories();
  const [allVendors, setAllVendors] = useState<ListingCardItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetchVendors({
      category: initialCategoryId || undefined,
      city: initialCity || undefined,
      q: initialSearchQuery || undefined,
    })
      .then((list) => {
        if (!cancelled) setAllVendors(list);
      })
      .catch(() => {
        if (!cancelled) setAllVendors([]);
      });
    return () => {
      cancelled = true;
    };
  }, [initialCategoryId, initialCity, initialSearchQuery]);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState<VendorSearchDraft['sortBy']>('');
  const [ratingFilter, setRatingFilter] = useState<VendorSearchDraft['ratingFilter']>('');
  const [offersFilter, setOffersFilter] = useState<VendorSearchDraft['offersFilter']>('');

  const [draft, setDraft] = useState<VendorSearchDraft>(() =>
    draftFromApplied(initialSearchQuery, initialCategoryId, initialCity, '', '', '')
  );

  const [isInfiniteScrolling, setIsInfiniteScrolling] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
    setSelectedCategoryId(initialCategoryId);
    setSelectedCity(initialCity);
    setDraft(draftFromApplied(initialSearchQuery, initialCategoryId, initialCity, '', '', ''));
    setVisibleCount(4);
  }, [initialSearchQuery, initialCategoryId, initialCity]);

  const applySearch = () => {
    setSearchQuery(draft.query);
    setSelectedCategoryId(draft.categoryId);
    setSelectedCity(draft.city);
    setSortBy(draft.sortBy);
    setRatingFilter(draft.ratingFilter);
    setOffersFilter(draft.offersFilter);
    setVisibleCount(4);
  };

  const clearAll = () => {
    setDraft(EMPTY_DRAFT);
    setSearchQuery('');
    setSelectedCategoryId('');
    setSelectedCity('');
    setSortBy('');
    setRatingFilter('');
    setOffersFilter('');
    setVisibleCount(4);
  };

  const filteredVendors = useMemo(() => {
    let list = allVendors.map(enrichVendorForListing);

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.categoryLabel.toLowerCase().includes(q) ||
          v.featuredServices.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategoryId) {
      list = list.filter((v) => v.category === selectedCategoryId);
    }

    if (selectedCity.trim()) {
      list = list.filter((v) => vendorMatchesCity(v.location, selectedCity));
    }

    if (ratingFilter === 'top48') {
      list = list.filter((v) => v.rating >= 4.8);
    }

    if (offersFilter === 'offers') {
      list = list.filter((v) => v.offerText || v.hasFestiveDeal);
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.responseTimeMins - b.responseTimeMins);
    } else if (sortBy === 'costAsc') {
      list.sort((a, b) => parseVendorPrice(a.price) - parseVendorPrice(b.price));
    } else if (sortBy === 'costDesc') {
      list.sort((a, b) => parseVendorPrice(b.price) - parseVendorPrice(a.price));
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.distance - b.distance);
    }

    return list;
  }, [allVendors, searchQuery, selectedCategoryId, selectedCity, sortBy, ratingFilter, offersFilter]);

  const handleSimulateInfiniteScroll = () => {
    setIsInfiniteScrolling(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 2);
      setIsInfiniteScrolling(false);
    }, 1200);
  };

  const hasMore = filteredVendors.length > visibleCount;

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedCategoryId ||
      selectedCity ||
      sortBy ||
      ratingFilter ||
      offersFilter
  );

  const activeCategoryLabel = selectedCategoryId ? getLabel(selectedCategoryId) : null;

  const activeCityLabel = selectedCity
    ? HERO_VENDOR_CITIES.find((c) => c.value === selectedCity)?.label
    : null;

  const bannerTitle =
    activeCategoryLabel && activeCityLabel
      ? `${activeCategoryLabel} in ${activeCityLabel}`
      : activeCategoryLabel
        ? activeCategoryLabel
        : activeCityLabel
          ? `Vendors in ${activeCityLabel}`
          : 'Find trusted vendors for your celebration';

  const bannerDescription =
    activeCategoryLabel || activeCityLabel
      ? `Compare ratings, packages, and response times — then request quotes from verified ${APP_NAME} vendors.`
      : 'Venues, catering, décor, photography, pandits, and more — compare ratings, packages, and request quotes.';

  const bannerImage =
    selectedCategoryId === 'makeup'
      ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80'
      : selectedCategoryId === 'photographers'
        ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80'
        : selectedCategoryId === 'food'
          ? 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-stone-50 dark:bg-stone-900" id="vendor-listing-container">
      <PageBanner
        id="vendor-listing-hero"
        variant="vendor"
        bleed
        eyebrow={`${APP_NAME} vendor marketplace`}
        title={bannerTitle}
        description={bannerDescription}
        imageSrc={bannerImage}
        imageAlt={bannerTitle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <VendorSearchBar
        categories={categories}
        draft={draft}
        onDraftChange={setDraft}
        onSearch={applySearch}
        onClear={clearAll}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2 px-1">
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-orange-600" aria-hidden />
            <span>Found {filteredVendors.length} vendor matches</span>
          </h3>
          {hasActiveFilters && (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {activeCategoryLabel && <span className="font-semibold">{activeCategoryLabel}</span>}
              {activeCategoryLabel && searchQuery.trim() && ' • '}
              {searchQuery.trim() && (
                <span>
                  &quot;<span className="font-semibold">{searchQuery}</span>&quot;
                </span>
              )}
            </p>
          )}
        </div>

        {filteredVendors.length === 0 ? (
          <div
            className="bg-white dark:bg-stone-800 rounded-2xl p-12 text-center border border-orange-50 dark:border-stone-800 space-y-4 max-w-md mx-auto"
            id="vendor-listing-empty-state"
          >
            <AnimatedDiya className="w-16 h-16 mx-auto animate-bounce filter drop-shadow" />
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              No vendor matches found
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Adjust your filters and click Search again, or clear all filters to browse
              everything.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow hover:bg-orange-700 transition cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch"
            id="filtered-vendors-grid"
          >
            {filteredVendors.slice(0, visibleCount).map((vendor) => (
              <div key={vendor.id} className="h-full min-h-0">
                <VendorListItemCard
                  vendor={vendor}
                  onClick={() => onNavigate('vendor-details', { vendorId: vendor.id })}
                />
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-6" id="vendor-infinite-scroll-trigger">
            <button
              type="button"
              onClick={handleSimulateInfiniteScroll}
              disabled={isInfiniteScrolling}
              className="px-6 py-2.5 bg-white dark:bg-stone-800 hover:bg-orange-50 dark:hover:bg-amber-950/20 text-stone-800 dark:text-stone-200 hover:text-orange-600 dark:hover:text-amber-400 font-extrabold text-xs border border-orange-100 dark:border-stone-800 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isInfiniteScrolling ? (
                <>
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more vendors...</span>
                </>
              ) : (
                <>
                  <span>Load more vendors</span>
                  <span aria-hidden>↓</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
