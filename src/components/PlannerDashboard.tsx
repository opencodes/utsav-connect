import React, { useMemo } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ListTodo,
  Flame,
  IndianRupee,
  Truck,
  ChefHat,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { PLANNER_STORAGE_KEYS, purgeLegacyPlannerSeedData, readPlannerStorage } from '../plannerStorage';

interface PlannerEvent {
  id: string;
  name: string;
  date: string;
  description?: string;
  isActive?: boolean;
}

interface PlannerGuest {
  rsvpStatus?: string;
  familyCount?: number;
}

interface PlannerExpense {
  cost?: number;
}

function daysUntil(dateIso: string): number | null {
  if (!dateIso) return null;
  const target = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

interface PlannerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const PlannerDashboard: React.FC<PlannerDashboardProps> = ({ onNavigateTab }) => {
  const snapshot = useMemo(() => {
    purgeLegacyPlannerSeedData();
    const events = readPlannerStorage<PlannerEvent[]>(PLANNER_STORAGE_KEYS.events, []);
    const active = events.find((e) => e.isActive) ?? events[0] ?? null;
    const guests = readPlannerStorage<PlannerGuest[]>(PLANNER_STORAGE_KEYS.guests, []);
    const subEvents = readPlannerStorage<unknown[]>(PLANNER_STORAGE_KEYS.subEvents, []);
    const rituals = readPlannerStorage<unknown[]>(PLANNER_STORAGE_KEYS.rituals, []);
    const vendors = readPlannerStorage<unknown[]>(PLANNER_STORAGE_KEYS.vendors, []);
    const feast = readPlannerStorage<unknown[]>(PLANNER_STORAGE_KEYS.feast, []);
    const expenses = readPlannerStorage<PlannerExpense[]>(PLANNER_STORAGE_KEYS.expenses, []);
    const budgetLimit = parseFloat(
      window.localStorage.getItem(PLANNER_STORAGE_KEYS.budgetLimit) ?? '0'
    );

    const confirmedGuests = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
    const pendingGuests = guests.filter((g) => g.rsvpStatus === 'Pending').length;
    const spent = expenses.reduce((sum, e) => sum + (e.cost ?? 0), 0);
    const budgetPct = budgetLimit > 0 ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0;

    return {
      active,
      daysLeft: active?.date ? daysUntil(active.date) : null,
      confirmedGuests,
      pendingGuests,
      subEventCount: subEvents.length,
      ritualCount: rituals.length,
      vendorCount: vendors.length,
      feastCount: feast.length,
      spent,
      budgetLimit,
      budgetPct,
    };
  }, []);

  const quickLinks = [
    { tab: 'planner-events', label: 'Event details', icon: Calendar },
    { tab: 'planner-guests', label: 'Guests & RSVP', icon: Users },
    { tab: 'planner-feast', label: 'Feast & catering', icon: ChefHat },
    { tab: 'planner-vendors', label: 'Vendors', icon: Truck },
    { tab: 'planner-budget', label: 'Budget & expenses', icon: IndianRupee },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="planner-dashboard-tab">
      <div className="admin-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C51C13] mb-1">
            <LayoutDashboard className="w-4 h-4" aria-hidden />
            <span className="text-xs font-semibold">Planner overview</span>
          </div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
            {snapshot.active?.name ?? 'Your event'}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            {snapshot.active?.description ||
              'Summary of guests, schedule, vendors, and budget from your saved planner data.'}
          </p>
        </div>
        {snapshot.active?.date && (
          <div className="flex items-center gap-3 shrink-0 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-4 py-3">
            <Clock className="w-5 h-5 text-orange-600" aria-hidden />
            <div>
              <p className="text-xs text-stone-500">Event date</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-white">
                {new Date(`${snapshot.active.date}T00:00:00`).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              {snapshot.daysLeft !== null && (
                <p className="text-xs text-orange-600 font-medium mt-0.5">
                  {snapshot.daysLeft > 0
                    ? `${snapshot.daysLeft} days to go`
                    : snapshot.daysLeft === 0
                      ? 'Today'
                      : `${Math.abs(snapshot.daysLeft)} days ago`}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab('planner-guests')}
          className="admin-card p-4 text-left hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors cursor-pointer"
        >
          <span className="admin-stat-label">Confirmed guests</span>
          <p className="admin-stat-value">{snapshot.confirmedGuests}</p>
          <span className="text-xs text-stone-500">{snapshot.pendingGuests} pending RSVP</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('planner-events')}
          className="admin-card p-4 text-left hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors cursor-pointer"
        >
          <span className="admin-stat-label">Sub-events</span>
          <p className="admin-stat-value">{snapshot.subEventCount}</p>
          <span className="text-xs text-stone-500">{snapshot.ritualCount} rituals mapped</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('planner-vendors')}
          className="admin-card p-4 text-left hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors cursor-pointer"
        >
          <span className="admin-stat-label">Vendors</span>
          <p className="admin-stat-value">{snapshot.vendorCount}</p>
          <span className="text-xs text-stone-500">{snapshot.feastCount} feast plans</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('planner-budget')}
          className="admin-card p-4 text-left hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors cursor-pointer"
        >
          <span className="admin-stat-label">Budget used</span>
          <p className="admin-stat-value">{snapshot.budgetPct}%</p>
          <span className="text-xs text-stone-500">
            ₹{snapshot.spent.toLocaleString('en-IN')} of ₹{snapshot.budgetLimit.toLocaleString('en-IN')}
          </span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="admin-card lg:col-span-2 p-5 space-y-4">
          <h3 className="text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-orange-600" aria-hidden />
            Planning checklist
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              {
                done: snapshot.subEventCount > 0,
                label: 'Add sub-events and venues',
                tab: 'planner-events',
              },
              {
                done: snapshot.confirmedGuests > 0,
                label: 'Confirm guest RSVPs',
                tab: 'planner-guests',
              },
              {
                done: snapshot.feastCount > 0,
                label: 'Plan feast menus',
                tab: 'planner-feast',
              },
              {
                done: snapshot.vendorCount > 0,
                label: 'Book vendors',
                tab: 'planner-vendors',
              },
              {
                done: snapshot.spent > 0,
                label: 'Track expenses against budget',
                tab: 'planner-budget',
              },
            ].map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onNavigateTab(item.tab)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border border-stone-200 dark:border-stone-700 px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.done ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-600'
                      }`}
                      aria-hidden
                    />
                    <span className="text-stone-800 dark:text-stone-200">{item.label}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card p-5 space-y-3">
          <h3 className="text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600" aria-hidden />
            Quick links
          </h3>
          <div className="space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.tab}
                  type="button"
                  onClick={() => onNavigateTab(link.tab)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-stone-200/80 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-[#C51C13] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden />
                    {link.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" aria-hidden />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
