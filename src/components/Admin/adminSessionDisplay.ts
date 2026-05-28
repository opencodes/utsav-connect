import type { PlatformUser } from '../../api/platform';

export type AdminSessionDisplay = {
  displayName: string;
  roleLabel: string;
  detailLine: string;
  initials: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return '??';
}

export function buildAdminSessionDisplay(opts: {
  plannerWorkspace?: boolean;
  platformUser?: PlatformUser | null;
  userProfile?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}): AdminSessionDisplay {
  const { plannerWorkspace, platformUser, userProfile } = opts;

  if (platformUser?.role === 'root' || platformUser?.role === 'admin') {
    const name = platformUser.name?.trim() || platformUser.username;
    return {
      displayName: name,
      roleLabel: platformUser.role === 'root' ? 'Root administrator' : 'Platform admin',
      detailLine: platformUser.email?.trim() || platformUser.username,
      initials: initialsFromName(name),
    };
  }

  if (plannerWorkspace && userProfile) {
    const name = userProfile.name?.trim() || 'Event planner';
    const email = userProfile.email?.trim();
    const phone = userProfile.phone?.trim();
    return {
      displayName: name,
      roleLabel: 'Event planner',
      detailLine: email || phone || 'Customer account',
      initials: initialsFromName(name),
    };
  }

  return {
    displayName: 'Admin',
    roleLabel: 'Workspace',
    detailLine: 'Signed in',
    initials: 'AD',
  };
}
