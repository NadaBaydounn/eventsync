# Business Rules

## Authentication
- Users sign up with email + password (Google OAuth optional)
- Profile auto-created via Supabase trigger on auth.users insert
- Full name extracted from metadata or email prefix
- Session managed via HTTP-only cookies (Supabase SSR)
- Unauthenticated users redirect to /login
- Authenticated users on /login redirect to /calendar

## Events
- Events belong to a user (created_by) or organization (org_id)
- 14 event types, each with unique visual identity
- Events can be recurring (with recurrence_rule RRULE)
- Events can be locked (password-protected from editing)
- Status transitions: upcoming → attending/maybe/declined → completed/cancelled
- Priority levels: low, normal, high, urgent
- Visibility: private (self only), team (org members), public (anyone)
- Tags are stored as text array, entered comma-separated

## Roles & Permissions
- Host: Full control (CRUD, invite, manage, delete)
- Co-host: Configurable permissions (guests, tasks, messages, polls)
- Attendee: RSVP, view details, prep checklist, reflect
- Viewer: Read-only via share link (no auth required)

## Invitations
- Sent via email or share link
- Each invitation has a unique token for RSVP
- RSVP statuses: pending, accepted, declined, maybe
- Hosts can send reminders to non-responders
- Attendees can RSVP without creating an account (via token)

## Share Links
- Scopes: single_event, calendar, org_calendar
- Optional: password protection, expiry date
- View count tracked for analytics
- Permissions: view or comment

## AI Features
- Chatbot: Natural language → event creation, navigation help
- Image Import: Photo of flyer → structured event data
- Planning Agent: Event type + details → checklist, budget, timeline
- Suggestion Agent: Event context → what to wear, bring, prepare
- All AI calls server-side only (API key never exposed)
- Free tier: 1,500 requests/day via Google Gemini

## Notifications
- Types: reminder, invitation, update, rsvp, custom, ai_suggestion
- Scheduled reminders: configurable (1h, 1d before event)
- Real-time via Supabase Realtime
- Read/unread status tracking

## Data Privacy
- RLS on all tables (users only access own data)
- Service role key server-side only
- Share links provide controlled public access
- Reflections are private by default
