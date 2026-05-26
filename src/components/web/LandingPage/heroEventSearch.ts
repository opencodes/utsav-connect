export interface HeroEventSearchPayload {
  eventName?: string;
  location?: string;
  date?: string;
  eventType?: string;
}

export const HERO_EVENT_TYPES = [
  { value: '', label: 'Select event type…' },
  { value: 'wedding', label: 'Wedding (Shaadi)' },
  { value: 'sangeet', label: 'Sangeet / Mehndi' },
  { value: 'puja', label: 'Puja & Festival' },
  { value: 'griha-pravesh', label: 'Griha Pravesh' },
  { value: 'community-feast', label: 'Community Feast (Bhoj)' },
  { value: 'other', label: 'Other Celebration' },
];
