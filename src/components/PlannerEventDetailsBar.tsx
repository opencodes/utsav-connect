import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Pencil, X, Check } from 'lucide-react';
import {
  buildEventMetaLine,
  draftFromEvent,
  parseEventSummary,
  type PlannerMasterEvent,
} from '../plannerEventUtils';
import { plannerForm } from '../plannerFormClasses';

interface PlannerEventDetailsBarProps {
  activeEvent: PlannerMasterEvent;
  onSave: (patch: { name: string; date: string; description: string }) => void;
  /** Render inside a parent card (no outer border/shadow). */
  embedded?: boolean;
}

export const PlannerEventDetailsBar: React.FC<PlannerEventDetailsBarProps> = ({
  activeEvent,
  onSave,
  embedded = false,
}) => {
  const activeSummary = useMemo(() => parseEventSummary(activeEvent), [activeEvent]);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventDraft, setEventDraft] = useState(() => draftFromEvent(activeEvent));

  useEffect(() => {
    setEventDraft(draftFromEvent(activeEvent));
    setIsEditingEvent(false);
  }, [activeEvent.id, activeEvent.name, activeEvent.date, activeEvent.description]);

  const handleSave = () => {
    onSave({
      name: eventDraft.name,
      date: eventDraft.date,
      description: eventDraft.description,
    });
    setIsEditingEvent(false);
  };

  const handleCancel = () => {
    setEventDraft(draftFromEvent(activeEvent));
    setIsEditingEvent(false);
  };

  return (
    <div
      className={
        embedded
          ? 'px-1 py-0.5'
          : 'bg-white dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700/60 px-3 py-2.5 shadow-sm'
      }
      id="planner-active-event-details"
    >
      {!isEditingEvent ? (
        <>
          <div className="flex items-center gap-2 min-h-[22px]">
            <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" aria-hidden />
            <span className={`${plannerForm.kicker} shrink-0 normal-case`}>Event details</span>
            <span className="text-stone-300 dark:text-stone-600 shrink-0" aria-hidden>
              |
            </span>
            <p className="text-sm font-semibold text-stone-900 dark:text-white truncate min-w-0 flex-1">
              {activeEvent.name || 'Untitled event'}
            </p>
            <button
              type="button"
              onClick={() => setIsEditingEvent(true)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 dark:hover:bg-orange-950/40 transition-colors cursor-pointer shrink-0"
              title="Edit event details"
              aria-label="Edit event details"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
          <p
            className="text-sm text-stone-500 dark:text-stone-400 truncate mt-1 pl-[calc(0.875rem+0.5rem)]"
            title={buildEventMetaLine(activeSummary, activeEvent.date)}
          >
            {buildEventMetaLine(activeSummary, activeEvent.date)}
          </p>
        </>
      ) : (
        <div className="space-y-3">
          <p className={plannerForm.kicker}>Edit event</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div>
              <label className={plannerForm.label} htmlFor="planner-edit-event-name">
                Event name
              </label>
              <input
                id="planner-edit-event-name"
                type="text"
                value={eventDraft.name}
                onChange={(e) => setEventDraft((d) => ({ ...d, name: e.target.value }))}
                className={plannerForm.input}
              />
            </div>
            <div>
              <label className={plannerForm.label} htmlFor="planner-edit-event-date">
                Date
              </label>
              <input
                id="planner-edit-event-date"
                type="date"
                value={eventDraft.date}
                onChange={(e) => setEventDraft((d) => ({ ...d, date: e.target.value }))}
                className={`${plannerForm.input} sm:w-[11rem] cursor-pointer`}
              />
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className={`${plannerForm.btnSecondary} shrink-0`}
              title="Cancel"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" aria-hidden />
              Cancel
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 min-w-0">
              <label className={plannerForm.label} htmlFor="planner-edit-event-notes">
                Notes, location & type
              </label>
              <textarea
                id="planner-edit-event-notes"
                value={eventDraft.description}
                onChange={(e) => setEventDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Location: … · Type: … · Notes"
                rows={2}
                className={`${plannerForm.textarea} min-h-[2.75rem]`}
              />
            </div>
            <button type="button" onClick={handleSave} className={`${plannerForm.btnPrimary} shrink-0`}>
              <Check className="w-4 h-4" aria-hidden />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
