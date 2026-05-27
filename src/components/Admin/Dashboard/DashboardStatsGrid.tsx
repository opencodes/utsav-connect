import React from 'react';
import { IndianRupee, ShoppingCart, Users, Store } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  activeRestaurants: number;
}

interface DashboardStatsGridProps {
  stats: Stats;
}

const STAT_CARDS = [
  {
    label: 'Gross revenue today',
    value: (s: Stats) => `₹${s.totalRevenue.toLocaleString('en-IN')}`,
    icon: IndianRupee,
    iconClass: 'from-orange-600 to-orange-700',
  },
  {
    label: 'Orders',
    value: (s: Stats) => String(s.totalOrders),
    icon: ShoppingCart,
    iconClass: 'from-red-500 to-rose-600',
  },
  {
    label: 'Active customers',
    value: (s: Stats) => String(s.activeCustomers),
    icon: Users,
    iconClass: 'from-stone-700 to-stone-900',
  },
  {
    label: 'Approved kitchens',
    value: (s: Stats) => String(s.activeRestaurants),
    icon: Store,
    iconClass: 'from-violet-600 to-pink-600',
  },
] as const;

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-dashboard-stats-grid">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="admin-card p-5 flex items-center justify-between gap-4"
          >
            <div className="text-left min-w-0">
              <span className="admin-stat-label">{card.label}</span>
              <p className="admin-stat-value">{card.value(stats)}</p>
              <span className="text-xs text-stone-400">Live from platform</span>
            </div>
            <div
              className={`p-3 rounded-xl text-white bg-gradient-to-tr shrink-0 ${card.iconClass}`}
            >
              <Icon className="w-5 h-5" aria-hidden />
            </div>
          </div>
        );
      })}
    </div>
  );
};
