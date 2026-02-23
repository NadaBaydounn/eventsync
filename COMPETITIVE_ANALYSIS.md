# 🔍 EventSync — Competitive Analysis & Feature Mining
## Deep Research: What Exists, What's Missing, What We Can Steal

---

## EXECUTIVE SUMMARY

After analyzing 25+ event scheduling & calendar tools, here's the truth: **no one has built the "everything app" for events.** Every tool excels in one area and sucks in others. The opportunity is to combine the best ideas from each into a cohesive, AI-powered experience.

The biggest gap in the market: **AI-native event management.** Everyone has basic scheduling. Nobody has AI that actually helps you plan, prepare, and reflect on events.

---

## TIER 1: THE GIANTS (Millions of Users)

### 📅 Google Calendar
**What they do right (STEAL THESE):**
- Multi-calendar overlay with color-coding — users can see personal + work + shared calendars layered
- "Find a time" — shows availability across multiple people
- Time zone support — events display in local time automatically
- Quick event creation — click any time slot, type "Lunch with Sarah at 12pm at Pasta Palace" and it auto-parses title, time, and location
- Natural language processing in the search bar
- Recurring events with complex RRULE (every 2nd Tuesday, etc.)
- "Out of office" and "Focus time" blocks
- Gmail integration — automatically creates events from flight confirmations, restaurant reservations, etc.
- Map preview for locations — small Google Maps embed
- Guest RSVP with "Yes/No/Maybe" + proposed new times
- Reminders: email + push + desktop notification
- `.ics` import/export
- "Speedy meetings" — auto-shortens 30min meetings to 25min, 60min to 50min
- Working hours configuration

**Where they fall short (OUR OPPORTUNITY):**
- ZERO AI beyond basic NLP parsing
- Ugly, dated UI (Material Design 2, feels 2018)
- No event type theming — a funeral looks the same as a birthday party
- No post-event reflection/notes
- No planning tools — can't build a checklist or budget
- No dashboard analytics — can't see "how many meetings did I have this month?"
- Sharing is clunky — you share a whole calendar, not individual events easily
- No invitation RSVP beyond Yes/No/Maybe
- No polls/voting for group decisions

**Key takeaway:** Copy their multi-calendar overlay, NLP parsing, and recurring event logic. Beat them on AI, theming, and post-event features.

---

### 📅 Microsoft Outlook Calendar
**What they do right:**
- Deep integration with Teams, email, and Office 365
- "Scheduling Assistant" — shows everyone's availability in a grid
- Room/resource booking — reserve conference rooms
- Categories with colors — similar to labels
- Board view — Kanban-style task/event view
- "MyAnalytics" — shows how much time you spend in meetings vs focus time
- Shared calendar delegation — assistants can manage exec calendars

**Where they fall short:**
- Enterprise-focused, overwhelming for individuals
- UI is cluttered and complex
- No AI-powered planning
- No event type awareness
- No public sharing without organization

**Steal:** The analytics concept (time spent in meetings), room booking, scheduling assistant grid.

---

### 📅 Apple Calendar (Fantastical is the premium version)
**What they do right:**
- Beautiful, clean iOS/Mac design
- Natural language event creation — "Meeting with John tomorrow 3pm" just works
- Integration with Apple Maps for location/travel time
- Travel time blocks — shows commute as a separate block before the event
- Siri integration for voice event creation
- Birthday calendar auto-imported from contacts
- Weather forecast in day view

**Where they fall short:**
- Apple ecosystem only
- Very basic feature set beyond scheduling
- No collaboration tools
- No analytics

**Steal:** Travel time blocks, weather in day view, clean design language.

---

## TIER 2: SCHEDULING TOOLS (Booking-Focused)

### 📆 Calendly
**Market position:** #1 scheduling tool. 10M+ users.

**What they do right (STEAL THESE):**
- Booking page with beautiful public URL — `calendly.com/yourname`
- Availability rules — define when you're free, others book slots
- Round-robin scheduling — distribute meetings across team members
- Workflows — automated emails before/after meetings
- Routing forms — ask questions before booking to determine meeting type
- Integrations with Zoom, Teams, Google Meet — auto-creates video links
- Buffer times — automatically adds gaps between meetings
- Minimum scheduling notice — "book at least 24h in advance"
- Team pages — one URL, multiple people to book with
- Embed widget — drop scheduling on any website
- Payment collection — charge for consultations via Stripe
- Analytics — track which links get booked, conversion rates

**Where they fall short:**
- ONLY about booking meetings — not a calendar or event manager
- No event types beyond "meeting"
- No group events (parties, trips, etc.)
- No AI (surprising given their scale)
- No post-event tools
- Expensive — $10/mo for basic, $16/mo for teams

**Key takeaway:** Their booking page + availability concept is brilliant. We can build a simpler version for our share links — let invitees not just RSVP but propose alternate times.

---

### 📆 Cal.com
**Market position:** Open-source Calendly alternative. Developer-favorite.

**What they do right:**
- **Open source** — community trust, self-hostable
- Beautiful, modern UI (way better than Calendly)
- "Atoms" — embeddable scheduling components for your own app
- Round-robin, collective scheduling
- Dynamic booking links with parameters
- Workflows with custom triggers
- API-first design — everything accessible via API
- Insights dashboard — booking analytics
- App marketplace — 100+ integrations
- Recurring availability schedules
- Conference room management

**Where they fall short:**
- Still booking-focused, not a full event manager
- No personal calendar features
- No AI
- Complex setup for non-developers

**Steal:** Their clean UI patterns, the concept of embeddable components (our share links should be embeddable), and their insights dashboard design.

---

### 📆 SavvyCal
**What they do right:**
- "Overlay" scheduling — recipient can overlay their own calendar to find mutual times
- Prioritized scheduling — rank which meetings matter more
- Beautiful, minimal UI
- Personalized links with custom questions
- Calendar connections (not just availability slots)

**Steal:** The overlay concept is genius. When sharing events, let recipients overlay their own calendar.

---

### 📆 TidyCal
**What they do right:**
- Simple, cheap ($29 one-time!)
- Clean no-frills booking
- Payment collection built-in

**Lesson:** Simplicity wins. Don't over-complicate the core experience.

---

## TIER 3: AI-NATIVE CALENDARS (The Future)

### 🤖 Motion
**Market position:** AI-powered calendar + task manager. ~$20/mo.

**What they do right (STEAL EVERYTHING):**
- **AI auto-scheduling** — you tell it what tasks you need to do, and it places them on your calendar automatically based on priority, deadlines, and your energy levels
- **Intelligent rescheduling** — if a meeting gets moved, Motion reshuffles all your tasks automatically
- **Task-to-calendar** — every task becomes a time block, no task falls through cracks
- **Project management** — Kanban boards, task lists, priorities, all connected to calendar
- **Focus time protection** — AI ensures you have uninterrupted blocks
- **Smart meeting scheduling** — suggests times based on all participants' real availability
- Priority-based time allocation — urgent tasks get earlier slots
- Daily planning AI — each morning, Motion re-optimizes your day

**Where they fall short:**
- Very expensive ($19/mo individual, $12/mo/user for teams)
- Learning curve — users report it takes weeks to trust the AI
- Can feel overwhelming — too much automation
- No event type awareness
- No social/fun events — very work-focused
- No post-event reflection
- No public sharing

**KEY INSIGHT FOR US:** Motion proves users WANT AI in their calendar. But Motion is work-only. Nobody is doing AI for personal/social events. This is our gap.

**Steal:** The concept of AI auto-scheduling, priority-based time blocking, and daily planning optimization. Adapt for events (not just tasks).

---

### 🤖 Reclaim.ai
**Market position:** AI scheduling assistant for Google Calendar.

**What they do right:**
- **Smart Habits** — blocks recurring time for habits (exercise, lunch, reading) and flexes them around meetings
- **Smart 1:1s** — finds optimal recurring time for 1:1 meetings
- **Task scheduling** — like Motion, puts tasks on calendar
- **Buffer time** — auto-adds decompression time after intense meetings
- **Focus time defense** — protects deep work blocks
- **Time tracking** — automatically categorizes how you spend time
- **Analytics** — weekly report of meeting load, focus time, habit completion
- **Slack integration** — auto-sets status based on calendar
- **Smart breaks** — ensures you don't have 5 meetings in a row

**Where they fall short:**
- Google Calendar dependent (overlay tool, not standalone)
- Work-focused only
- No event management
- No visual customization

**Steal:** Smart Habits (we could suggest "block 30min to prepare before your big presentation"), buffer time, analytics showing work-life balance, Slack status sync concept.

---

### 🤖 Amie
**Market position:** Beautiful AI calendar for Mac/iOS.

**What they do right:**
- **STUNNING UI** — arguably the most beautiful calendar app ever made
- Emoji reactions on events
- Inline "find a time" without leaving the calendar
- Keyboard-first design — everything accessible via shortcuts
- Split-view for multiple calendars
- Beautifully animated transitions
- AI scheduling suggestions
- Contact integration — see who you're meeting and their LinkedIn/Twitter
- Quick event creation with natural language

**Where they fall short:**
- Apple-only
- No web version (yet)
- Early stage — limited features compared to Google Calendar
- No event types or theming
- No analytics

**KEY STEAL FOR US:** Amie proves that BEAUTIFUL DESIGN wins users. Their UI is what gets people to switch from Google Calendar. We need our UI to be Amie-level beautiful. Also steal: emoji reactions on events, contact profiles for attendees, keyboard-first design.

---

### 🤖 Vimcal
**Market position:** "The fastest calendar" — speed-focused.

**What they do right:**
- **Blazing fast** — everything loads instantly, keyboard shortcuts for everything
- **Command bar** — Cmd+K style command palette for any action
- **Time zone intelligence** — shows multiple time zones, auto-converts
- **Scheduling links built-in** — no need for Calendly
- **Template events** — save event templates for recurring types
- **Availability sharing** — copy your free slots as text to paste in chat
- **Customizable hotkeys** — users define their own shortcuts
- **Quick availability** — one-click share of "I'm free at these times"

**Steal:** Template events (save a "Team Standup" template), copy-availability-as-text, speed as a feature, customizable hotkeys.

---

## TIER 4: EVENT MANAGEMENT PLATFORMS

### 🎪 Eventbrite
**Market position:** #1 for public event ticketing.

**What they do right:**
- Event discovery — browse events near you
- Ticketing with tiers (free, paid, VIP)
- Registration pages with custom fields
- Attendee management + check-in app
- Event analytics — ticket sales, page views, conversion
- Social sharing — one-click share to Facebook, Twitter
- Waitlist management
- Discount codes / promo codes
- Embeddable ticket widgets
- Post-event surveys
- Multi-event series management

**Where they fall short:**
- Focused on PUBLIC events (conferences, concerts, workshops)
- Not a personal calendar
- No AI
- Takes fees from ticket sales
- UI is functional but not beautiful

**Steal:** The concept of event discovery, tiered access (free vs premium features), attendee check-in, waitlist, promo codes for events, post-event surveys.

---

### 🎪 Luma (lu.ma)
**Market position:** Beautiful event pages for communities.

**What they do right (HEAVILY STEAL):**
- **GORGEOUS event pages** — each event gets a stunning, shareable landing page
- QR code for check-in
- Calendar subscriptions — subscribe to a host's events
- Community features — followers, recurring series
- Ticketing with Stripe
- Event recap emails with photos
- Waitlist with automatic approval
- Co-hosts and speaker management
- Custom branding per event
- "Add to Calendar" button (Google, Outlook, Apple)
- Podcast-style event series
- Integration with Zoom for virtual events
- Location with map embed
- Guest list management
- Event templates

**Where they fall short:**
- No personal calendar management
- No AI features
- No planning tools
- No analytics dashboard
- Limited to public/community events

**KEY STEAL:** Luma's event pages are BEAUTIFUL. Every event should have a stunning shareable page. Copy their approach: hero image, clean typography, prominent RSVP button, map embed, "Add to Calendar" buttons, QR code. This directly applies to our share links.

---

### 🎪 AddEvent
**Market position:** "Add to Calendar" button as a service.

**What they do right:**
- Universal "Add to Calendar" button — works for Google, Outlook, Apple, Yahoo, etc.
- RSVP landing pages
- Calendar subscriptions
- Analytics on button clicks
- Embeddable widgets
- Event series management

**Steal:** Their "Add to Calendar" button covers all platforms — we need to support Google, Outlook, Apple, Yahoo, and .ics download.

---

### 🎪 Teamup Calendar
**Market position:** Shared calendars for groups (no accounts needed).

**What they do right:**
- **No sign-up required** — share a link, anyone can view/edit
- Color-coded sub-calendars
- Permission levels on shared links (read-only, modify, admin)
- Embeddable calendar widgets
- CSV import/export
- Event images and file attachments
- Custom event fields
- Calendar-level permissions (not just event-level)
- Signup sheets — people claim event slots

**Steal:** The "no account needed" sharing model is exactly what we're building. Also steal: signup sheets (attendees claim spots), custom event fields, file attachments on events.

---

## TIER 5: NICHE & EMERGING

### 📱 Notion Calendar (formerly Cron)
**What they do right:**
- Deep integration with Notion databases
- Split views — side-by-side calendars
- Beautiful minimal UI
- Keyboard shortcuts
- Multi-account calendar management
- Time blocking
- Availability sharing

**Steal:** The Notion-style database view for events — imagine events as a database you can view as calendar, table, board, or timeline.

---

### ⚡ Fantastical
**What they do right:**
- **Best natural language parsing** — "Coffee with Sarah next Tuesday 9am at Blue Bottle" perfectly parsed
- Beautiful UI with weather, map, and meeting info
- Interesting calendars — subscribe to sports schedules, holidays, TV shows
- Availability windows for scheduling
- Focus filters — show only specific calendars at work
- Templates for recurring events
- Color coordination
- Travel time estimates

**Steal:** "Interesting calendars" — let users subscribe to public event feeds (sports, holidays, community). Travel time integration. Focus filters.

---

### 📊 Clockwise
**What they do right:**
- AI that shuffles flexible meetings to create focus time blocks
- Team-wide scheduling optimization
- Meeting cost calculator (shows $ value of meeting time)
- Flexible meetings concept — meetings that can move within a window
- Analytics on meeting culture

**Steal:** Meeting cost calculator — show "this event will take 2 hours × 5 attendees = 10 person-hours ($500 in team time)". This would be killer for business events.

---

### 🗓️ Morgen
**What they do right:**
- Unified calendar (connects Google, Outlook, Apple, all in one)
- Task management integrated into calendar
- Time blocking with drag-and-drop
- Focus time scheduling
- Clean, modern UI

---

### 🎯 Fellow
**What they do right:**
- Meeting notes attached to calendar events
- Action items tracked per meeting
- Meeting templates
- 360° feedback after meetings
- AI meeting summaries

**Steal:** Meeting notes and action items attached to events, templates, AI meeting summaries, feedback after meetings.

---

## FEATURE GAP ANALYSIS: What Nobody Does

Here are features that ZERO competitors offer. These are pure differentiators:

### 1. 🎨 Event-Type Themed UI
Nobody changes the visual experience based on event type. A party shouldn't look the same as a business meeting. Our themed system (14 types with unique colors, emojis, animations) is completely unique.

### 2. 🤖 AI Event Preparation Agent
No one has an AI that tells you "for your wedding tomorrow, wear a dark suit, bring a gift from the registry, weather will be 72°F and sunny, leave by 3:15 PM to arrive on time." This is our #1 differentiator.

### 3. 🤖 AI Event Planning Agent
No one has an AI that helps plan the logistics of an event — budget, checklist, guest list, speeches, activities. Motion/Reclaim schedule tasks, but nobody plans the EVENT itself.

### 4. 📸 Post-Event Reflection System
Nobody asks "how was the event?" after it happens. No ratings, no notes, no photos, no "what would I improve?" This is a feature that makes EventSync feel like a life companion, not just a scheduler.

### 5. 🖼️ AI Event Import from Images
No tool can look at an event flyer/poster and extract the details. This is premium-tier magic.

### 6. 🎭 Event-Type Animations
Confetti for birthdays, floating clouds for trips, pulse for sports — nobody does contextual animations.

### 7. 📊 Personal Event Analytics
Google gives you meeting analytics (via Workspace). Nobody gives you analytics on your personal life — "you attended 12 social events this month, 3 fitness events, and 0 art events. Maybe try something creative?"

### 8. 🗳️ Built-in Audience Polls
Event tools have RSVP, but nobody has "vote on what restaurant" or "pick a date" built into the event itself (with deadlines and visual results).

### 9. 🔒 Event Locking with Password
Nobody lets you lock an event so it can't be accidentally edited/deleted.

### 10. 🎤 Voice Event Creation with AI
Siri can create basic events, but no web app lets you speak naturally to create rich events with type, location, description — all parsed by AI.

---

## STOLEN IDEAS: Complete Feature Additions for EventSync

Based on this research, here are features to ADD to your CLAUDE.md:

### From Google Calendar:
- [ ] **Natural language event creation** in the search/command bar (not just AI chat)
- [ ] **Speedy events** toggle — auto-shorten meetings by 5-10 min
- [ ] **Working hours** — show others when you're available
- [ ] **Multiple calendars** — personal, work, shared team, with color-coded overlay

### From Calendly/Cal.com:
- [ ] **Booking page** — public URL where others can book time with you
- [ ] **Buffer time settings** — auto-add gaps between events
- [ ] **Minimum scheduling notice** — "book at least 2h in advance"

### From Motion/Reclaim.ai:
- [ ] **AI daily briefing** — morning notification: "Today you have 3 events. Your busiest time is 2-5 PM. Don't forget to prepare for the pitch at 3."
- [ ] **Smart preparation reminders** — "Your tech conference is in 3 days. Have you packed your laptop charger?"
- [ ] **Time analytics** — "This week: 12h in meetings, 6h in social events, 2h in fitness"
- [ ] **Focus time protection** — warn before booking during focus blocks

### From Amie:
- [ ] **Emoji reactions on events** — 🔥 ❤️ 😂 on shared events
- [ ] **Attendee profiles** — show mini-profile card for each attendee
- [ ] **Keyboard-first design** — every action has a shortcut

### From Luma:
- [ ] **Beautiful event pages** — every event gets a stunning shareable landing page with hero image, map, RSVP button
- [ ] **QR code for events** — generate QR code for check-in or sharing
- [ ] **Event series** — recurring events as a "series" with subscriber list
- [ ] **Co-hosts** — multiple people can manage an event
- [ ] **Event recap** — after the event, send a recap with photos to attendees

### From Eventbrite:
- [ ] **Waitlist** — if event is full, join waitlist (auto-notify when spot opens)
- [ ] **Tiered access** — VIP vs general for events
- [ ] **Promo codes** — discount codes for paid events
- [ ] **Attendee check-in** — QR code scan at the door

### From Vimcal:
- [ ] **Event templates** — save "Weekly Standup" or "Birthday Party" as templates with pre-filled fields
- [ ] **Copy availability as text** — "I'm free Monday 2-4pm, Tuesday 10am-12pm" copied to clipboard for pasting in messages
- [ ] **Multiple time zones** — event displays in all attendees' time zones

### From Fantastical:
- [ ] **Subscribable calendars** — subscribe to public feeds (sports, holidays, community events)
- [ ] **Travel time blocks** — show travel time as a pre-event block
- [ ] **Weather in day view** — see forecast for each day

### From Fellow:
- [ ] **Event notes** — rich text notes attached to each event (agenda, minutes, links)
- [ ] **Action items** — checkable to-do items created during/after an event
- [ ] **AI meeting summary** — after a meeting event, AI generates a summary

### From Teamup:
- [ ] **Signup sheets** — for volunteer events, let people claim time slots
- [ ] **Custom event fields** — add custom data fields beyond the defaults
- [ ] **No-account required viewing** — our share links already do this ✅

### From Clockwise:
- [ ] **Event cost calculator** — "This 2-hour meeting with 8 people costs ~$800 in team time"
- [ ] **Flexible events** — mark events as "flexible" (can be moved within a window)

---

## UNIQUE IDEAS (Nobody Has These)

Features that NO competitor offers — our innovation:

### 1. 🎯 Event Score / Streak System
- Track your event attendance streak ("12 events attended in a row!")
- Score events by satisfaction (from reflections)
- Monthly summary: "Your best event this month was Sarah's Birthday (5/5)"
- Gamification: badges for milestones ("First 100 events", "Social butterfly: 10 social events in a month")

### 2. 🧠 AI Event Memory
- After each event, AI remembers context
- "Last time you went to Blue Bottle Coffee, you ordered the lavender oat milk latte"
- "You met Mike at the networking event on Jan 15 — he works at Stripe"
- Helps build a personal network/experience database

### 3. 📍 Event Map View
- See ALL your events on a map
- Filter by type, date range
- Heatmap of locations you frequent
- Discover: "You've been to this area 5 times but never tried the museum nearby"

### 4. 💡 AI Event Suggestions
- "It's been 2 months since you last did something creative. Here are art events near you this weekend."
- "You have a free Saturday. Based on your preferences, here are 3 event ideas."
- "Your friend Sarah's birthday is in 2 weeks. Want to start planning?"

### 5. 📱 Widget / Glanceable View
- iOS-style widget showing today's events with type-themed colors
- Desktop widget for quick glance
- Lock screen integration concept

### 6. 🎵 Event Soundscapes
- Each event type has an optional ambient sound
- Business: subtle office ambiance
- Trip: nature sounds
- Tech: lo-fi beats
- Play while preparing for the event (silly but memorable for judges)

### 7. 🤝 "Who's Going?" Social Feed
- See which friends/colleagues are attending shared events
- Activity feed: "Sarah RSVP'd yes to Tech Conference"
- Social proof for attendance decisions

### 8. 📋 Event Packing Lists
- Per event type, auto-generate a packing/preparation checklist
- Trip: passport, charger, clothes, toiletries
- Concert: tickets, ear protection, comfortable shoes
- Business: laptop, business cards, presentation USB
- User can check off items as they prepare

### 9. 🔄 Event Cloning with Smart Dates
- "Copy this event to next month" — auto-adjusts dates
- "Repeat this party annually" — creates recurring with all details
- Clone and customize — keep details but change date/location

### 10. 📊 Year in Review
- Annual report like Spotify Wrapped
- "In 2025, you attended 156 events across 12 types"
- "Your most social month was July (23 events)"
- "You spent 340 hours in business events"
- Shareable card for social media

### 11. 🌍 Cultural Calendar Awareness
- Auto-add relevant holidays based on user's culture/religion
- Ramadan, Chinese New Year, Diwali, Hanukkah, Christmas, etc.
- "Heads up: your event overlaps with [holiday]"

### 12. ⏰ Smart Conflict Resolution
- When events overlap: "You have a conflict between Team Meeting and Dentist Appointment. Which takes priority?"
- AI suggests: "The dentist was booked 2 months ago and is harder to reschedule. Consider moving the team meeting."

### 13. 🎁 Gift Tracker
- For birthday/wedding events, track gift ideas and purchase status
- "You typically spend $30-50 on birthday gifts"
- AI suggests gifts based on event type and relationship

### 14. 🚗 Smart Departure Alerts
- "Leave in 15 minutes to arrive on time for dinner at 7pm"
- Accounts for real-time traffic
- Adjusts based on how you travel (driving, transit, walking)

### 15. 📝 Event Checklist Templates
- Pre-built checklists per event type
- Wedding: "6 months before", "3 months before", "1 week before", "day of"
- Conference: "Register", "Book hotel", "Pack", "Download agenda"
- Users can save custom templates

---

## UI/UX INNOVATIONS TO STEAL

### From Linear (project management tool):
- Ultra-clean sidebar with minimal icons
- Keyboard shortcuts for EVERYTHING
- Cmd+K command palette
- Smooth page transitions
- Subtle hover states with info preview

### From Vercel Dashboard:
- Beautiful data visualization
- Status indicators with colored dots
- Clean typography hierarchy
- Gradient accents

### From Notion:
- Block-based content editing (for event descriptions)
- Slash commands for quick actions
- Toggle blocks for collapsible sections
- Database-style views (calendar, table, board, gallery)

### From Stripe Dashboard:
- Skeleton loading states
- Real-time data updates
- Expandable rows with detail previews
- Professional data tables with sorting/filtering

### From Arc Browser:
- Colorful, personality-driven UI
- User picks accent color → entire UI adapts
- Spaces/profiles for context switching

---

## PRIORITY RANKING: What to Build First

### 🔴 MUST HAVE (Judges will specifically look for these):
1. Event CRUD with all fields ✅ (already planned)
2. Calendar view ✅
3. Status tracking ✅
4. Search ✅
5. AI features (chatbot minimum) ✅
6. User accounts + invitations ✅
7. Deploy with live URL ✅

### 🟡 HIGH IMPACT (What will make you stand out):
8. Event-type themed UI (our unique differentiator)
9. Beautiful event pages for sharing (Luma-style)
10. AI event import from image
11. Dashboard analytics with charts
12. QR code generation for events
13. Event templates (save & reuse)
14. Dark/Light/Custom theme

### 🟢 WOW FACTOR (If time allows):
15. AI preparation suggestions (what to wear/bring)
16. Post-event reflections
17. Event packing checklists
18. AI daily briefing
19. Copy availability as text
20. Emoji reactions on events
21. Event map view
22. Year in Review concept (even a mock)

---

## PRICING RESEARCH

| Tool | Free Tier | Paid |
|------|-----------|------|
| Calendly | 1 event type | $10-16/mo |
| Cal.com | Unlimited (self-host) | $15/mo (cloud) |
| Motion | None | $19/mo |
| Reclaim | Basic AI | $8-14/mo |
| Amie | Free (beta) | TBD |
| Vimcal | None | $15/mo |
| Fantastical | Basic | $5-7/mo |
| Luma | Free for basics | % of ticket sales |
| Eventbrite | Free events free | % of ticket sales |
| SavvyCal | None | $12/mo |

**Our strategy:** Generous free tier (all core features) + Premium for AI power features. This is the winning formula — Calendly proved it.

---

## FINAL COMPETITIVE ADVANTAGE MATRIX

| Feature | Google Cal | Calendly | Motion | Luma | Eventbrite | **EventSync** |
|---------|-----------|----------|--------|------|------------|---------------|
| Event CRUD | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Calendar View | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Event Types/Themes | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| AI Chatbot | ❌ | ❌ | ⚠️ | ❌ | ❌ | ✅ |
| AI Planning | ❌ | ❌ | ⚠️ tasks | ❌ | ❌ | ✅ **UNIQUE** |
| AI Suggestions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| AI Image Import | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| Beautiful UI | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| Custom Themes | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| Event Animations | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| Share Links | ⚠️ | ✅ | ❌ | ✅ | ✅ | ✅ |
| RSVP/Invitations | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Polls/Voting | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Post-Event Reflection | ❌ | ❌ | ❌ | ❌ | ⚠️ survey | ✅ **UNIQUE** |
| Dashboard Analytics | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| CSV Import/Export | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| ICS Export | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Event Lock | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **UNIQUE** |
| Voice Creation | ⚠️ Siri | ❌ | ❌ | ❌ | ❌ | ✅ |
| QR Codes | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Event Templates | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Team/Org | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Free tier | ✅ | ⚠️ | ❌ | ✅ | ✅ | ✅ |

**Count of UNIQUE features only EventSync has: 8**

This is how a junior beats 100 seniors: not by doing what they do, but by doing what NOBODY does.

---

*Research compiled from analysis of 25+ event scheduling and calendar management tools, their public feature sets, user reviews, and product documentation. Current as of early 2025.*
