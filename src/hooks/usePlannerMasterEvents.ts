import { useState, useEffect, useRef } from 'react';
import {
  PLANNER_STORAGE_KEYS,
  loadPlannerEventsBundle,
  writePlannerStorage,
} from '../plannerStorage';
import type { PlannerMasterEvent } from '../plannerEventUtils';

export function reloadPlannerMasterEventsFromStorage(): PlannerMasterEvent[] {
  return loadPlannerEventsBundle().events as PlannerMasterEvent[];
}

/** Master events list with localStorage persistence. Reloads from storage on each mount. */
export function usePlannerMasterEvents() {
  const persistReady = useRef(false);
  const [events, setEvents] = useState(() => reloadPlannerMasterEventsFromStorage());

  useEffect(() => {
    persistReady.current = true;
  }, []);

  useEffect(() => {
    if (!persistReady.current) return;
    writePlannerStorage(PLANNER_STORAGE_KEYS.events, events);
  }, [events]);

  const activeEvent = events.find((e) => e.isActive) ?? events[0] ?? null;

  const selectActiveEvent = (id: string) => {
    setEvents((prev) => prev.map((e) => ({ ...e, isActive: e.id === id })));
  };

  const addEvent = (input: { name: string; date: string; description: string }) => {
    setEvents((prev) => {
      const newEvt: PlannerMasterEvent = {
        id: `evt-${Date.now()}`,
        name: input.name,
        date: input.date,
        description: input.description,
        isActive: prev.length === 0,
      };
      return [...prev, newEvt];
    });
  };

  const updateEvent = (
    id: string,
    patch: Pick<PlannerMasterEvent, 'name' | 'date' | 'description'>
  ) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const removed = prev.find((e) => e.id === id);
      const next = prev.filter((e) => e.id !== id);
      if (next.length === 0) return next;
      if (!removed?.isActive) return next;
      return next.map((e, i) => ({ ...e, isActive: i === 0 }));
    });
  };

  return {
    events,
    setEvents,
    activeEvent,
    selectActiveEvent,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
