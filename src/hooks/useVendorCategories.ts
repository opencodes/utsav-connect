import { useEffect, useState } from 'react';
import type { CategoryItem } from '../components/web/VendorCategoryPage/CategoriesGrid';
import { getCategoryLabel, loadVendorCategories } from '../vendorCategories';

export function useVendorCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void loadVendorCategories().then((list) => {
      if (!cancelled) {
        setCategories(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    categories,
    loading,
    getLabel: (categoryId: string) => getCategoryLabel(categoryId, categories),
  };
}
