import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  createAdminVendorCategory,
  deleteAdminVendorCategory,
  fetchAdminVendorCategories,
  updateAdminVendorCategory,
  type AdminVendorCategory,
} from '../../../api/admin';
import { AdminEmptyState } from '../AdminEmptyState';

export const AdminVendorCategories: React.FC = () => {
  const [categories, setCategories] = useState<AdminVendorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    void fetchAdminVendorCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) return;
    setSaving(true);
    try {
      await createAdminVendorCategory({
        id: newId.trim().toLowerCase().replace(/\s+/g, '-'),
        name: newName.trim(),
      });
      setNewId('');
      setNewName('');
      setShowAdd(false);
      load();
    } catch {
      alert('Could not create category. Check id format (lowercase, hyphens) and admin access.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateAdminVendorCategory(id, { name: editName.trim() });
      setEditingId(null);
      load();
    } catch {
      alert('Could not update category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}" (${id})? Vendors using it will keep the id until updated.`)) {
      return;
    }
    setSaving(true);
    try {
      await deleteAdminVendorCategory(id);
      load();
    } catch {
      alert('Could not delete category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-vendor-categories-tab">
      <div className="admin-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Vendor categories</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Categories shown on registration and marketplace browse pages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="admin-btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add category
        </button>
      </div>

      {loading ? (
        <AdminEmptyState title="Loading categories…" />
      ) : categories.length === 0 ? (
        <AdminEmptyState title="No categories" description="Add a category or refresh the page." />
      ) : (
        <div className="admin-card overflow-hidden">
          <ul className="divide-y divide-stone-100 dark:divide-stone-800">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 hover:bg-stone-50/80 dark:hover:bg-stone-900/40"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-stone-400">{cat.id}</p>
                  {editingId === cat.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1 w-full max-w-md px-3 py-1.5 text-sm border rounded-lg dark:bg-stone-900 dark:border-stone-700"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium text-stone-900 dark:text-white">{cat.name}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {editingId === cat.id ? (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleSaveEdit(cat.id)}
                        className="admin-btn-primary text-xs px-3 py-1.5"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 border rounded-lg dark:border-stone-700"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void handleDelete(cat.id, cat.name)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <form
            onSubmit={handleCreate}
            className="admin-card w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-stone-900 dark:text-white">New category</h3>
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                Id (slug)
              </label>
              <input
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. floral-decor"
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Lowercase letters, numbers, hyphens"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                Display name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Floral Decor"
                className="mt-1 w-full px-3 py-2 text-sm border rounded-xl dark:bg-stone-900 dark:border-stone-700"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="admin-btn-primary flex-1">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
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
