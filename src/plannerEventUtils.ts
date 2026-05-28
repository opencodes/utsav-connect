export interface PlannerMasterEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  location?: string;
  eventType?: string;
  isActive: boolean;
}

export type EventSummary = {
  location: string;
  eventType: string;
  notes: string;
};

export function parseEventSummary(event: PlannerMasterEvent): EventSummary {
  const directLocation = (event.location ?? '').trim();
  const directType = (event.eventType ?? '').trim();
  if (directLocation || directType) {
    return {
      location: directLocation,
      eventType: directType,
      notes: (event.description ?? '').trim(),
    };
  }

  const desc = (event.description ?? '').trim();
  if (!desc) {
    return { location: '', eventType: '', notes: '' };
  }

  const parts = desc.split(' · ').map((p) => p.trim()).filter(Boolean);
  let location = '';
  let eventType = '';
  const noteParts: string[] = [];

  for (const part of parts) {
    if (part.startsWith('Location:')) {
      location = part.replace(/^Location:\s*/i, '').trim();
    } else if (part.startsWith('Type:')) {
      eventType = part.replace(/^Type:\s*/i, '').trim();
    } else {
      noteParts.push(part);
    }
  }

  if (!location && !eventType && noteParts.length === 0) {
    return { location: '', eventType: '', notes: desc };
  }

  return { location, eventType, notes: noteParts.join(' · ') };
}

export function formatEventDateShort(dateStr: string): string {
  if (!dateStr) return 'No date';
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildEventMetaLine(summary: EventSummary, dateStr: string): string {
  const parts = [
    formatEventDateShort(dateStr),
    summary.eventType || null,
    summary.location || null,
    summary.notes || null,
  ].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(' · ') : 'Add date, location, or notes';
}

export function draftFromEvent(event: PlannerMasterEvent | null) {
  const summary = event ? parseEventSummary(event) : { location: '', eventType: '', notes: '' };
  const notes =
    summary.notes ||
    [summary.location ? `Location: ${summary.location}` : '', summary.eventType ? `Type: ${summary.eventType}` : '']
      .filter(Boolean)
      .join(' · ');
  return {
    name: event?.name ?? '',
    date: event?.date ?? '',
    description: notes,
  };
}

export function eventDateSortKey(dateStr: string): number {
  if (!dateStr) return 0;
  const parsed = new Date(`${dateStr}T12:00:00`).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function isEventPast(dateStr: string): boolean {
  if (!dateStr) return false;
  const parsed = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  return parsed < today;
}
