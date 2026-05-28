import React from 'react';
import { Users, Store, ArrowLeft } from 'lucide-react';
import type { AdminSessionDisplay } from '../adminSessionDisplay';

interface RootSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExit: () => void;
  onOpenAdminWorkspace?: () => void;
  session?: AdminSessionDisplay;
}

export const RootSidebar: React.FC<RootSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExit,
  onOpenAdminWorkspace,
  session,
}) => {
  const items = [
    { id: 'admin-users', name: 'Admin users', icon: Users },
    { id: 'admin-console', name: 'Operations console', icon: Store },
  ];

  return (
    <aside id="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-brand-inner">
          <p className="admin-sidebar-brand-title">Root console</p>
          <p className="admin-sidebar-brand-sub">Platform governance</p>
        </div>
      </div>

      <nav className="p-3 space-y-1" aria-label="Root navigation">
        <span className="admin-nav-section">Root</span>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'admin-console' && onOpenAdminWorkspace) {
                  onOpenAdminWorkspace();
                  return;
                }
                onSelectTab(item.id);
              }}
              className="admin-nav-item"
              data-active={isActive ? 'true' : 'false'}
            >
              <Icon aria-hidden />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        {session ? (
          <div className="admin-sidebar-user" id="root-sidebar-signed-in-user">
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
          <p className="admin-role-badge">Signed in as root</p>
        )}
        <button type="button" onClick={onExit} className="admin-exit-btn">
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
