import React, { useMemo, useState } from 'react';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { VendorReview, VendorReviewSummary } from './vendorReviewsData';

interface VendorReviewsSectionProps {
  vendorName: string;
  summary: VendorReviewSummary;
  reviews: VendorReview[];
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} shrink-0 ${
            star <= rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300 dark:text-stone-600'
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

export const VendorReviewsSection: React.FC<VendorReviewsSectionProps> = ({
  vendorName,
  summary,
  reviews,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);
  const maxDist = Math.max(...([5, 4, 3, 2, 1] as const).map((s) => summary.distribution[s]), 1);

  const recommendPercent = useMemo(() => {
    const positive = summary.distribution[5] + summary.distribution[4];
    if (summary.totalCount === 0) return 0;
    return Math.round((positive / summary.totalCount) * 100);
  }, [summary]);

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      className="space-y-6"
      id="vendor-reviews-section"
      aria-labelledby="vendor-reviews-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h3
            id="vendor-reviews-heading"
            className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-orange-600 shrink-0" aria-hidden />
            Customer reviews
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Verified bookings and ratings for {vendorName}
          </p>
        </div>
        <button
          type="button"
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl border border-orange-200 dark:border-stone-700 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-stone-800 transition cursor-pointer"
          onClick={() => {
            document.getElementById('vendor-review-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Write a review
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,16rem)_1fr] gap-6">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100/40 dark:border-stone-800 p-5 space-y-4 shadow-sm">
          <div className="text-center lg:text-left">
            <p className="text-4xl font-black text-stone-900 dark:text-white tabular-nums">
              {summary.averageRating.toFixed(1)}
            </p>
            <StarRow rating={Math.round(summary.averageRating)} size="md" />
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-2">
              {summary.totalCount.toLocaleString()}+ ratings
            </p>
            <p className="text-[11px] font-bold text-green-700 dark:text-green-400 mt-1">
              {recommendPercent}% would recommend
            </p>
          </div>

          <div className="space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = summary.distribution[star];
              const pct = summary.totalCount > 0 ? (count / summary.totalCount) * 100 : 0;
              const barPct = (count / maxDist) * 100;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-bold text-stone-500 tabular-nums">{star}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" aria-hidden />
                  <div className="flex-1 h-2 bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-stone-400 tabular-nums">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-orange-100/40 dark:border-stone-800 p-5 shadow-sm text-left"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0" aria-hidden>
                    {review.avatarEmoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-stone-900 dark:text-white truncate">
                      {review.authorName}
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      {review.eventType} • {review.date}
                      {review.verified && (
                        <span className="ml-1.5 text-green-700 dark:text-green-400 font-semibold">
                          ✓ Verified booking
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <StarRow rating={review.rating} />
              </div>

              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 mt-3">
                {review.title}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mt-1">
                &ldquo;{review.text}&rdquo;
              </p>

              <button
                type="button"
                onClick={() => toggleHelpful(review.id)}
                className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold transition cursor-pointer ${
                  helpfulIds.has(review.id)
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-stone-500 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${helpfulIds.has(review.id) ? 'fill-current' : ''}`}
                  aria-hidden
                />
                Helpful {helpfulIds.has(review.id) ? '(thanks!)' : ''}
              </button>
            </article>
          ))}

          {reviews.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="w-full py-2.5 text-xs font-bold text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-stone-700 rounded-xl hover:bg-orange-50 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </div>
      </div>

      <div
        id="vendor-review-form"
        className="bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4"
      >
        <h4 className="font-bold text-sm text-stone-900 dark:text-white">Share your experience</h4>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Reviews help other families choose vendors. Sign in to submit a verified review after your
          event.
        </p>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Your rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled
              className="p-1 text-stone-300 dark:text-stone-600 cursor-not-allowed"
              aria-label={`${star} stars`}
            >
              <Star className="w-6 h-6" aria-hidden />
            </button>
          ))}
        </div>
        <textarea
          disabled
          placeholder="Tell others about quality, punctuality, and value… (sign in to post)"
          rows={3}
          className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800 text-stone-500 resize-none cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          className="px-4 py-2 bg-stone-300 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-xs font-bold rounded-xl cursor-not-allowed"
        >
          Sign in to post review
        </button>
      </div>
    </section>
  );
};
