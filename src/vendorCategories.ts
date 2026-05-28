import { fetchVendorCategories, type VendorCategoryItem } from './api/catalog';
import type { CategoryItem } from './components/web/VendorCategoryPage/CategoriesGrid';

const CATEGORY_CARD_STYLES: Pick<CategoryItem, 'bgColorLight' | 'bgColorDark' | 'image'>[] = [
  {
    bgColorLight:
      'bg-indigo-50/95 hover:bg-indigo-100 border-indigo-300 border-l-4 border-l-indigo-600 shadow-sm shadow-indigo-100/40',
    bgColorDark:
      'dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 dark:border-indigo-800 dark:border-l-indigo-500',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-orange-50/95 hover:bg-orange-101 border-orange-300 border-l-4 border-l-orange-650 shadow-sm shadow-orange-100/40',
    bgColorDark:
      'dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:border-orange-850 dark:border-l-orange-500',
    image:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-rose-50/95 hover:bg-rose-100 border-rose-300 border-l-4 border-l-rose-500 shadow-sm shadow-rose-100/40',
    bgColorDark:
      'dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:border-rose-800 dark:border-l-rose-500',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-amber-50/95 hover:bg-amber-100 border-amber-300 border-l-4 border-l-amber-600 shadow-sm shadow-amber-100/40',
    bgColorDark:
      'dark:bg-amber-950/40 dark:hover:bg-amber-900/50 dark:border-amber-800 dark:border-l-amber-500',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-emerald-50/95 hover:bg-emerald-100 border-emerald-300 border-l-4 border-l-emerald-600 shadow-sm shadow-emerald-100/40',
    bgColorDark:
      'dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:border-emerald-800 dark:border-l-emerald-500',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-violet-50/95 hover:bg-violet-100 border-violet-300 border-l-4 border-l-violet-605 shadow-sm shadow-violet-100/40',
    bgColorDark:
      'dark:bg-violet-950/40 dark:hover:bg-violet-900/50 dark:border-violet-800 dark:border-l-violet-500',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-sky-50/95 hover:bg-sky-101 border-sky-300 border-l-4 border-l-sky-500 shadow-sm shadow-sky-100/40',
    bgColorDark:
      'dark:bg-sky-950/40 dark:hover:bg-sky-900/50 dark:border-sky-800 dark:border-l-sky-500',
    image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&auto=format&fit=crop&q=70',
  },
  {
    bgColorLight:
      'bg-pink-50/95 hover:bg-pink-101 border-pink-300 border-l-4 border-l-pink-500 shadow-sm shadow-pink-100/40',
    bgColorDark:
      'dark:bg-pink-950/40 dark:hover:bg-pink-900/50 dark:border-pink-800 dark:border-l-pink-500',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=70',
  },
];

function toCategoryItem(item: VendorCategoryItem, index: number): CategoryItem {
  const style = CATEGORY_CARD_STYLES[index % CATEGORY_CARD_STYLES.length];
  return {
    id: item.id,
    name: item.name,
    subtext: item.name,
    ...style,
  };
}

let categoriesCache: CategoryItem[] | null = null;
let loadPromise: Promise<CategoryItem[]> | null = null;

export async function loadVendorCategories(): Promise<CategoryItem[]> {
  if (categoriesCache) return categoriesCache;
  if (!loadPromise) {
    loadPromise = fetchVendorCategories()
      .then((items) => {
        categoriesCache = items.map(toCategoryItem);
        return categoriesCache;
      })
      .catch(() => {
        categoriesCache = [];
        return categoriesCache;
      });
  }
  return loadPromise;
}

export function getCategoryLabel(categoryId: string, categories?: CategoryItem[]): string {
  const list = categories ?? categoriesCache ?? [];
  return list.find((c) => c.id === categoryId)?.name ?? categoryId;
}

export function getHeroCategoryOptions(
  categories: CategoryItem[]
): { value: string; label: string }[] {
  return [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
}
