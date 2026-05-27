import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { APP_NAME, SUPPORT_EMAIL } from '../../brand';
import { LandingSection } from './LandingPage/LandingSection';

interface ContactUsPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors';

const LABEL_CLASS = 'text-xs font-semibold text-stone-700 dark:text-stone-300';

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'event-planning',
    city: '',
    eventDate: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError('Please enter your name, email, and phone number.');
      return;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setInquiryId(`SHUBHE-${randomNum}`);
    setIsSubmitted(true);
    setFormError('');
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      topic: 'event-planning',
      city: '',
      eventDate: '',
      message: '',
    });
    setInquiryId('');
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] dark:bg-stone-900" id="contact-us-page">
      <section className="border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-10 lg:pb-14">
          <div className="max-w-2xl space-y-4 text-left">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-amber-400">
              <span className="h-px w-6 bg-gradient-to-r from-orange-500 to-amber-400" aria-hidden />
              Contact {APP_NAME}
              <span className="h-px w-6 bg-gradient-to-r from-amber-400 to-orange-500" aria-hidden />
            </span>
            <h1 className="heading-page text-3xl sm:text-4xl text-[#C51C13] dark:text-white">
              We&apos;re here to help you plan
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Questions about vendors, listings, or event planning? Send us a message and our team will
              get back to you — usually within one business day.
            </p>
          </div>
        </div>
      </section>

      <LandingSection tone="white" showTexture={false} showMandala={false} innerClassName="py-10 sm:py-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Contact details */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 p-6 space-y-5">
              <h2 className="heading-card text-lg text-stone-900 dark:text-white">Get in touch</h2>

              <ul className="space-y-4 text-sm text-stone-600 dark:text-stone-300">
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">Email</p>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-[#C51C13] dark:text-orange-400 hover:underline"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">Phone</p>
                    <p>+91 1800 123 4567 (toll-free)</p>
                    <p className="text-stone-500 dark:text-stone-400">+91 98871 00234</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">Office</p>
                    <p>
                      Sector 62, Noida, Uttar Pradesh 201309
                      <br />
                      National Capital Region, India
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-white">Support hours</p>
                    <p>Mon – Sat, 9:00 AM – 7:00 PM IST</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-orange-100 dark:border-stone-700 bg-orange-50/50 dark:bg-stone-800/50 p-5 flex gap-3">
              <MessageSquare
                className="w-5 h-5 text-[#C51C13] dark:text-orange-400 shrink-0 mt-0.5"
                aria-hidden
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-900 dark:text-white">
                  Vendors &amp; partnerships
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Want to list your business on {APP_NAME}? Use our{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('list-your-service')}
                    className="text-[#C51C13] dark:text-orange-400 font-semibold hover:underline cursor-pointer"
                  >
                    vendor registration form
                  </button>{' '}
                  or choose &quot;List my business&quot; below.
                </p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div
            className="lg:col-span-7 rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 sm:p-8 shadow-sm"
            id="contact-form-container"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                <div>
                  <h2 className="heading-card text-xl text-stone-900 dark:text-white">
                    Send a message
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Fields marked with * are required.
                  </p>
                </div>

                {formError && (
                  <p
                    className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
                    role="alert"
                  >
                    {formError}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-fullName" className={LABEL_CLASS}>
                      Full name *
                    </label>
                    <input
                      id="contact-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className={LABEL_CLASS}>
                      Phone *
                    </label>
                    <input
                      id="contact-phone"
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
                  <label htmlFor="contact-email" className={LABEL_CLASS}>
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-topic" className={LABEL_CLASS}>
                      How can we help?
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    >
                      <option value="event-planning">Event planning</option>
                      <option value="vendor-listing">List my business</option>
                      <option value="vendor-enquiry">Question about a vendor</option>
                      <option value="account">Account &amp; login</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-city" className={LABEL_CLASS}>
                      City (optional)
                    </label>
                    <input
                      id="contact-city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Noida, Delhi"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-eventDate" className={LABEL_CLASS}>
                    Event date (optional)
                  </label>
                  <input
                    id="contact-eventDate"
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className={LABEL_CLASS}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event, vendor needs, or question..."
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden />
                  Send message
                </button>
              </form>
            ) : (
              <div className="space-y-6 py-4 text-center sm:text-left" id="contact-success">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                    <CheckCircle2 className="w-8 h-8" aria-hidden />
                  </div>
                  <div className="space-y-2">
                    <h2 className="heading-card text-xl text-stone-900 dark:text-white">
                      Message received
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Thanks, <strong>{formData.fullName}</strong>. We&apos;ve logged your enquiry and
                      will reply to <strong>{formData.email}</strong> soon.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-5 text-sm space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500 dark:text-stone-400">Reference</span>
                    <span className="font-mono font-semibold text-stone-900 dark:text-white">
                      {inquiryId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-500 dark:text-stone-400">Topic</span>
                    <span className="text-stone-900 dark:text-white text-right capitalize">
                      {formData.topic.replace(/-/g, ' ')}
                    </span>
                  </div>
                  {formData.eventDate && (
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-500 dark:text-stone-400">Event date</span>
                      <span className="text-stone-900 dark:text-white">{formData.eventDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('vendor-categories')}
                    className="px-5 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Browse vendors
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </LandingSection>
    </div>
  );
};
