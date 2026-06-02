import React from 'react';
import { AdminEmptyState } from '../AdminEmptyState';

interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface DiwaliAnalyticsChartProps {
  revenueTrend: RevenueTrendPoint[];
  activeSegment: 'revenue' | 'orders';
  setActiveSegment: (segment: 'revenue' | 'orders') => void;
}

export const DiwaliAnalyticsChart: React.FC<DiwaliAnalyticsChartProps> = ({
  revenueTrend,
  activeSegment,
  setActiveSegment,
}) => {
  const chartHeight = 160;
  const chartWidth = 500;
  const numDataPoints = revenueTrend.length;
  const hasChartData = numDataPoints >= 2;

  const pointsString = hasChartData
    ? revenueTrend
        .map((point, idx) => {
          const x = (idx / (numDataPoints - 1)) * chartWidth;
          const maxVal = 250000;
          const y = chartHeight - (point.revenue / maxVal) * chartHeight;
          return `${x},${y}`;
        })
        .join(' ')
    : '';

  const pointsOrdersString = hasChartData
    ? revenueTrend
        .map((point, idx) => {
          const x = (idx / (numDataPoints - 1)) * chartWidth;
          const maxVal = 900;
          const y = chartHeight - (point.orders / maxVal) * chartHeight;
          return `${x},${y}`;
        })
        .join(' ')
    : '';

  return (
    <div className="admin-card lg:col-span-2 p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-3 border-stone-200 dark:border-stone-700">
        <div className="text-left">
          <h3 className="text-base font-semibold text-stone-900 dark:text-white">
            Revenue & orders
          </h3>
          <p className="text-xs text-stone-500 font-medium">Last 7 days across active zones</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveSegment('revenue')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              activeSegment === 'revenue' ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-900 text-stone-400'
            }`}
          >
            Revenue trend (₹)
          </button>
          <button
            onClick={() => setActiveSegment('orders')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              activeSegment === 'orders' ? 'bg-orange-600 text-white' : 'bg-stone-100 dark:bg-stone-900 text-stone-400'
            }`}
          >
            Orders count
          </button>
        </div>
      </div>

      {!hasChartData ? (
        <AdminEmptyState
          title="No chart data yet"
          description="Revenue and order trends will display once activity is recorded."
          className="border-0 shadow-none bg-stone-50 dark:bg-stone-900/40"
        />
      ) : (
      <div className="relative pt-4 overflow-hidden rounded-xl">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
          {/* Back grid lines */}
          <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" />
          <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" />
          <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" />

          {/* Gradient def */}
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="primary" stopOpacity="0.4" />
              <stop offset="100%" stopColor="primary" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Solid Trend lines paths */}
          {activeSegment === 'revenue' ? (
            <>
              <path d={`M0,${chartHeight} L${pointsString} L${chartWidth},${chartHeight} Z`} fill="url(#chartGrad)" />
              <polyline fill="none" stroke="primary" strokeWidth="3.5" points={pointsString} className="animate-pulse" />
            </>
          ) : (
            <>
              <polyline fill="none" stroke="#E53935" strokeWidth="3.5" points={pointsOrdersString} />
            </>
          )}

          {/* Data points dots */}
          {revenueTrend.map((pt, index) => {
            const x = (index / (numDataPoints - 1)) * chartWidth;
            const y = chartHeight - (activeSegment === 'revenue' ? (pt.revenue / 250000) * chartHeight : (pt.orders / 900) * chartHeight);
            return (
              <g key={index} className="group cursor-pointer">
                <circle cx={x} cy={y} r="5" fill="secondary" stroke="#fff" strokeWidth="2" />
                <text x={x - 12} y={y - 10} className="text-[9px] font-mono leading-none fill-stone-600 dark:fill-stone-300 font-bold hidden group-hover:block bg-stone-900">
                  {activeSegment === 'revenue' ? `₹${pt.revenue / 1000}k` : `${pt.orders}p`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* X Axis labels */}
        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-400 mt-2 px-1">
          {revenueTrend.map((pt, i) => <span key={i}>{pt.date}</span>)}
        </div>
      </div>
      )}
    </div>
  );
};
