import React from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  subtext: string;
  bgColorLight: string;
  bgColorDark: string;
  image: string;
}

interface CategoriesGridProps {
  categories: CategoryItem[];
  onSelectCategory: (cat: CategoryItem) => void;
  selectedCategoryId: string | null;
  searchQuery?: string;
  loading?: boolean;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  onSelectCategory,
  selectedCategoryId,
  searchQuery = '',
  loading = false,
}) => {
  const q = searchQuery.trim().toLowerCase();
  const visibleCategories = q
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) || cat.subtext.toLowerCase().includes(q)
      )
    : categories;

  if (loading) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400 py-8 text-center">
        Loading categories…
      </p>
    );
  }

  if (visibleCategories.length === 0) {
    return (
      <p className="text-sm text-stone-500 dark:text-stone-400 py-8 text-center">
        No categories available right now. Please try again later.
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

      <div className="grid grid-cols-2 gap-3 sm:gap-4" id="categories-boxes-row">
        {visibleCategories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            aria-pressed={selectedCategoryId === cat.id}
            className={`group relative flex h-[6.25rem] sm:h-[6.75rem] w-full min-w-0 overflow-hidden rounded-2xl border-0 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none ${cat.bgColorLight} ${cat.bgColorDark} ${
              selectedCategoryId === cat.id
                ? 'ring-2 ring-[#C51C13] ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-900'
                : ''
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
