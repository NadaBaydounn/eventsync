# EventSync — AI-Powered Event Scheduler
# 🏆 COMPETITION MODE: BUILD TO WIN

# CRITICAL TECH CONTEXT
- This is Next.js 16.1.6 with Tailwind v4 (NOT v3)
- Tailwind v4: use @import "tailwindcss" NOT @tailwind base/components/utilities
- Tailwind v4: use @theme {} NOT @layer base { :root {} }
- Tailwind v4: opacity modifiers like bg-white/80 do NOT work in @apply — use plain CSS instead
- shadcn/ui components are installed and available
- AI uses Google Gemini 2.0 Flash (FREE), client at src/lib/ai/client.ts
- All Supabase clients, hooks, types, validators, constants are pre-built in src/lib/
- Always use "use client" directive for components with hooks, state, or browser APIs

## Mission Statement
We are a junior dev competing against ~100 seniors. Our weapon is Claude Code + a vision so detailed and polished that the output looks like a funded startup's MVP. Every pixel matters. Every interaction should feel magical. Judges should open this and think "there's no way one person built this in an hour."

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14+ (App Router)** | Full-stack, SSR, API routes, instant Vercel deploy |
| Language | **TypeScript (strict)** | Type safety, professional codebase |
| Styling | **Tailwind CSS + shadcn/ui** | Beautiful, consistent, fast |
| Database | **Supabase (PostgreSQL + Auth + Realtime + Storage)** | Everything-in-one backend |
| AI | **Google Gemini 2.0 Flash (FREE tier)** | Chatbot, agents, OCR, planning |
| Calendar | **FullCalendar React** | Google Calendar-quality views |
| Animations | **Framer Motion** | Buttery smooth micro-interactions |
| Charts | **Recharts** | Dashboard analytics |
| Icons | **Lucide React** | Clean, consistent |
| Toasts | **Sonner** | Beautiful notifications |
| Forms | **React Hook Form + Zod** | Robust validation |
| State | **Zustand** | Lightweight global state |
| Dates | **date-fns** | Date manipulation |
| Export | **ics** (npm) | .ics calendar export |
| CSV | **Papaparse** | CSV import/export |
| Fonts | **Cal Sans (display) + Inter (body) + JetBrains Mono (code/times)** | Distinctive, professional |
| Deployment | **Vercel** | One command deploy |
| Command Palette | **cmdk** | Power-user Cmd+K |
| Drawers | **vaul** | Mobile-friendly drawers |
| Color | **color** or **chroma-js** | Dynamic theme generation from user-picked color |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx              # Centered auth layout, animated background
│   ├── (app)/                      # Protected routes — requires auth
│   │   ├── layout.tsx              # Sidebar + Topbar + AI Panel
│   │   ├── page.tsx                # Dashboard home (redirect or overview)
│   │   ├── calendar/page.tsx       # Full calendar view
│   │   ├── events/
│   │   │   ├── page.tsx            # Events list/grid view
│   │   │   ├── new/page.tsx        # Create event (wizard-style)
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Event detail view
│   │   │       ├── edit/page.tsx   # Edit event
│   │   │       └── reflect/page.tsx # Post-event reflection
│   │   ├── dashboard/page.tsx      # Analytics & stats
│   │   ├── notifications/page.tsx  # Notification center
│   │   ├── settings/page.tsx       # Profile, theme, preferences
│   │   ├── team/page.tsx           # Organization/team management
│   │   └── ai/page.tsx             # AI (FREE — no credit card needed) assistant full page (optional)
│   ├── share/[token]/page.tsx      # Public shared view (NO auth)
│   ├── invite/[token]/page.tsx     # RSVP page (NO auth needed)
│   ├── poll/[id]/page.tsx          # Public poll/form (NO auth)
│   ├── api/
│   │   ├── events/route.ts
│   │   ├── ai/chat/route.ts
│   │   ├── ai/extract/route.ts     # OCR from image/PDF
│   │   ├── ai/plan/route.ts        # Event planning agent
│   │   ├── ai/suggest/route.ts     # Suggestions agent
│   │   ├── export/ics/route.ts
│   │   ├── import/csv/route.ts
│   │   ├── share/route.ts
│   │   ├── notifications/route.ts
│   │   └── polls/route.ts
│   ├── layout.tsx                  # Root layout (fonts, providers, theme)
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── layout/
│   │   ├── Sidebar.tsx             # Collapsible, animated sidebar
│   │   ├── Topbar.tsx              # Search, notifications bell, user avatar
│   │   ├── MobileNav.tsx           # Bottom tab bar for mobile
│   │   └── CommandPalette.tsx      # Cmd+K — search events, navigate, quick actions
│   ├── calendar/
│   │   ├── CalendarView.tsx        # FullCalendar wrapper
│   │   ├── EventPopover.tsx        # Quick preview on hover/click
│   │   ├── MiniCalendar.tsx        # Small sidebar calendar
│   │   └── ConflictBadge.tsx       # Visual indicator for overlapping events
│   ├── events/
│   │   ├── EventCard.tsx           # Card with event-type theme
│   │   ├── EventForm.tsx           # Create/Edit form (multi-step wizard)
│   │   ├── EventTypeSelector.tsx   # Visual dropdown with themed previews
│   │   ├── EventDetailView.tsx     # Full event page
│   │   ├── EventStatusBadge.tsx    # Upcoming/Attending/Maybe/Declined
│   │   ├── EventLockDialog.tsx     # Lock with password
│   │   ├── EventTimeline.tsx       # Timeline view of events
│   │   ├── EventReflection.tsx     # Post-event notes, rating, images
│   │   ├── QuickEventButton.tsx    # Floating "+" button
│   │   └── ImportDialog.tsx        # CSV/Image/PDF import
│   ├── dashboard/
│   │   ├── StatsGrid.tsx           # Key metrics cards
│   │   ├── EventsByTypeChart.tsx   # Donut/pie chart
│   │   ├── EventsTimelineChart.tsx # Line chart over time
│   │   ├── StatusBreakdown.tsx     # Bar chart by status
│   │   ├── UpcomingWidget.tsx      # Next 5 events widget
│   │   ├── BusiestDaysChart.tsx    # Heatmap of busiest days
│   │   └── AttendanceRate.tsx      # RSVP response rates
│   ├── ai/
│   │   ├── AIChatPanel.tsx         # Slide-out chat panel
│   │   ├── AIChatBubble.tsx        # Individual message
│   │   ├── AISuggestionCard.tsx    # What to wear, bring, etc.
│   │   ├── AIPlanningWizard.tsx    # Multi-step planning flow
│   │   ├── AIImportPreview.tsx     # Preview extracted event from image
│   │   └── VoiceInput.tsx          # Speech-to-text event creation
│   ├── theme/
│   │   ├── ThemeProvider.tsx       # next-themes wrapper
│   │   ├── ThemeToggle.tsx         # Light/Dark/System toggle
│   │   ├── ColorPicker.tsx         # Custom color → full theme
│   │   └── EventThemeWrapper.tsx   # Wraps content in event-type colors
│   ├── team/
│   │   ├── TeamManager.tsx         # Add/remove members
│   │   ├── RoleSelector.tsx        # Admin/Editor/Viewer
│   │   ├── InviteMemberDialog.tsx  # Send invites
│   │   └── PermissionsGrid.tsx     # Granular permissions matrix
│   ├── notifications/
│   │   ├── NotificationBell.tsx    # Topbar bell with badge count
│   │   ├── NotificationList.tsx    # All notifications
│   │   ├── NotificationItem.tsx    # Single notification
│   │   └── ReminderCreator.tsx     # Custom notification/reminder
│   ├── share/
│   │   ├── ShareDialog.tsx         # Generate & copy share link
│   │   ├── PublicCalendarView.tsx  # What shared users see
│   │   └── RSVPForm.tsx            # Public RSVP
│   └── common/
│       ├── EmptyState.tsx          # Beautiful empty states with illustrations
│       ├── LoadingSkeleton.tsx     # Shimmer loading
│       ├── ErrorBoundary.tsx       # Graceful error handling
│       ├── ConfettiEffect.tsx      # Celebration animation
│       ├── AnimatedCounter.tsx     # Number counting up animation
│       └── GradientBlob.tsx        # Decorative background blobs
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   ├── middleware.ts           # Auth middleware
│   │   └── database.types.ts      # Generated types
│   ├── ai/
│   │   ├── client.ts              # Google Gemini API wrapper
│   │   ├── prompts/
│   │   │   ├── chatbot.ts         # General assistant system prompt
│   │   │   ├── extractor.ts       # OCR → event data
│   │   │   ├── planner.ts         # Event planning agent
│   │   │   ├── suggester.ts       # Attire, gifts, weather, prep
│   │   │   └── voice-parser.ts    # Voice transcript → structured event
│   │   └── agents/
│   │       ├── chat-agent.ts
│   │       ├── planning-agent.ts
│   │       ├── suggestion-agent.ts
│   │       └── import-agent.ts
│   ├── utils/
│   │   ├── cn.ts                  # clsx + tailwind-merge
│   │   ├── dates.ts               # Date formatting helpers
│   │   ├── colors.ts              # HSL palette generation from single color
│   │   ├── share-tokens.ts        # Generate/validate share tokens
│   │   └── export.ts              # ICS generation, CSV export
│   ├── validators/
│   │   ├── event.ts               # Event Zod schemas
│   │   ├── auth.ts                # Auth schemas
│   │   └── team.ts                # Team/org schemas
│   ├── constants/
│   │   ├── event-themes.ts        # 12 event type themes
│   │   ├── animations.ts          # Framer Motion presets
│   │   ├── defaults.ts            # Default notification settings, etc.
│   │   └── demo-data.ts           # Seed data for demo
│   └── hooks/
│       ├── useEvents.ts           # CRUD + realtime subscriptions
│       ├── useAuth.ts             # Auth state
│       ├── useTheme.ts            # Theme + custom color
│       ├── useNotifications.ts    # Notification logic
│       ├── useAI.ts               # AI (FREE — no credit card needed) chat state
│       ├── useKeyboard.ts         # Keyboard shortcuts
│       └── useMediaQuery.ts       # Responsive helpers
├── types/
│   ├── events.ts
│   ├── team.ts
│   ├── ai.ts
│   └── supabase.ts                # Auto-generated
├── styles/
│   └── fonts.ts                   # Font configuration
└── public/
    ├── icons/events/              # Per-type SVG icons
    ├── illustrations/             # Empty state illustrations
    └── og-image.png               # Social preview
```

---

## Design System

### Visual Philosophy
This app should look like it was designed by a team at Linear, Vercel, or Notion. Clean lines, generous whitespace, subtle depth, and attention to micro-interactions. NOT generic Bootstrap. NOT template-looking.

Key design principles:
- **Depth through subtle shadows**, not borders (except sparingly)
- **Glassmorphism** for floating panels (AI chat, popovers)
- **Gradient accents** — subtle gradients on buttons and key UI
- **Generous padding** — things should breathe
- **Consistent 4px/8px grid** — everything aligns
- **Motion is meaning** — animations communicate state changes, not just decoration

### Color System
```
Base palette (CSS variables):
--background        # Page background
--foreground        # Primary text
--card              # Card/surface background
--card-foreground   # Text on cards
--primary           # Primary action color (user-customizable!)
--primary-foreground
--secondary         # Secondary backgrounds
--muted             # Disabled/subtle elements
--accent            # Hover states
--destructive       # Delete/error
--border            # Subtle borders
--ring              # Focus rings

Event type colors override --primary contextually
```

### Custom Theme Engine
When user picks a color (e.g., #6366F1):
1. Extract HSL values
2. Generate 11 shades (50-950) using HSL lightness stepping
3. Auto-determine if text should be light/dark via WCAG contrast ratio
4. Apply as CSS variables instantly
5. Persist to user profile in Supabase
6. Light mode: use shade 600 as primary, 50 as bg tint
7. Dark mode: use shade 400 as primary, 950 as bg tint

Implementation: Create a `generatePalette(hex: string)` function in `lib/utils/colors.ts`

### Typography
```css
/* Import in layout.tsx via next/font */
--font-display: 'Cal Sans', 'Plus Jakarta Sans', sans-serif;  /* Headings */
--font-body: 'Inter', system-ui, sans-serif;                    /* Body text */
--font-mono: 'JetBrains Mono', monospace;                       /* Times, codes */
```

Font size scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60

### Animations (Framer Motion Presets)

```typescript
// lib/constants/animations.ts
export const animations = {
  // Page transitions
  pageEnter: { opacity: 0, y: 20 } → { opacity: 1, y: 0, transition: { duration: 0.3 } },
  pageExit: { opacity: 0, y: -10 },

  // Card interactions
  cardHover: { scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
  cardTap: { scale: 0.98 },

  // Stagger children (for lists)
  staggerParent: { transition: { staggerChildren: 0.05 } },
  staggerChild: { opacity: 0, y: 10 } → { opacity: 1, y: 0 },

  // Status change
  statusMorph: { transition: { type: "spring", stiffness: 300, damping: 20 } },

  // Sidebar
  sidebarExpand: { width: 240 },
  sidebarCollapse: { width: 64 },

  // Float (for trip events)
  float: { y: [-4, 4, -4], transition: { repeat: Infinity, duration: 3 } },

  // Pulse (for sports events)
  pulse: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } },

  // Confetti burst (party/birthday events)
  confetti: trigger on event creation with type party/birthday,

  // Breathe (health events)
  breathe: { scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 4 } },

  // Shimmer loading
  shimmer: { backgroundPosition: ["-200%", "200%"], transition: { repeat: Infinity, duration: 1.5 } },

  // Number count up
  countUp: { from: 0 to target, duration: 1.5, ease: "easeOut" },

  // Modal
  modalEnter: { opacity: 0, scale: 0.95 } → { opacity: 1, scale: 1 },
  modalExit: { opacity: 0, scale: 0.95 },
}
```

### Event-Specific Animations
When an event type is selected in the form, the ENTIRE form section morphs:
- Background color fades to event theme color (light tint)
- Relevant emoji floats in the corner
- Small themed icon appears next to title
- Submit button changes color to match theme
- For party/birthday: tiny confetti particles in background
- For trip: subtle clouds/plane animation
- For tech: matrix-rain or terminal cursor blink
- For concert: subtle audio waveform line
- For sports: energy pulse ring

---

## Event Type Themes — Full Specification

```typescript
// Each theme includes: emoji, icon, color palette, animation, form decoration
// The form, cards, calendar chips, and detail pages ALL adapt to these

export const EVENT_THEMES = {
  party: {
    emoji: '🎉', icon: 'PartyPopper',
    gradient: 'from-rose-500 to-orange-400',
    bgTint: 'bg-rose-50 dark:bg-rose-950/20',
    ring: 'ring-rose-500/30',
    animation: 'confetti',
    formDecoration: 'floating party emoji, confetti particles',
    calendarChip: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
    suggestions: ['party outfit', 'gift ideas', 'plus-one etiquette'],
  },
  educational: {
    emoji: '📚', icon: 'GraduationCap',
    gradient: 'from-blue-500 to-cyan-400',
    bgTint: 'bg-blue-50 dark:bg-blue-950/20',
    ring: 'ring-blue-500/30',
    animation: 'fadeSlide',
    formDecoration: 'book stack icon, pencil line animation',
    calendarChip: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    suggestions: ['what notebook to bring', 'prep reading materials'],
  },
  trip: {
    emoji: '✈️', icon: 'Plane',
    gradient: 'from-teal-500 to-sky-400',
    bgTint: 'bg-teal-50 dark:bg-teal-950/20',
    ring: 'ring-teal-500/30',
    animation: 'float',
    formDecoration: 'clouds drifting, plane icon, destination pin',
    calendarChip: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
    suggestions: ['packing list', 'weather at destination', 'travel time', 'nearby restaurants'],
  },
  business: {
    emoji: '💼', icon: 'Briefcase',
    gradient: 'from-slate-600 to-gray-500',
    bgTint: 'bg-slate-50 dark:bg-slate-950/20',
    ring: 'ring-slate-500/30',
    animation: 'slideUp',
    formDecoration: 'minimal, clean lines, subtle grid',
    calendarChip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    suggestions: ['dress code', 'agenda prep', 'meeting notes template'],
  },
  sports: {
    emoji: '🏋️', icon: 'Dumbbell',
    gradient: 'from-green-500 to-emerald-400',
    bgTint: 'bg-green-50 dark:bg-green-950/20',
    ring: 'ring-green-500/30',
    animation: 'pulse',
    formDecoration: 'energy rings, heartbeat line',
    calendarChip: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    suggestions: ['what to wear', 'hydration reminder', 'warm-up routine'],
  },
  concert: {
    emoji: '🎵', icon: 'Music',
    gradient: 'from-purple-500 to-violet-400',
    bgTint: 'bg-purple-50 dark:bg-purple-950/20',
    ring: 'ring-purple-500/30',
    animation: 'wave',
    formDecoration: 'sound wave line, music notes floating',
    calendarChip: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    suggestions: ['outfit', 'ear protection', 'venue info', 'parking/transit'],
  },
  dining: {
    emoji: '🍽️', icon: 'UtensilsCrossed',
    gradient: 'from-amber-500 to-orange-400',
    bgTint: 'bg-amber-50 dark:bg-amber-950/20',
    ring: 'ring-amber-500/30',
    animation: 'fadeSlide',
    formDecoration: 'plate icon, subtle cutlery pattern',
    calendarChip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    suggestions: ['dress code', 'dietary restrictions to share', 'reservation details'],
  },
  birthday: {
    emoji: '🎂', icon: 'Cake',
    gradient: 'from-pink-500 to-rose-400',
    bgTint: 'bg-pink-50 dark:bg-pink-950/20',
    ring: 'ring-pink-500/30',
    animation: 'confetti',
    formDecoration: 'balloons floating, candles, confetti',
    calendarChip: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
    suggestions: ['gift ideas for age group', 'card message', 'party supplies checklist'],
  },
  tech: {
    emoji: '💻', icon: 'Code2',
    gradient: 'from-emerald-400 to-green-500',
    bgTint: 'bg-gray-900 dark:bg-gray-950',
    ring: 'ring-green-500/30',
    animation: 'glitch',
    formDecoration: 'terminal cursor blink, matrix-inspired subtle code rain',
    calendarChip: 'bg-gray-800 text-green-400',
    suggestions: ['laptop charged', 'dev environment ready', 'API keys', 'project repos'],
  },
  health: {
    emoji: '🏥', icon: 'HeartPulse',
    gradient: 'from-emerald-400 to-teal-400',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/20',
    ring: 'ring-emerald-500/30',
    animation: 'breathe',
    formDecoration: 'heartbeat line, calm gradient pulse',
    calendarChip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
    suggestions: ['insurance card', 'medical records', 'fasting requirements', 'questions for doctor'],
  },
  art: {
    emoji: '🎨', icon: 'Palette',
    gradient: 'from-fuchsia-500 to-pink-400',
    bgTint: 'bg-fuchsia-50 dark:bg-fuchsia-950/20',
    ring: 'ring-fuchsia-500/30',
    animation: 'splash',
    formDecoration: 'paint splatter accent, color wheel hint',
    calendarChip: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-200',
    suggestions: ['supplies to bring', 'inspiration references', 'comfortable clothing'],
  },
  wedding: {
    emoji: '💒', icon: 'Heart',
    gradient: 'from-rose-300 to-pink-300',
    bgTint: 'bg-rose-50 dark:bg-rose-950/10',
    ring: 'ring-rose-400/30',
    animation: 'sparkle',
    formDecoration: 'hearts floating, elegant gold accents, rings icon',
    calendarChip: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-200',
    suggestions: ['dress code', 'gift registry', 'RSVP deadline', 'speech prep', 'transportation'],
  },
  volunteer: {
    emoji: '🤝', icon: 'HandHeart',
    gradient: 'from-amber-400 to-yellow-400',
    bgTint: 'bg-amber-50 dark:bg-amber-950/20',
    ring: 'ring-amber-400/30',
    animation: 'glow',
    formDecoration: 'warm glow, helping hands icon',
    calendarChip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    suggestions: ['what to wear', 'what to bring', 'waiver forms', 'carpool options'],
  },
  general: {
    emoji: '📅', icon: 'CalendarDays',
    gradient: 'from-indigo-500 to-blue-400',
    bgTint: 'bg-indigo-50 dark:bg-indigo-950/20',
    ring: 'ring-indigo-500/30',
    animation: 'fadeSlide',
    formDecoration: 'clean, subtle calendar grid pattern',
    calendarChip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
    suggestions: [],
  },
}
```

---

## Database Schema (Supabase SQL)

Run this in the Supabase SQL editor after creating the project:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  theme_mode TEXT DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
  custom_color TEXT DEFAULT '#6366F1',  -- User's custom primary color
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "reminders": ["1h", "1d"]}',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ORGANIZATIONS (company level)
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{}',
  max_members INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORGANIZATION MEMBERS
-- ============================================
CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{"can_create": false, "can_edit": false, "can_delete": false, "can_invite": false, "can_export": false}',
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(org_id, user_id)
);

-- ============================================
-- EVENTS (core table)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'general' CHECK (event_type IN (
    'party', 'educational', 'trip', 'business', 'sports', 'concert',
    'dining', 'birthday', 'tech', 'health', 'art', 'wedding', 'volunteer', 'general'
  )),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  virtual_link TEXT,  -- Zoom/Meet link for virtual events
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'attending', 'maybe', 'declined', 'completed', 'cancelled')),
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,  -- RRULE string (RFC 5545)
  is_locked BOOLEAN DEFAULT false,
  lock_password_hash TEXT,  -- bcrypt hash, never store plain
  color_override TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
  budget DECIMAL(10,2),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',  -- [{name, url, type}]
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',  -- AI suggestions, extra data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast search
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_org_id ON events(org_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_title_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================
-- EVENT INVITATIONS / RSVP
-- ============================================
CREATE TABLE event_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_name TEXT,
  invitee_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  rsvp_message TEXT,
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),  -- For public RSVP link
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(event_id, invitee_email)
);

-- ============================================
-- SHARE LINKS
-- ============================================
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('single_event', 'calendar', 'org_calendar')),
  target_id UUID NOT NULL,  -- event_id or org_id
  permissions TEXT DEFAULT 'view' CHECK (permissions IN ('view', 'comment')),
  password_hash TEXT,  -- Optional password protection
  expires_at TIMESTAMPTZ,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'invitation', 'update', 'rsvp', 'custom', 'ai_suggestion')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  action_url TEXT,  -- Deep link into app
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================
-- EVENT REFLECTIONS (post-event)
-- ============================================
CREATE TABLE event_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  thoughts TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  mood TEXT CHECK (mood IN ('amazing', 'good', 'okay', 'meh', 'bad')),
  improvements TEXT,
  highlights TEXT,
  images TEXT[] DEFAULT '{}',  -- Supabase Storage URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- POLLS / FORMS (audience choices)
-- ============================================
CREATE TABLE event_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  poll_type TEXT DEFAULT 'single' CHECK (poll_type IN ('single', 'multiple', 'text', 'date_picker')),
  options JSONB NOT NULL DEFAULT '[]',  -- [{id, label, emoji?}]
  deadline TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT false,
  allow_other BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES event_polls(id) ON DELETE CASCADE,
  respondent_email TEXT,
  respondent_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  selected_options JSONB NOT NULL,  -- [option_ids] or {text: "..."}
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, respondent_email)
);

-- ============================================
-- AI CONVERSATIONS
-- ============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  context TEXT CHECK (context IN ('general', 'planning', 'suggestions', 'import')),
  messages JSONB DEFAULT '[]',  -- [{role, content, timestamp}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG (audit trail — impressive for judges)
-- ============================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,  -- 'event.created', 'event.edited', 'invitation.sent', etc.
  target_type TEXT,      -- 'event', 'invitation', 'poll'
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_log(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (expand as needed)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own events" ON events FOR SELECT USING (
  created_by = auth.uid() 
  OR org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  OR visibility = 'public'
);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own AI chats" ON ai_conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create AI chats" ON ai_conversations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own AI chats" ON ai_conversations FOR UPDATE USING (user_id = auth.uid());
```

---

## AI (FREE — no credit card needed) System Design

### System Prompts

#### General Chatbot (`lib/ai/prompts/chatbot.ts`)
```
You are EventSync AI — a helpful assistant for an event scheduling app.
You help users:
- Create events quickly from natural language ("add a team meeting next Tuesday at 2pm")
- Navigate the app ("how do I share my calendar?")
- Answer questions about their events ("what do I have this week?")
- Provide tips for event planning

Context you receive: user's upcoming events, current page, user preferences.
Always be concise, friendly, and actionable. Use emoji sparingly.
If the user describes an event, extract: title, date/time, location, type, description.
Return structured JSON when creating events: { action: "create_event", data: {...} }
```

#### Event Extractor (`lib/ai/prompts/extractor.ts`)
```
You are an event data extractor. Given an image or PDF of an event announcement/flyer/invitation, extract:
- title (string)
- date and time (ISO 8601)
- end_time if available
- location (string)
- description (summary of the event)
- event_type (one of: party, educational, trip, business, sports, concert, dining, birthday, tech, health, art, wedding, volunteer, general)
- virtual_link if any URL for virtual attendance

Return ONLY valid JSON. If a field cannot be determined, use null.
Be smart about relative dates ("this Saturday" = calculate from current date).
```

#### Planning Agent (`lib/ai/prompts/planner.ts`)
```
You are an event planning specialist. Help the user plan their event comprehensively.
Based on the event type and details, provide:

1. **Checklist**: Step-by-step planning checklist with deadlines relative to event date
2. **Budget**: Estimated budget breakdown by category
3. **Guest List**: Suggestions for who to invite based on event type
4. **Logistics**: Venue considerations, equipment needed, timeline for the day
5. **Speeches/Content**: If relevant, speech outlines or activity ideas
6. **Risk Mitigation**: What could go wrong and backup plans

Structure response as JSON:
{
  "checklist": [{ "task": "", "deadline": "", "priority": "" }],
  "budget": { "total_estimate": 0, "categories": [{ "name": "", "estimate": 0 }] },
  "guest_suggestions": [""],
  "logistics": { "timeline": [], "equipment": [], "venue_tips": [] },
  "content": { "speech_outline": "", "activities": [] },
  "risks": [{ "risk": "", "mitigation": "" }]
}
```

#### Suggestion Agent (`lib/ai/prompts/suggester.ts`)
```
You are a personal event preparation advisor. Given an event's details (type, location, date, time), suggest:

1. **What to Wear**: Appropriate outfit based on event type, venue, and weather
2. **What to Bring**: Items to bring (gifts if applicable, documents, supplies)
3. **How to Prepare**: Things to do before the event
4. **Travel**: Estimated travel time, best route suggestions, parking tips
5. **Weather**: Current/forecast weather and recommendations (umbrella, sunscreen, layers)
6. **Etiquette**: Social tips specific to event type

Keep suggestions practical, specific, and personalized to the event.
Return as JSON with sections.
```

#### Voice Parser (`lib/ai/prompts/voice-parser.ts`)
```
You receive a transcript from speech-to-text. The user is describing an event they want to create.
Extract structured event data from natural speech, handling:
- Relative dates ("next Friday", "two weeks from now", "tomorrow at 3")
- Casual descriptions ("dinner with Sarah at that Italian place on 5th")
- Implied fields (dinner → dining type, 7pm default if time not specified)

Return JSON matching the event creation schema.
Handle ambiguity by making reasonable defaults and flagging uncertain fields.
```

### AI (FREE — no credit card needed) Features Implementation Notes

**Image/PDF Import (Premium)**
- User uploads image/PDF via dropzone
- Convert to base64 in browser
- Send to `/api/ai/extract` which calls Claude with vision
- Show extracted data in pre-filled form for user confirmation
- User can edit any field before saving

**Voice Event Creation (Premium)**
- Use Web Speech API (browser native, free!)
- `SpeechRecognition` API → transcript
- Send transcript to Claude for parsing
- Show pre-filled form for confirmation
- Add a pulsing microphone button in the event creation form

**AI Chat Panel**
- Floating button bottom-right (like Intercom)
- Slide-out panel with chat interface
- Context-aware: knows what page user is on, their events
- Can trigger actions: create event, navigate, search
- Streaming responses (Gemini API streaming)

**Planning Agent (Premium)**
- Available on event detail page: "Help me plan this" button
- Opens multi-step wizard
- Each step populated by Claude
- User can edit and save each section
- Saved to event.metadata.plan

**Suggestion Agent (Premium)**
- Automatically triggers for upcoming events (next 48h)
- Shows as a card on event detail page
- "What to bring", "What to wear", "Weather forecast"
- Integrates weather API for real data
- Refreshes suggestions as event approaches

---

## Feature Details

### Command Palette (Cmd+K)
Power-user feature that will IMPRESS judges. Opens overlay with:
- Search events by title
- Quick actions: "New event", "Go to calendar", "Toggle dark mode"
- Navigate to any page
- Change status of an event
- Open AI chat
Implementation: `cmdk` library, fuzzy search, keyboard navigation

### Keyboard Shortcuts
- `Cmd/Ctrl + K` — Command palette
- `Cmd/Ctrl + N` — New event
- `Cmd/Ctrl + /` — Toggle AI chat
- `Cmd/Ctrl + D` — Toggle dark mode
- `←/→` — Navigate calendar weeks
- `Esc` — Close modals/panels

### Onboarding Flow
First-time users see a 3-step onboarding:
1. "Welcome to EventSync!" — Enter name, upload avatar
2. "Pick your style" — Choose light/dark, pick custom color
3. "Create your first event" — Quick event creation
Skip button available. Mark `onboarding_completed = true` after.

### Empty States
Every page has a beautiful empty state:
- Calendar: "No events yet — your calendar is a blank canvas 🎨"
- Dashboard: "Add some events to see your analytics come alive 📊"
- Notifications: "All caught up! 🎉"
- Team: "Go solo or build your crew 👥"
Each with an illustration/icon, primary CTA button, and secondary hint text.

### Share System
- "Share" button on any event or calendar → generates unique token
- Link format: `yourapp.vercel.app/share/abc123`
- Shared page has its own beautiful layout (no sidebar, branded header)
- Shows calendar or single event in read-only mode
- Optional: password-protect the share link
- Viewer can add events to their own calendar via .ics download
- No login required to view

### Export System
- Single event → .ics file download
- Full calendar → .ics file with all events
- CSV export of events list
- Add to Google Calendar button (constructs gcal URL)
- Add to Outlook button (constructs outlook URL)

### Import System
- CSV upload with column mapping UI
- Drag & drop zone
- Preview imported events before saving
- Image/PDF upload (Premium) → AI extraction
- Paste text → AI parsing (Premium)

### Notification System
Default reminders per event:
- 1 hour before
- 1 day before
Custom reminders:
- User picks: X minutes/hours/days before
- Custom message optional
- Stored in `notifications` table with `scheduled_for`
In-app notification bell:
- Real-time with Supabase Realtime subscriptions
- Unread badge count
- Mark as read, mark all as read
- Click → navigate to relevant event

### Event Lock
- Toggle lock on event → prompts for password
- Password is bcrypt hashed, stored in `lock_password_hash`
- Locked events show 🔒 icon, grayed edit/delete buttons
- To unlock: enter password → unlock for session
- Locked events cannot be edited or deleted without password
- Visual: locked events have a subtle shield/lock overlay

### Event Reflections (Post-Event)
After an event passes:
- Show prompt: "How was [Event Name]? ✨"
- Rate 1-5 stars + mood (amazing/good/okay/meh/bad)
- Text field for thoughts
- Text field for improvements
- Text field for highlights
- Upload photos (Supabase Storage)
- Saved per user per event
- Shows on event detail page as a "memories" section
- Dashboard includes reflection stats (avg rating, mood breakdown)

### Polls/Forms
- Event creator can add polls to any event
- Poll types: single choice, multiple choice, free text, date picker
- Polls have deadlines
- Public URL for respondents (no auth needed)
- Real-time results with animated charts
- Results visible to event creator
- Use case: "What food should we order?", "Which date works best?"

### Team/Organization
- Create organization with name + slug
- Invite members by email
- Roles: Admin / Editor / Viewer
- Admin can customize each member's permissions granularly
- Shared team calendar
- Team events visible to all members
- Activity log shows who did what (audit trail)
- Max 10 members on free, unlimited on premium

### Dashboard Analytics
Impress judges with real analytics:
- **Stats Grid**: Total events, upcoming, completed, cancelled (animated counters)
- **Events by Type**: Donut chart with event type distribution
- **Monthly Timeline**: Line chart showing events per month
- **Status Breakdown**: Horizontal bar chart
- **Busiest Days**: Heatmap (like GitHub contribution graph!)
- **RSVP Rates**: If invitations sent, show acceptance rates
- **Upcoming Next 7 Days**: Mini timeline widget
- **Reflection Score**: Average event satisfaction
- **Time Spent in Events**: Total hours by type (stacked bar)

ALL charts should animate in on page load (Recharts supports this natively).

---

## Demo Data

CRITICAL: Seed the app with impressive demo data so judges see a LIVING app, not an empty shell.

Create a `lib/constants/demo-data.ts` with ~15-20 events across different types:
- A tech conference next week
- A team birthday party
- A business quarterly review
- A weekend hiking trip
- A concert next month
- A dinner reservation
- A wedding in 3 months
- A volunteer event
- An art workshop
- Several past events with reflections filled in
- Some with invitations (mix of accepted/declined/pending)
- A couple of recurring events (weekly standup, monthly book club)

Seed this on first login (if user has 0 events) or via a "Load demo data" button in settings.

---

## Competition Winning Details

### Things seniors won't think of:
1. **Animated page transitions** — pages don't just appear, they flow
2. **Skeleton loading** on every async operation — never show a blank screen
3. **Optimistic updates** — UI updates instantly, syncs in background
4. **Empty states with personality** — not just "no data", but illustrations + CTAs
5. **Keyboard shortcuts + command palette** — shows you think about power users
6. **Activity audit log** — shows enterprise-readiness
7. **RSVP public pages** — shows you think about the full user journey
8. **GitHub-style heatmap** — instantly recognizable, impressive
9. **Event-type animations** — shows attention to detail and creativity
10. **Reflection/memories** — shows you think about the event lifecycle end-to-end
11. **Password-protected share links** — shows security awareness
12. **Onboarding flow** — shows UX maturity

### Things that take 5 minutes but look like 5 hours:
- Add `framer-motion` `layoutId` to event cards → shared layout animations when navigating
- Add `sonner` toasts with event emojis on every action
- Add confetti on event creation (party/birthday types)
- Add count-up animation on dashboard numbers
- Add subtle parallax scroll on the landing/share page
- Gradient border on the AI chat panel (animated gradient)
- "Powered by AI ✨" shimmer badge on premium features

### README Structure
```markdown
# 🗓️ EventSync — AI-Powered Event Scheduler

> Built for [Competition Name] — the smartest way to plan, track, and share events.

## 🚀 Live Demo
**[https://eventsync.vercel.app](https://eventsync.vercel.app)**

Demo Account: demo@eventsync.app / password123

## ✨ Features
[Grid of feature cards with emojis — visual, scannable]

## 🛠️ Tech Stack
[Table format]

## 📦 Quick Start
\`\`\`bash
git clone ...
npm install
cp .env.example .env.local
# Fill in Supabase + Gemini keys
npm run dev
\`\`\`

## 🏗️ Architecture
[Brief diagram or description]

## 🤖 AI Features
[Highlight the AI stuff — this is your differentiator]

## 📸 Screenshots
[If time allows, add 2-3 screenshots]
```

---

## Coding Standards

### Rules Claude Code MUST follow:
1. **TypeScript strict** — no `any`, no `as any`, proper generics
2. **Server Components by default** — `'use client'` only when needed (hooks, interactivity)
3. **Error handling everywhere** — try/catch, error boundaries, fallback UI
4. **Loading states everywhere** — `<Suspense>` with skeleton fallbacks
5. **Zod validation** on all inputs (forms AND API routes)
6. **Never expose secrets** — GOOGLE_GEMINI_API_KEY only in server routes
7. **Use `cn()` helper** for conditional classnames (clsx + tailwind-merge)
8. **Mobile responsive** — test at 375px width minimum
9. **Accessible** — proper aria labels, keyboard navigation, focus management
10. **Semantic HTML** — proper headings, landmarks, button vs div

### Component Pattern:
```tsx
'use client'  // Only if needed

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Props {
  // Explicit props, no `any`
}

export function ComponentName({ ...props }: Props) {
  // Hooks at top
  // Early returns for loading/error/empty states
  // Main render
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "base classes",
        conditional && "conditional classes",
      )}
    >
      {/* Content */}
    </motion.div>
  )
}
```

### API Route Pattern:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { eventSchema } from '@/lib/validators/event'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const validated = eventSchema.parse(body)

    const { data, error } = await supabase
      .from('events')
      .insert({ ...validated, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (FREE — no credit card needed)
GOOGLE_GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EventSync

# Optional
RESEND_API_KEY=
OPENWEATHER_API_KEY=
```

---

## Build Order (Priority Queue)

When building, follow this order — if time runs out, we still have a great submission:

### P0 — Must Have (Foundation)
1. Auth (Supabase login/register)
2. Event CRUD with themed form
3. Calendar view (FullCalendar)
4. Basic search
5. Deploy to Vercel

### P1 — Core Differentiators
6. Event type themes (colors, emojis, animations)
7. Dark/Light/Custom color theme
8. Dashboard with charts
9. AI Chatbot panel
10. Share links

### P2 — Impressive Features
11. .ics export
12. CSV import
13. Event lock with password
14. Notifications system
15. Command palette (Cmd+K)

### P3 — Premium Wow
16. AI event import from image/PDF
17. AI planning agent
18. AI suggestion agent
19. Voice event creation
20. Polls/forms

### P4 — Polish
21. Onboarding flow
22. Demo seed data
23. Event reflections
24. Organization/team management
25. Activity audit log
26. README with screenshots

---

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build (run before deploy!)
npm run lint             # Check for errors
vercel                   # Deploy (needs vercel CLI: npm i -g vercel)
vercel --prod            # Production deploy
```

---

## Final Notes for Claude Code

- You are building a competition entry. EVERY DETAIL MATTERS.
- Animations are not optional — they are part of the product.
- The theme system with event-type colors is a core differentiator.
- AI features should work with real Gemini API calls, not mocked.
- When in doubt, choose the option that looks more impressive.
- Mobile must work — judges might test on their phones.
- Speed matters — use Next.js caching, React Suspense, optimistic updates.
- Seed demo data so the app never looks empty during judging.
- The README is part of the submission — make it beautiful.
- Deploy early and often. A working URL beats a local masterpiece.
