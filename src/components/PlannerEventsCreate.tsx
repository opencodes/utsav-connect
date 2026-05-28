import React, { useState } from 'react';
import { Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { usePlannerMasterEvents } from '../hooks/usePlannerMasterEvents';
import { parseEventSummary, formatEventDateShort } from '../plannerEventUtils';
import { plannerForm } from '../plannerFormClasses';

export const PlannerEventsCreate: React.FC = () => {
  const { events, addEvent, selectActiveEvent, deleteEvent } = usePlannerMasterEvents();

  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;
    addEvent({ name: newEventName, date: newEventDate, description: newEventDesc });
    setNewEventName('');
    setNewEventDate('');
    setNewEventDesc('');
  };

  return (
    <div className="space-y-6 pb-12" id="planner-events-create-root">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm space-y-6">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" aria-hidden />
            <span>Create Master Event</span>
          </h2>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className={plannerForm.label} htmlFor="planner-create-event-name">
                Event name
              </label>
              <input
                id="planner-create-event-name"
                type="text"
                placeholder="e.g. Traditional Wedding Ceremonies"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                className={plannerForm.input}
                required
              />
            </div>
            <div>
              <label className={plannerForm.label} htmlFor="planner-create-event-date">
                Execution date
              </label>
              <input
                id="planner-create-event-date"
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className={`${plannerForm.input} cursor-pointer`}
                required
              />
            </div>
            <div>
              <label className={plannerForm.label} htmlFor="planner-create-event-desc">
                Brief description
              </label>
              <textarea
                id="planner-create-event-desc"
                placeholder="Describe key logistics or visual cues..."
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                rows={3}
                className={plannerForm.textarea}
              />
            </div>
            <button type="submit" className={`${plannerForm.btnPrimary} w-full`}>
              <Plus className="w-4 h-4" aria-hidden />
              <span>Register Event</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-700 mb-4">
              Registered Master Events
            </h2>

            {events.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <AlertCircle className="w-8 h-8 mx-auto opacity-60 mb-2 text-orange-600" aria-hidden />
                <p className="text-sm font-medium">No events registered yet.</p>
                <p className="text-sm text-stone-500 mt-1">Use the form to register your first master event.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => {
                  const summary = parseEventSummary(evt);
                  const meta = [formatEventDateShort(evt.date), summary.eventType, summary.location]
                    .filter(Boolean)
                    .join(' · ');
                  return (
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
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-stone-900 dark:text-white">{evt.name}</h3>
                            {evt.isActive ? (
                              <span className="px-2 py-0.5 rounded text-xs bg-emerald-500 text-white font-semibold">
                                Active
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 truncate">
                            {meta || evt.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-2.5 py-1 rounded-lg bg-orange-600/10 text-orange-700 dark:text-orange-400 text-sm font-medium">
                            {formatEventDateShort(evt.date)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEvent(evt.id);
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
                            title="Delete event"
                            aria-label={`Delete ${evt.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <p className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 text-sm text-stone-500">
            Selecting an event sets the active context for Event details and other planner tabs.
          </p>
        </div>
      </div>
    </div>
  );
};
