import React from 'react';
import { Inbox } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  className = '',
}) => (
  <div
    className={`admin-card flex flex-col items-center justify-center text-center p-10 ${className}`}
    role="status"
  >
    <Inbox className="w-10 h-10 text-stone-300 dark:text-stone-600 mb-3" aria-hidden />
    <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">{title}</p>
    {description ? (
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">{description}</p>
    ) : null}
  </div>
);
