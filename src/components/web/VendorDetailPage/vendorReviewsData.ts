export interface VendorReview {
  id: string;
  authorName: string;
  avatarEmoji: string;
  rating: number;
  date: string;
  eventType: string;
  title: string;
  text: string;
  verified: boolean;
}

export interface VendorReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

const REVIEW_POOL: Omit<VendorReview, 'id'>[] = [
  {
    authorName: 'Ananya & Vikram S.',
    avatarEmoji: '💑',
    rating: 5,
    date: 'Nov 2024',
    eventType: 'Wedding',
    title: 'Exceeded expectations',
    text: 'Very professional from first call to event day. The team was punctual, polite, and delivered exactly what we discussed in the quote.',
    verified: true,
  },
  {
    authorName: 'Meera Kapoor',
    avatarEmoji: '👩',
    rating: 5,
    date: 'Oct 2024',
    eventType: 'Sangeet',
    title: 'Smooth coordination',
    text: 'We booked for our daughter’s sangeet. Clear communication on WhatsApp and no last-minute surprises. Would recommend to family friends.',
    verified: true,
  },
  {
    authorName: 'Rohit Malhotra',
    avatarEmoji: '👨',
    rating: 4,
    date: 'Sep 2024',
    eventType: 'Reception',
    title: 'Great value for money',
    text: 'Quality was strong overall. One small delay on setup day, but they made up for it with extra attention during the function.',
    verified: true,
  },
  {
    authorName: 'Divya & Arjun P.',
    avatarEmoji: '🪔',
    rating: 5,
    date: 'Aug 2024',
    eventType: 'Haldi',
    title: 'Festive season ready',
    text: 'Booked during peak season and they still managed our timeline well. The package breakdown in the quote was very transparent.',
    verified: false,
  },
  {
    authorName: 'Kavita Sharma',
    avatarEmoji: '👩‍🦱',
    rating: 4,
    date: 'Jul 2024',
    eventType: 'Engagement',
    title: 'Responsive team',
    text: 'Quick replies and flexible with a few add-ons we requested late. Final invoice matched the agreed estimate.',
    verified: true,
  },
  {
    authorName: 'Sanjay G.',
    avatarEmoji: '👨‍💼',
    rating: 5,
    date: 'Jun 2024',
    eventType: 'Corporate event',
    title: 'Professional end-to-end',
    text: 'Used them for a corporate Diwali dinner. Setup was on time and guests complimented the presentation and service.',
    verified: true,
  },
];

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

function buildDistribution(
  average: number,
  total: number
): VendorReviewSummary['distribution'] {
  const dist: VendorReviewSummary['distribution'] = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const weights = [
    { star: 5 as const, w: Math.max(0.35, average / 5) },
    { star: 4 as const, w: 0.28 },
    { star: 3 as const, w: 0.12 },
    { star: 2 as const, w: 0.05 },
    { star: 1 as const, w: 0.02 },
  ];
  let assigned = 0;
  weights.forEach(({ star, w }, idx) => {
    if (idx === weights.length - 1) {
      dist[star] = total - assigned;
    } else {
      const n = Math.round(total * w);
      dist[star] = n;
      assigned += n;
    }
  });
  if (dist[5] + dist[4] + dist[3] + dist[2] + dist[1] !== total) {
    dist[5] += total - (dist[5] + dist[4] + dist[3] + dist[2] + dist[1]);
  }
  return dist;
}

export function getVendorReviews(
  vendorId: string,
  averageRating: number,
  ratingCount: number
): { summary: VendorReviewSummary; reviews: VendorReview[] } {
  const seed = hashSeed(vendorId);
  const count = Math.min(5, Math.max(3, (seed % 3) + 3));
  const reviews: VendorReview[] = [];

  for (let i = 0; i < count; i++) {
    const template = REVIEW_POOL[(seed + i * 7) % REVIEW_POOL.length];
    const rating =
      i === 0
        ? Math.min(5, Math.max(4, Math.round(averageRating)))
        : template.rating;
    reviews.push({
      ...template,
      id: `${vendorId}-review-${i}`,
      rating,
    });
  }

  return {
    summary: {
      averageRating,
      totalCount: ratingCount,
      distribution: buildDistribution(averageRating, ratingCount),
    },
    reviews,
  };
}
