import React from 'react';
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  Users,
  Megaphone,
  ArrowLeft,
  Calendar,
  ChefHat,
  Truck,
  IndianRupee,
  Gift,
} from 'lucide-react';
import { APP_NAME } from '../../../brand';

interface AdminSidebarProps {
  currentAdminTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  /** Event planners only see the Mithila planner tools (not commerce admin). */
  plannerWorkspace?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentAdminTab,
  onSelectTab,
  onExitAdmin,
  plannerWorkspace = false,
}) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurants', name: 'Products & Stores', icon: Store },
    { id: 'orders', name: 'Order Logs', icon: ClipboardList },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'marketing', name: 'Marketing', icon: Megaphone },
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

  const renderNavItem = (item: { id: string; name: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    const isActive = currentAdminTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelectTab(item.id)}
        className="admin-nav-item"
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
          {!plannerWorkspace && (
            <>
              <span className="admin-nav-section">Commerce</span>
              {menuItems.map(renderNavItem)}
            </>
          )}

          <span className={`admin-nav-section ${plannerWorkspace ? '' : 'mt-2'}`}>
            {plannerWorkspace ? 'Planning' : 'Event planner'}
          </span>
          {plannerItems.map(renderNavItem)}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <p className="admin-role-badge">
          {plannerWorkspace ? 'Signed in as event planner' : 'Signed in as administrator'}
        </p>
        <button type="button" onClick={onExitAdmin} className="admin-exit-btn" id="btn-admin-exit">
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          <span>{plannerWorkspace ? 'Back to site' : 'Exit admin'}</span>
        </button>
      </div>
    </aside>
  );
};
