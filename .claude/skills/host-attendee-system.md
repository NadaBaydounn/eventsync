# Skill: Host/Attendee Role System

## Role Detection
```tsx
import { determineEventRole } from "@/types/roles"
import type { EventRole } from "@/types/roles"

const role: EventRole = determineEventRole(
  event.created_by,    // who made the event
  currentUserId,       // current logged-in user
  cohostUserIds,       // array of co-host user IDs
  inviteeUserIds       // array of invited user IDs
)
// Returns: 'host' | 'co-host' | 'attendee' | 'viewer'
```

## UI Routing by Role

### Host → Event Command Center
```tsx
if (role === 'host') {
  return <EventCommandCenter event={event} />
}
```
Tabs: Overview, Guests, Checklist/Tasks, Budget, Timeline, Communications, Polls, Post-Event

### Attendee → Preparation Hub
```tsx
if (role === 'attendee') {
  return <AttendeeEventView event={event} />
}
```
Sections: RSVP toggle, Who's Going, Prep Checklist, AI Suggestions, Host Announcements, Polls

### Viewer → Public Page
```tsx
if (role === 'viewer') {
  return <PublicEventPage event={event} />
}
```
Luma-style landing: Hero, details, map, Add to Calendar, RSVP form, QR code

## Host Features
- Guest management table with RSVP status tracking
- Task/checklist with categories, assignees, relative deadlines
- Budget tracker with categories, estimated vs actual, receipts
- Day-of timeline / run of show
- Announcements to attendees
- Bulk messaging (all, confirmed-only, pending-only)
- Post-event feedback collection + photo gallery

## Attendee Features
- One-click RSVP (attending/maybe/declined)
- Auto-generated prep checklist (from DEFAULT_CHECKLISTS per event type)
- AI suggestions: what to wear, what to bring, travel time, weather
- View host announcements and updates
- Vote on polls
- Post-event reflection (rating, mood, thoughts, photos)

## Database Tables
- `event_cohosts` — Co-host assignments with granular permissions
- `event_tasks` — Planning checklist items
- `event_budget_items` — Expense tracking
- `event_timeline_items` — Day-of schedule
- `event_announcements` — Host → attendee updates
- `event_messages` — Bulk messaging
- `event_photos` — Shared gallery
