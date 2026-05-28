import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Store,
  Users,
} from 'lucide-react';
import { APP_NAME, SUPPORT_EMAIL } from '../../brand';
import { LandingSection } from './LandingPage/LandingSection';
import { PageBanner } from './PageBanner';
import { useVendorCategories } from '../../hooks/useVendorCategories';
import { primaryLocationFromValues, resolveStateDistrictFromVendor } from '../../indiaLocations';
import { StateDistrictSelect } from './StateDistrictSelect';
import { registerVendor } from '../../api/vendors';

interface VendorRegistrationPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  initialCity?: string;
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors';

const LABEL_CLASS = 'text-xs font-semibold text-stone-700 dark:text-stone-300';

const BENEFITS = [
  'Free listing in your category and city',
  'Reach families planning weddings, pujas, and receptions',
  'Showcase packages, photos, and service areas',
  'Receive enquiries tied to real events on the platform',
];

const STEPS = ['Business', 'Contact & location', 'Your profile'] as const;

const YEARS_OPTIONS = [
  { value: '', label: 'Select experience' },
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1 – 3 years' },
  { value: '3-5', label: '3 – 5 years' },
  { value: '5-10', label: '5 – 10 years' },
  { value: '10+', label: '10+ years' },
];

const initialForm = {
  businessName: '',
  categoryId: '',
  yearsInBusiness: '',
  contactName: '',
  phone: '',
  email: '',
  state: '',
  district: '',
  description: '',
  website: '',
  gstNumber: '',
  agreeTerms: false,
};

export const VendorRegistrationPage: React.FC<VendorRegistrationPageProps> = ({
  onNavigate,
  initialCity = '',
}) => {
  const { categories, getLabel } = useVendorCategories();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    ...initialForm,
    district: initialCity || '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    if (!initialCity) return;
    const { state, district } = resolveStateDistrictFromVendor({ city: initialCity });
    setFormData((prev) => ({ ...prev, state, district }));
  }, [initialCity]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formError) setFormError('');
  };

  const validateStep = (index: number): boolean => {
    if (index === 0) {
      if (!formData.businessName.trim() || !formData.categoryId) {
        setFormError('Please enter your business name and select a category.');
        return false;
      }
      return true;
    }
    if (index === 1) {
      if (
        !formData.contactName.trim() ||
        !formData.phone.trim() ||
        !formData.email.trim() ||
        !formData.state ||
        !formData.district
      ) {
        setFormError('Please complete contact details and select your state and district.');
        return false;
      }
      return true;
    }
    if (!formData.description.trim()) {
      setFormError('Please add a short description of your services.');
      return false;
    }
    if (!formData.agreeTerms) {
      setFormError('Please confirm that the information is accurate and you agree to our terms.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setFormError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setFormError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setFormError('');
    try {
      const vendor = await registerVendor({
        businessName: formData.businessName,
        category: formData.categoryId,
        state: formData.state,
        district: formData.district,
        primaryLocation: primaryLocationFromValues(formData.state, formData.district),
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        price: 'On request',
      });
      setApplicationId(vendor.id ?? `VND-${Date.now()}`);
      setIsSubmitted(true);
    } catch {
      setFormError('Submission failed. Ensure the API is running on port 8080.');
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(0);
    setFormData({ ...initialForm, district: initialCity || '' });
    setApplicationId('');
    setFormError('');
  };

  const categoryLabel = formData.categoryId
    ? getLabel(formData.categoryId)
    : formData.categoryId;
  const locationLabel = primaryLocationFromValues(formData.state, formData.district);

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="vendor-registration-page">
      <PageBanner
        id="vendor-registration-banner"
        variant="vendor"
        eyebrow="List your service"
        title={`Register as a vendor on ${APP_NAME}`}
        description="Tell us about your business — venues, catering, decor, photography, pandits, and more. Listing is free; our team reviews applications before your profile goes live."
        imageSrc="https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&auto=format&fit=crop&q=80"
        imageAlt="Wedding catering and celebration feast"
      >
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <Store className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            Free vendor listing
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <Building2 className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            {STEPS.length}-step application
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <Clock className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            Review in 2–3 business days
          </span>
        </div>
      </PageBanner>

      <LandingSection tone="white" showTexture={false} showMandala={false} innerClassName="py-10 sm:py-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 p-6 space-y-5">
              <h2 className="heading-card text-lg text-stone-900 dark:text-white">
                Why join {APP_NAME}?
              </h2>
              <ul className="space-y-3 text-sm text-stone-600 dark:text-stone-300">
                {BENEFITS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800/50 p-5 space-y-4 text-sm">
              <h3 className="font-semibold text-stone-900 dark:text-white">What happens next?</h3>
              <ol className="space-y-3 text-stone-600 dark:text-stone-400">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 text-xs font-bold text-[#C51C13] dark:text-orange-400">
                    1
                  </span>
                  <span>We review your application within 2–3 business days.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 text-xs font-bold text-[#C51C13] dark:text-orange-400">
                    2
                  </span>
                  <span>Our team may call to verify details and request photos or packages.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 text-xs font-bold text-[#C51C13] dark:text-orange-400">
                    3
                  </span>
                  <span>Once approved, your profile appears in search for your city and category.</span>
                </li>
              </ol>
              <p className="text-xs text-stone-500 dark:text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-700">
                Questions? Email{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-[#C51C13] dark:text-orange-400 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8 rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 sm:p-8 shadow-sm">
            {!isSubmitted ? (
              <>
                <nav
                  className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between mb-8"
                  aria-label="Registration progress"
                >
                  {STEPS.map((label, index) => {
                    const isActive = index === step;
                    const isDone = index < step;
                    return (
                      <div
                        key={label}
                        className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${
                          isActive
                            ? 'text-[#C51C13] dark:text-orange-400'
                            : isDone
                              ? 'text-stone-600 dark:text-stone-400'
                              : 'text-stone-400 dark:text-stone-500'
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                            isActive
                              ? 'bg-[#C51C13] text-white'
                              : isDone
                                ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-500'
                          }`}
                        >
                          {isDone ? '✓' : index + 1}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </div>
                    );
                  })}
                </nav>

                <form onSubmit={handleSubmit} className="space-y-5" id="vendor-registration-form">
                  {formError && (
                    <p
                      className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="heading-card text-xl text-stone-900 dark:text-white flex items-center gap-2">
                          <Store className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                          Business details
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          How families will find you on the marketplace.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="vendor-businessName" className={LABEL_CLASS}>
                          Business / brand name *
                        </label>
                        <input
                          id="vendor-businessName"
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Shree Banquet & Events"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-categoryId" className={LABEL_CLASS}>
                            Primary category *
                          </label>
                          <select
                            id="vendor-categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className={INPUT_CLASS}
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-yearsInBusiness" className={LABEL_CLASS}>
                            Years in business
                          </label>
                          <select
                            id="vendor-yearsInBusiness"
                            name="yearsInBusiness"
                            value={formData.yearsInBusiness}
                            onChange={handleChange}
                            className={INPUT_CLASS}
                          >
                            {YEARS_OPTIONS.map((opt) => (
                              <option key={opt.value || 'empty'} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="heading-card text-xl text-stone-900 dark:text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                          Contact &amp; location
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          We use this to verify your listing and send enquiries.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-contactName" className={LABEL_CLASS}>
                            Contact person *
                          </label>
                          <input
                            id="vendor-contactName"
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            placeholder="Owner or manager name"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-phone" className={LABEL_CLASS}>
                            Phone *
                          </label>
                          <input
                            id="vendor-phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                            className={INPUT_CLASS}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="vendor-email" className={LABEL_CLASS}>
                          Email *
                        </label>
                        <input
                          id="vendor-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          placeholder="business@example.com"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <StateDistrictSelect
                        idPrefix="vendor-register"
                        state={formData.state}
                        district={formData.district}
                        onStateChange={(state) =>
                          setFormData((prev) => ({ ...prev, state, district: '' }))
                        }
                        onDistrictChange={(district) =>
                          setFormData((prev) => ({ ...prev, district }))
                        }
                        stateLabel="State *"
                        districtLabel="District *"
                      />

                      <p className="text-xs text-stone-500 dark:text-stone-400 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 px-3 py-2">
                        After approval, sign in to your vendor dashboard to add your full business
                        address and the villages you serve.
                      </p>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="heading-card text-xl text-stone-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                          Your profile
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          This appears on your public listing after approval.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="vendor-description" className={LABEL_CLASS}>
                          About your services *
                        </label>
                        <textarea
                          id="vendor-description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          required
                          placeholder="Describe what you offer, typical events, capacity, packages..."
                          className={`${INPUT_CLASS} resize-none`}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-website" className={LABEL_CLASS}>
                            Website or Instagram
                          </label>
                          <input
                            id="vendor-website"
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https:// or @handle"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="vendor-gstNumber" className={LABEL_CLASS}>
                            GST number (optional)
                          </label>
                          <input
                            id="vendor-gstNumber"
                            type="text"
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            placeholder="For verified business badge"
                            className={INPUT_CLASS}
                          />
                        </div>
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer text-sm text-stone-600 dark:text-stone-300">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="mt-1 rounded border-stone-300 text-[#C51C13] focus:ring-orange-500"
                        />
                        <span>
                          I confirm the information is accurate and agree to {APP_NAME}&apos;s{' '}
                          <button
                            type="button"
                            onClick={() => onNavigate('terms')}
                            className="text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
                          >
                            Terms &amp; Conditions
                          </button>{' '}
                          and{' '}
                          <button
                            type="button"
                            onClick={() => onNavigate('privacy')}
                            className="text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
                          >
                            Privacy Policy
                          </button>
                          .
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer sm:ml-auto"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" aria-hidden />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer sm:ml-auto"
                      >
                        <Send className="w-4 h-4" aria-hidden />
                        Submit application
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-6 py-4" id="vendor-registration-success">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                    <CheckCircle2 className="w-8 h-8" aria-hidden />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="heading-card text-xl text-stone-900 dark:text-white">
                      Application received
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Thanks, <strong>{formData.contactName}</strong>. We&apos;ve received your
                      registration for <strong>{formData.businessName}</strong> and will email{' '}
                      <strong>{formData.email}</strong> within 2–3 business days.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-5 text-sm space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500 dark:text-stone-400">Application ID</span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-white">
                      {applicationId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500 dark:text-stone-400">Category</span>
                    <span className="text-stone-900 dark:text-white text-right">{categoryLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500 dark:text-stone-400">State & district</span>
                    <span className="text-stone-900 dark:text-white text-right">{locationLabel}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-100 dark:border-stone-700 bg-orange-50/50 dark:bg-stone-800/50 p-4 flex gap-3 text-sm text-stone-600 dark:text-stone-400">
                  <Clock className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0" aria-hidden />
                  <p>
                    Keep your phone handy — our onboarding team may call{' '}
                    <strong className="text-stone-800 dark:text-stone-200">{formData.phone}</strong>{' '}
                    to verify details or request portfolio photos.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    Submit another application
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('profile')}
                    className="px-5 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Go to vendor dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </LandingSection>

      <LandingSection tone="blush" showTexture={false} showMandala={false} innerClassName="py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-stone-600 dark:text-stone-400">
            <span className="inline-flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C51C13] dark:text-orange-400" aria-hidden />
              {SUPPORT_EMAIL}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C51C13] dark:text-orange-400" aria-hidden />
              +91 98871 00234
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C51C13] dark:text-orange-400" aria-hidden />
              Noida, India
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="text-sm font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
          >
            Prefer to talk first? Contact us
          </button>
        </div>
      </LandingSection>
    </div>
  );
};
