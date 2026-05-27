import { ListingCardItem } from '../VendorCategoryPage/VendorGridCard';

export interface VendorServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isFestiveSpecial?: boolean;
}

export interface VendorDetailProfile extends ListingCardItem {
  ratingCount: number;
  responseTime: string;
  distance: number;
  offerText?: string;
  tagline: string;
  services: VendorServiceItem[];
}

const CATEGORY_SERVICES: Record<
  string,
  Omit<VendorServiceItem, 'id' | 'image'>[]
> = {
  venues: [
    {
      name: 'Banquet hall — full day',
      description: 'Indoor hall with stage, seating for 300+, AC, and basic sound.',
      price: 85000,
      rating: 4.8,
      ratingCount: 124,
      category: 'Venue packages',
      isPopular: true,
    },
    {
      name: 'Lawn + mandap setup',
      description: 'Outdoor lawn with mandap frame, aisle décor, and seating layout.',
      price: 140000,
      rating: 4.9,
      ratingCount: 89,
      category: 'Venue packages',
      isFestiveSpecial: true,
    },
    {
      name: 'Catering coordination',
      description: 'Vendor liaison for halwai, live counters, and service staff.',
      price: 15000,
      rating: 4.7,
      ratingCount: 56,
      category: 'Add-ons',
    },
    {
      name: 'Valet & parking',
      description: 'Managed parking and guest arrival for peak hours.',
      price: 8000,
      rating: 4.6,
      ratingCount: 34,
      category: 'Add-ons',
    },
  ],
  photographers: [
    {
      name: 'Wedding day photography',
      description: 'Full-day coverage, edited gallery, and online delivery.',
      price: 35000,
      rating: 4.9,
      ratingCount: 210,
      category: 'Photo & video',
      isPopular: true,
    },
    {
      name: 'Cinematic highlight film',
      description: '3–5 min film with licensed music and color grading.',
      price: 45000,
      rating: 4.8,
      ratingCount: 167,
      category: 'Photo & video',
    },
    {
      name: 'Pre-wedding shoot',
      description: 'Half-day outdoor shoot with 30 edited photos.',
      price: 18000,
      rating: 4.7,
      ratingCount: 98,
      category: 'Pre-wedding',
      isFestiveSpecial: true,
    },
    {
      name: 'Drone coverage',
      description: 'Aerial shots for baraat or venue (subject to permissions).',
      price: 12000,
      rating: 4.6,
      ratingCount: 45,
      category: 'Add-ons',
    },
  ],
  makeup: [
    {
      name: 'Bridal makeup & hair',
      description: 'HD bridal look, hair styling, and touch-up kit for the day.',
      price: 15000,
      rating: 5.0,
      ratingCount: 312,
      category: 'Bridal',
      isPopular: true,
    },
    {
      name: 'Family makeup (per person)',
      description: 'Traditional or party look for mothers, sisters, and guests.',
      price: 3500,
      rating: 4.8,
      ratingCount: 189,
      category: 'Family',
    },
    {
      name: 'Sangeet glam package',
      description: 'Bridal + 4 family members with hairstyling.',
      price: 28000,
      rating: 4.9,
      ratingCount: 76,
      category: 'Packages',
      isFestiveSpecial: true,
    },
  ],
  'planning-decor': [
    {
      name: 'Mandap & stage décor',
      description: 'Floral mandap, backdrop, and stage setup with lighting.',
      price: 125000,
      rating: 4.9,
      ratingCount: 143,
      category: 'Décor',
      isPopular: true,
    },
    {
      name: 'Full wedding planning',
      description: 'End-to-end coordination, vendor management, and day-of team.',
      price: 95000,
      rating: 4.8,
      ratingCount: 88,
      category: 'Planning',
    },
    {
      name: 'Haldi / mehendi setup',
      description: 'Themed décor, seating, and photo-friendly corners.',
      price: 35000,
      rating: 4.7,
      ratingCount: 62,
      category: 'Functions',
      isFestiveSpecial: true,
    },
  ],
  food: [
    {
      name: 'Satvik wedding menu',
      description: 'Per-plate multi-course menu with live counters (min. 100 guests).',
      price: 1200,
      rating: 5.0,
      ratingCount: 401,
      category: 'Catering',
      isPopular: true,
    },
    {
      name: 'Chaat & snack counter',
      description: 'Live chaat, tikki, and mithai station for 4 hours.',
      price: 45000,
      rating: 4.8,
      ratingCount: 156,
      category: 'Live counters',
    },
    {
      name: 'Tasting session',
      description: 'Menu tasting for up to 6 people at vendor kitchen.',
      price: 2500,
      rating: 4.9,
      ratingCount: 89,
      category: 'Add-ons',
      isFestiveSpecial: true,
    },
  ],
  pandits: [
    {
      name: 'Full wedding rituals',
      description: 'Vivah sanskar with samagri checklist and family guidance.',
      price: 15000,
      rating: 5.0,
      ratingCount: 278,
      category: 'Rituals',
      isPopular: true,
    },
    {
      name: 'Griha pravesh / puja',
      description: 'Housewarming or deity installation ceremony.',
      price: 8000,
      rating: 4.9,
      ratingCount: 134,
      category: 'Rituals',
    },
    {
      name: 'Muhurat consultation',
      description: 'Date and time selection with written summary.',
      price: 3000,
      rating: 4.8,
      ratingCount: 201,
      category: 'Consultation',
      isFestiveSpecial: true,
    },
  ],
};

const DEFAULT_SERVICES: Omit<VendorServiceItem, 'id' | 'image'>[] = [
  {
    name: 'Consultation call',
    description: '30-minute call to understand your event and share packages.',
    price: 0,
    rating: 4.8,
    ratingCount: 120,
    category: 'Consultation',
    isPopular: true,
  },
  {
    name: 'Custom event package',
    description: 'Tailored quote based on date, guest count, and requirements.',
    price: 25000,
    rating: 4.7,
    ratingCount: 85,
    category: 'Packages',
  },
  {
    name: 'On-day support',
    description: 'Dedicated coordinator on event day.',
    price: 12000,
    rating: 4.6,
    ratingCount: 44,
    category: 'Add-ons',
    isFestiveSpecial: true,
  },
];

const OFFER_BY_CATEGORY: Record<string, string> = {
  venues: 'Book 60+ days ahead — complimentary welcome drink station.',
  photographers: 'Festive offer: free pre-wedding teaser reel on full-day booking.',
  makeup: 'Bridal trial included when you book the full bridal package.',
  food: 'Pure satvik kitchen — 10% off for 200+ guest bookings.',
  'planning-decor': 'Early-bird décor: free haldi corner styling with mandap package.',
  pandits: 'Samagri checklist PDF and family briefing call included.',
};

export function buildVendorDetailProfile(vendor: ListingCardItem): VendorDetailProfile {
  const templates = CATEGORY_SERVICES[vendor.category] ?? DEFAULT_SERVICES;
  const services: VendorServiceItem[] = templates.map((t, i) => ({
    ...t,
    id: `${vendor.id}-svc-${i}`,
    image: vendor.image,
  }));

  return {
    ...vendor,
    ratingCount: Math.floor(80 + vendor.rating * 45),
    responseTime: '2–4 hrs',
    distance: 2.5 + (vendor.id.charCodeAt(0) % 5) * 0.8,
    offerText: OFFER_BY_CATEGORY[vendor.category],
    tagline: vendor.location,
    services,
  };
}
