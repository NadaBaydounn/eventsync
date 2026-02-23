import type { EventType } from '@/types/events'

/**
 * Default checklist items per event type.
 * Auto-populated when user creates a checklist for an event.
 */
export const DEFAULT_CHECKLISTS: Record<EventType, string[]> = {
  party: [
    'Pick out outfit',
    'Buy a gift or bottle of wine',
    'RSVP if not done yet',
    'Arrange transportation / designate driver',
    'Charge your phone',
  ],
  educational: [
    'Review agenda or syllabus',
    'Bring notebook and pen',
    'Download any required materials',
    'Prepare questions to ask',
    'Charge laptop if needed',
  ],
  trip: [
    'Pack clothes for the duration',
    'Bring chargers and adapters',
    'Check passport / ID validity',
    'Download offline maps',
    'Confirm accommodation booking',
    'Pack toiletries',
    'Set out-of-office / auto-reply',
    'Check weather at destination',
    'Arrange pet/plant care if needed',
  ],
  business: [
    'Review meeting agenda',
    'Prepare talking points / presentation',
    'Bring laptop and charger',
    'Print any required documents',
    'Dress appropriately',
    'Test video/audio setup if virtual',
  ],
  sports: [
    'Pack athletic wear',
    'Bring water bottle',
    'Pack towel',
    'Bring change of clothes',
    'Eat a proper meal beforehand',
    'Warm up / stretch before activity',
  ],
  concert: [
    'Have tickets ready (digital or printed)',
    'Charge phone for photos',
    'Bring ear protection',
    'Check venue bag policy',
    'Plan parking or transit',
    'Wear comfortable shoes',
  ],
  dining: [
    'Confirm reservation',
    'Check dress code',
    'Review menu for dietary needs',
    'Arrange transportation',
    'Bring wallet / payment method',
  ],
  birthday: [
    'Buy and wrap gift',
    'Write birthday card',
    'Confirm party details with host',
    'Pick out festive outfit',
    'Arrange transportation',
    "Don't forget to say Happy Birthday!",
  ],
  tech: [
    'Charge laptop fully',
    'Set up dev environment',
    'Have API keys and credentials ready',
    'Clone relevant repositories',
    'Bring charger and cables',
    'Download IDE plugins / tools needed',
    'Bring notebook for ideas',
  ],
  health: [
    'Bring insurance card / ID',
    'Gather medical records if needed',
    'Follow fasting instructions if any',
    'Write down questions for doctor',
    'Bring list of current medications',
    'Arrange transportation',
  ],
  art: [
    'Bring art supplies (if required)',
    'Wear clothes you can get dirty',
    'Bring reference images or inspiration',
    'Bring water and snacks',
    'Charge phone for photos of work',
  ],
  wedding: [
    'RSVP before deadline',
    'Buy gift from registry',
    'Get outfit ready (dry clean if needed)',
    'Arrange transportation',
    'Book hotel if needed',
    'Prepare speech if giving one',
    'Charge phone / camera',
    'Bring tissues for happy tears',
    'Know the dress code',
  ],
  volunteer: [
    'Wear appropriate clothing',
    'Bring water and sunscreen',
    'Sign waiver forms if needed',
    'Arrange carpool if possible',
    'Bring gloves or tools if specified',
    'Review volunteer instructions',
  ],
  general: [
    'Review event details',
    'Confirm time and location',
    'Arrange transportation',
    'Charge phone',
  ],
}

/**
 * AI Daily Briefing system prompt.
 */
export const DAILY_BRIEFING_PROMPT = `You are EventSync's daily briefing assistant. Generate a concise, helpful morning briefing based on the user's events for today and the near future.

Given the user's events, generate a briefing with:
1. Greeting (with time of day awareness: morning/afternoon/evening)
2. Today's event count and first event
3. Any scheduling conflicts today
4. Upcoming important events (next 3 days) that need preparation
5. A helpful tip or reminder based on event types

Format as a short, scannable briefing. Use emojis sparingly (1-2 per line).
Keep it under 8 lines total. Be warm but efficient.

Today's date: {{TODAY}}
Current time: {{TIME}}
User's name: {{NAME}}
Today's events: {{TODAY_EVENTS}}
This week's events: {{WEEK_EVENTS}}

Return a plain text briefing, no JSON.`

/**
 * Pre-built event templates users can choose from.
 */
export const BUILT_IN_TEMPLATES = [
  {
    name: 'Weekly Team Standup',
    event_type: 'business' as EventType,
    template_data: {
      title: 'Weekly Team Standup',
      description: 'Quick sync: what did you do, what will you do, any blockers?',
      duration_minutes: 15,
      priority: 'normal',
      visibility: 'team',
    },
  },
  {
    name: 'Birthday Party',
    event_type: 'birthday' as EventType,
    template_data: {
      title: "🎂 [Name]'s Birthday",
      description: "Birthday celebration! Don't forget a gift and card.",
      duration_minutes: 180,
      priority: 'normal',
      visibility: 'private',
    },
  },
  {
    name: 'Dinner Reservation',
    event_type: 'dining' as EventType,
    template_data: {
      title: 'Dinner at [Restaurant]',
      description: 'Reservation for [X] people. Dress code: [casual/smart casual].',
      duration_minutes: 120,
      priority: 'normal',
      visibility: 'private',
    },
  },
  {
    name: 'Road Trip',
    event_type: 'trip' as EventType,
    template_data: {
      title: 'Road Trip to [Destination]',
      description: 'Pack the car, check tire pressure, download offline maps!',
      duration_minutes: 480,
      priority: 'normal',
      visibility: 'private',
    },
  },
  {
    name: 'Gym Workout',
    event_type: 'sports' as EventType,
    template_data: {
      title: 'Gym Session',
      description: 'Workout day! Remember to hydrate and warm up.',
      duration_minutes: 60,
      priority: 'low',
      visibility: 'private',
    },
  },
  {
    name: 'Doctor Appointment',
    event_type: 'health' as EventType,
    template_data: {
      title: 'Doctor Appointment',
      description: 'Bring insurance card. Write down questions beforehand.',
      duration_minutes: 60,
      priority: 'high',
      visibility: 'private',
    },
  },
  {
    name: 'Conference / Talk',
    event_type: 'tech' as EventType,
    template_data: {
      title: '[Conference Name]',
      description: 'Bring laptop, business cards, and notebook. Download the agenda.',
      duration_minutes: 480,
      priority: 'high',
      visibility: 'private',
    },
  },
  {
    name: '1:1 Meeting',
    event_type: 'business' as EventType,
    template_data: {
      title: '1:1 with [Name]',
      description: 'Agenda:\n- Updates\n- Blockers\n- Action items',
      duration_minutes: 30,
      priority: 'normal',
      visibility: 'team',
    },
  },
]
