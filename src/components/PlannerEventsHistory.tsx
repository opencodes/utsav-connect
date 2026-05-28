import React, { useMemo } from 'react';
import { History, Calendar, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePlannerMasterEvents } from '../hooks/usePlannerMasterEvents';
import {
  eventDateSortKey,
  formatEventDateShort,
  isEventPast,
  parseEventSummary,
} from '../plannerEventUtils';

export const PlannerEventsHistory: React.FC = () => {
  const { events, selectActiveEvent } = usePlannerMasterEvents();

  const sorted = useMemo(
    () => [...events].sort((a, b) => eventDateSortKey(b.date) - eventDateSortKey(a.date)),
    [events]
  );

  return (
    <div className="space-y-6 pb-12" id="planner-events-history-root">
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-stone-700 mb-4">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" aria-hidden />
            Event History
          </h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-600/10 text-orange-600">
            {events.length} total
          </span>
        </div>

        {sorted.length === 0 ? (
          <p className="text-center py-12 text-xs text-stone-500 font-bold">
            No events yet. Register one under Events → Create Event.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[32rem]">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-stone-500 border-b border-stone-100 dark:border-stone-700">
                  <th className="pb-2 pr-3 font-semibold">Event</th>
                  <th className="pb-2 pr-3 font-semibold">Date</th>
                  <th className="pb-2 pr-3 font-semibold hidden sm:table-cell">Type</th>
                  <th className="pb-2 pr-3 font-semibold hidden md:table-cell">Location</th>
                  <th className="pb-2 pr-3 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-700/80">
                {sorted.map((evt) => {
                  const summary = parseEventSummary(evt);
                  const past = isEventPast(evt.date);
                  return (
                    <tr key={evt.id} className="text-stone-800 dark:text-stone-200">
                      <td className="py-3 pr-3 font-semibold text-stone-900 dark:text-white">
                        {evt.name}
                        {evt.isActive ? (
                          <span className="ml-2 text-[9px] font-bold uppercase text-emerald-600">
                            Active
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3 text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-stone-600 dark:text-stone-400">
                          <Calendar className="w-3 h-3 text-orange-600 shrink-0" aria-hidden />
                          {formatEventDateShort(evt.date)}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-xs hidden sm:table-cell">
                        {summary.eventType ? (
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-orange-600" aria-hidden />
                            {summary.eventType}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 pr-3 text-xs hidden md:table-cell max-w-[12rem] truncate">
                        {summary.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-600 shrink-0" aria-hidden />
                            {summary.location}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
                            past
                              ? 'bg-stone-100 text-stone-500 dark:bg-stone-900 dark:text-stone-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400'
                          }`}
                        >
                          {past ? 'Past' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {evt.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                            In use
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => selectActiveEvent(evt.id)}
                            className="text-sm font-semibold text-orange-600 hover:underline cursor-pointer"
                          >
                            Set active
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
