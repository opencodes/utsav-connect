import React, { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import {
  createRootAdmin,
  fetchRootAdmins,
  updateRootAdmin,
  type RootAdminRow,
} from '../../../api/platform';
import { AdminEmptyState } from '../AdminEmptyState';

export const RootAdminUsers: React.FC = () => {
  const [admins, setAdmins] = useState<RootAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    void fetchRootAdmins()
      .then(setAdmins)
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createRootAdmin({
        username: form.username,
        password: form.password,
        name: form.name,
        email: form.email || undefined,
      });
      setForm({ username: '', password: '', name: '', email: '' });
      setShowCreate(false);
      load();
    } catch {
      alert('Could not create admin. Username may already exist or password is too short.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (admin: RootAdminRow) => {
    setSaving(true);
    try {
      await updateRootAdmin(admin.id, { active: !admin.active });
      load();
    } catch {
      alert('Could not update admin status.');
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (admin: RootAdminRow) => {
    const next = window.prompt(`New password for ${admin.username} (min 8 characters):`);
    if (!next || next.length < 8) {
      if (next !== null) alert('Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      await updateRootAdmin(admin.id, { password: next });
      alert('Password updated.');
    } catch {
      alert('Could not reset password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left" id="root-admin-users-tab">
      <div className="admin-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Admin users</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Create platform admins with username and password. They sign in at{' '}
            <code className="text-xs">/platform/sign-in</code> to open the operations workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="admin-icon-btn" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="admin-btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create admin
          </button>
        </div>
      </div>

      {loading ? (
        <AdminEmptyState title="Loading admin accounts…" />
      ) : admins.length === 0 ? (
        <AdminEmptyState
          title="No admin users yet"
          description="Create the first admin account for your operations team."
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 dark:bg-stone-900/80 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-4 py-3 font-mono text-xs">{admin.username}</td>
                  <td className="px-4 py-3">{admin.name}</td>
                  <td className="px-4 py-3 text-stone-500">{admin.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        admin.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {admin.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void resetPassword(admin)}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      Reset password
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void toggleActive(admin)}
                      className="text-xs text-stone-600 hover:underline"
                    >
                      {admin.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form onSubmit={handleCreate} className="admin-card w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white">New admin user</h3>
            <div>
              <label className="text-xs font-semibold text-stone-600">Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
                required
                pattern="[a-zA-Z0-9._-]+"
                title="Letters, numbers, dots, underscores, hyphens"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Display name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
                required
                minLength={8}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="admin-btn-primary flex-1">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 text-sm border rounded-xl dark:border-stone-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
