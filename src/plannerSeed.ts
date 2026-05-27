/**
 * Centralized demo seed data for planner localStorage.
 *
 * Keep ALL dummy planner data here so we can easily replace it later with
 * real backend data while still supporting a first-run experience.
 */

export const PLANNER_SEED_EVENTS = [
  {
    id: 'evt-1',
    name: 'Grand Shadi Festival (Main Ceremony)',
    date: '2026-11-12',
    description: 'The main wedding event with royal traditional golden themes.',
    isActive: true,
  },
  {
    id: 'evt-2',
    name: 'Pre-wedding Sangeet & Mehndi Gala',
    date: '2026-11-10',
    description: 'Shadi opening cultural feast, choreography dances, and henna setup.',
    isActive: false,
  },
  {
    id: 'evt-3',
    name: 'Dussehra Community Food Festival',
    date: '2026-10-25',
    description: 'Mass Satvik catering and traditional Mithila art bazaar.',
    isActive: false,
  },
];

export const PLANNER_SEED_SUB_EVENTS = [
  {
    id: 'sub-1',
    name: 'Baraat Swagat Welcome',
    time: '17:30',
    venue: 'Grand Entrance Gateway, Sector 56 Noida',
    notes: 'Rose petal shower arrangement and dhol players sync.',
  },
  {
    id: 'sub-2',
    name: 'Mehndi Evening Bazaar',
    time: '16:00',
    venue: 'Courtyard Lawn & Gazebo Garden',
    notes: 'Saffron tea and dry fruits sweet tables operational.',
  },
  {
    id: 'sub-3',
    name: 'Sangeet Stage Performances',
    time: '20:00',
    venue: 'Rooftop Palace Hall',
    notes: 'Ensure sound check for traditional Maithili geet and folk choreography.',
  },
];

export const PLANNER_SEED_RITUALS = [
  {
    id: 'rit-1',
    name: 'Dwar Puja Ceremony',
    description: 'Groom greeting ritual at the main entrance gate with Vedic shlokas.',
    duration: '45 mins',
    subEventId: 'sub-1',
  },
  {
    id: 'rit-2',
    name: 'Gauri Puja & Haldi paste',
    description: 'Pre-wedding haldi pasting ceremonies with close family members.',
    duration: '2 hours',
    subEventId: 'unmapped',
  },
  {
    id: 'rit-3',
    name: 'Jaimala Varmala Exchange',
    description: 'Pristine floral garlands exchange on the central amphitheater stage.',
    duration: '30 mins',
    subEventId: 'sub-3',
  },
];

export const PLANNER_SEED_GUESTS = [
  {
    id: 'gst-1',
    name: 'Pandey Jha Ji (Mama Ji)',
    gender: 'Male',
    age: 58,
    familyCount: 4,
    contact: '+91 94312 87654',
    group: 'Bride Family',
    rsvpStatus: 'Confirmed',
    roomAllocated: 'VIP Palace Suite 101',
    returnGiftItem: 'Premium Silver Diya Set',
    returnGiftStatus: 'Assigned',
    notes: 'Requires ground floor accommodations; pure satvik fasting meals.',
  },
  {
    id: 'gst-2',
    name: 'Sushant Kumar Mishra',
    gender: 'Male',
    age: 32,
    familyCount: 2,
    contact: '+91 88776 55443',
    group: 'Groom Family',
    rsvpStatus: 'Confirmed',
    roomAllocated: 'Heritage Room 104',
    returnGiftItem: 'Classic Mithai Box',
    returnGiftStatus: 'Gifted',
    notes: 'Driver accompanying; needs separate driver dome spacing.',
  },
  {
    id: 'gst-3',
    name: 'Apeksha Roy',
    gender: 'Female',
    age: 26,
    familyCount: 0,
    contact: '+91 74012 32156',
    group: 'Mutual Friends',
    rsvpStatus: 'Pending',
    roomAllocated: '—',
    returnGiftItem: 'Madhubani Bookmark Set',
    returnGiftStatus: 'Pending',
    notes: 'Vegetarian; arriving late evening.',
  },
];

