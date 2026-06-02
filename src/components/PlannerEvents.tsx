import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  ListPlus,
  ListChecks,
  ShoppingCart,
  Route,
  Pencil,
  UserPlus,
} from 'lucide-react';
import {
  hydratePlannerFromApi,
  loadPlannerEventsBundle,
  persistPlannerSubEventsLocal,
  persistPlannerSubEventsToDatabase,
} from '../plannerStorage';
import {
  filterSubEventsForMasterEvent,
  formatCompactDateRange,
  formatSubEventDisplayName,
  mergeSubEventsForMasterEvent,
  normalizeSubEventsFromStorage,
  PURCHASE_ITEM_CATEGORIES,
  subEventSortKey,
  type PlannerSubEvent,
} from '../plannerSubEventTypes';
import { getApiToken } from '../api/config';
import { usePlannerMasterEvents } from '../hooks/usePlannerMasterEvents';
import { plannerForm } from '../plannerFormClasses';
import { parseEventSummary } from '../plannerEventUtils';
import { PlannerEventDetailsBar } from './PlannerEventDetailsBar';

function memberInitials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const PlannerEvents: React.FC = () => {
  const persistReady = useRef(false);
  const { activeEvent, updateEvent } = usePlannerMasterEvents();
  const [showMasterEdit, setShowMasterEdit] = useState(false);

  const [allSubEvents, setAllSubEvents] = useState<PlannerSubEvent[]>(() => {
    const bundle = loadPlannerEventsBundle();
    return normalizeSubEventsFromStorage(
      bundle.subEvents as unknown[],
      bundle.rituals as unknown[]
    );
  });
  const [subEventSaveError, setSubEventSaveError] = useState<string | null>(null);
  const [isSavingSubEvent, setIsSavingSubEvent] = useState(false);

  const [collapsedSubEvents, setCollapsedSubEvents] = useState<Set<string>>(new Set());
  const [addChecklistDraft, setAddChecklistDraft] = useState<Record<string, string>>({});
  const [addPurchaseDraft, setAddPurchaseDraft] = useState<
    Record<string, { item: string; qty: string; category: string }>
  >({});
  const [editingSubheadingId, setEditingSubheadingId] = useState<string | null>(null);
  const [subheadingDraft, setSubheadingDraft] = useState<Record<string, string>>({});

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickDate, setQuickDate] = useState('');
  const [quickTime, setQuickTime] = useState('');
  const [quickVenue, setQuickVenue] = useState('');

  const [ritualDrafts, setRitualDrafts] = useState<
    Record<string, { name: string; duration: string }>
  >({});
  const [showRitualAddFor, setShowRitualAddFor] = useState<Set<string>>(new Set());

  useEffect(() => {
    persistReady.current = true;
  }, []);

  useEffect(() => {
    if (!getApiToken()) return;
    let cancelled = false;
    void (async () => {
      try {
        await hydratePlannerFromApi();
        if (cancelled) return;
        const bundle = loadPlannerEventsBundle();
        setAllSubEvents(
          normalizeSubEventsFromStorage(
            bundle.subEvents as unknown[],
            bundle.rituals as unknown[]
          )
        );
      } catch {
        // keep local copy
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeEvent?.date && !quickDate) {
      setQuickDate(activeEvent.date);
    }
  }, [activeEvent?.date, quickDate]);

  useEffect(() => {
    if (!persistReady.current) return;
    persistPlannerSubEventsLocal(allSubEvents);
  }, [allSubEvents]);

  const subEvents = useMemo(
    () => filterSubEventsForMasterEvent(allSubEvents, activeEvent?.id),
    [allSubEvents, activeEvent?.id]
  );

  const setSubEventsForActive = (
    updater: (prev: PlannerSubEvent[]) => PlannerSubEvent[]
  ) => {
    setAllSubEvents((prevAll) => {
      const visible = filterSubEventsForMasterEvent(prevAll, activeEvent?.id);
      const nextVisible = updater(visible);
      if (!activeEvent?.id) return nextVisible;
      return mergeSubEventsForMasterEvent(prevAll, activeEvent.id, nextVisible);
    });
  };

  const sortedSubEvents = useMemo(
    () => [...subEvents].sort((a, b) => subEventSortKey(a) - subEventSortKey(b)),
    [subEvents]
  );

  const dateRangeLabel = useMemo(() => {
    const dates = subEvents.map((s) => s.date).filter(Boolean);
    if (dates.length > 0) return formatCompactDateRange(dates);
    if (activeEvent?.date) return formatCompactDateRange([activeEvent.date]);
    return 'Pick dates';
  }, [subEvents, activeEvent?.date]);

  const activeSummary = activeEvent ? parseEventSummary(activeEvent) : null;

  const toggleSubEvent = (subId: string) => {
    setCollapsedSubEvents((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) next.delete(subId);
      else next.add(subId);
      return next;
    });
  };

  const updateSubEventNotes = (subId: string, notes: string) => {
    setSubEventsForActive((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, notes } : s))
    );
  };

  const startEditSubheading = (sub: PlannerSubEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubheadingId(sub.id);
    setSubheadingDraft((prev) => ({ ...prev, [sub.id]: sub.notes }));
  };

  const saveSubheading = (subId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateSubEventNotes(subId, subheadingDraft[subId] ?? '');
    setEditingSubheadingId(null);
  };

  const cancelSubheadingEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubheadingId(null);
  };

  const handleQuickAddSubEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;
    if (!quickName.trim() || !quickDate || !quickTime || !quickVenue.trim()) return;
    const sub: PlannerSubEvent = {
      id: `sub-${Date.now()}`,
      eventId: activeEvent.id,
      name: quickName.trim(),
      date: quickDate,
      time: quickTime,
      venue: quickVenue.trim(),
      notes: '',
      rituals: [],
      checklist: [],
      purchaseItems: [],
    };
    const nextAll = mergeSubEventsForMasterEvent(allSubEvents, activeEvent.id, [
      ...subEvents,
      sub,
    ]);
    setAllSubEvents(nextAll);
    setSubEventSaveError(null);
    setIsSavingSubEvent(true);
    try {
      await persistPlannerSubEventsToDatabase(nextAll);
      setQuickName('');
      setQuickTime('');
      setQuickVenue('');
      setShowQuickAdd(false);
    } catch {
      setSubEventSaveError(
        getApiToken()
          ? 'Could not save sub-event. Check your connection and try again.'
          : 'Sign in as an event planner to save sub-events to your account.'
      );
    } finally {
      setIsSavingSubEvent(false);
    }
  };

  const handleAddChecklistItem = (subId: string) => {
    const text = (addChecklistDraft[subId] ?? '').trim();
    if (!text) return;
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              checklist: [
                ...sub.checklist,
                { id: `chk-${Date.now()}`, text, done: false },
              ],
            }
          : sub
      )
    );
    setAddChecklistDraft((prev) => ({ ...prev, [subId]: '' }));
  };

  const handleToggleChecklistItem = (subId: string, itemId: string) => {
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              checklist: sub.checklist.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : sub
      )
    );
  };

  const handleDeleteChecklistItem = (subId: string, itemId: string) => {
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, checklist: sub.checklist.filter((item) => item.id !== itemId) }
          : sub
      )
    );
  };

  const handleAddPurchaseItem = (subId: string) => {
    const draft = addPurchaseDraft[subId] ?? { item: '', qty: '', category: '' };
    const itemName = draft.item.trim();
    if (!itemName) return;
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              purchaseItems: [
                ...sub.purchaseItems,
                {
                  id: `pur-${Date.now()}`,
                  item: itemName,
                  qty: draft.qty.trim() || '1',
                  category: draft.category.trim(),
                  purchased: false,
                },
              ],
            }
          : sub
      )
    );
    setAddPurchaseDraft((prev) => ({
      ...prev,
      [subId]: { item: '', qty: '', category: '' },
    }));
  };

  const updatePurchaseDraft = (
    subId: string,
    field: 'item' | 'qty' | 'category',
    value: string
  ) => {
    setAddPurchaseDraft((prev) => ({
      ...prev,
      [subId]: {
        item: prev[subId]?.item ?? '',
        qty: prev[subId]?.qty ?? '',
        category: prev[subId]?.category ?? '',
        [field]: value,
      },
    }));
  };

  const handleTogglePurchaseItem = (subId: string, itemId: string) => {
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              purchaseItems: sub.purchaseItems.map((item) =>
                item.id === itemId ? { ...item, purchased: !item.purchased } : item
              ),
            }
          : sub
      )
    );
  };

  const handleDeletePurchaseItem = (subId: string, itemId: string) => {
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              purchaseItems: sub.purchaseItems.filter((item) => item.id !== itemId),
            }
          : sub
      )
    );
  };

  const handleAddRitual = (subId: string) => {
    const draft = ritualDrafts[subId] ?? { name: '', duration: '1 hour' };
    if (!draft.name.trim()) return;
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              rituals: [
                ...sub.rituals,
                {
                  id: `rit-${Date.now()}`,
                  name: draft.name.trim(),
                  description: '',
                  duration: draft.duration,
                },
              ],
            }
          : sub
      )
    );
    setRitualDrafts((prev) => ({ ...prev, [subId]: { name: '', duration: '1 hour' } }));
  };

  const openRitualAdd = (subId: string) => {
    setShowRitualAddFor((prev) => new Set(prev).add(subId));
  };

  const closeRitualAdd = (subId: string) => {
    setShowRitualAddFor((prev) => {
      const next = new Set(prev);
      next.delete(subId);
      return next;
    });
  };

  const handleDeleteSub = (id: string) => {
    setSubEventsForActive((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteRitual = (subId: string, ritId: string) => {
    setSubEventsForActive((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, rituals: sub.rituals.filter((r) => r.id !== ritId) }
          : sub
      )
    );
  };

  const eventTitle = activeEvent?.name ?? 'Event details';
  const heroInitials = memberInitials(eventTitle);

  return (
    <div className="pb-12 planner-itinerary" id="planner-events-root">
      <article className="planner-event-panel">
      <header className="planner-event-hero">
        <div className="planner-event-hero-banner">
          <button
            type="button"
            className="planner-event-hero-edit"
            title={showMasterEdit ? 'Close edit' : 'Edit event details'}
            aria-label={showMasterEdit ? 'Close edit' : 'Edit event details'}
            aria-pressed={showMasterEdit}
            disabled={!activeEvent}
            onClick={() => activeEvent && setShowMasterEdit((v) => !v)}
          >
            <Pencil className="w-4 h-4" aria-hidden />
          </button>
        </div>
        <div className="planner-event-hero-card">
          <div className="min-w-0">
            <h1 className="planner-itinerary-title">{eventTitle}</h1>
            <p className="planner-itinerary-range" title="Event dates">
              <Calendar className="w-4 h-4 text-stone-400 shrink-0" aria-hidden />
              <span>{dateRangeLabel}</span>
            </p>
            {activeSummary &&
            (activeSummary.location || activeSummary.eventType) ? (
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 truncate max-w-md">
                {[activeSummary.eventType, activeSummary.location].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          
        </div>
      </header>

      <div className="planner-event-panel-body">
      {!activeEvent ? (
        <p className="text-sm text-stone-500 mb-6">
          No active master event. Register one under Events → Create Event.
        </p>
      ) : null}
      {showMasterEdit && activeEvent ? (
        <div className="planner-event-hero-edit-panel">
          <PlannerEventDetailsBar
            embedded
            activeEvent={activeEvent}
            onSave={(patch) => {
              updateEvent(activeEvent.id, patch);
              setShowMasterEdit(false);
            }}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 mb-6">
        
        <button
          type="button"
          className="text-sm font-medium text-sky-700 dark:text-sky-400 inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          onClick={() => setShowQuickAdd((v) => !v)}
        >
          <ListPlus className="w-4 h-4" aria-hidden />
          {showQuickAdd ? 'Hide quick add' : 'Add Sub Event'}
        </button>
      </div>

      {showQuickAdd ? (
        <form
          onSubmit={handleQuickAddSubEvent}
          className="planner-itinerary-quick-add space-y-3"
        >
          <p className={plannerForm.kicker}>Quick add sub-event</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={plannerForm.label}>Name</label>
              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className={plannerForm.input}
                placeholder="e.g. Sangeet evening"
                required
              />
            </div>
            <div>
              <label className={plannerForm.label}>Date</label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className={`${plannerForm.input} cursor-pointer`}
                required
              />
            </div>
            <div>
              <label className={plannerForm.label}>Time</label>
              <input
                type="time"
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className={plannerForm.input}
                required
              />
            </div>
            <div>
              <label className={plannerForm.label}>Venue</label>
              <input
                type="text"
                value={quickVenue}
                onChange={(e) => setQuickVenue(e.target.value)}
                className={plannerForm.input}
                placeholder="Venue or location"
                required
              />
            </div>
          </div>
          {subEventSaveError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {subEventSaveError}
            </p>
          ) : null}
          <button
            type="submit"
            className={plannerForm.btnPrimary}
            disabled={isSavingSubEvent || !activeEvent}
          >
            <Plus className="w-4 h-4" aria-hidden />
            {isSavingSubEvent ? 'Saving…' : 'Add Sub Event'}
          </button>
        </form>
      ) : null}

      {sortedSubEvents.length === 0 ? (
        <div className="planner-itinerary-empty">
          <button
            type="button"
            className="planner-btn planner-itinerary-empty-btn"
            onClick={() => setShowQuickAdd(true)}
            disabled={!activeEvent}
            title={activeEvent ? 'Add a sub-event to this itinerary' : 'Create a master event first'}
          >
            <Plus className="w-4 h-4" aria-hidden />
            Add Sub Event
          </button>
        </div>
      ) : (
        sortedSubEvents.map((sub) => {
          const isCollapsed = collapsedSubEvents.has(sub.id);
          const accordionTitle = formatSubEventDisplayName(sub.name, sub.date);
          return (
            <section key={sub.id} className="planner-itinerary-day">
              <div className="planner-itinerary-day-toolbar">
                <button
                  type="button"
                  className="planner-itinerary-day-head flex-1 min-w-0"
                  onClick={() => toggleSubEvent(sub.id)}
                  aria-expanded={!isCollapsed}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 shrink-0 text-stone-400" aria-hidden />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-stone-400" aria-hidden />
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <h2 className="planner-itinerary-day-title">{accordionTitle}</h2>
                    {editingSubheadingId === sub.id ? (
                      <div
                        className="mt-2 flex flex-wrap items-center gap-2 max-w-md"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder="Add subheading"
                          value={subheadingDraft[sub.id] ?? ''}
                          onChange={(e) =>
                            setSubheadingDraft((prev) => ({
                              ...prev,
                              [sub.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              saveSubheading(sub.id);
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setEditingSubheadingId(null);
                            }
                          }}
                          className={`${plannerForm.input} flex-1 min-w-[12rem]`}
                          autoFocus
                        />
                        <button
                          type="button"
                          className={plannerForm.btnPrimary}
                          onClick={(e) => saveSubheading(sub.id, e)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className={plannerForm.btnSecondary}
                          onClick={cancelSubheadingEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : sub.notes?.trim() ? (
                      <button
                        type="button"
                        className="planner-itinerary-subheading-display mt-1 block w-full max-w-md text-left text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
                        onClick={(e) => startEditSubheading(sub, e)}
                      >
                        {sub.notes}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="planner-itinerary-subheading-add mt-1 text-sm text-stone-400 hover:text-orange-700 dark:hover:text-orange-400 cursor-pointer"
                        onClick={(e) => startEditSubheading(sub, e)}
                      >
                        Add subheading
                      </button>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSub(sub.id)}
                  className="p-2 mt-0.5 text-stone-400 hover:text-red-600 cursor-pointer shrink-0"
                  aria-label={`Delete ${accordionTitle}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden />
                </button>
              </div>

              {!isCollapsed ? (
                <div className="planner-itinerary-day-body">
                    <div className="planner-itinerary-sub-block">
                      <div className="planner-itinerary-activity">
                          {sub.venue && sub.venue.trim() !== sub.name.trim() ? (
                            <h3 className="text-base font-bold text-stone-900 dark:text-white">
                              {sub.venue}
                            </h3>
                          ) : null}
                          <div className="flex flex-wrap gap-3 mt-3 text-sm text-sky-700 dark:text-sky-400">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden />
                              {sub.time || 'Set time'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" aria-hidden />
                              {sub.venue}
                            </span>
                          </div>

                          <div className="planner-itinerary-section planner-itinerary-rituals">
                            <h3 className="planner-itinerary-section-head">
                              <Sparkles className="planner-itinerary-section-head-icon" aria-hidden />
                              Rituals
                              {sub.rituals.length > 0 ? ` (${sub.rituals.length})` : ''}
                            </h3>
                            {sub.rituals.length > 0 ? (
                              <>
                                {sub.rituals.map((rit) => (
                                  <div
                                    key={rit.id}
                                    className="planner-itinerary-ritual flex justify-between gap-2"
                                  >
                                    <div>
                                      <span className="font-semibold text-orange-700 dark:text-orange-400">
                                        {rit.name}
                                      </span>
                                      <span className="text-stone-500 ml-2">{rit.duration}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRitual(sub.id, rit.id)}
                                      className="text-stone-400 hover:text-red-600 cursor-pointer"
                                      aria-label={`Remove ${rit.name}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" aria-hidden />
                                    </button>
                                  </div>
                                ))}
                              </>
                            ) : null}

                            {showRitualAddFor.has(sub.id) ? (
                              <div className="space-y-2 mt-2">
                                <div className="flex flex-wrap gap-2 items-end">
                                  <input
                                    type="text"
                                    placeholder="Ritual or puja name"
                                    value={ritualDrafts[sub.id]?.name ?? ''}
                                    onChange={(e) =>
                                      setRitualDrafts((prev) => ({
                                        ...prev,
                                        [sub.id]: {
                                          name: e.target.value,
                                          duration: prev[sub.id]?.duration ?? '1 hour',
                                        },
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddRitual(sub.id);
                                      }
                                    }}
                                    className={`${plannerForm.input} flex-1 min-w-[10rem]`}
                                    autoFocus
                                  />
                                  <select
                                    value={ritualDrafts[sub.id]?.duration ?? '1 hour'}
                                    onChange={(e) =>
                                      setRitualDrafts((prev) => ({
                                        ...prev,
                                        [sub.id]: {
                                          name: prev[sub.id]?.name ?? '',
                                          duration: e.target.value,
                                        },
                                      }))
                                    }
                                    className={`${plannerForm.select} w-[8.5rem]`}
                                  >
                                    <option value="30 mins">30 min</option>
                                    <option value="1 hour">1 hour</option>
                                    <option value="2 hours">2 hours</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleAddRitual(sub.id)}
                                    className={plannerForm.btnPrimary}
                                  >
                                    Add
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
                                  onClick={() => closeRitualAdd(sub.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`planner-itinerary-rituals-empty${sub.rituals.length > 0 ? ' planner-itinerary-rituals-empty--compact' : ''}`}
                              >
                                <button
                                  type="button"
                                  className="planner-btn planner-itinerary-empty-btn"
                                  onClick={() => openRitualAdd(sub.id)}
                                >
                                  <Plus className="w-4 h-4" aria-hidden />
                                  Add ritual
                                </button>
                              </div>
                            )}
                          </div>
                      </div>
                    </div>

                  <div className="planner-itinerary-section planner-itinerary-checklist-add">
                    <h3 className="planner-itinerary-section-head">
                      <ListChecks className="planner-itinerary-section-head-icon" aria-hidden />
                      Checklist
                      {sub.checklist.length > 0 ? ` (${sub.checklist.length})` : ''}
                    </h3>
                    {sub.checklist.length > 0 ? (
                      <ul className="mb-3 space-y-0 planner-itinerary-checklist">
                        {sub.checklist.map((item) => (
                          <li
                            key={item.id}
                            className="planner-itinerary-checklist-item flex items-start gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => handleToggleChecklistItem(sub.id, item.id)}
                              className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                              aria-label={`Mark "${item.text}" done`}
                            />
                            <span
                              className={
                                item.done
                                  ? 'flex-1 text-stone-400 line-through'
                                  : 'flex-1 text-stone-700 dark:text-stone-200'
                              }
                            >
                              {item.text}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteChecklistItem(sub.id, item.id)}
                              className="text-stone-400 hover:text-red-600 cursor-pointer shrink-0"
                              aria-label={`Remove checklist item ${item.text}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="planner-itinerary-add-bar">
                      <input
                        type="text"
                        placeholder="Add checklist item"
                        value={addChecklistDraft[sub.id] ?? ''}
                        onChange={(e) =>
                          setAddChecklistDraft((prev) => ({
                            ...prev,
                            [sub.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddChecklistItem(sub.id);
                          }
                        }}
                        className={plannerForm.input}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem(sub.id)}
                        className={plannerForm.btnSecondary}
                        aria-label="Add checklist item"
                      >
                        <Plus className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="planner-itinerary-section planner-itinerary-purchases-add">
                    <h3 className="planner-itinerary-section-head">
                      <ShoppingCart className="planner-itinerary-section-head-icon" aria-hidden />
                      Purchase items
                      {sub.purchaseItems.length > 0 ? ` (${sub.purchaseItems.length})` : ''}
                    </h3>
                    <div className="planner-itinerary-purchase-table">
                      <div className="planner-itinerary-purchase-row planner-itinerary-purchase-head">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Category</span>
                        <span className="sr-only">Add</span>
                      </div>
                      {sub.purchaseItems.map((purchase) => (
                        <div
                          key={purchase.id}
                          className={`planner-itinerary-purchase-row text-sm${purchase.purchased ? ' planner-itinerary-purchase-row--done' : ''}`}
                        >
                          <div className="planner-itinerary-purchase-item-cell">
                            <input
                              type="checkbox"
                              checked={purchase.purchased}
                              onChange={() => handleTogglePurchaseItem(sub.id, purchase.id)}
                              className="planner-itinerary-purchase-check rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer shrink-0"
                              aria-label={`Mark "${purchase.item}" purchased`}
                            />
                            <span className="planner-itinerary-purchase-cell planner-itinerary-purchase-cell--item min-w-0">
                              {purchase.item}
                            </span>
                          </div>
                          <span className="planner-itinerary-purchase-cell planner-itinerary-purchase-cell--qty">
                            {purchase.qty}
                          </span>
                          <span className="planner-itinerary-purchase-cell planner-itinerary-purchase-cell--category">
                            {purchase.category || '—'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePurchaseItem(sub.id, purchase.id)}
                            className="planner-itinerary-purchase-delete text-stone-400 hover:text-red-600 cursor-pointer"
                            aria-label={`Remove ${purchase.item}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden />
                          </button>
                        </div>
                      ))}
                      <div className="planner-itinerary-purchase-row planner-itinerary-purchase-add">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={addPurchaseDraft[sub.id]?.item ?? ''}
                          onChange={(e) => updatePurchaseDraft(sub.id, 'item', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPurchaseItem(sub.id);
                            }
                          }}
                          className={plannerForm.input}
                        />
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Qty"
                          value={addPurchaseDraft[sub.id]?.qty ?? ''}
                          onChange={(e) => updatePurchaseDraft(sub.id, 'qty', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPurchaseItem(sub.id);
                            }
                          }}
                          className={plannerForm.input}
                        />
                        <select
                          value={addPurchaseDraft[sub.id]?.category ?? ''}
                          onChange={(e) =>
                            updatePurchaseDraft(sub.id, 'category', e.target.value)
                          }
                          className={`${plannerForm.select} planner-itinerary-purchase-category-select`}
                          aria-label="Category"
                        >
                          <option value="">Category</option>
                          {PURCHASE_ITEM_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleAddPurchaseItem(sub.id)}
                          className={plannerForm.btnSecondary}
                          aria-label="Add purchase item"
                        >
                          <Plus className="w-4 h-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          );
        })
      )}
      </div>
      </article>
    </div>
  );
};
