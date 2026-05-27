import React, { useMemo, useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ALL_MOCK_VENDORS } from './VendorCategoryPage/mockData';
import { fetchVendor, submitVendorEnquiry } from '../../api/vendors';
import type { ListingCardItem } from './VendorCategoryPage/VendorGridCard';
import { InquiryModal, InquiryFormData } from './VendorCategoryPage/InquiryModal';
import { VendorDetailHero } from './VendorDetailPage/VendorDetailHero';
import { ServiceCategoryToggleList } from './VendorDetailPage/ServiceCategoryToggleList';
import { ServiceOfferingCard } from './VendorDetailPage/ServiceOfferingCard';
import { StickyInquiryFooter } from './VendorDetailPage/StickyInquiryFooter';
import {
  buildVendorDetailProfile,
  VendorServiceItem,
} from './VendorDetailPage/vendorServicesData';
import { getVendorReviews } from './VendorDetailPage/vendorReviewsData';
import { VendorReviewsSection } from './VendorDetailPage/VendorReviewsSection';

interface VendorDetailsPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  vendorId: string;
  initialCity?: string;
}

export const VendorDetailsPage: React.FC<VendorDetailsPageProps> = ({
  onNavigate,
  vendorId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFavorite, setIsFavorite] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [shortlist, setShortlist] = useState<Record<string, number>>({});

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    date: '',
    message: '',
    estimatedGuests: '150-300',
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const [listing, setListing] = useState<ListingCardItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchVendor(vendorId)
      .then((v) => {
        if (cancelled) return;
        if (v) setListing(v);
        else setListing(ALL_MOCK_VENDORS.find((x) => x.id === vendorId) ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setListing(ALL_MOCK_VENDORS.find((x) => x.id === vendorId) ?? null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const vendor = useMemo(() => {
    if (!listing) return null;
    return buildVendorDetailProfile(listing);
  }, [listing]);

  const { summary: reviewSummary, reviews: vendorReviews } = useMemo(() => {
    if (!vendor) return { summary: null, reviews: [] };
    return getVendorReviews(vendor.id, vendor.rating, vendor.ratingCount);
  }, [vendor]);

  const serviceCategories = useMemo(() => {
    if (!vendor) return ['All'];
    const cats = new Set<string>();
    vendor.services.forEach((s) => cats.add(s.category));
    return ['All', ...Array.from(cats)];
  }, [vendor]);

  const filteredServices = useMemo(() => {
    if (!vendor) return [];
    return vendor.services.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        serviceSearch.trim() === '' ||
        item.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [vendor, selectedCategory, serviceSearch]);

  const shortlistCount = (Object.values(shortlist) as number[]).reduce((sum, n) => sum + n, 0);

  const getServiceQty = (serviceId: string) => shortlist[serviceId] ?? 0;

  const addToShortlist = (service: VendorServiceItem) => {
    setShortlist((prev) => ({
      ...prev,
      [service.id]: (prev[service.id] ?? 0) + 1,
    }));
  };

  const removeFromShortlist = (serviceId: string) => {
    setShortlist((prev) => {
      const next = { ...prev };
      if (!next[serviceId]) return prev;
      if (next[serviceId] <= 1) {
        delete next[serviceId];
      } else {
        next[serviceId] -= 1;
      }
      return next;
    });
  };

  const openInquiryWithShortlist = () => {
    if (!vendor) return;
    const names = vendor.services
      .filter((s) => shortlist[s.id])
      .map((s) => `${s.name} (×${shortlist[s.id]})`)
      .join(', ');
    setFormData((prev) => ({
      ...prev,
      message: names
        ? `Interested in: ${names}. Please share availability and quote.`
        : prev.message,
    }));
    setShowInquiryModal(true);
  };

  const handleApplyInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitVendorEnquiry(vendorId, {
        guestName: formData.name,
        eventType: 'Wedding consultation',
        eventDate: formData.date,
        guests: formData.estimatedGuests,
        message: formData.message,
      });
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setShowInquiryModal(false);
        setFormData({ name: '', phone: '', date: '', message: '', estimatedGuests: '150-300' });
        setShortlist({});
      }, 4500);
    } catch {
      alert('Could not send enquiry. Please try again.');
    }
  };

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-stone-50 dark:bg-stone-900">
        <button
          type="button"
          onClick={() => onNavigate('vendor-list')}
          className="flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-orange-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          Back to vendor list
        </button>
        <h1 className="heading-page text-2xl mt-6 text-stone-900 dark:text-white">Vendor not found</h1>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen bg-stone-50 dark:bg-stone-900 text-left relative pb-28"
      id="vendor-detail-container"
    >
      <button
        type="button"
        onClick={() => onNavigate('vendor-list', { categoryId: vendor.category })}
        className="flex items-center gap-2 text-sm font-bold text-stone-605 dark:text-stone-300 hover:text-orange-600 transition-colors cursor-pointer"
        id="btn-back-to-vendor-list"
      >
        <ArrowLeft className="w-4 h-4 text-orange-600" />
        <span>Back to Vendor List</span>
      </button>

      <VendorDetailHero
        vendor={vendor}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
      />

      {vendor.offerText && (
        <div
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-4 border border-orange-200 dark:border-stone-850 flex items-center justify-between gap-4"
          id="vendor-details-offer-banner"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden>
              🪔
            </span>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">Active vendor offer</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{vendor.offerText}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-orange-600 text-white px-3 py-1 rounded">
            ACTIVE
          </span>
        </div>
      )}

      <section className="space-y-6" id="detail-vendor-services">
        <ServiceCategoryToggleList
          serviceCategories={serviceCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          serviceSearch={serviceSearch}
          setServiceSearch={setServiceSearch}
        />

        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="p-12 bg-white dark:bg-stone-850 rounded-2xl text-center border ring-1 ring-orange-100 dark:ring-stone-800 space-y-2">
              <span className="text-3xl" aria-hidden>
                🔍
              </span>
              <h5 className="font-bold text-stone-800 dark:text-stone-200">No services matching</h5>
              <p className="text-xs text-stone-400">
                Try changing the category tab or search query.
              </p>
            </div>
          ) : (
            <div className="grid gap-4" id="vendor-services-container">
              {filteredServices.map((service) => {
                const qty = getServiceQty(service.id);
                return (
                  <ServiceOfferingCard
                    key={service.id}
                    service={service}
                    qty={qty}
                    onAdd={addToShortlist}
                    onRemove={removeFromShortlist}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {reviewSummary && (
        <VendorReviewsSection
          vendorName={vendor.name}
          summary={reviewSummary}
          reviews={vendorReviews}
        />
      )}

      {shortlistCount > 0 && (
        <StickyInquiryFooter
          selectedCount={shortlistCount}
          onRequestQuote={openInquiryWithShortlist}
        />
      )}

      <AnimatePresence>
        {showInquiryModal && (
          <InquiryModal
            inquiryTarget={vendor}
            formData={formData}
            setFormData={setFormData}
            showCelebration={showCelebration}
            onClose={() => setShowInquiryModal(false)}
            onSubmit={handleApplyInquiry}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
