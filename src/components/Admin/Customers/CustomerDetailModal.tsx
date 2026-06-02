import React from 'react';

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

interface CustomerDetailModalProps {
  user: User | null;
  onClose: () => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  user,
  onClose,
  onToggleStatus,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-orange-100 dark:border-stone-700 shadow-2xl animate-in fade-in zoom-in-95 leading-relaxed text-left relative text-neutral-700 dark:text-neutral-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b pb-4 dark:border-stone-800">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl">
              🎖️
            </div>
            <div>
              <h4 className="font-extrabold text-stone-900 dark:text-white text-base font-sans">
                {user.name}
              </h4>
              <p className="text-xs text-stone-400 font-medium">Customer ID {user.id}</p>
            </div>
          </div>

          {/* Data points */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800">
              <span className="admin-stat-label">Wallet balance</span>
              <b className="text-sm font-semibold text-stone-900 dark:text-white mt-1 block">₹{user.wallet}</b>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border dark:border-stone-800">
              <span className="admin-stat-label">Loyalty points</span>
              <b className="text-sm font-semibold text-orange-600 mt-1 block">{user.loyalty} pts</b>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-semibold text-stone-600 dark:text-stone-300 text-sm">Activity</h5>
            <p className="text-stone-500 dark:text-stone-400 py-2">No activity recorded yet.</p>
          </div>

          {/* Controls */}
          <div className="pt-4 border-t dark:border-stone-800 flex gap-3 font-semibold text-xs">
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, user.status)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-xs transition-colors border cursor-pointer ${
                user.status === 'Active'
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
                  : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
              }`}
            >
              {user.status === 'Active' ? 'Restrict account' : 'Activate account'}
            </button>
            <button
              type="button"
              onClick={() => alert(`Credits Top-up of ₹500 pushed dynamically to user ${user.id}`)}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl transition cursor-pointer dark:bg-stone-800 dark:hover:bg-stone-700"
            >
              Add ₹500 credit
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
