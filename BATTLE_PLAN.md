# 🏆 EventSync — 1 Hour Battle Plan

## Pre-Competition (Before Timer Starts)
- [x] CLAUDE.md with full spec ✅
- [ ] Supabase project created + SQL schema pasted
- [ ] Vercel account linked to GitHub repo
- [ ] .env.local filled with real keys
- [ ] bootstrap.sh run successfully
- [ ] `npm run dev` works

---

## MINUTE-BY-MINUTE EXECUTION

### 🟢 Minutes 0-5: Foundation
Tell Claude Code: "Read CLAUDE.md. Build the root layout with Inter + Cal Sans fonts, ThemeProvider (next-themes), Sonner toast provider, and the main app layout with a collapsible sidebar and topbar. Include dark/light toggle."

- [ ] Root layout with fonts + providers
- [ ] Sidebar with navigation links
- [ ] Topbar with search bar + notification bell + avatar
- [ ] Theme toggle (dark/light)
- [ ] Supabase client setup (browser + server)
- [ ] Auth middleware

### 🟢 Minutes 5-12: Auth + First Deploy
Tell Claude Code: "Build login and register pages with Supabase Auth. Email/password + Google OAuth. Beautiful centered layout with animated gradient background. Then deploy to Vercel."

- [ ] Login page (email + Google)
- [ ] Register page
- [ ] Auth callback handler
- [ ] Protected route middleware
- [ ] **FIRST DEPLOY TO VERCEL** ← Get the URL live!

### 🟡 Minutes 12-25: Event CRUD (THE CORE)
Tell Claude Code: "Build the event system: creation form with event type selector showing themed previews (colors, emojis, animations change when type is selected), event list page with cards, event detail page, edit and delete. Use the full event type theme system from CLAUDE.md."

- [ ] Event creation form (multi-step or single page)
- [ ] Event type selector with live theme preview
- [ ] Event list view with themed cards
- [ ] Event detail page
- [ ] Edit event
- [ ] Delete event (with confirmation)
- [ ] Status tracking (upcoming/attending/maybe/declined)

### 🟡 Minutes 25-32: Calendar
Tell Claude Code: "Add FullCalendar with month/week/day/list views. Events show with their type color. Click to view event detail. Support drag events to reschedule. Show overlapping events like Google Calendar."

- [ ] FullCalendar integration
- [ ] Month/Week/Day/List views
- [ ] Color-coded by event type
- [ ] Click → event detail
- [ ] Overlapping event display

### 🟡 Minutes 32-38: Search + Dashboard
Tell Claude Code: "Build search with filters (title, date range, event type, status, location). Then build the dashboard with: animated stat counters, events by type donut chart, monthly timeline line chart, status breakdown bar chart, and a GitHub-style heatmap of busiest days using Recharts."

- [ ] Search page with filters
- [ ] Full-text search on title + description
- [ ] Dashboard with animated stats grid
- [ ] Donut chart (events by type)
- [ ] Line chart (events over time)
- [ ] Status breakdown
- [ ] Heatmap of busiest days

### 🔴 Minutes 38-45: Differentiators
Tell Claude Code: "Add these features: share links (generate token, public page with no auth showing read-only calendar or event), .ics export (single event + full calendar), CSV import with preview, custom color theme picker that generates a full palette, and Cmd+K command palette."

- [ ] Share link generation + public page
- [ ] .ics export
- [ ] CSV import with column mapping
- [ ] Custom color theme engine
- [ ] Command palette (Cmd+K)

### 🔴 Minutes 45-52: AI Features
Tell Claude Code: "Build the AI chat panel using Claude API with streaming. Floating button bottom-right, slide-out panel, context-aware. Then add AI event import from image (upload → Claude vision → pre-filled form). Then add the AI suggestion card on event detail pages."

- [ ] AI chat panel (streaming Claude responses)
- [ ] AI image/PDF → event extraction
- [ ] AI suggestion cards (what to wear, bring, weather)
- [ ] AI event planning button

### 🟣 Minutes 52-55: Polish + Demo Data
Tell Claude Code: "Seed the app with 15 demo events across all types (some past with reflections, some upcoming with invitations). Add beautiful empty states. Add confetti on party/birthday event creation. Add notification bell with sample notifications. Add event lock with password."

- [ ] Demo seed data (15-20 events)
- [ ] Empty states with illustrations
- [ ] Confetti animation
- [ ] Event lock system
- [ ] Notifications

### 🟣 Minutes 55-60: Final Deploy + README
Tell Claude Code: "Final Vercel deploy. Write a stunning README.md with live demo link, feature grid with emojis, tech stack table, quick start guide, and architecture overview."

- [ ] Final `vercel --prod`
- [ ] README.md
- [ ] Test live URL
- [ ] **SUBMIT** 🏆

---

## Emergency Shortcuts

If running behind, SKIP (in order):
1. Skip polls/forms
2. Skip organization/team management
3. Skip voice event creation
4. Skip event reflections
5. Skip activity log
6. Skip onboarding flow

NEVER skip:
- Event CRUD + themes (this IS the app)
- Calendar view
- AI chatbot (this is the differentiator)
- Dashboard (this shows sophistication)
- Deploy (no URL = no submission)

---

## Key Prompt Pattern for Claude Code

For maximum speed, give Claude Code SPECIFIC instructions:
```
❌ "Build the events page"
✅ "Build src/app/(app)/events/page.tsx — a page showing all events as
    animated cards using Framer Motion stagger. Each card shows the event
    emoji, title, date, location, and status badge. Cards are colored by
    event type theme. Include a search bar at top and filter chips for
    event type and status. Empty state if no events. Link each card to
    /events/[id]. Add a floating '+' button bottom-right for new event."
```

Be specific. Claude Code executes better with detailed instructions.

---

## 🎯 What Makes This Win

| What Seniors Do | What You Do Better |
|---|---|
| Basic CRUD | Themed CRUD with animations per event type |
| Plain calendar | FullCalendar with color-coded, overlapping events |
| Maybe dark mode | Dark + Light + Custom Color theme engine |
| Simple search | Search + Cmd+K command palette |
| Maybe AI | Full AI suite: chatbot, import, planning, suggestions |
| Static dashboard | Animated charts, heatmap, live counters |
| No sharing | Share links, .ics export, CSV import |
| Basic README | Beautiful README with emojis, screenshots, demo link |

You're not competing on experience. You're competing on **vision + execution speed + polish**. Claude Code gives you the speed. This CLAUDE.md gives you the vision. Now go execute. 🚀
