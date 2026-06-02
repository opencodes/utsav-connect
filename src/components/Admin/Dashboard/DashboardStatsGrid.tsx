import React from 'react';
import { IndianRupee, ShoppingCart, UserCheck, Users, Store } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  activeRestaurants: number;
  pendingVendors?: number;
}

interface DashboardStatsGridProps {
  stats: Stats;
}

const STAT_CARDS = [
  {
    label: 'Gross revenue today',
    value: (s: Stats) => `₹${s.totalRevenue.toLocaleString('en-IN')}`,
    icon: IndianRupee,
    iconClass: 'bg-primary',
  },
  {
    label: 'Orders',
    value: (s: Stats) => String(s.totalOrders),
    icon: ShoppingCart,
    iconClass: 'bg-primary',
  },
  {
    label: 'Active customers',
    value: (s: Stats) => String(s.activeCustomers),
    icon: Users,
    iconClass: 'bg-stone-800 dark:bg-stone-700',
  },
  {
    label: 'Approved kitchens',
    value: (s: Stats) => String(s.activeRestaurants),
    icon: Store,
    iconClass: 'bg-stone-800 dark:bg-stone-700',
  },
  {
    label: 'Vendors pending review',
    value: (s: Stats) => String(s.pendingVendors ?? 0),
    icon: UserCheck,
    iconClass: 'bg-primary',
  },
] as const;

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="admin-dashboard-stats-grid">
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
              className={`p-3 rounded-xl text-white shrink-0 ${card.iconClass}`}
            >
              <Icon className="w-5 h-5" aria-hidden />
            </div>
          </div>
        );
      })}
    </div>
  );
};
