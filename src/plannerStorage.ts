/** Planner localStorage — synced to API when authenticated. */

import { getApiToken } from './api/config';
import {
  flattenRitualsFromSubEvents,
  normalizeSubEventsFromStorage,
  type PlannerSubEvent,
} from './plannerSubEventTypes';

let plannerSaveTimer: ReturnType<typeof setTimeout> | null = null;

/** IDs from legacy `plannerSeed.ts` demo rows. */
const PLANNER_DEMO_IDS = new Set([
  'evt-1',
  'evt-2',
  'evt-3',
  'sub-1',
  'sub-2',
  'sub-3',
  'rit-1',
  'rit-2',
  'rit-3',
  'gst-1',
  'gst-2',
  'gst-3',
  'gst-4',
  'chu-1',
  'chu-2',
  'chu-3',
  'chu-4',
  'exp-1',
  'exp-2',
  'exp-3',
  'exp-4',
  'exp-5',
]);

export const PLANNER_STORAGE_KEYS = {
  events: 'utsav_planner_events',
  subEvents: 'utsav_planner_sub_events',
  rituals: 'utsav_planner_rituals',
  guests: 'utsav_planner_guests',
  vendors: 'utsav_planner_vendors',
  feast: 'utsav_planner_feast',
  misc: 'utsav_planner_misc',
  bartan: 'utsav_planner_bartan',
  cylinders: 'utsav_planner_cylinders',
  expenses: 'utsav_planner_expenses',
  chuman: 'utsav_planner_chuman',
  budgetLimit: 'utsav_planner_budget_limit',
  estVillagers: 'utsav_planner_est_villagers',
  estRelatives: 'utsav_planner_est_relatives',
} as const;

const ARRAY_KEYS = [
  PLANNER_STORAGE_KEYS.events,
  PLANNER_STORAGE_KEYS.subEvents,
  PLANNER_STORAGE_KEYS.rituals,
  PLANNER_STORAGE_KEYS.guests,
  PLANNER_STORAGE_KEYS.vendors,
  PLANNER_STORAGE_KEYS.feast,
  PLANNER_STORAGE_KEYS.misc,
  PLANNER_STORAGE_KEYS.bartan,
  PLANNER_STORAGE_KEYS.cylinders,
  PLANNER_STORAGE_KEYS.expenses,
  PLANNER_STORAGE_KEYS.chuman,
] as const;

function hasDemoId(item: unknown): boolean {
  if (!item || typeof item !== 'object') return false;
  const id = (item as { id?: string }).id;
  return typeof id === 'string' && PLANNER_DEMO_IDS.has(id);
}

/** Remove legacy demo rows from a planner array key; drops key if empty. */
function stripDemoRowsFromKey(key: string): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;
    if (!parsed.some(hasDemoId)) return false;

    const kept = parsed.filter((item) => !hasDemoId(item));
    if (kept.length === 0) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(kept));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Strip seeded demo planner data still sitting in localStorage from earlier builds.
 * Returns storage keys that were modified.
 */
export function purgeLegacyPlannerSeedData(): string[] {
  const modified: string[] = [];
  for (const key of ARRAY_KEYS) {
    if (stripDemoRowsFromKey(key)) {
      modified.push(key);
    }
  }
  return modified;
}

/** Purge demo rows, then read planner events / sub-events / rituals together. */
export function loadPlannerEventsBundle(): {
  events: unknown[];
  subEvents: unknown[];
  rituals: unknown[];
} {
  purgeLegacyPlannerSeedData();
  const rawSubEvents = readPlannerStorage(PLANNER_STORAGE_KEYS.subEvents, []);
  const rawRituals = readPlannerStorage(PLANNER_STORAGE_KEYS.rituals, []);
  const subEvents = normalizeSubEventsFromStorage(rawSubEvents, rawRituals);
  return {
    events: readPlannerStorage(PLANNER_STORAGE_KEYS.events, []),
    subEvents,
    rituals: flattenRitualsFromSubEvents(subEvents),
  };
}

export function readPlannerStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writePlannerStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode / quota
  }
  schedulePlannerApiSave();
}

/** Write sub-events (+ flat rituals) to localStorage and debounced API sync. */
export function persistPlannerSubEventsLocal(subEvents: PlannerSubEvent[]): void {
  writePlannerStorage(PLANNER_STORAGE_KEYS.subEvents, subEvents);
  writePlannerStorage(PLANNER_STORAGE_KEYS.rituals, flattenRitualsFromSubEvents(subEvents));
}

/** Save sub-events to MongoDB via planner workspace API (requires sign-in). */
export async function persistPlannerSubEventsToDatabase(
  subEvents: PlannerSubEvent[]
): Promise<void> {
  const rituals = flattenRitualsFromSubEvents(subEvents);
  try {
    window.localStorage.setItem(PLANNER_STORAGE_KEYS.subEvents, JSON.stringify(subEvents));
    window.localStorage.setItem(PLANNER_STORAGE_KEYS.rituals, JSON.stringify(rituals));
  } catch {
    // private mode / quota
  }

  if (!getApiToken()) {
    schedulePlannerApiSave();
    return;
  }

  if (plannerSaveTimer) {
    clearTimeout(plannerSaveTimer);
    plannerSaveTimer = null;
  }

  const { readPlannerWorkspaceFromStorage, savePlannerWorkspace } = await import('./api/planner');
  const workspace = readPlannerWorkspaceFromStorage();
  await savePlannerWorkspace({
    ...workspace,
    subEvents,
    rituals,
  });
}

function schedulePlannerApiSave(): void {
  if (!getApiToken()) return;
  if (plannerSaveTimer) clearTimeout(plannerSaveTimer);
  plannerSaveTimer = setTimeout(() => {
    plannerSaveTimer = null;
    void import('./api/planner')
      .then(({ readPlannerWorkspaceFromStorage, savePlannerWorkspace }) =>
        savePlannerWorkspace(readPlannerWorkspaceFromStorage())
      )
      .catch(() => {
        // offline / token expired — local copy remains
      });
  }, 900);
}

/** Load workspace from API into localStorage (call after planner sign-in). */
export async function hydratePlannerFromApi(): Promise<void> {
  if (!getApiToken()) return;
  const { fetchPlannerWorkspace, applyPlannerWorkspaceToStorage } = await import('./api/planner');
  const workspace = await fetchPlannerWorkspace();
  applyPlannerWorkspaceToStorage(workspace);
}
