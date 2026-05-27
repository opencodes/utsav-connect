import { apiRequest } from './client';
import { PLANNER_STORAGE_KEYS } from '../plannerStorage';

export type PlannerWorkspace = {
  events?: unknown[];
  subEvents?: unknown[];
  rituals?: unknown[];
  guests?: unknown[];
  vendors?: unknown[];
  feast?: unknown[];
  misc?: unknown[];
  bartan?: unknown[];
  cylinders?: unknown[];
  expenses?: unknown[];
  chuman?: unknown[];
  budgetLimit?: number;
  estVillagers?: number;
  estRelatives?: number;
};

export async function fetchPlannerWorkspace(): Promise<PlannerWorkspace> {
  const data = await apiRequest<{ workspace: PlannerWorkspace }>('/planner/workspace', {
    auth: true,
  });
  return data.workspace ?? {};
}

export async function savePlannerWorkspace(workspace: PlannerWorkspace): Promise<PlannerWorkspace> {
  const data = await apiRequest<{ workspace: PlannerWorkspace }>('/planner/workspace', {
    method: 'PUT',
    auth: true,
    body: workspace,
  });
  return data.workspace ?? workspace;
}

/** Copy API workspace into planner localStorage keys (UI still reads localStorage). */
export function applyPlannerWorkspaceToStorage(workspace: PlannerWorkspace): void {
  const pairs: [string, unknown][] = [
    [PLANNER_STORAGE_KEYS.events, workspace.events ?? []],
    [PLANNER_STORAGE_KEYS.subEvents, workspace.subEvents ?? []],
    [PLANNER_STORAGE_KEYS.rituals, workspace.rituals ?? []],
    [PLANNER_STORAGE_KEYS.guests, workspace.guests ?? []],
    [PLANNER_STORAGE_KEYS.vendors, workspace.vendors ?? []],
    [PLANNER_STORAGE_KEYS.feast, workspace.feast ?? []],
    [PLANNER_STORAGE_KEYS.misc, workspace.misc ?? []],
    [PLANNER_STORAGE_KEYS.bartan, workspace.bartan ?? []],
    [PLANNER_STORAGE_KEYS.cylinders, workspace.cylinders ?? []],
    [PLANNER_STORAGE_KEYS.expenses, workspace.expenses ?? []],
    [PLANNER_STORAGE_KEYS.chuman, workspace.chuman ?? []],
    [PLANNER_STORAGE_KEYS.budgetLimit, workspace.budgetLimit ?? 0],
    [PLANNER_STORAGE_KEYS.estVillagers, workspace.estVillagers ?? 0],
    [PLANNER_STORAGE_KEYS.estRelatives, workspace.estRelatives ?? 0],
  ];

  for (const [key, value] of pairs) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
}

export function readPlannerWorkspaceFromStorage(): PlannerWorkspace {
  const read = (key: string) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  };

  return {
    events: read(PLANNER_STORAGE_KEYS.events) ?? [],
    subEvents: read(PLANNER_STORAGE_KEYS.subEvents) ?? [],
    rituals: read(PLANNER_STORAGE_KEYS.rituals) ?? [],
    guests: read(PLANNER_STORAGE_KEYS.guests) ?? [],
    vendors: read(PLANNER_STORAGE_KEYS.vendors) ?? [],
    feast: read(PLANNER_STORAGE_KEYS.feast) ?? [],
    misc: read(PLANNER_STORAGE_KEYS.misc) ?? [],
    bartan: read(PLANNER_STORAGE_KEYS.bartan) ?? [],
    cylinders: read(PLANNER_STORAGE_KEYS.cylinders) ?? [],
    expenses: read(PLANNER_STORAGE_KEYS.expenses) ?? [],
    chuman: read(PLANNER_STORAGE_KEYS.chuman) ?? [],
    budgetLimit: Number(read(PLANNER_STORAGE_KEYS.budgetLimit) ?? 0),
    estVillagers: Number(read(PLANNER_STORAGE_KEYS.estVillagers) ?? 0),
    estRelatives: Number(read(PLANNER_STORAGE_KEYS.estRelatives) ?? 0),
  };
}
