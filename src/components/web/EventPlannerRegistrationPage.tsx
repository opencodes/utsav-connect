import React, { useEffect, useState } from 'react';
import {
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Lock,
  MapPin,
  Send,
  User,
} from 'lucide-react';
import { APP_NAME, SUPPORT_EMAIL } from '../../brand';
import { LandingSection } from './LandingPage/LandingSection';
import { PageBanner } from './PageBanner';
import { HERO_VENDOR_CITIES } from './LandingPage/heroVendorSearch';
import { HERO_EVENT_TYPES } from './LandingPage/heroEventSearch';

export interface EventPlannerRegisterPrefill {
  eventName?: string;
  location?: string;
  date?: string;
  eventType?: string;
  city?: string;
}

export interface EventPlannerRegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
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
}

interface EventPlannerRegistrationPageProps {
  onNavigate: (page: string, data?: unknown) => void;
  initialCity?: string;
  initialPrefill?: EventPlannerRegisterPrefill;
  /** Skip event-details step when user already entered them on the homepage hero. */
  startAtAccountStep?: boolean;
  onRegisterComplete?: (payload: EventPlannerRegistrationPayload) => void;
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors';

const LABEL_CLASS = 'text-xs font-semibold text-stone-700 dark:text-stone-300';

const BENEFITS = [
  'Full planner workspace — guests, budget, feast & vendors',
  'Create and manage multiple client events',
  'Track rituals, timelines, and vendor shortlists',
  'Export-ready reports for families and teams',
];

const STEPS = ['Enter event details', 'Create your account'] as const;

const initialForm = {
  fullName: '',
  companyName: '',
  contactPhone: '',
  email: '',
  serviceCities: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
};

export const EventPlannerRegistrationPage: React.FC<EventPlannerRegistrationPageProps> = ({
  onNavigate,
  initialCity = '',
  initialPrefill = {} as EventPlannerRegisterPrefill,
  startAtAccountStep = false,
  onRegisterComplete,
}) => {
  const [step, setStep] = useState(startAtAccountStep ? 1 : 0);
  const [formData, setFormData] = useState({ ...initialForm });
  const [draftEvent, setDraftEvent] = useState<EventPlannerRegisterPrefill>({
    eventName: initialPrefill.eventName ?? '',
    location: initialPrefill.location ?? '',
    date: initialPrefill.date ?? '',
    eventType: initialPrefill.eventType ?? '',
    city: initialPrefill.city || initialCity || '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    setDraftEvent({
      eventName: initialPrefill.eventName ?? '',
      location: initialPrefill.location ?? '',
      date: initialPrefill.date ?? '',
      eventType: initialPrefill.eventType ?? '',
      city: initialPrefill.city || initialCity || '',
    });
    if (startAtAccountStep) {
      setStep(1);
    }
  }, [initialCity, initialPrefill, startAtAccountStep]);

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
      if (!draftEvent.eventName?.trim()) {
        setFormError('Please enter an event name.');
        return false;
      }
      if (!draftEvent.eventType) {
        setFormError('Please select the type of event.');
        return false;
      }
      if (!draftEvent.city) {
        setFormError('Please select the event city.');
        return false;
      }
      return true;
    }

    if (!formData.fullName.trim()) {
      setFormError('Please enter your full name.');
      return false;
    }
    const phoneDigits = formData.contactPhone.replace(/\D/g, '');
    if (!formData.contactPhone.trim() || phoneDigits.length < 10) {
      setFormError('Enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setFormError('Enter a valid email address.');
      return false;
    }
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return false;
    }
    if (!formData.agreeTerms) {
      setFormError('Please agree to the terms to continue.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setFormError('');
    setStep(1);
  };

  const goBack = () => {
    setFormError('');
    setStep(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(0)) {
      setStep(0);
      return;
    }
    if (!validateStep(1)) return;
    setFormError('');

    const payload: EventPlannerRegistrationPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.contactPhone.trim(),
      companyName: formData.companyName.trim() || undefined,
      primaryEventType: draftEvent.eventType ?? '',
      city: draftEvent.city ?? '',
      serviceCities: formData.serviceCities.trim() || undefined,
      bio: '',
      draftEvent: {
        eventName: draftEvent.eventName?.trim(),
        location: draftEvent.location?.trim(),
        date: draftEvent.date,
        eventType: draftEvent.eventType,
      },
    };

    if (onRegisterComplete) {
      setIsSubmitting(true);
      window.setTimeout(() => {
        onRegisterComplete(payload);
        setIsSubmitting(false);
      }, 400);
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setApplicationId(`PLNR-${randomNum}`);
    setIsSubmitted(true);
  };

  const goToPlannerSignIn = () => {
    onNavigate('sign-in');
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStep(0);
    setFormData({ ...initialForm });
    setDraftEvent({
      eventName: initialPrefill.eventName ?? '',
      location: initialPrefill.location ?? '',
      date: initialPrefill.date ?? '',
      eventType: initialPrefill.eventType ?? '',
      city: initialPrefill.city || initialCity || '',
    });
    setApplicationId('');
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="event-planner-registration-page">
      <PageBanner
        id="event-planner-register-banner"
        variant="planner"
        eyebrow="Event planner"
        title={`Register as a ${APP_NAME} customer for event planning`}
        description="Step 1: tell us about your event. Step 2: create your customer login — then open your planning workspace."
        imageSrc="https://images.unsplash.com/photo-1530103862673-de8c9a59d780?w=1400&auto=format&fit=crop&q=80"
        imageAlt="Festive event celebration"
      >
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <CalendarPlus className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            {STEPS[0]} → {STEPS[1]}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            Free planning workspace
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            <User className="w-3.5 h-3.5 text-[#FFCB44] shrink-0" aria-hidden />
            For hosts &amp; planners
          </span>
        </div>
      </PageBanner>

      <LandingSection tone="white" showTexture={false} showMandala={false} innerClassName="py-10 sm:py-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 p-6 space-y-5">
              <h2 className="heading-card text-lg text-stone-900 dark:text-white">
                Planner workspace includes
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

            <div className="rounded-2xl border border-orange-100 dark:border-stone-700 bg-orange-50/50 dark:bg-stone-800/50 p-5 space-y-3 text-sm text-stone-600 dark:text-stone-400">
              <p className="font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                Two quick steps
              </p>
              <ol className="space-y-2 list-decimal list-inside text-xs leading-relaxed">
                <li>
                  <strong>Enter event details</strong> — name, type, city, date &amp; location.
                </li>
                <li>
                  <strong>Create your account</strong> — name, mobile, email &amp; password.
                </li>
              </ol>
            </div>
          </aside>

          <div className="lg:col-span-8 rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 sm:p-8 shadow-sm">
            {!isSubmitted ? (
              <>
                <nav
                  className="flex gap-6 sm:gap-10 mb-8"
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
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs shrink-0 ${
                            isActive
                              ? 'bg-[#C51C13] text-white'
                              : isDone
                                ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                                : 'bg-stone-100 dark:bg-stone-700 text-stone-500'
                          }`}
                        >
                          {isDone ? '✓' : index + 1}
                        </span>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </nav>

                <form onSubmit={handleSubmit} className="space-y-5" id="event-planner-registration-form">
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
                          <CalendarPlus className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                          Enter event details
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          What are you planning? You can refine everything in your workspace later.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="draft-event-name" className={LABEL_CLASS}>
                          Event name *
                        </label>
                        <input
                          id="draft-event-name"
                          type="text"
                          value={draftEvent.eventName ?? ''}
                          onChange={(e) =>
                            setDraftEvent((d) => ({ ...d, eventName: e.target.value }))
                          }
                          placeholder="e.g. Priya & Rahul Wedding"
                          className={INPUT_CLASS}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="draft-event-type" className={LABEL_CLASS}>
                            Type of event *
                          </label>
                          <select
                            id="draft-event-type"
                            value={draftEvent.eventType ?? ''}
                            onChange={(e) =>
                              setDraftEvent((d) => ({ ...d, eventType: e.target.value }))
                            }
                            className={INPUT_CLASS}
                          >
                            {HERO_EVENT_TYPES.map((t) => (
                              <option key={t.value || 'empty'} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="draft-event-city" className={LABEL_CLASS}>
                            Event city *
                          </label>
                          <select
                            id="draft-event-city"
                            value={draftEvent.city ?? ''}
                            onChange={(e) =>
                              setDraftEvent((d) => ({ ...d, city: e.target.value }))
                            }
                            className={INPUT_CLASS}
                          >
                            <option value="">Select city</option>
                            {HERO_VENDOR_CITIES.filter((c) => c.value).map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="draft-event-location" className={LABEL_CLASS}>
                            Location / venue area
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden />
                            <input
                              id="draft-event-location"
                              type="text"
                              value={draftEvent.location ?? ''}
                              onChange={(e) =>
                                setDraftEvent((d) => ({ ...d, location: e.target.value }))
                              }
                              placeholder="Sector, venue or locality"
                              className={`${INPUT_CLASS} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="draft-event-date" className={LABEL_CLASS}>
                            Event date
                          </label>
                          <input
                            id="draft-event-date"
                            type="date"
                            value={draftEvent.date ?? ''}
                            onChange={(e) =>
                              setDraftEvent((d) => ({ ...d, date: e.target.value }))
                            }
                            className={INPUT_CLASS}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-5">
                      {startAtAccountStep && (
                        <p className="text-sm text-stone-600 dark:text-stone-400 rounded-lg bg-orange-50/80 dark:bg-stone-900/50 border border-orange-100 dark:border-stone-700 px-3 py-2">
                          Event details from the homepage are saved. Complete your account below, or{' '}
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="font-semibold text-[#C51C13] hover:underline cursor-pointer"
                          >
                            edit event details
                          </button>
                          .
                        </p>
                      )}
                      <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-4 text-sm">
                        <p className="font-semibold text-stone-900 dark:text-white mb-1">Your event</p>
                        <p className="text-stone-600 dark:text-stone-400">
                          <strong>{draftEvent.eventName || 'Untitled event'}</strong>
                          {draftEvent.eventType && (
                            <>
                              {' '}
                              ·{' '}
                              {HERO_EVENT_TYPES.find((t) => t.value === draftEvent.eventType)?.label ??
                                draftEvent.eventType}
                            </>
                          )}
                          {draftEvent.city && (
                            <>
                              {' '}
                              ·{' '}
                              {HERO_VENDOR_CITIES.find((c) => c.value === draftEvent.city)?.label ??
                                draftEvent.city}
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <h2 className="heading-card text-xl text-stone-900 dark:text-white flex items-center gap-2">
                          <Lock className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
                          Create your account
                        </h2>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          Your {APP_NAME} customer login — used to access the event planning workspace.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="planner-fullName" className={LABEL_CLASS}>
                            Full name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden />
                            <input
                              id="planner-fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              placeholder="Your name"
                              className={`${INPUT_CLASS} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="planner-companyName" className={LABEL_CLASS}>
                            Company / studio (optional)
                          </label>
                          <input
                            id="planner-companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. Shubhe Events Co."
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="planner-contactPhone" className={LABEL_CLASS}>
                            Mobile number *
                          </label>
                          <input
                            id="planner-contactPhone"
                            name="contactPhone"
                            type="tel"
                            inputMode="tel"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="10-digit mobile"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="planner-email" className={LABEL_CLASS}>
                            Email *
                          </label>
                          <input
                            id="planner-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="planner-password" className={LABEL_CLASS}>
                            Password *
                          </label>
                          <input
                            id="planner-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            className={INPUT_CLASS}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="planner-confirmPassword" className={LABEL_CLASS}>
                            Confirm password *
                          </label>
                          <input
                            id="planner-confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
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
                          I agree to {APP_NAME}&apos;s terms and want to create my customer account
                          and open the event planning workspace.
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
                    {step === 0 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer sm:ml-auto"
                      >
                        Continue to create account
                        <ChevronRight className="w-4 h-4" aria-hidden />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer sm:ml-auto"
                      >
                        <Send className="w-4 h-4" aria-hidden />
                        {isSubmitting ? 'Creating account…' : 'Create account & open workspace'}
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-6 py-4" id="event-planner-registration-success">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                    <CheckCircle2 className="w-8 h-8" aria-hidden />
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="heading-card text-xl text-stone-900 dark:text-white">
                      Application received
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Thanks, <strong>{formData.fullName}</strong>. Reference{' '}
                      <strong className="font-mono">{applicationId}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={goToPlannerSignIn}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" aria-hidden />
                    Sign in to planner workspace
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    Register another event
                  </button>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Questions? {SUPPORT_EMAIL}
                </p>
              </div>
            )}
          </div>
        </div>
      </LandingSection>

      <LandingSection tone="blush" showTexture={false} showMandala={false} innerClassName="py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-2">
            <CalendarPlus className="w-4 h-4 text-[#C51C13]" aria-hidden />
            Already have an account?
          </p>
          <button
            type="button"
            onClick={goToPlannerSignIn}
            className="text-sm font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </LandingSection>
    </div>
  );
};
