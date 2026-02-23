import type { EventType, EventStatus } from '@/types/events'
import { addDays, addHours, format, subDays } from 'date-fns'

interface DemoEvent {
  title: string
  description: string
  event_type: EventType
  start_offset_days: number // relative to today
  start_hour: number
  duration_hours: number
  location: string
  status: EventStatus
  priority: 'low' | 'normal' | 'high' | 'urgent'
  tags: string[]
}

const DEMO_EVENTS: DemoEvent[] = [
  // === UPCOMING ===
  {
    title: 'Product Launch Strategy Meeting',
    description: 'Q2 product launch planning with marketing, engineering, and design leads. Agenda: timeline review, go-to-market strategy, and resource allocation.',
    event_type: 'business',
    start_offset_days: 1,
    start_hour: 10,
    duration_hours: 2,
    location: 'Conference Room A, 4th Floor',
    status: 'attending',
    priority: 'high',
    tags: ['work', 'product', 'Q2'],
  },
  {
    title: 'Sarah\'s 30th Birthday Bash 🎂',
    description: 'Surprise party for Sarah! Theme: 90s throwback. Don\'t forget to bring a gift! RSVP by Thursday.',
    event_type: 'birthday',
    start_offset_days: 3,
    start_hour: 19,
    duration_hours: 4,
    location: '742 Evergreen Terrace, Apt 3B',
    status: 'attending',
    priority: 'normal',
    tags: ['personal', 'friends'],
  },
  {
    title: 'AI & Machine Learning Conference 2025',
    description: 'Annual tech conference featuring keynotes on LLMs, computer vision, and robotics. Networking sessions and hands-on workshops included.',
    event_type: 'tech',
    start_offset_days: 7,
    start_hour: 9,
    duration_hours: 9,
    location: 'TechHub Convention Center, San Francisco',
    status: 'attending',
    priority: 'high',
    tags: ['tech', 'AI', 'conference', 'networking'],
  },
  {
    title: 'Weekend Hiking Trip — Mount Tamalpais',
    description: 'Group hike to the summit. Moderate difficulty, ~4 hours round trip. Bring water, snacks, and sunscreen. Carpool from downtown at 7 AM.',
    event_type: 'trip',
    start_offset_days: 5,
    start_hour: 7,
    duration_hours: 6,
    location: 'Mount Tamalpais State Park, CA',
    status: 'attending',
    priority: 'normal',
    tags: ['outdoors', 'fitness', 'friends'],
  },
  {
    title: 'Jazz Night at Blue Note',
    description: 'Live jazz performance featuring the Marcus Miller Quartet. Doors open at 7 PM, show starts at 8 PM. Dress code: smart casual.',
    event_type: 'concert',
    start_offset_days: 4,
    start_hour: 19,
    duration_hours: 3,
    location: 'Blue Note Jazz Club, 131 W 3rd St',
    status: 'maybe',
    priority: 'low',
    tags: ['music', 'nightlife'],
  },
  {
    title: 'Annual Dental Checkup',
    description: 'Routine dental examination and cleaning. Remember to bring insurance card. Fast from midnight if x-rays needed.',
    event_type: 'health',
    start_offset_days: 10,
    start_hour: 14,
    duration_hours: 1,
    location: 'Bright Smile Dental, Suite 200',
    status: 'upcoming',
    priority: 'normal',
    tags: ['health', 'appointment'],
  },
  {
    title: 'Team Dinner — Italian Night 🍝',
    description: 'Monthly team dinner at Lucia\'s. Prix fixe menu, $45/person. Dietary restrictions already submitted. Don\'t forget to expense it!',
    event_type: 'dining',
    start_offset_days: 6,
    start_hour: 19,
    duration_hours: 2,
    location: 'Lucia\'s Trattoria, 285 Columbus Ave',
    status: 'attending',
    priority: 'normal',
    tags: ['work', 'team', 'food'],
  },
  {
    title: 'Pottery Workshop — Beginner Friendly',
    description: 'Hands-on wheel-throwing workshop. All materials provided. Wear clothes you don\'t mind getting dirty. Max 12 participants.',
    event_type: 'art',
    start_offset_days: 8,
    start_hour: 10,
    duration_hours: 3,
    location: 'Clay Studio, 1798 Market St',
    status: 'attending',
    priority: 'low',
    tags: ['creative', 'hobby', 'weekend'],
  },
  {
    title: 'Community Park Cleanup 🌿',
    description: 'Volunteer day at Golden Gate Park. Gloves and bags provided. Bring water and sunscreen. Free lunch for all volunteers!',
    event_type: 'volunteer',
    start_offset_days: 12,
    start_hour: 9,
    duration_hours: 4,
    location: 'Golden Gate Park, Main Entrance',
    status: 'attending',
    priority: 'normal',
    tags: ['volunteer', 'community'],
  },
  {
    title: 'CrossFit Open Workout 25.3',
    description: 'Weekly CrossFit Open workout. Warm up by 5:30. Judges needed for the 6 PM heat. Post-workout smoothies!',
    event_type: 'sports',
    start_offset_days: 2,
    start_hour: 17,
    duration_hours: 2,
    location: 'CrossFit Pacific, 500 Brannan St',
    status: 'attending',
    priority: 'high',
    tags: ['fitness', 'crossfit', 'competition'],
  },
  {
    title: 'Data Science Study Group',
    description: 'Weekly study group covering chapters 7-9 of "Hands-On Machine Learning". Bring your laptop with Jupyter Notebook ready.',
    event_type: 'educational',
    start_offset_days: 3,
    start_hour: 18,
    duration_hours: 2,
    location: 'Central Library, Room 302',
    status: 'attending',
    priority: 'normal',
    tags: ['learning', 'data-science', 'study'],
  },
  {
    title: 'Emily & Jake\'s Wedding 💒',
    description: 'Ceremony at 4 PM followed by reception. Black tie optional. Gift registry on Zola. RSVP deadline: March 1st.',
    event_type: 'wedding',
    start_offset_days: 45,
    start_hour: 16,
    duration_hours: 6,
    location: 'Presidio Officers\' Club, San Francisco',
    status: 'attending',
    priority: 'high',
    tags: ['wedding', 'formal', 'friends'],
  },
  // === PAST EVENTS (with potential reflections) ===
  {
    title: 'Startup Pitch Night',
    description: 'Pitched our AI event scheduler to 5 VCs. Got 2 follow-up meetings! Great feedback on the demo.',
    event_type: 'business',
    start_offset_days: -3,
    start_hour: 18,
    duration_hours: 3,
    location: 'WeWork, 600 California St',
    status: 'completed',
    priority: 'urgent',
    tags: ['startup', 'pitch', 'networking'],
  },
  {
    title: 'React Advanced Workshop',
    description: 'Full-day workshop on React Server Components, Suspense patterns, and Next.js App Router best practices.',
    event_type: 'educational',
    start_offset_days: -7,
    start_hour: 9,
    duration_hours: 8,
    location: 'Online — Zoom',
    status: 'completed',
    priority: 'normal',
    tags: ['react', 'workshop', 'learning'],
  },
  {
    title: 'House Party at Mike\'s',
    description: 'Housewarming party. Brought guacamole and it was a hit! Great rooftop views.',
    event_type: 'party',
    start_offset_days: -5,
    start_hour: 20,
    duration_hours: 4,
    location: 'Mike\'s Place, 123 Mission St, Rooftop',
    status: 'completed',
    priority: 'normal',
    tags: ['party', 'friends', 'social'],
  },
  // === RECURRING (shown as single instances) ===
  {
    title: 'Weekly Team Standup',
    description: 'Quick 15-min standup. Share what you did yesterday, what you\'re doing today, and any blockers.',
    event_type: 'business',
    start_offset_days: 0,
    start_hour: 9,
    duration_hours: 0.25,
    location: 'Zoom — Daily Room',
    status: 'attending',
    priority: 'normal',
    tags: ['work', 'daily', 'standup'],
  },
  {
    title: 'Monthly Book Club 📖',
    description: 'This month: "Project Hail Mary" by Andy Weir. Bring your favorite passage to share. Snacks rotation: it\'s your turn!',
    event_type: 'educational',
    start_offset_days: 14,
    start_hour: 19,
    duration_hours: 2,
    location: 'Alex\'s Living Room',
    status: 'attending',
    priority: 'low',
    tags: ['books', 'friends', 'monthly'],
  },
  {
    title: 'Yoga & Meditation Session',
    description: 'Gentle flow yoga followed by 15 minutes of guided meditation. Bring your own mat. Beginners welcome!',
    event_type: 'health',
    start_offset_days: 1,
    start_hour: 7,
    duration_hours: 1,
    location: 'Serenity Studio, 450 Hayes St',
    status: 'maybe',
    priority: 'low',
    tags: ['wellness', 'yoga', 'morning'],
  },
]

/**
 * Generate demo events with actual dates based on today.
 */
export function generateDemoEvents(userId: string) {
  const now = new Date()

  return DEMO_EVENTS.map((demo, index) => {
    const startDate = addDays(now, demo.start_offset_days)
    startDate.setHours(demo.start_hour, 0, 0, 0)
    const endDate = addHours(startDate, demo.duration_hours)

    return {
      title: demo.title,
      description: demo.description,
      event_type: demo.event_type,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      all_day: false,
      location: demo.location,
      status: demo.status,
      priority: demo.priority,
      visibility: 'private' as const,
      tags: demo.tags,
      is_locked: false,
      is_recurring: demo.title.includes('Weekly') || demo.title.includes('Monthly'),
      created_by: userId,
      metadata: {},
      attachments: [],
    }
  })
}

/**
 * Demo reflections for past events.
 */
export const DEMO_REFLECTIONS = [
  {
    event_index: 12, // Startup Pitch Night
    thoughts: 'Incredible experience! The VCs were really engaged with our demo. Need to follow up with Sequoia and a16z by Friday.',
    rating: 5,
    mood: 'amazing' as const,
    highlights: 'Got 2 follow-up meetings! The live demo went flawlessly.',
    improvements: 'Should have prepared more specific market size data. Also need a cleaner 1-pager.',
  },
  {
    event_index: 13, // React Workshop
    thoughts: 'Learned a ton about RSC and streaming. The instructor was great. Need to refactor our app to use these patterns.',
    rating: 4,
    mood: 'good' as const,
    highlights: 'Finally understand React Server Components. The Suspense patterns section was eye-opening.',
    improvements: 'Would have liked more hands-on time. The afternoon session felt rushed.',
  },
  {
    event_index: 14, // House Party
    thoughts: 'Fun night! Mike\'s new place is amazing. The rooftop views at sunset were unreal.',
    rating: 4,
    mood: 'good' as const,
    highlights: 'My guacamole was the star of the show. Met some cool new people from Mike\'s work.',
    improvements: 'Left too late, was tired the next day. Set a leave-by time next time!',
  },
]
