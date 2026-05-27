import React from 'react';
import { Target, Percent, Megaphone, Star } from 'lucide-react';
import type { MarketingCampaign } from '../../../types';

interface MarketingStatsProps {
  campaigns: MarketingCampaign[];
}

export const MarketingStats: React.FC<MarketingStatsProps> = ({ campaigns }) => {
  const active = campaigns.filter((c) => c.status === 'Active').length;
  const scheduled = campaigns.filter((c) => c.status === 'Scheduled').length;

  const stats = [
    {
      label: 'Total campaigns',
      value: String(campaigns.length),
      icon: Percent,
      iconClass: 'from-orange-600 to-orange-700',
      iconWrap: true,
    },
    {
      label: 'Active now',
      value: String(active),
      icon: Target,
      iconClass: 'text-red-600',
      iconWrap: false,
    },
    {
      label: 'Scheduled',
      value: String(scheduled),
      icon: Megaphone,
      iconClass: 'text-green-700',
      iconWrap: false,
    },
    {
      label: 'Avg. performance',
      value:
        campaigns.length === 0
          ? '—'
          : `${Math.round(campaigns.reduce((s, c) => s + c.performance, 0) / campaigns.length)}%`,
      icon: Star,
      iconClass: 'text-orange-600',
      iconWrap: false,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="marketing-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="admin-card p-4 flex items-center justify-between gap-3">
            <div className="text-left min-w-0">
              <span className="admin-stat-label">{stat.label}</span>
              <b className="text-lg font-semibold text-stone-900 dark:text-white mt-1 block">{stat.value}</b>
            </div>
            {stat.iconWrap ? (
              <div className={`p-2 bg-gradient-to-tr ${stat.iconClass} rounded-lg text-white shrink-0`}>
                <Icon className="w-4 h-4" aria-hidden />
              </div>
            ) : (
              <Icon className={`w-5 h-5 shrink-0 ${stat.iconClass}`} aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
};
