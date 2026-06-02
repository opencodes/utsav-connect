import React, { useState } from 'react';
import { Bell, Search, RefreshCw } from 'lucide-react';
import { APP_NAME } from '../../../brand';
import type { AdminSessionDisplay } from '../adminSessionDisplay';

const ADMIN_TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  restaurants: 'Products & Stores',
  orders: 'Order Logs',
  customers: 'Customers',
  marketing: 'Marketing',
  'vendor-approvals': 'Vendor approvals',
  'vendor-categories': 'Vendor categories',
  'admin-users': 'Admin users',
  'planner-dashboard': 'Dashboard',
  'planner-events': 'Event details',
  'planner-events-create': 'Create Event',
  'planner-events-history': 'Event History',
  'planner-guests': 'Guests & RSVP',
  'planner-feast': 'Feast & Catering',
  'planner-vendors': 'Vendors',
  'planner-budget': 'Budget & Expenses',
  'planner-chuman': 'Chuman (Gifts)',
  'planner-inventory': 'Inventory',
};

function tabTitle(tabId: string): string {
  return ADMIN_TAB_TITLES[tabId] ?? tabId.replace(/-/g, ' ');
}

interface AdminHeaderProps {
  currentTabName: string;
  plannerWorkspace?: boolean;
  session?: AdminSessionDisplay;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTabName,
  plannerWorkspace = false,
  session,
}) => {
  const user = session ?? {
    displayName: plannerWorkspace ? 'Planner account' : 'Admin',
    roleLabel: 'Active',
    detailLine: '',
    initials: plannerWorkspace ? 'EP' : 'AD',
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const displayTitle = tabTitle(currentTabName);

  const notifications: {
    title: string;
    detail: string;
    time: string;
    unread: boolean;
  }[] = [];

  return (
    <header id="admin-top-header">
      <div className="admin-header-leading">
        <h1 className="admin-page-title">
          {plannerWorkspace ? (
            <>
              {APP_NAME}
              <span> / {displayTitle}</span>
            </>
          ) : (
            <>
              Admin
              <span> / {displayTitle}</span>
            </>
          )}
        </h1>

        <div className="admin-search-wrap">
          <label htmlFor="admin-header-search" className="sr-only">
            Search workspace
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
            aria-hidden
          />
          <input
            id="admin-header-search"
            type="search"
            placeholder={plannerWorkspace ? 'Search events, guests…' : 'Search orders, stores…'}
            className="admin-search-input"
          />
        </div>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          onClick={() =>
            alert(plannerWorkspace ? 'Planner data synced (demo).' : 'Data refreshed (demo).')
          }
          className="admin-icon-btn"
          title="Refresh"
          aria-label="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="admin-icon-btn relative"
            title="Notifications"
            aria-expanded={showNotifications}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 ? (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
            ) : null}
          </button>

          {showNotifications && (
            <div
              className="admin-notify-panel absolute top-full right-0 mt-2 w-80 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 p-3 z-50 text-left"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-stone-200 dark:border-stone-700">
                <span className="text-xs font-semibold text-stone-500 tracking-wide">
                  Notifications
                </span>
                <button
                  type="button"
                  onClick={() => alert('All notifications marked as read (demo).')}
                  className="text-xs font-medium text-primary hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="py-6 text-center text-xs text-stone-500">No notifications</li>
                ) : null}
                {notifications.map((not) => (
                  <li
                    key={not.title}
                    className={`p-2.5 rounded-lg border text-left ${
                      not.unread
                        ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{not.title}</p>
                      <span className="text-[10px] text-stone-400 shrink-0 font-mono">{not.time}</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{not.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="admin-user-chip hidden sm:flex"
          title={[user.displayName, user.roleLabel, user.detailLine].filter(Boolean).join(' · ')}
        >
          <div className="admin-user-avatar" aria-hidden>
            {user.initials}
          </div>
          <div className="admin-user-meta min-w-0">
            <p className="admin-user-name truncate max-w-[10rem] lg:max-w-[14rem]">{user.displayName}</p>
            <p className="admin-user-status">{user.roleLabel}</p>
            {user.detailLine ? (
              <p className="admin-user-detail truncate max-w-[10rem] lg:max-w-[14rem]">{user.detailLine}</p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
