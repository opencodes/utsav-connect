import React, { useState, useEffect } from 'react';
import { fetchAdminCustomers } from '../../../api/admin';
import { Search } from 'lucide-react';
import { CustomerTable } from './CustomerTable';
import { CustomerDetailModal } from './CustomerDetailModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: number;
  loyalty: number;
  status: string;
  orderCount: number;
  joined: string;
}

export const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void fetchAdminCustomers()
      .then((rows) =>
        setUsers(
          rows.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            wallet: 0,
            loyalty: 0,
            status: 'Active',
            orderCount: c.ordersCount,
            joined: c.customerType,
          }))
        )
      )
      .catch(() => setUsers([]));
  }, []);

  const sortedAndFiltered = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: string, current: string) => {
    const next = current === 'Active' ? 'Restricted' : 'Active';
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, status: next } : u));
    setUsers(updatedUsers);

    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: next });
    }
    alert(`User security level updated to ${next}.`);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-customers-tab">
      {/* 1. SEARCH CRITERIA CONTROL */}
      <div className="admin-card p-4 flex items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs text-left">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border bg-stone-50 dark:bg-stone-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C51C13] dark:border-stone-700 text-stone-900 dark:text-white"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" aria-hidden />
        </div>
        <span className="text-xs text-stone-500 hidden sm:inline">{users.length} customers</span>
      </div>

      {/* 2. CUSTOMER METADATA TABLE */}
      <CustomerTable users={sortedAndFiltered} onSelectUser={setSelectedUser} />

      {/* 3. PROFILE DETAILS INSPECTOR MODAL */}
      <CustomerDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
