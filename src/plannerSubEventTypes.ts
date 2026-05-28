export interface PlannerSubEventRitual {
  id: string;
  name: string;
  description: string;
  duration: string;
}

export interface PlannerSubEventChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface PlannerSubEventPurchaseItem {
  id: string;
  item: string;
  qty: string;
  category: string;
  purchased: boolean;
}

/** Purchase list category options (dropdown). */
export const PURCHASE_ITEM_CATEGORIES = [
  'Decor',
  'Food & catering',
  'Gifts & chuman',
  'Clothing',
  'Puja & ritual',
  'Transport',
  'Electronics',
  'Stationery',
  'Miscellaneous',
  'Other',
] as const;

export interface PlannerSubEvent {
  id: string;
  /** Master event this sub-event belongs to (planner workspace). */
  eventId?: string;
  name: string;
  /** ISO date (YYYY-MM-DD) for calendar scheduling */
  date: string;
  time: string;
  venue: string;
  notes: string;
  rituals: PlannerSubEventRitual[];
  checklist: PlannerSubEventChecklistItem[];
  purchaseItems: PlannerSubEventPurchaseItem[];
}

/** Legacy flat ritual row (pre-nested storage). */
export interface PlannerFlatRitual {
  id: string;
  name: string;
  description: string;
  duration: string;
  subEventId: string;
}

function asSubEvent(raw: unknown): PlannerSubEvent {
  const row = raw as Partial<PlannerSubEvent>;
  const rituals = Array.isArray(row.rituals)
    ? (row.rituals as PlannerSubEventRitual[]).map((r) => ({
        id: r.id ?? `rit-${Date.now()}`,
        name: r.name ?? '',
        description: r.description ?? '',
        duration: r.duration ?? '1 hour',
      }))
    : [];
  const checklist = Array.isArray(row.checklist)
    ? (row.checklist as PlannerSubEventChecklistItem[]).map((item) => ({
        id: item.id ?? `chk-${Date.now()}`,
        text: item.text ?? '',
        done: Boolean(item.done),
      }))
    : [];
  const purchaseItems = Array.isArray(row.purchaseItems)
    ? (row.purchaseItems as PlannerSubEventPurchaseItem[]).map((entry) => {
        const legacy = entry as PlannerSubEventPurchaseItem & { text?: string };
        return {
          id: legacy.id ?? `pur-${Date.now()}`,
          item: legacy.item ?? legacy.text ?? '',
          qty: legacy.qty ?? '',
          category: legacy.category ?? '',
          purchased: Boolean(legacy.purchased),
        };
      })
    : [];
  return {
    id: row.id ?? `sub-${Date.now()}`,
    eventId: typeof row.eventId === 'string' ? row.eventId : undefined,
    name: row.name ?? '',
    date: row.date ?? '',
    time: row.time ?? '',
    venue: row.venue ?? '',
    notes: row.notes ?? '',
    rituals,
    checklist,
    purchaseItems,
  };
}

/** Sub-events shown on the active master event itinerary. */
export function filterSubEventsForMasterEvent(
  subEvents: PlannerSubEvent[],
  masterEventId: string | undefined
): PlannerSubEvent[] {
  if (!masterEventId) {
    return subEvents.filter((s) => !s.eventId);
  }
  return subEvents.filter((s) => !s.eventId || s.eventId === masterEventId);
}

/** Replace sub-events for one master event while keeping others. */
export function mergeSubEventsForMasterEvent(
  allSubEvents: PlannerSubEvent[],
  masterEventId: string,
  forMaster: PlannerSubEvent[]
): PlannerSubEvent[] {
  const others = allSubEvents.filter((s) => s.eventId && s.eventId !== masterEventId);
  const tagged = forMaster.map((s) => ({ ...s, eventId: masterEventId }));
  return [...others, ...tagged];
}

/** Merge nested + legacy flat rituals into sub-events with `date` default. */
export function normalizeSubEventsFromStorage(
  rawSubEvents: unknown[],
  rawFlatRituals: unknown[] = []
): PlannerSubEvent[] {
  const subs = rawSubEvents.map(asSubEvent);
  const byId = new Map(subs.map((s) => [s.id, s]));

  for (const raw of rawFlatRituals) {
    const rit = raw as Partial<PlannerFlatRitual>;
    if (!rit.id || !rit.name) continue;
    const subId = rit.subEventId;
    if (!subId || subId === 'unmapped') continue;
    const sub = byId.get(subId);
    if (!sub) continue;
    if (sub.rituals.some((r) => r.id === rit.id)) continue;
    sub.rituals.push({
      id: rit.id,
      name: rit.name,
      description: rit.description ?? '',
      duration: rit.duration ?? '1 hour',
    });
  }

  return subs;
}

export function flattenRitualsFromSubEvents(subEvents: PlannerSubEvent[]): PlannerFlatRitual[] {
  return subEvents.flatMap((sub) =>
    sub.rituals.map((rit) => ({
      ...rit,
      subEventId: sub.id,
    }))
  );
}

export function countRitualsInSubEvents(subEvents: PlannerSubEvent[]): number {
  return subEvents.reduce((n, sub) => n + sub.rituals.length, 0);
}

export function formatSubEventDate(dateStr: string): string {
  if (!dateStr) return 'Date TBD';
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  const last = day % 10;
  if (last === 1) return 'st';
  if (last === 2) return 'nd';
  if (last === 3) return 'rd';
  return 'th';
}

/** Long day heading for itinerary views, e.g. "Friday, 22nd May". */
export function formatDayHeading(dateStr: string): string {
  if (!dateStr) return 'Unscheduled';
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  const weekday = parsed.toLocaleDateString(undefined, { weekday: 'long' });
  const day = parsed.getDate();
  const month = parsed.toLocaleDateString(undefined, { month: 'long' });
  return `${weekday}, ${day}${ordinalSuffix(day)} ${month}`;
}

/** Sub-event title with date, e.g. "Udyog Marabthatti - Wednesday, 20th May". */
export function formatSubEventDisplayName(name: string, dateStr: string): string {
  const label = name.trim();
  if (!dateStr?.trim()) return label || 'Sub event';
  const dateLabel = formatDayHeading(dateStr);
  if (!label) return dateLabel;
  return `${label} - ${dateLabel}`;
}

export function formatCompactDateRange(dates: string[]): string {
  const sorted = [...dates]
    .filter(Boolean)
    .map((d) => new Date(`${d}T12:00:00`))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (sorted.length === 0) return 'No dates';
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' });
  if (sorted.length === 1) return fmt(sorted[0]);
  return `${fmt(sorted[0])} – ${fmt(sorted[sorted.length - 1])}`;
}

export type SubEventsByDay = {
  dateKey: string;
  heading: string;
  items: PlannerSubEvent[];
};

export function groupSubEventsByDay(subEvents: PlannerSubEvent[]): SubEventsByDay[] {
  const map = new Map<string, PlannerSubEvent[]>();
  for (const sub of subEvents) {
    const key = sub.date?.trim() || '__unscheduled__';
    const list = map.get(key) ?? [];
    list.push(sub);
    map.set(key, list);
  }

  const groups: SubEventsByDay[] = [];
  for (const [dateKey, items] of map.entries()) {
    items.sort((a, b) => subEventSortKey(a) - subEventSortKey(b));
    groups.push({
      dateKey,
      heading: dateKey === '__unscheduled__' ? 'Unscheduled' : formatDayHeading(dateKey),
      items,
    });
  }

  return groups.sort((a, b) => {
    if (a.dateKey === '__unscheduled__') return 1;
    if (b.dateKey === '__unscheduled__') return -1;
    return subEventSortKey(a.items[0]) - subEventSortKey(b.items[0]);
  });
}

export function subEventSortKey(sub: PlannerSubEvent): number {
  const datePart = sub.date ? new Date(`${sub.date}T12:00:00`).getTime() : 0;
  const timePart = sub.time ? sub.time.replace(':', '') : '0000';
  return datePart * 10000 + Number(timePart);
}
