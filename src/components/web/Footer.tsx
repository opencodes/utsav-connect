import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import LogoSvg from '../../assets/logo.svg';
import { APP_NAME, SUPPORT_EMAIL } from '../../brand';
import { AppPhoneMockup } from './AppPhoneMockup';

interface FooterProps {
  isDarkMode: boolean;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPage = 'landing', onNavigate }) => {
  const [storeNotice, setStoreNotice] = useState(false);

  const goToPage = (page: string) => {
    onNavigate?.(page);
  };

  const scrollToSection = (sectionId: string) => {
    const scroll = () =>
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (currentPage === 'landing') {
      scroll();
      return;
    }
    goToPage('landing');
    window.setTimeout(scroll, 450);
  };

  const handlePageLink = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    goToPage(page);
  };

  const handleHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    goToPage('how-it-works');
  };

  const handleStoreClick = () => {
    setStoreNotice(true);
    window.setTimeout(() => setStoreNotice(false), 5000);
  };

  return (
    <>
      <div
        className="w-full h-[24px] bg-[#FAF8F5] border-y border-stone-800/10 dark:border-stone-950 flex overflow-hidden relative"
        id="mithila-folk-border"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='24' viewBox='0 0 160 24'%3E%3Crect width='100%25' height='100%25' fill='%23FAF6E9'/%3E%3C!-- Top Triangles --%3E%3Cpath d='M0,0 L6,0 L3,3 Z M12,0 L18,0 L15,3 Z M24,0 L30,0 L27,3 Z M36,0 L42,0 L39,3 Z M48,0 L54,0 L51,3 Z M60,0 L66,0 L63,3 Z M72,0 L78,0 L75,3 Z M84,0 L90,0 L87,3 Z M96,0 L102,0 L99,3 Z M108,0 L114,0 L111,3 Z M120,0 L126,0 L123,3 Z M132,0 L138,0 L135,3 Z M144,0 L150,0 L147,3 Z' fill='%23C51C13'/%3E%3Cpath d='M6,0 L12,0 L9,3 Z M30,0 L36,0 L33,3 Z M54,0 L60,0 L57,3 Z M78,0 L84,0 L81,3 Z M102,0 L108,0 L105,3 Z M126,0 L132,0 L129,3 Z M150,0 L156,0 L153,3 Z' fill='%23FFCB44'/%3E%3Cpath d='M18,0 L24,0 L21,3 Z M42,0 L48,0 L45,3 Z M66,0 L72,0 L69,3 Z M90,0 L96,0 L93,3 Z M114,0 L120,0 L117,3 Z M138,0 L144,0 L141,3 Z M156,0 L160,0 L158,1.5 Z' fill='%232E7D32'/%3E%3C!-- Bottom Triangles --%3E%3Cpath d='M0,24 L6,24 L3,21 Z M12,24 L18,24 L15,21 Z M24,24 L30,24 L27,21 Z M36,24 L42,24 L39,21 Z M48,24 L54,24 L51,21 Z M60,24 L66,24 L63,21 Z M72,24 L78,24 L75,21 Z M84,24 L90,24 L87,21 Z M96,24 L102,24 L99,21 Z M108,24 L114,24 L111,21 Z M120,24 L126,24 L123,21 Z M132,24 L138,24 L135,21 Z M144,24 L150,24 L147,21 Z' fill='%23C51C13'/%3E%3Cpath d='M6,24 L12,24 L9,21 Z M30,24 L36,24 L33,21 Z M54,24 L60,24 L57,21 Z M78,24 L84,24 L81,21 Z M102,24 L108,24 L105,21 Z M126,24 L132,24 L129,21 Z M150,24 L156,24 L153,21 Z' fill='%23FFCB44'/%3E%3Cpath d='M18,24 L24,24 L21,21 Z M42,24 L48,24 L45,21 Z M66,24 L72,24 L69,21 Z M90,24 L96,24 L93,21 Z M114,24 L120,24 L117,21 Z M138,24 L144,24 L141,21 Z M156,24 L160,24 L158,22.5 Z' fill='%232E7D32'/%3E%3C!-- Vine Path --%3E%3Cpath d='M0,12 C40,6 40,18 80,12 C120,6 120,18 160,12' stroke='%23191919' stroke-width='1.5' fill='none'/%3E%3C!-- Traditional Flowers --%3E%3Ccircle cx='40' cy='11' r='4' fill='%23C51C13' stroke='%23191919' stroke-width='0.75'/%3E%3Ccircle cx='40' cy='11' r='1.5' fill='%23FFCB44'/%3E%3Ccircle cx='120' cy='13' r='4' fill='%23C51C13' stroke='%23191919' stroke-width='0.75'/%3E%3Ccircle cx='120' cy='13' r='1.5' fill='%23FFCB44'/%3E%3C!-- Styled Mithila Birds --%3E%3Cpath d='M75,9 C72,7 68,9 66,13 C64,17 60,16 57,14 L55,16 C58,18 63,19 66,16 C69,13 71,11 75,9 Z' fill='%2300ACC1' stroke='%23191919' stroke-width='0.75'/%3E%3Cpolygon points='75,9 79,8 76,11' fill='%23FFCB44' stroke='%23191919' stroke-width='0.5'/%3E%3Ccircle cx='73' cy='8' r='0.5' fill='%23000'/%3E%3Cpath d='M145,9 C142,7 138,9 136,13 C134,17 130,16 127,14 L125,16 C128,18 133,19 136,16 C139,13 141,11 145,9 Z' fill='%2300ACC1' stroke='%23191919' stroke-width='0.75'/%3E%3Cpolygon points='145,9 149,8 146,11' fill='%23FFCB44' stroke='%23191919' stroke-width='0.5'/%3E%3Ccircle cx='143' cy='8' r='0.5' fill='%23000'/%3E%3C!-- Green Leaves --%3E%3Cpath d='M25,8 Q20,3 15,6 Q20,11 25,8 Z M105,8 Q100,3 95,6 Q100,11 105,8 Z' fill='%232E7D32' stroke='%23191919' stroke-width='0.5'/%3E%3Cpath d='M50,16 Q55,21 60,18 Q55,13 50,16 Z M130,16 Q135,21 140,18 Q135,13 130,16 Z' fill='%232E7D32' stroke='%23191919' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 24px',
        }}
      />
      <footer className="relative bg-stone-900 border-t border-stone-800 text-stone-300 overflow-hidden pb-8" id="festival-footer">
        <section
          className="footer-download-banner w-full border-b border-[#8c0d09]/40"
          id="download-app-banner"
          aria-labelledby="download-app-heading"
        >
          <div className="footer-download-banner-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 md:pt-16 pb-0">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-end md:items-stretch">
              <div className="space-y-4 pb-12 md:pb-16">
                <span className="inline-block text-xs font-bold text-amber-200 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  Har Traditional Function Ka Smart Planning Partner
                </span>
                <h3
                  id="download-app-heading"
                  className="font-display text-3xl md:text-4xl font-normal text-white tracking-tight leading-tight"
                >
                  Get the {APP_NAME} app
                </h3>
                <p className="text-sm text-amber-100/95 -mt-2">Launching soon on iOS & Android</p>
                <div className="text-orange-50 text-base max-w-md space-y-4">
                  <p className="font-bold text-amber-200">App Features:</p>
                  <ul className="space-y-1.5 text-sm md:text-base font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-300" aria-hidden>
                        ✓
                      </span>
                      <span>Trusted local vendors search karo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-300" aria-hidden>
                        ✓
                      </span>
                      <span>Halwai, Tent, Decorator, Milk, Kirana sab ek jagah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-300" aria-hidden>
                        ✓
                      </span>
                      <span>Guest list & RSVP management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-300" aria-hidden>
                        ✓
                      </span>
                      <span>Feast / Bhoj planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-300" aria-hidden>
                        ✓
                      </span>
                      <span>Budget aur expense tracking</span>
                    </li>
                  </ul>
                  <p className="text-xs text-amber-100/90">
                    Full feature list inside the app — launching soon on iOS & Android.
                  </p>
                  <div className="pt-2">
                    <p className="tagline py-2 bg-white/10 px-4 rounded-xl backdrop-blur-sm border border-white/5 inline-block text-xs md:text-sm">
                      <strong>
                        Ghar ka bada function? Ab notebook nahi, {APP_NAME} use karo 😄
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleStoreClick}
                    className="flex items-center gap-3 px-4 py-2 bg-black/80 border border-stone-700 text-white rounded-xl transition-colors cursor-pointer min-w-[155px] opacity-90 hover:opacity-100"
                    aria-describedby={storeNotice ? 'store-coming-soon' : undefined}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white shrink-0" fill="currentColor" aria-hidden>
                      <path d="M5 3c-.22 0-.43.06-.61.18L12.52 12l-8.13 8.81c.18.12.39.19.61.19.18 0 .35-.04.51-.13l13.79-7.23c.44-.23.7-.84.7-1.54s-.26-1.31-.7-1.54L5.51 3.13C5.35 3.04 5.18 3 5 3z" />
                    </svg>
                    <div className="text-left leading-none">
                      <span className="text-[9px] text-stone-400 font-bold tracking-wider block uppercase">
                        Coming soon
                      </span>
                      <span className="text-sm font-extrabold tracking-tight block mt-0.5 font-sans">Google Play</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleStoreClick}
                    className="flex items-center gap-3 px-4 py-2.5 bg-black/80 border border-stone-700 text-white rounded-xl transition-colors cursor-pointer min-w-[155px] opacity-90 hover:opacity-100"
                    aria-describedby={storeNotice ? 'store-coming-soon' : undefined}
                  >
                    <svg viewBox="0 0 384 512" className="w-5 h-5 text-white shrink-0" fill="currentColor" aria-hidden>
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.1-77.1-19.1-37.4 0-77.5 21.8-97.6 57.2-40 70.2-10.2 175 28.7 230 19.1 27.2 41.5 57.4 71.3 56.2 28.7-1.1 39.6-18.5 74.3-18.5 34.7 0 45.1 18.5 74.8 17.9 30.3-.6 50.1-27.2 69-54.6 21.8-31.5 30.8-62 31.1-63.6-1-.5-60.1-23.1-60.3-91.4zM269.4 90.1c19.1-23.1 31.9-55.2 28.4-87.1-27.4 1.1-60.4 18.2-80.1 41-16.7 18.8-31.3 51.3-27.3 82.9 30.6 2.3 61.4-14.7 79-36.8z" />
                    </svg>
                    <div className="text-left leading-none">
                      <span className="text-[9px] text-stone-400 font-bold tracking-wider block uppercase font-sans">
                        Coming soon
                      </span>
                      <span className="text-sm font-extrabold tracking-tight block mt-0.5 font-sans">App Store</span>
                    </div>
                  </button>
                </div>
                {storeNotice && (
                  <p id="store-coming-soon" className="text-sm text-amber-100" role="status">
                    Mobile apps are launching soon.{' '}
                    <button
                      type="button"
                      onClick={(e) => handlePageLink('contact', e)}
                      className="font-semibold text-[#FFCB44] underline-offset-2 hover:underline cursor-pointer"
                    >
                      Contact us
                    </button>{' '}
                    to join the waitlist.
                  </p>
                )}
              </div>

              <div className="footer-download-phone flex h-full w-full items-end justify-center md:justify-end">
                <AppPhoneMockup className="w-full" />
              </div>
            </div>
          </div>
        </section>

        <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12" id="footer-links-grid">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <button
                type="button"
                onClick={() => goToPage('landing')}
                className="flex items-center gap-1 cursor-pointer group"
                id="footer-logo"
                aria-label={`${APP_NAME} home`}
              >
                <img
                  src={LogoSvg}
                  alt={APP_NAME}
                  className="h-10 sm:h-12 w-auto select-none transition-transform duration-300 group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
              </button>
              <p className="text-sm text-stone-400 leading-relaxed">
                {APP_NAME} brings trusted ceremony vendors onto one platform — from halwai and tent houses to
                decorators and pandits — for weddings, pujas, and community functions across India.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-stone-850 hover:bg-orange-600 rounded-full hover:text-white transition-colors text-stone-400" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-stone-500 font-bold text-sm tracking-wider uppercase mb-3">
                Explore features
              </h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('vendor-categories-preview')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Vendor search
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('event-planning-guide')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Event planning
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('platform-overview')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Platform overview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('event-planning-guide')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Budget tracker
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('event-planning-guide')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Guest management
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('event-planning-guide')}
                    className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                  >
                    Bhoj / feast planning
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-stone-500 font-bold text-sm tracking-wider uppercase mb-3">
                Useful links
              </h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <a href="#about" onClick={(e) => handlePageLink('about', e)} className="hover:text-orange-400 transition-colors cursor-pointer block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#how-it-works-page" onClick={handleHowItWorks} className="hover:text-orange-400 transition-colors cursor-pointer block">
                    How it works (full guide)
                  </a>
                </li>
                <li>
                  <a href="#terms" onClick={(e) => handlePageLink('terms', e)} className="hover:text-orange-400 transition-colors cursor-pointer block">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#privacy" onClick={(e) => handlePageLink('privacy', e)} className="hover:text-orange-400 transition-colors cursor-pointer block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#cancellation" onClick={(e) => handlePageLink('cancellation', e)} className="hover:text-orange-400 transition-colors cursor-pointer block">
                    Cancellation Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-stone-500 font-bold text-sm tracking-wider uppercase mb-3">
                Contact us
              </h4>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden />
                  <span>Corp Office: Keshopur Pura, PO - Pokharvinda, Pupri thana, Sitamadhi - 843320</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" aria-hidden />
                  <a href="tel:+9118001234567" className="hover:text-orange-400 transition-colors">
                    +91 1800 123 4567
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" aria-hidden />
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-orange-400 transition-colors">
                    {SUPPORT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <ShieldCheck className="w-4 h-4 text-orange-500" aria-hidden />
              <span>Certified Secure Platform</span>
            </div>
            <div className="text-center sm:text-right">
              <span>© 2026 {APP_NAME}. Inspired by tradition. Prepared for & Made in India!</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
