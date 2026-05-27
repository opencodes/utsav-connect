import React, { useState } from 'react';
import { EMPTY_ADMIN_STATS } from '../../../adminDefaults';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { DiwaliAnalyticsChart } from './DiwaliAnalyticsChart';
import { TopSellingCategories } from './TopSellingCategories';
import { RecentOrdersTable } from './RecentOrdersTable';
import { QuickActionsPanel } from './QuickActionsPanel';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const stats = EMPTY_ADMIN_STATS;
  const [activeSegment, setActiveSegment] = useState<'revenue' | 'orders'>('revenue');

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-dashboard-tab">
      <div className="admin-card p-5">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Overview</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Commerce snapshot — revenue, orders, customers, and kitchens for today.
        </p>
      </div>

      <DashboardStatsGrid stats={stats} />

      {/* 2. SALES CHANNELS GRAPH & CATEGORIES SALES */}
      <div className="grid lg:grid-cols-3 gap-6" id="charts-layout">
        <DiwaliAnalyticsChart
          revenueTrend={stats.revenueTrend}
          activeSegment={activeSegment}
          setActiveSegment={setActiveSegment}
        />
        <TopSellingCategories categorySales={stats.categorySales} />
      </div>

      {/* 3. RECENT ORDERS TABLE & ACTIONS */}
      <div className="grid lg:grid-cols-4 gap-6" id="dashboard-bottom-grid">
        <RecentOrdersTable recentOrders={stats.recentOrders} onNavigateTab={onNavigateTab} />
        <QuickActionsPanel onNavigateTab={onNavigateTab} />
      </div>
    </div>
  );
};
