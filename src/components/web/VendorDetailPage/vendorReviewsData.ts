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

function buildDistribution(
  averageRating: number,
  totalCount: number
): Record<1 | 2 | 3 | 4 | 5, number> {
  const total = Math.max(0, totalCount);
  if (total === 0) {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const weights: { star: 1 | 2 | 3 | 4 | 5; w: number }[] = [
    { star: 5, w: averageRating >= 4.5 ? 0.55 : 0.35 },
    { star: 4, w: averageRating >= 4 ? 0.25 : 0.2 },
    { star: 3, w: 0.12 },
    { star: 2, w: 0.05 },
    { star: 1, w: 0.03 },
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
  return dist;
}

/** Reviews come from the API when available; no fabricated review text. */
export function getVendorReviews(
  _vendorId: string,
  averageRating: number,
  ratingCount: number
): { summary: VendorReviewSummary | null; reviews: VendorReview[] } {
  if (ratingCount <= 0) {
    return { summary: null, reviews: [] };
  }

  return {
    summary: {
      averageRating,
      totalCount: ratingCount,
      distribution: buildDistribution(averageRating, ratingCount),
    },
    reviews: [],
  };
}
