import React from 'react';
export interface CategoryItem {
  id: string;
  name: string;
  subtext: string;
  bgColorLight: string;
  bgColorDark: string;
  image: string;
}

export const WEDDING_CATEGORIES: CategoryItem[] = [
  {
    id: 'venues',
    name: 'Venues',
    subtext: 'Banquet Halls, Marriage Garden / Lawn...',
    bgColorLight: 'bg-indigo-50/95 hover:bg-indigo-100 border-indigo-300 border-l-4 border-l-indigo-600 shadow-sm shadow-indigo-100/40',
    bgColorDark: 'dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 dark:border-indigo-800 dark:border-l-indigo-500',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'photographers',
    name: 'Photographers',
    subtext: 'Photographers, Wedding Cinema...',
    bgColorLight: 'bg-orange-50/95 hover:bg-orange-101 border-orange-300 border-l-4 border-l-orange-650 shadow-sm shadow-orange-100/40',
    bgColorDark: 'dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:border-orange-850 dark:border-l-orange-500',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    subtext: 'Bridal Makeup Artists, Family Makeup...',
    bgColorLight: 'bg-rose-50/95 hover:bg-rose-100 border-rose-300 border-l-4 border-l-rose-500 shadow-sm shadow-rose-100/40',
    bgColorDark: 'dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:border-rose-800 dark:border-l-rose-500',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'planning-decor',
    name: 'Planning & Decor',
    subtext: 'Wedding Planners, Decorators...',
    bgColorLight: 'bg-amber-50/95 hover:bg-amber-100 border-amber-300 border-l-4 border-l-amber-600 shadow-sm shadow-amber-100/40',
    bgColorDark: 'dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:border-amber-800 dark:border-l-amber-500',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'virtual-planning',
    name: 'Virtual Planning',
    subtext: 'Virtual planning counsel & advice...',
    bgColorLight: 'bg-emerald-50/95 hover:bg-emerald-100 border-emerald-300 border-l-4 border-l-emerald-600 shadow-sm shadow-emerald-100/40',
    bgColorDark: 'dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:border-emerald-800 dark:border-l-emerald-500',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'mehndi',
    name: 'Mehndi',
    subtext: 'Mehendi Artists...',
    bgColorLight: 'bg-teal-50/95 hover:bg-teal-100 border-teal-300 border-l-4 border-l-teal-605 shadow-sm shadow-teal-101/40',
    bgColorDark: 'dark:bg-teal-950/40 dark:hover:bg-teal-900/50 dark:border-teal-800 dark:border-l-teal-500',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'music-dance',
    name: 'Music & Dance',
    subtext: 'DJs, Sangeet Choreographer, Wedding...',
    bgColorLight: 'bg-violet-50/95 hover:bg-violet-100 border-violet-300 border-l-4 border-l-violet-605 shadow-sm shadow-violet-100/40',
    bgColorDark: 'dark:bg-violet-950/40 dark:hover:bg-violet-900/50 dark:border-violet-800 dark:border-l-violet-500',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'invites-gifts',
    name: 'Invites & Gifts',
    subtext: 'Invitations, Favors, Trousseau Packers...',
    bgColorLight: 'bg-yellow-50/95 hover:bg-yellow-101 border-yellow-300 border-l-4 border-l-yellow-500 shadow-sm shadow-yellow-101/40',
    bgColorDark: 'dark:bg-yellow-950/35 dark:hover:bg-yellow-900/50 dark:border-yellow-700 dark:border-l-yellow-500',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'food',
    name: 'Food',
    subtext: 'Catering Services, Cake, Chaat & Food...',
    bgColorLight: 'bg-purple-50/95 hover:bg-purple-101 border-purple-300 border-l-4 border-l-purple-650 shadow-sm shadow-purple-100/40',
    bgColorDark: 'dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:border-purple-800 dark:border-l-purple-500',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'pre-wedding-shoot',
    name: 'Pre Wedding Shoot',
    subtext: 'Pre Wedding Shoot Locations, Shoot Counsel...',
    bgColorLight: 'bg-sky-50/95 hover:bg-sky-101 border-sky-300 border-l-4 border-l-sky-500 shadow-sm shadow-sky-100/40',
    bgColorDark: 'dark:bg-sky-950/40 dark:hover:bg-sky-900/50 dark:border-sky-800 dark:border-l-sky-500',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'bridal-wear',
    name: 'Bridal Wear',
    subtext: 'Bridal Lehengas, Kanjeevaram / Silk Sa...',
    bgColorLight: 'bg-red-50/95 hover:bg-red-101 border-red-350 border-l-4 border-l-red-650 shadow-sm shadow-red-101/40',
    bgColorDark: 'dark:bg-red-950/40 dark:hover:bg-red-900/55 dark:border-red-800 dark:border-l-red-500',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'groom-wear',
    name: 'Groom Wear',
    subtext: 'Sherwani, Wedding Suits / Tuxes, Sher...',
    bgColorLight: 'bg-cyan-50/95 hover:bg-cyan-101 border-cyan-300 border-l-4 border-l-cyan-600 shadow-sm shadow-cyan-101/40',
    bgColorDark: 'dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 dark:border-cyan-800 dark:border-l-cyan-500',
    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'jewellery-accessories',
    name: 'Jewellery & Accessories',
    subtext: 'Jewellery, Flower Jewellery, Bridal Jew...',
    bgColorLight: 'bg-amber-50/95 hover:bg-amber-101 border-amber-305 border-l-4 border-l-yellow-600 shadow-sm shadow-amber-100/40',
    bgColorDark: 'dark:bg-amber-950/35 dark:hover:bg-amber-900/50 dark:border-amber-850 dark:border-l-yellow-500',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'pandits',
    name: 'Pandits',
    subtext: 'Wedding Pandits...',
    bgColorLight: 'bg-orange-50/95 hover:bg-orange-101 border-orange-300 border-l-4 border-l-orange-500 shadow-sm shadow-orange-100/40',
    bgColorDark: 'dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:border-orange-850 dark:border-l-orange-500',
    image: 'https://images.unsplash.com/photo-1609137144813-f6d14909fff0?w=300&auto=format&fit=crop&q=70',
  },
  {
    id: 'bridal-grooming',
    name: 'Bridal Grooming',
    subtext: 'Beauty and Wellness...',
    bgColorLight: 'bg-pink-50/95 hover:bg-pink-101 border-pink-300 border-l-4 border-l-pink-500 shadow-sm shadow-pink-100/40',
    bgColorDark: 'dark:bg-pink-950/40 dark:hover:bg-pink-900/50 dark:border-pink-800 dark:border-l-pink-500',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=70',
  }
];

interface CategoriesGridProps {
  onSelectCategory: (cat: CategoryItem) => void;
  selectedCategoryId: string | null;
  searchQuery?: string;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  onSelectCategory,
  selectedCategoryId,
  searchQuery = '',
}) => {
  const q = searchQuery.trim().toLowerCase();
  const visibleCategories = q
    ? WEDDING_CATEGORIES.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) || cat.subtext.toLowerCase().includes(q)
      )
    : WEDDING_CATEGORIES;

  if (visibleCategories.length === 0) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400 py-8 text-center">
        No categories match your search. Try a different term or browse all categories.
      </p>
    );
  }

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="category-card-image-curve" clipPathUnits="objectBoundingBox">
            <path d="M 0.26 0 Q 0 0.5 0.26 1 L 1 1 L 1 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="grid grid-cols-2 gap-3 sm:gap-4"
        id="categories-boxes-row"
      >
      {visibleCategories.map((cat) => (
        <button
          type="button"
          key={cat.id}
          onClick={() => onSelectCategory(cat)}
          aria-pressed={selectedCategoryId === cat.id}
          className={`group relative flex h-[6.25rem] sm:h-[6.75rem] w-full min-w-0 overflow-hidden rounded-2xl border-0 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none ${cat.bgColorLight} ${cat.bgColorDark} ${
            selectedCategoryId === cat.id ? 'ring-2 ring-[#C51C13] ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900' : ''
          }`}
          id={`box-category-${cat.id}`}
        >
          <div className="relative z-10 flex flex-1 flex-col justify-center gap-0.5 pl-3 sm:pl-4 pr-2 min-w-0">
            <h4 className="font-bold text-[13px] sm:text-sm text-stone-900 dark:text-white leading-tight truncate group-hover:text-[#C51C13] dark:group-hover:text-orange-400 transition-colors">
              {cat.name}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600/90 dark:text-stone-400 line-clamp-2 leading-snug pr-1">
              {cat.subtext}
            </p>
          </div>

          <div className="relative h-full w-[40%] shrink-0 pointer-events-none">
            <img
              src={cat.image}
              alt=""
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              style={{ clipPath: 'url(#category-card-image-curve)' }}
              referrerPolicy="no-referrer"
            />
          </div>
        </button>
      ))}
      </div>
    </>
  );
};
