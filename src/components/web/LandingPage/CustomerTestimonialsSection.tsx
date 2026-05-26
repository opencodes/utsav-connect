import React from 'react';
import { Star } from 'lucide-react';
import { APP_NAME } from '../../../brand';
import { LandingSection, LandingSectionHeader } from './LandingSection';

export const CustomerTestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Priya & Rahul Varma',
      role: 'Wedding hosts, Delhi',
      text: 'We shortlisted decorators and caterers in one place instead of ten WhatsApp groups. Creating our event first made vendor comparisons so much easier.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      name: 'Amit Singhal',
      role: 'Tent house owner, Noida',
      text: `After listing on ${APP_NAME} we started getting enquiries from families already planning sangeet dates. Registration was straightforward and our profile does the talking.`,
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      name: 'Sanjana Roy',
      role: 'Community puja organizer, Gurugram',
      text: 'For our housing society Navratri, we found a halwai and sound vendor through category search. The platform fits how we actually plan functions in our colony.',
      rating: 5,
      avatar: '👩‍🍳',
    },
  ];

  return (
    <LandingSection id="customer-reviews" tone="parchment" showDivider={false} showTexture={false} showMandala={false}>
      <LandingSectionHeader
        eyebrow="Hosts & vendors"
        title={`Stories from the ${APP_NAME} community`}
        description="Families planning events and service providers growing their reach — on one platform."
      />

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {testimonials.map((test, idx) => (
          <article
            key={idx}
            className={`text-left flex flex-col justify-between py-2 ${
              idx > 0 ? 'md:border-l md:border-stone-200/80 md:dark:border-stone-800 md:pl-8 lg:pl-12' : ''
            }`}
          >
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">&ldquo;{test.text}&rdquo;</p>
            </div>

            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-200/60 dark:border-stone-800">
              <span className="text-2xl shrink-0" aria-hidden>
                {test.avatar}
              </span>
              <div>
                <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">{test.name}</h3>
                <p className="text-xs text-stone-500">{test.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </LandingSection>
  );
};
