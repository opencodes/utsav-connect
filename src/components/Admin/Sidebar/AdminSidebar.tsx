import React from 'react';
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  Users,
  Megaphone,
  UserCheck,
  Tags,
  ArrowLeft,
  Calendar,
  CalendarPlus,
  History,
  ChefHat,
  Truck,
  IndianRupee,
  Gift,
} from 'lucide-react';
import { APP_NAME } from '../../../brand';
import type { AdminSessionDisplay } from '../adminSessionDisplay';

interface AdminSidebarProps {
  currentAdminTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  /** Event planners only see the Mithila planner tools (not commerce admin). */
  plannerWorkspace?: boolean;
  /** Platform admin sees commerce + vendor operations. */
  platformAdmin?: boolean;
  session?: AdminSessionDisplay;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentAdminTab,
  onSelectTab,
  onExitAdmin,
  plannerWorkspace = false,
  platformAdmin = false,
  session,
}) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurants', name: 'Products & Stores', icon: Store },
    { id: 'orders', name: 'Order Logs', icon: ClipboardList },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'marketing', name: 'Marketing', icon: Megaphone },
    { id: 'vendor-approvals', name: 'Vendor approvals', icon: UserCheck },
    { id: 'vendor-categories', name: 'Vendor categories', icon: Tags },
  ];

  const plannerItems = [
    { id: 'planner-dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner-events', name: 'Event details', icon: Calendar },
    { id: 'planner-guests', name: 'Guests & RSVP', icon: Users },
    { id: 'planner-feast', name: 'Feast & Catering', icon: ChefHat },
    { id: 'planner-vendors', name: 'Vendors', icon: Truck },
    { id: 'planner-budget', name: 'Budget & Expenses', icon: IndianRupee },
    { id: 'planner-chuman', name: 'Chuman (Gifts)', icon: Gift },
    { id: 'planner-inventory', name: 'Inventory', icon: ClipboardList },
  ];

  const plannerEventItems = [
    { id: 'planner-events-create', name: 'Create Event', icon: CalendarPlus },
    { id: 'planner-events-history', name: 'Event History', icon: History },
  ];

  const renderNavItem = (
    item: { id: string; name: string; icon: React.ElementType },
    nested = false
  ) => {
    const Icon = item.icon;
    const isActive = currentAdminTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectTab(item.id)}
        className={`admin-nav-item${nested ? ' admin-nav-item--nested' : ''}`}
        data-active={isActive ? 'true' : 'false'}
        id={`admin-sib-btn-${item.id}`}
      >
        <Icon aria-hidden />
        <span>{item.name}</span>
      </button>
    );
  };

  return (
    <aside id="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-inner">
          <p className="admin-sidebar-brand-title">
            {plannerWorkspace ? APP_NAME : 'Admin console'}
          </p>
          <p className="admin-sidebar-brand-sub">
            {plannerWorkspace ? 'Event planning workspace' : 'Platform operations'}
          </p>
        </div>
      </div>

      <div className="admin-sidebar-body">
        <nav className="p-3 space-y-1" aria-label="Admin navigation">
          {platformAdmin && (
            <>
              <span className="admin-nav-section">Commerce</span>
              {menuItems.map(renderNavItem)}
            </>
          )}

          {plannerWorkspace && (
            <>
              <span className={`admin-nav-section ${platformAdmin ? 'mt-2' : ''}`}>Planning</span>
              {plannerItems.map((item) => renderNavItem(item))}
              <span className="admin-nav-section mt-2">Events</span>
              {plannerEventItems.map((item) => renderNavItem(item, true))}
            </>
          )}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        {session ? (
          <div className="admin-sidebar-user" id="admin-sidebar-signed-in-user">
            <div className="admin-sidebar-user-avatar" aria-hidden>
              {session.initials}
            </div>
            <div className="admin-sidebar-user-meta min-w-0">
              <p className="admin-sidebar-user-name truncate">{session.displayName}</p>
              <p className="admin-sidebar-user-role">{session.roleLabel}</p>
              {session.detailLine ? (
                <p className="admin-sidebar-user-detail truncate">{session.detailLine}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="admin-role-badge">
            {plannerWorkspace
              ? 'Signed in as event planner'
              : platformAdmin
                ? 'Signed in as platform admin'
                : 'Workspace'}
          </p>
        )}
        <button type="button" onClick={onExitAdmin} className="admin-exit-btn" id="btn-admin-exit">
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          <span>{plannerWorkspace ? 'Back to site' : 'Exit admin'}</span>
        </button>
      </div>
    </aside>
  );
};
