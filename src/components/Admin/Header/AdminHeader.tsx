import React, { useState } from 'react';
import { Bell, Search, RefreshCw } from 'lucide-react';
import { APP_NAME } from '../../../brand';

const ADMIN_TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  restaurants: 'Products & Stores',
  orders: 'Order Logs',
  customers: 'Customers Sync',
  marketing: 'Marketing & Campaigns',
  'planner-events': 'Events & Rituals',
  'planner-guests': 'Guests & RSVP',
  'planner-feast': 'Feast & Catering',
  'planner-vendors': 'Vendors Directory',
  'planner-budget': 'Budget & Expenses',
  'planner-chuman': 'Chuman (Gifts)',
  'planner-inventory': 'Bartan & Cylinders',
};

function tabTitle(tabId: string): string {
  return ADMIN_TAB_TITLES[tabId] ?? tabId.replace(/-/g, ' ');
}

interface AdminHeaderProps {
  currentTabName: string;
  plannerWorkspace?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTabName,
  plannerWorkspace = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const displayTitle = tabTitle(currentTabName);

  const notifications = plannerWorkspace
    ? [
        {
          title: 'Upcoming: Tilak ceremony',
          detail: 'Guest list draft ready — 42 confirmed of 60 invited',
          time: 'Just now',
          unread: true,
        },
        {
          title: 'Vendor quote received',
          detail: 'Catering partner replied for feast planning',
          time: '2h ago',
          unread: true,
        },
        {
          title: 'Budget reminder',
          detail: 'Chuman allocation at 78% of planned spend',
          time: 'Yesterday',
          unread: false,
        },
      ]
    : [
        {
          title: 'New Multi-item Order Placed',
          detail: 'OrderID: FED-9831 by Aishwarya, value ₹560',
          time: 'Just now',
          unread: true,
        },
        {
          title: 'Diwali Campaign Alert',
          detail: 'Coupon DIWALISWEET conversion rate crossed 80%',
          time: '10m ago',
          unread: true,
        },
        {
          title: 'Approval Required',
          detail: 'New menu item: "Dry Fruit Shrikhand" needs kitchen review',
          time: '1h ago',
          unread: false,
        },
      ];

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 border-b border-orange-100/40 dark:border-stone-800 p-4 flex items-center justify-between gap-4 shadow-sm"
      id="admin-top-header"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
          {plannerWorkspace ? (
            <>
              {APP_NAME}{' '}
              <span className="text-orange-600 font-sans font-bold">/ {displayTitle}</span>
            </>
          ) : (
            <>
              Root // <span className="text-orange-600 font-sans">{displayTitle}</span>
            </>
          )}
        </h2>

        <div className="hidden md:flex relative max-w-xs text-left">
          <input
            type="text"
            placeholder={
              plannerWorkspace ? 'Search events, guests, vendors…' : 'Search master indexes...'
            }
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-stone-50 dark:bg-stone-850 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500 text-stone-900 dark:text-white"
          />
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>

      <div className="flex items-center gap-4 select-none">
        <button
          type="button"
          onClick={() =>
            alert(
              plannerWorkspace
                ? 'Planner data synced (demo).'
                : 'Database index synchronized with Live Cloud Run container.'
            )
          }
          className="p-2 text-stone-400 hover:text-orange-650 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Click to Resync Nodes"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-stone-400 hover:text-orange-655 rounded-full hover:bg-stone-55 dark:hover:bg-stone-800 transition-colors relative cursor-pointer"
            title="Read announcements"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-ping" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-stone-800 shadow-2xl border border-orange-100 dark:border-stone-700 p-3 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-light-100 dark:border-stone-700 mb-2">
                <span className="text-xs font-black text-stone-400 tracking-wider">
                  {plannerWorkspace ? 'Planner updates' : 'Live System Logs'}
                </span>
                <button
                  type="button"
                  onClick={() => alert('Announcements flagged as completed.')}
                  className="text-[10px] text-orange-600 hover:underline font-bold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 font-semibold">
                {notifications.map((not, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs text-left ${
                      not.unread
                        ? 'bg-orange-600/5 border-orange-600/20'
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <b className="font-extrabold text-stone-900 dark:text-white font-sans">
                        {not.title}
                      </b>
                      <span className="text-[9px] text-stone-400 shrink-0 font-mono font-bold">
                        {not.time}
                      </span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-300 text-[11px] mt-0.5">
                      {not.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l pl-4 border-stone-105 dark:border-stone-850">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-700 flex items-center justify-center text-sm">
            📯
          </div>
          <div className="text-left leading-none hidden sm:block">
            <h4 className="text-xs font-black text-stone-900 dark:text-white">
              {plannerWorkspace ? 'Customer account' : 'Admin Core'}
            </h4>
            <span className="text-[9px] font-mono font-bold text-green-700 dark:text-green-400">
              {plannerWorkspace ? 'Workspace active' : 'Server Online'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
