import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Plus, Trash2, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import {
  PLANNER_STORAGE_KEYS,
  loadPlannerEventsBundle,
  writePlannerStorage,
} from '../plannerStorage';

interface Ritual {
  id: string;
  name: string;
  description: string;
  duration: string;
  subEventId: string; // mapped sub-event (can be empty / 'unmapped')
}

interface SubEvent {
  id: string;
  name: string;
  time: string;
  venue: string;
  notes: string;
}

interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  isActive: boolean;
}

let initialEventsBundle: ReturnType<typeof loadPlannerEventsBundle> | undefined;

function getInitialEventsBundle() {
  if (!initialEventsBundle) {
    initialEventsBundle = loadPlannerEventsBundle();
  }
  return initialEventsBundle;
}

export const PlannerEvents: React.FC = () => {
  const persistReady = useRef(false);

  const [events, setEvents] = useState<WeddingEvent[]>(
    () => getInitialEventsBundle().events as WeddingEvent[]
  );

  const [subEvents, setSubEvents] = useState<SubEvent[]>(
    () => getInitialEventsBundle().subEvents as SubEvent[]
  );

  const [rituals, setRituals] = useState<Ritual[]>(
    () => getInitialEventsBundle().rituals as Ritual[]
  );

  useEffect(() => {
    persistReady.current = true;
  }, []);

  const activeEvent = events.find((e) => e.isActive) ?? events[0] ?? null;
  const [eventDraft, setEventDraft] = useState(() => ({
    name: activeEvent?.name ?? '',
    date: activeEvent?.date ?? '',
    description: activeEvent?.description ?? '',
  }));

  useEffect(() => {
    const next = events.find((e) => e.isActive) ?? events[0] ?? null;
    setEventDraft({
      name: next?.name ?? '',
      date: next?.date ?? '',
      description: next?.description ?? '',
    });
  }, [events]);

  // Event states
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Sub-event states
  const [newSubName, setNewSubName] = useState('');
  const [newSubTime, setNewSubTime] = useState('');
  const [newSubVenue, setNewSubVenue] = useState('');
  const [newSubNotes, setNewSubNotes] = useState('');

  // Ritual states
  const [newRitName, setNewRitName] = useState('');
  const [newRitDesc, setNewRitDesc] = useState('');
  const [newRitDuration, setNewRitDuration] = useState('1 hour');
  const [newRitSubId, setNewRitSubId] = useState('unmapped');

  useEffect(() => {
    if (!persistReady.current) return;
    writePlannerStorage(PLANNER_STORAGE_KEYS.events, events);
  }, [events]);

  useEffect(() => {
    if (!persistReady.current) return;
    writePlannerStorage(PLANNER_STORAGE_KEYS.subEvents, subEvents);
  }, [subEvents]);

  useEffect(() => {
    if (!persistReady.current) return;
    writePlannerStorage(PLANNER_STORAGE_KEYS.rituals, rituals);
  }, [rituals]);

  // Handle Event Add
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;
    const newEvt: WeddingEvent = {
      id: `evt-${Date.now()}`,
      name: newEventName,
      date: newEventDate,
      description: newEventDesc,
      isActive: events.length === 0,
    };
    setEvents([...events, newEvt]);
    setNewEventName('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  // Toggle active event context
  const selectActiveEvent = (id: string) => {
    setEvents(events.map(e => ({ ...e, isActive: e.id === id })));
  };

  const handleDeleteEvent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvents(events.filter(e => e.id !== id));
  };

  // Handle Sub-Event Add
  const handleAddSubEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubTime || !newSubVenue) return;
    const newSub: SubEvent = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      time: newSubTime,
      venue: newSubVenue,
      notes: newSubNotes,
    };
    setSubEvents([...subEvents, newSub]);
    setNewSubName('');
    setNewSubTime('');
    setNewSubVenue('');
    setNewSubNotes('');
  };

  const handleDeleteSubEvent = (id: string) => {
    setSubEvents(subEvents.filter(s => s.id !== id));
    // Reset mapped rituals
    setRituals(rituals.map(rit => rit.subEventId === id ? { ...rit, subEventId: 'unmapped' } : rit));
  };

  // Handle Ritual Add
  const handleAddRitual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRitName) return;
    const newRit: Ritual = {
      id: `rit-${Date.now()}`,
      name: newRitName,
      description: newRitDesc,
      duration: newRitDuration,
      subEventId: newRitSubId,
    };
    setRituals([...rituals, newRit]);
    setNewRitName('');
    setNewRitDesc('');
    setNewRitDuration('1 hour');
    setNewRitSubId('unmapped');
  };

  // Map Ritual to specific sub-event later
  const handleUpdateRitualMapping = (ritId: string, subId: string) => {
    setRituals(rituals.map(rit => rit.id === ritId ? { ...rit, subEventId: subId } : rit));
  };

  const handleDeleteRitual = (id: string) => {
    setRituals(rituals.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 pb-12" id="planner-events-root">
      {/* Event details */}
      {activeEvent && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" aria-hidden />
                Event details
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                This is the active event used across planner tabs (stored locally for now).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                Event name
              </label>
              <input
                type="text"
                value={eventDraft.name}
                onChange={(e) => setEventDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={eventDraft.date}
                onChange={(e) => setEventDraft((d) => ({ ...d, date: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
              Notes / location / type
            </label>
            <textarea
              value={eventDraft.description}
              onChange={(e) => setEventDraft((d) => ({ ...d, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white min-h-[88px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEvents((prev) =>
                  prev.map((e) =>
                    e.id === activeEvent.id
                      ? { ...e, name: eventDraft.name, date: eventDraft.date, description: eventDraft.description }
                      : e
                  )
                );
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold cursor-pointer"
            >
              Save event
            </button>
          </div>
        </div>
      )}

      {/* Grid of Event Creation & Event Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Write Event Forms */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Create Master Event</span>
          </h2>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Event Name</label>
              <input
                type="text"
                placeholder="e.g. Traditional Wedding Ceremonies"
                value={newEventName}
                onChange={e => setNewEventName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Execution Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">Brief Description / Objective</label>
              <textarea
                placeholder="Describe key logistics or visual cues..."
                value={newEventDesc}
                onChange={e => setNewEventDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 focus:ring-1 focus:ring-orange-600 focus:outline-none bg-stone-50 dark:bg-stone-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register Event</span>
            </button>
          </form>
        </div>

        {/* Master Directory List */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 mb-4">
              Registered Master Events
            </h2>

            {events.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <AlertCircle className="w-8 h-8 mx-auto text-orange-650 opacity-60 mb-2" />
                <p className="text-xs font-bold">No active events registered.</p>
                <p className="text-[10px]">Prepare a master template using the left form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => selectActiveEvent(evt.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      evt.isActive
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                        : 'border-stone-200 dark:border-stone-700 hover:border-orange-500 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900 dark:text-white">{evt.name}</h3>
                          {evt.isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500 text-white font-semibold font-mono">
                              ACTIVE CONTEXT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{evt.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-600/10 text-orange-655 font-mono text-xs font-bold shrink-0">
                          {evt.date}
                        </span>
                        <button
                          onClick={(e) => handleDeleteEvent(evt.id, e)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-105"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 text-[11px] text-stone-400 italic">
            💡 Selecting an event updates the focus scope for sub-events and guest planning metrics dynamically.
          </div>
        </div>
      </div>

      {/* Sub-Events section & Ritual coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-stone-200 dark:border-stone-700/60 pt-8">
        
        {/* Sub-Events Manager */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-700">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Sub-Events & Timelines</span>
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 bg-orange-600/10 text-orange-600 font-bold rounded-full">
              {subEvents.length} Active Tracks
            </span>
          </div>

          {/* Form to add sub-event */}
          <form onSubmit={handleAddSubEvent} className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl space-y-3.5">
            <span className="text-[10px] font-mono font-bold text-orange-600 block">Add sub-event</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Sub-event name (e.g., Baraat, Sangeet)"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="time"
                  value={newSubTime}
                  onChange={e => setNewSubTime(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Specify venue or hall area"
                value={newSubVenue}
                onChange={e => setNewSubVenue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Logistics Notes (catering, decorators review)"
                value={newSubNotes}
                onChange={e => setNewSubNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub-Event</span>
            </button>
          </form>

          {/* List sub-events */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {subEvents.length === 0 ? (
              <p className="text-center text-stone-400 py-6 text-xs font-bold">No sub-events planned yet.</p>
            ) : (
              subEvents.map((sub) => (
                <div key={sub.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:bg-stone-50/50 flex items-start justify-between gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <b className="text-xs text-stone-900 dark:text-white font-semibold tracking-tight">{sub.name}</b>
                      <span className="font-mono text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {sub.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span>{sub.venue}</span>
                    </div>
                    {sub.notes && (
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 italic">Note: {sub.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubEvent(sub.id)}
                    className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rituals & Ceremonies Management */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-700">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Rituals & Traditional Ceremonies</span>
            </h2>
            <span className="font-mono text-[9px] px-2 py-0.5 bg-orange-600/10 text-orange-600 font-bold rounded-full">
              {rituals.length} Total
            </span>
          </div>

          {/* Form to add rituals */}
          <form onSubmit={handleAddRitual} className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl space-y-3.5">
            <span className="text-[10px] font-mono font-bold text-orange-600 block">Add ritual or puja</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ritual / Ceremony name"
                value={newRitName}
                onChange={e => setNewRitName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
                required
              />
              <select
                value={newRitDuration}
                onChange={e => setNewRitDuration(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white font-bold"
              >
                <option value="30 mins">30 minutes</option>
                <option value="45 mins">45 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1.5 hours">1.5 hours</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours+">3 hours +</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Short ceremony details or items required"
                value={newRitDesc}
                onChange={e => setNewRitDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white"
              />
              <div>
                <label className="block text-[9px] font-bold text-stone-500 mb-1">Link to sub-event</label>
                <select
                  value={newRitSubId}
                  onChange={e => setNewRitSubId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-orange-600 text-stone-900 dark:text-white font-mono"
                >
                  <option value="unmapped">⏳ Keep Unmapped (Standard rituals shelf)</option>
                  {subEvents.map(sub => (
                    <option key={sub.id} value={sub.id}>📅 {sub.name} (at {sub.time})</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Ritual</span>
            </button>
          </form>

          {/* List of rituals with dynamic mapping capability */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {rituals.length === 0 ? (
              <p className="text-center text-stone-400 py-6 text-xs font-bold">No rituals registered yet.</p>
            ) : (
              rituals.map((rit) => {
                const mappedSub = subEvents.find(s => s.id === rit.subEventId);
                return (
                  <div key={rit.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:bg-stone-50/50 flex flex-col justify-between gap-2 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <b className="text-xs text-orange-600 font-semibold tracking-tight">{rit.name}</b>
                          <span className="font-mono text-[9px] bg-stone-100 dark:bg-stone-900 px-1.5 py-0.2 rounded text-stone-600 dark:text-stone-400">
                             ⏱️ {rit.duration}
                          </span>
                        </div>
                        {rit.description && (
                          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">{rit.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteRitual(rit.id)}
                        className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded shrink-0 self-start"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Mapping Select Dropdown */}
                    <div className="mt-1 flex items-center justify-between gap-2 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-lg">
                      <span className="text-[9px] font-bold text-stone-400">Sub-event:</span>
                      <select
                        value={rit.subEventId}
                        onChange={e => handleUpdateRitualMapping(rit.id, e.target.value)}
                        className="text-[10px] bg-white dark:bg-stone-800 border dark:border-stone-700 rounded px-1.5 py-0.5 max-w-[170px] font-mono text-stone-800 dark:text-stone-200"
                      >
                        <option value="unmapped">Unmapped (Vedic Shelf)</option>
                        {subEvents.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
