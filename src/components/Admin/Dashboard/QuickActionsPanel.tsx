import React from 'react';
import { Plus, ArrowUpRight, ExternalLink } from 'lucide-react';

interface QuickActionsPanelProps {
  onNavigateTab: (tab: string) => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onNavigateTab }) => {
  return (
    <div className="admin-card p-5 space-y-4">
      <h3 className="text-base font-semibold text-stone-900 dark:text-white border-b pb-3 border-stone-200 dark:border-stone-700 text-left">
        Quick actions
      </h3>

      <div className="space-y-2 text-left">
        <button
          onClick={() => onNavigateTab('restaurants')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-700 dark:text-stone-300 hover:text-orange-600 font-medium text-sm rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Add restaurant store</span>
          <Plus className="w-4 h-4 shrink-0 text-orange-600" />
        </button>

        <button
          onClick={() => onNavigateTab('vendor-approvals')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-700 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Review pending vendors</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-orange-600" />
        </button>

        <button
          onClick={() => onNavigateTab('marketing')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-700 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Create marketing campaign</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-orange-600" />
        </button>

        <button
          onClick={() => alert('All delivery partner logs downloaded to system workspace secure sector.')}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-orange-50 dark:bg-stone-900 dark:hover:bg-orange-950/20 text-stone-700 dark:text-stone-300 hover:text-orange-600 font-bold text-xs rounded-xl flex items-center justify-between border border-stone-200/50 dark:border-stone-800 cursor-pointer transition-all"
        >
          <span>Download delivery logs</span>
          <ExternalLink className="w-4 h-4 shrink-0 text-orange-600" />
        </button>
      </div>
    </div>
  );
};
