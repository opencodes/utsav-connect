import React, { useState } from 'react';
import { Calendar, Search, Sparkles, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { RangoliMandala, AnimatedDiya } from '../GoldenDeco';

interface FeaturedOffersSectionProps {
  onNavigate: (page: string) => void;
}

export const FeaturedOffersSection: React.FC<FeaturedOffersSectionProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearched(false);
      return;
    }
    setSearched(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="rsvp-tracker-homepage">
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40 border border-amber-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Absolute Background Decos */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
          <RangoliMandala className="w-full h-full text-amber-500 animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-0 w-36 h-36 opacity-5 pointer-events-none transform -translate-x-6 translate-y-6">
          <RangoliMandala className="w-full h-full text-orange-500" />
        </div>

        {/* Section Header */}
        <div className="md:flex md:items-center md:justify-between border-b border-stone-800/80 pb-6 mb-8 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-[11px] font-extrabold text-amber-500 font-mono">
                Interactive Guest & RSVP Suite
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ceremonies Timeline & Live RSVP Portal
            </h3>
            <p className="text-sm text-stone-400 max-w-2xl leading-relaxed">
              Verify your invitation, track venue schedules in real-time, view room allocations and return gift registry lists for the upcoming celebration..
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onNavigate('celebrations')}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 font-bold text-sm text-white rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Launch RSVP Registry Portal</span>
            </button>
          </div>
        </div>

        {/* Major Content Split Grid */}
        <div className="grid lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT COLUMN: Interactive Seating/Status Lookup (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 border border-stone-800/80 p-5 sm:p-6 rounded-2xl relative">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">Quick RSVP & Table Index Search</h4>
                  <p className="text-xs text-stone-500">Lookup by full first name to retrieve room numbers & table arrangements.</p>
                </div>
              </div>

              {/* Interactive Search Tool form */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Pandey, Sushant, Apeksha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-850 rounded-xl text-sm text-white placeholder-stone-550 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-stone-850 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl border border-stone-750 transition-all cursor-pointer shrink-0"
                >
                  Verify Status
                </button>
              </form>

              {/* Real-time reactive query output box */}
              {searched && (
                <div className="p-4 rounded-xl border animate-fade-in transition-all bg-stone-950/80">
                  <div className="text-center py-4 space-y-2">
                    <AlertCircle className="w-7 h-7 text-stone-650 mx-auto" />
                    <p className="text-xs text-stone-450">
                      No guest record found for{' '}
                      <strong className="text-stone-250 italic">&quot;{searchQuery}&quot;</strong>.
                      Sign in to your event planner workspace to manage RSVPs.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('celebrations')}
                      className="text-[11px] font-bold text-orange-400 hover:text-orange-300 hover:underline block mx-auto cursor-pointer"
                    >
                      Open RSVP registry &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick RSVP CTA Info card */}
            <div className={`mt-6 p-4 rounded-xl bg-[#C51C13]/10 border border-[#C51C13]/15 flex items-start gap-3 transition-opacity ${searched ? 'hidden md:flex' : 'flex'}`}>
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-350 space-y-1">
                <span className="font-extrabold text-stone-150 block text-orange-400">Ghar ka bada function?</span>
                <span>Skip registers & messy notebooks. Register guests, update food preferences, map out seating, and view digital cards directly in our planner widget!</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Splendid Events & Timelines Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold text-stone-450 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              Featured Wedding Events & Feast Menu Highlights
            </h4>

            <div className="grid sm:grid-cols-3 gap-4">
              
              {/* Card 1: Sangeet */}
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-850 hover:border-amber-550/20 shadow-sm transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-mono">
                      Day 1 Ritual
                    </span>
                    <AnimatedDiya className="w-5 h-5 filter drop-shadow animate-pulse" />
                  </div>
                  <h5 className="font-extrabold text-stone-100 text-sm group-hover:text-amber-300 transition-colors">
                    Sangeet & Shubh Mehndi
                  </h5>
                  <p className="text-[11px] text-stone-450 leading-relaxed">
                    Interactive folk music, dance choreography, and live local henna counters setup.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-900 text-[10px] text-stone-400 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-stone-300">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>Rooftop Palace Hall</span>
                  </div>
                  <div className="text-orange-400/80 font-medium">✨ Catering: Fresh Halwai Delights</div>
                </div>
              </div>

              {/* Card 2: Main Vivah */}
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-850 hover:border-amber-550/20 shadow-sm transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full font-mono">
                      Day 2 Main
                    </span>
                    <AnimatedDiya className="w-5 h-5 filter drop-shadow animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <h5 className="font-extrabold text-stone-100 text-sm group-hover:text-orange-300 transition-colors">
                    Grand Shadi / Vivah
                  </h5>
                  <p className="text-[11px] text-stone-450 leading-relaxed">
                    Vedic sacred mangalpheras with elite flower canopies and band welcome.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-900 text-[10px] text-stone-400 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-stone-300">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>Sacred Temple Mandap</span>
                  </div>
                  <div className="text-orange-400/80 font-medium">✨ Catering: Royal Banaras Feast</div>
                </div>
              </div>

              {/* Card 3: Royal Bhoj */}
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-850 hover:border-amber-550/20 shadow-sm transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-mono">
                      Day 3 Bhoj
                    </span>
                    <AnimatedDiya className="w-5 h-5 filter drop-shadow animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  <h5 className="font-extrabold text-stone-100 text-sm group-hover:text-emerald-300 transition-colors">
                    Ceremonial Maithili Bhoj
                  </h5>
                  <p className="text-[11px] text-stone-450 leading-relaxed">
                    Authentic traditional long table sits serving elite satvik parwal, dahi, and sweets.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-900 text-[10px] text-stone-400 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-stone-300">
                    <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>Grand Banqueting Lawn</span>
                  </div>
                  <div className="text-orange-400/80 font-medium">✨ Catering: Mithila Special Curry</div>
                </div>
              </div>

            </div>

            {/* Bottom mini showcase indicator */}
            <div className="bg-stone-900/40 p-3.5 rounded-xl border border-stone-850 text-xs text-stone-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Need pure vegetarian bartran, caterers or halwai? Manage the full supplier network easily.</span>
              </span>
              <button
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="text-amber-400 hover:text-amber-300 font-bold hover:underline select-none cursor-pointer text-xs shrink-0"
              >
                View Culinary Portfolio &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
