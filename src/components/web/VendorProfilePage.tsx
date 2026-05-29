import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  ExternalLink,
  Eye,
  Inbox,
  LayoutGrid,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Settings,
  Star,
  Store,
  Trash2,
} from 'lucide-react';
import { APP_NAME } from '../../brand';
import { LandingSection } from './LandingPage/LandingSection';
import { useVendorCategories } from '../../hooks/useVendorCategories';
import type { VendorServiceItem } from './VendorDetailPage/vendorServicesData';
import { AddVendorServiceModal } from './VendorProfilePage/AddVendorServiceModal';
import { ImageUploadField } from './VendorProfilePage/ImageUploadField';
import { ServiceImagePicker } from './VendorProfilePage/ServiceImagePicker';
import { readImageFileAsDataUrl } from './VendorProfilePage/imageUploadUtils';
import type { VendorDashboardSession, VendorEnquiry } from './VendorProfilePage/vendorProfileData';
import {
  addVendorService,
  changeVendorPassword,
  fetchVendorDashboard,
  fetchVendorEnquiries,
  updateVendorProfile,
} from '../../api/vendors';
import { DynamicStringList, nonEmptyStrings } from './DynamicStringList';
import {
  primaryLocationFromValues,
  resolveStateDistrictFromVendor,
} from '../../indiaLocations';
import { StateDistrictSelect } from './StateDistrictSelect';
import { isBusinessAddressComplete } from '../../vendorAddressUtils';
import { buildVendorDetailProfile } from './VendorDetailPage/vendorServicesData';
import type { ListingCardItem } from './VendorCategoryPage/VendorGridCard';
import type { VendorDetailProfile } from './VendorDetailPage/vendorServicesData';

const DEFAULT_SERVICE_CATEGORIES = [
  'Venue packages',
  'Add-ons',
  'Photo & video',
  'Catering',
  'Decor',
  'Other',
];

interface VendorProfilePageProps {
  onNavigate: (page: string, data?: unknown) => void;
  session: VendorDashboardSession;
}

type DashboardTab = 'overview' | 'enquiries' | 'services' | 'settings';

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white';

const STATUS_STYLES: Record<VendorEnquiry['status'], string> = {
  New: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300',
  Replied: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  Booked: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300',
  Closed: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
};

export const VendorProfilePage: React.FC<VendorProfilePageProps> = ({ onNavigate, session }) => {
  const { getLabel } = useVendorCategories();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [services, setServices] = useState<VendorServiceItem[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [profileImageError, setProfileImageError] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileDistrict, setProfileDistrict] = useState('');
  const [villagesServed, setVillagesServed] = useState<string[]>(['']);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [vendor, setVendor] = useState<VendorDetailProfile | null>(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [listingStatus, setListingStatus] = useState<string | undefined>();

  const [enquiries, setEnquiries] = useState<VendorEnquiry[]>([]);

  useEffect(() => {
    if (!session.vendorId) {
      setVendor(null);
      setListingLoading(false);
      return;
    }
    let cancelled = false;
    setListingLoading(true);
    void fetchVendorDashboard(session.vendorId)
      .then((listing) => {
        if (cancelled) return;
        if (listing) {
          setListingStatus(listing.status);
          const profile = buildVendorDetailProfile(listing);
          setVendor(profile);
          setServices(profile.services);
          setProfileImage(profile.image);
          setAddressLine1(profile.addressLine1 ?? '');
          setAddressLine2(profile.addressLine2 ?? '');
          setLandmark(profile.landmark ?? '');
          setPinCode(profile.pinCode ?? '');
          const { state, district } = resolveStateDistrictFromVendor(profile);
          setProfileState(state);
          setProfileDistrict(district);
          setVillagesServed(
            profile.villagesServed && profile.villagesServed.length > 0
              ? profile.villagesServed
              : ['']
          );
        } else {
          setVendor(null);
          setListingStatus(undefined);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVendor(null);
          setListingStatus(undefined);
        }
      })
      .finally(() => {
        if (!cancelled) setListingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session.vendorId]);

  useEffect(() => {
    void fetchVendorEnquiries(session.vendorId)
      .then((rows) =>
        setEnquiries(
          rows.map((e) => ({
            id: e.id,
            guestName: e.guestName,
            eventType: e.eventType,
            eventDate: e.eventDate,
            guests: e.guests,
            status: (e.status as VendorEnquiry['status']) || 'New',
            receivedAt: e.receivedAt,
            message: e.message,
          }))
        )
      )
      .catch(() => setEnquiries([]));
  }, [session.vendorId]);

  const handleProfileImageFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setProfileImage(dataUrl);
      setProfileImageError('');
    } catch (err) {
      setProfileImageError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  const handleUpdateServiceImage = (serviceId: string, image: string) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, image } : s)));
  };

  const categoryName =
    vendor?.category ? getLabel(vendor.category) : '—';

  const newEnquiryCount = enquiries.filter((e) => e.status === 'New').length;

  const profileComplete = isBusinessAddressComplete({
    addressLine1,
    addressLine2,
    landmark,
    pinCode,
    state: profileState,
    district: profileDistrict,
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSaved(false);
    if (
      !isBusinessAddressComplete({
        addressLine1,
        addressLine2,
        landmark,
        pinCode,
        state: profileState,
        district: profileDistrict,
      })
    ) {
      setSettingsError('Please enter street address, PIN, state, and district.');
      return;
    }
    setSavingSettings(true);
    try {
      const { vendor: updated } = await updateVendorProfile(session.vendorId, {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        landmark: landmark.trim(),
        pinCode: pinCode.trim(),
        state: profileState,
        district: profileDistrict,
        primaryLocation: primaryLocationFromValues(profileState, profileDistrict),
        villagesServed: nonEmptyStrings(villagesServed),
        image: profileImage || vendor?.image,
      });
      const profile = buildVendorDetailProfile(updated as ListingCardItem);
      setVendor(profile);
      setProfileImage(profile.image);
      setSettingsSaved(true);
    } catch {
      setSettingsError('Could not save settings. Try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordError('Enter current password and new password.');
      return;
    }
    if (newPassword.trim().length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword.trim() !== (confirmPassword.trim() || newPassword.trim())) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await changeVendorPassword(session.vendorId, {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
        confirmPassword: (confirmPassword.trim() || newPassword.trim()).trim(),
      });
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Could not change password. Check your current password and try again.');
    } finally {
      setSavingPassword(false);
    }
  };

  const serviceCategoryOptions = useMemo(() => {
    const fromServices = services.map((s) => s.category).filter(Boolean);
    return [...new Set([...fromServices, ...DEFAULT_SERVICE_CATEGORIES])];
  }, [services]);

  const handleAddService = async (service: VendorServiceItem) => {
    setSavingService(true);
    setServiceError('');
    try {
      const { service: saved } = await addVendorService(session.vendorId, {
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        image: service.image,
      });
      setServices((prev) => [...prev, { ...service, id: saved.id ?? service.id }]);
      setActiveTab('services');
    } catch {
      setServiceError('Could not save service. Check your connection and try again.');
      throw new Error('save failed');
    } finally {
      setSavingService(false);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    if (!serviceId.startsWith('custom-')) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <Inbox className="w-4 h-4" />,
      badge: newEnquiryCount,
    },
    { id: 'services', label: 'Services', icon: <Store className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (listingLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900 px-4 pt-28 pb-16 text-center">
        <p className="text-stone-600 dark:text-stone-400">Loading your listing…</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900 px-4 pt-28 pb-16 text-center">
        <p className="text-stone-600 dark:text-stone-400">
          {!session.vendorId
            ? 'Sign in again to load your vendor dashboard.'
            : 'Listing not found.'}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('list-your-service')}
          className="mt-4 text-[#C51C13] font-semibold hover:underline cursor-pointer"
        >
          Register your business
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="vendor-profile-page">
      {listingStatus === 'pending_review' && (
        <div
          className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-3 text-center text-sm text-amber-900 dark:text-amber-100"
          role="status"
        >
          Your listing is under review. You can manage your profile here; it will appear publicly
          once approved.
        </div>
      )}
      {/* Top hero banner */}
      <div
        className="relative w-full h-44 sm:h-52 md:h-56 overflow-hidden"
        id="vendor-profile-top-banner"
      >
        <img
          src={profileImage || vendor.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#C51C13]/95 via-stone-900/85 to-stone-900/75"
          aria-hidden
        />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 flex flex-col justify-end pb-5 sm:pb-6">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-amber-200/90 mb-2">
            <span className="h-px w-6 bg-amber-300/80" aria-hidden />
            Vendor dashboard
            <span className="h-px w-6 bg-amber-300/80" aria-hidden />
          </span>
          <h1 className="heading-page text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-sm">
            {session.businessName}
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{categoryName}</span>
            <span className="text-white/40" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="w-4 h-4 text-[#FFCB44] fill-[#FFCB44]" aria-hidden />
              {vendor.rating} ({vendor.ratingCount} reviews)
            </span>
            <span className="text-white/40 hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="hidden sm:inline">{vendor.location}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => profileImageInputRef.current?.click()}
          className="absolute bottom-4 right-4 sm:right-6 lg:right-10 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white text-xs font-semibold shadow-lg hover:bg-white transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4 text-[#C51C13]" aria-hidden />
          Change cover photo
        </button>
        <input
          ref={profileImageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            void handleProfileImageFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {profileImageError && (
          <p
            className="absolute bottom-14 right-4 z-10 text-xs text-red-200 bg-red-900/80 px-2 py-1 rounded"
            role="alert"
          >
            {profileImageError}
          </p>
        )}
      </div>

      {/* Sticky action banner — stays below site header while scrolling */}
      <div
        className="sticky top-16 sm:top-[4.25rem] z-40 border-b border-orange-900/40 bg-gradient-to-r from-[#C51C13] via-[#A2110A] to-amber-900 shadow-md"
        id="vendor-profile-sticky-banner"
        role="region"
        aria-label="Dashboard actions"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <p className="text-sm text-white/95 font-medium text-left">
            {newEnquiryCount > 0 ? (
              <>
                <span className="font-bold text-[#FFCB44]">{newEnquiryCount} new</span> guest{' '}
                {newEnquiryCount === 1 ? 'enquiry' : 'enquiries'} — reply to grow bookings on{' '}
                {APP_NAME}
              </>
            ) : !profileComplete ? (
              <>
                Complete your{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="font-bold text-[#FFCB44] underline cursor-pointer"
                >
                  business address &amp; villages
                </button>{' '}
                in Settings
              </>
            ) : (
              <>Your listing is live — add services so families can request quotes</>
            )}
          </p>
          <div className="flex flex-wrap gap-2 shrink-0">
            {newEnquiryCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/25 transition-colors cursor-pointer"
              >
                <Inbox className="w-4 h-4" aria-hidden />
                View enquiries
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAddService(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFCB44] hover:bg-amber-300 text-stone-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Add service
            </button>
          </div>
        </div>
      </div>

      <section className="border-b border-stone-200/80 dark:border-stone-800 bg-[#FFFDF7] dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                Live on {APP_NAME}
              </span>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 sm:hidden">
                {vendor.location}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onNavigate('vendor-details', { vendorId: session.vendorId })
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-800 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" aria-hidden />
                View public listing
              </button>
              <button
                type="button"
                onClick={() => onNavigate('list-your-service')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-800 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" aria-hidden />
                Update listing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Profile views', value: '1,248', sub: 'Last 30 days', icon: Eye },
              { label: 'New enquiries', value: String(newEnquiryCount), sub: 'Needs reply', icon: Inbox },
              { label: 'Services listed', value: String(services.length), sub: 'Active packages', icon: Store },
              { label: 'Response rate', value: '94%', sub: 'Under 4 hours', icon: MessageSquare },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-4"
              >
                <stat.icon
                  className="w-4 h-4 text-[#C51C13] dark:text-orange-400 mb-2"
                  aria-hidden
                />
                <p className="text-xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">{stat.label}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingSection tone="white" showTexture={false} showMandala={false} innerClassName="py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <nav
            className="lg:w-52 shrink-0 flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0"
            aria-label="Dashboard sections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C51C13] text-white'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 p-6">
                  <h2 className="heading-card text-lg text-stone-900 dark:text-white mb-4">
                    Quick actions
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiries')}
                      className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-left hover:border-orange-300 transition-colors cursor-pointer"
                    >
                      <Inbox className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-white">
                          Reply to enquiries
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {newEnquiryCount} waiting for your response
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-stone-400" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('vendor-details', { vendorId: session.vendorId })
                      }
                      className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-left hover:border-orange-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-white">
                          Preview listing
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          See how families view your profile
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-stone-400" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('services');
                        setShowAddService(true);
                      }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-stone-800 text-left hover:border-orange-400 transition-colors cursor-pointer sm:col-span-2"
                    >
                      <Plus className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-white">
                          Add a service
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Create a new package or offering for your listing
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto text-stone-400" aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-6">
                  <h2 className="heading-card text-lg text-stone-900 dark:text-white mb-3">
                    Recent enquiries
                  </h2>
                  <ul className="divide-y divide-stone-100 dark:divide-stone-700">
                    {enquiries.slice(0, 2).map((enq) => (
                      <li key={enq.id} className="py-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-stone-900 dark:text-white">
                            {enq.guestName}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {enq.eventType} · {enq.eventDate}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[enq.status]}`}
                        >
                          {enq.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className="mt-3 text-sm font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    View all enquiries
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div className="space-y-4">
                <h2 className="heading-card text-lg text-stone-900 dark:text-white">
                  Enquiries ({enquiries.length})
                </h2>
                <ul className="space-y-3">
                  {enquiries.map((enq) => (
                    <li
                      key={enq.id}
                      className="rounded-xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-white">
                            {enq.guestName}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {enq.id} · {enq.receivedAt}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[enq.status]}`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-300">{enq.message}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-400">
                        <span>{enq.eventType}</span>
                        <span>{enq.eventDate}</span>
                        <span>{enq.guests} guests</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
                        onClick={() =>
                          alert(`Demo: reply to ${enq.guestName}. Messaging will be available in the app.`)
                        }
                      >
                        Reply to guest
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                {serviceError && (
                  <p
                    className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
                    role="alert"
                  >
                    {serviceError}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="heading-card text-lg text-stone-900 dark:text-white">
                      Your services ({services.length})
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Shown on your public vendor profile after review
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddService(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden />
                    Add service
                  </button>
                </div>
                {services.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-300 dark:border-stone-600 p-10 text-center space-y-3">
                    <Store className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600" aria-hidden />
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      No services yet. Add your first package so families can request quotes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddService(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden />
                      Add your first service
                    </button>
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {services.map((service) => {
                      const isCustom = service.id.startsWith('custom-');
                      return (
                        <li
                          key={service.id}
                          className="rounded-xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-4 pt-0 space-y-2 relative overflow-hidden"
                        >
                          <ServiceImagePicker
                            image={service.image}
                            serviceName={service.name}
                            onImageChange={(image) =>
                              handleUpdateServiceImage(service.id, image)
                            }
                          />
                          {isCustom && (
                            <span className="inline-block text-[10px] font-bold tracking-wide text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full">
                              New · pending review
                            </span>
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-stone-900 dark:text-white">
                              {service.name}
                            </p>
                            {isCustom && (
                              <button
                                type="button"
                                onClick={() => handleRemoveService(service.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                                aria-label={`Remove ${service.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 tracking-wide">
                            {service.category}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                            {service.description}
                          </p>
                          <p className="text-sm font-bold text-[#C51C13] dark:text-orange-400">
                            ₹{service.price.toLocaleString('en-IN')}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <h2 className="heading-card text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C51C13] dark:text-orange-400" />
                  Business settings
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Add your full business address and villages you serve. Families use this to find
                  vendors near their event location.
                </p>

                <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 space-y-4">
                  <h3 className="heading-card text-base text-stone-900 dark:text-white">
                    Change password
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordError && (
                      <p
                        className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
                        role="alert"
                      >
                        {passwordError}
                      </p>
                    )}
                    {passwordSaved && (
                      <p
                        className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-lg px-3 py-2"
                        role="status"
                      >
                        Password updated.
                      </p>
                    )}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="vendor-current-password"
                        className="text-xs font-semibold text-stone-700 dark:text-stone-300"
                      >
                        Current password
                      </label>
                      <input
                        id="vendor-current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="vendor-new-password"
                          className="text-xs font-semibold text-stone-700 dark:text-stone-300"
                        >
                          New password
                        </label>
                        <input
                          id="vendor-new-password"
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="vendor-confirm-password"
                          className="text-xs font-semibold text-stone-700 dark:text-stone-300"
                        >
                          Confirm password
                        </label>
                        <input
                          id="vendor-confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {savingPassword ? 'Updating…' : 'Update password'}
                    </button>
                  </form>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {settingsError && (
                    <p
                      className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
                      role="alert"
                    >
                      {settingsError}
                    </p>
                  )}
                  {settingsSaved && (
                    <p
                      className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 rounded-lg px-3 py-2"
                      role="status"
                    >
                      Settings saved successfully.
                    </p>
                  )}

                  <ImageUploadField
                    label="Profile cover photo"
                    value={profileImage || vendor.image}
                    onChange={(image) => {
                      setProfileImage(image);
                      setProfileImageError('');
                    }}
                    variant="banner"
                    id="vendor-profile-cover-upload"
                    hint="Used on your dashboard banner and public listing hero"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Business name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={session.businessName}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Contact person
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={session.contactName}
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200 dark:border-stone-700 p-4 space-y-4 bg-stone-50/50 dark:bg-stone-900/40">
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C51C13] shrink-0" aria-hidden />
                      Full business address *
                    </p>

                    <div className="space-y-1.5">
                      <label htmlFor="settings-addressLine1" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Street / building / area *
                      </label>
                      <input
                        id="settings-addressLine1"
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        required
                        placeholder="Shop no., building name, sector, village or locality"
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="settings-addressLine2" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Address line 2
                      </label>
                      <input
                        id="settings-addressLine2"
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Floor, wing, or additional line (optional)"
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="settings-landmark" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Landmark
                        </label>
                        <input
                          id="settings-landmark"
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near temple, market, etc."
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="settings-pinCode" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          PIN code *
                        </label>
                        <input
                          id="settings-pinCode"
                          type="text"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          required
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="201301"
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>

                    <StateDistrictSelect
                      idPrefix="settings-address"
                      state={profileState}
                      district={profileDistrict}
                      onStateChange={(state) => {
                        setProfileState(state);
                        setProfileDistrict('');
                      }}
                      onDistrictChange={setProfileDistrict}
                    />
                  </div>

                  <DynamicStringList
                    id="vendor-settings-villages"
                    label="Villages you serve"
                    hint="Add villages or localities where you take bookings. You can update this anytime."
                    values={villagesServed}
                    onChange={setVillagesServed}
                    placeholder="e.g. Bisrakh, Dadri, Surajpur"
                    addButtonLabel="Add another village"
                  />

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {savingSettings ? 'Saving…' : 'Save settings'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </LandingSection>

      <AddVendorServiceModal
        open={showAddService}
        categoryOptions={serviceCategoryOptions}
        saving={savingService}
        onClose={() => {
          if (!savingService) setShowAddService(false);
        }}
        onAdd={handleAddService}
      />
    </div>
  );
};
