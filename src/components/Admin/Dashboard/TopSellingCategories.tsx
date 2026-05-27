import React from 'react';
import { AdminEmptyState } from '../AdminEmptyState';

interface CategorySale {
  category: string;
  value: number;
}

interface TopSellingCategoriesProps {
  categorySales: CategorySale[];
}

export const TopSellingCategories: React.FC<TopSellingCategoriesProps> = ({ categorySales }) => {
  return (
    <div className="admin-card p-6 space-y-4">
      <h3 className="text-base font-semibold text-stone-900 dark:text-white border-b pb-3 border-stone-200 dark:border-stone-700 text-left">
        Top categories
      </h3>
      
      {categorySales.length === 0 ? (
        <AdminEmptyState
          title="No category sales yet"
          description="Top categories will appear when orders are placed."
          className="border-0 shadow-none bg-transparent p-6"
        />
      ) : (
      <div className="space-y-4 pt-1">
        {categorySales.map((cat, idx) => (
          <div key={idx} className="space-y-1.5 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200">{cat.category}</span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{cat.value}%</span>
            </div>
            {/* ProgressBar background */}
            <div className="w-full bg-stone-100 dark:bg-stone-805 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-600 to-orange-700 h-full rounded-full"
                style={{ width: `${cat.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
