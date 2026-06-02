import React, { useCallback, useEffect, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import {
  fetchAdminVendors,
  updateAdminVendorStatus,
  type AdminVendorRow,
} from '../../../api/admin';
import { AdminEmptyState } from '../AdminEmptyState';
import { formatStateDistrict } from '../../../indiaLocations';

type StatusFilter = 'pending_review' | 'approved' | 'rejected' | '';

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function statusBadgeClass(status: string): string {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300';
  if (status === 'rejected') return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300';
  return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300';
}

export const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<AdminVendorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending_review');
  const [selected, setSelected] = useState<AdminVendorRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    void fetchAdminVendors({
      status: statusFilter || undefined,
      q: appliedQuery.trim() || undefined,
    })
      .then(setVendors)
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, [statusFilter, appliedQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (vendorId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    try {
      const updated = await updateAdminVendorStatus(vendorId, status);
      setVendors((prev) => prev.map((v) => (v.id === vendorId ? updated : v)));
      if (selected?.id === vendorId) setSelected(updated);
    } catch {
      alert('Could not update vendor status. Ensure you are signed in as admin.');
    } finally {
      setActionLoading(false);
    }
  };

  const locationLabel = (v: AdminVendorRow) => {
    if (v.state && v.district) return formatStateDistrict(v.state, v.district);
    return v.location || '—';
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-vendors-tab">
      <div className="admin-card p-5">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Vendor approvals</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Review new vendor registrations. Only approved vendors appear on the public marketplace.
        </p>
      </div>

      <div className="admin-card p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" aria-hidden />
          <input
            type="search"
            placeholder="Search name, email, phone, ID…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setAppliedQuery(searchQuery);
            }}
            className="w-full pl-9 pr-3 py-2 text-sm border bg-stone-50 dark:bg-stone-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:border-stone-700 text-stone-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['pending_review', 'Pending'],
              ['approved', 'Approved'],
              ['rejected', 'Rejected'],
              ['', 'All'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value || 'all'}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                statusFilter === value
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              {label}
            </button>
          ))}
          <button type="button" onClick={load} className="admin-btn-primary text-xs px-3 py-1.5">
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <AdminEmptyState title="Loading vendors…" />
      ) : vendors.length === 0 ? (
        <AdminEmptyState
          title="No vendors in this list"
          description="Try another status filter or search term."
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Business</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-900/40">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(v)}
                        className="font-medium text-stone-900 dark:text-white hover:text-orange-600 text-left"
                      >
                        {v.name}
                      </button>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">{v.id}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{v.category}</td>
                    <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{locationLabel(v)}</td>
                    <td className="px-4 py-3 text-stone-600 dark:text-stone-300">
                      <div>{v.contactEmail}</div>
                      <div className="text-xs text-stone-400">{v.contactPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass(v.status)}`}
                      >
                        {STATUS_LABELS[v.status] ?? v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.status !== 'approved' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleStatusChange(v.id, 'approved')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {v.status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => void handleStatusChange(v.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg ml-1"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Vendor details"
        >
          <div className="admin-card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-white">{selected.name}</h3>
                <p className="text-xs text-stone-500 font-mono">{selected.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-stone-400 hover:text-stone-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <dt className="text-stone-500 text-xs">Category</dt>
                <dd className="text-stone-900 dark:text-white">{selected.category}</dd>
              </div>
              <div>
                <dt className="text-stone-500 text-xs">Location</dt>
                <dd className="text-stone-900 dark:text-white">{locationLabel(selected)}</dd>
              </div>
              <div>
                <dt className="text-stone-500 text-xs">Contact</dt>
                <dd className="text-stone-900 dark:text-white">
                  {selected.contactName || '—'}
                  <br />
                  {selected.contactEmail}
                  <br />
                  {selected.contactPhone}
                </dd>
              </div>
              {selected.description ? (
                <div>
                  <dt className="text-stone-500 text-xs">Description</dt>
                  <dd className="text-stone-700 dark:text-stone-300">{selected.description}</dd>
                </div>
              ) : null}
            </dl>
            <div className="flex gap-2 pt-2">
              {selected.status !== 'approved' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => void handleStatusChange(selected.id, 'approved')}
                  className="admin-btn-primary flex-1"
                >
                  Approve vendor
                </button>
              )}
              {selected.status !== 'rejected' && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => void handleStatusChange(selected.id, 'rejected')}
                  className="flex-1 py-2 text-sm font-medium border border-red-200 text-red-700 rounded-xl hover:bg-red-50"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
