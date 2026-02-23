# 🗓️ EventSync — AI-Powered Event Scheduler

> The smartest way to plan, manage, and share events. Built with AI at its core.

<div align="center">

![EventSync](https://img.shields.io/badge/EventSync-v1.0-6366F1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Gemini AI](https://img.shields.io/badge/Claude_AI-Anthropic-D4A574?style=for-the-badge)

**[🌐 Live Demo](https://eventsync.vercel.app)** · **[📖 Features](#-features)** · **[🚀 Quick Start](#-quick-start)**

</div>

---

## ✨ Features

### 📅 Core Event Management
- **Full CRUD** — Create, edit, delete events with rich details
- **14 Event Types** — Each with unique themes, colors, emojis, and animations (party 🎉, business 💼, trip ✈️, wedding 💒, and more)
- **Google Calendar-style View** — Month, week, day, and list views with overlapping event support
- **Status Tracking** — Mark events as upcoming, attending, maybe, or declined
- **Smart Search** — Find events by title, date range, location, type, or tags
- **Event Lock** — Password-protect important events from accidental changes

### 🤖 AI-Powered (Premium)
- **AI Chatbot** — Natural language event creation ("Add dinner with Sarah next Friday at 7pm")
- **Image/PDF Import** — Upload event flyers → AI extracts all details automatically
- **Event Planning Agent** — AI generates checklists, budgets, guest lists, and logistics
- **Smart Suggestions** — What to wear, what to bring, weather alerts, and travel time estimates
- **Voice Event Creation** — Describe your event by voice, AI does the rest

### 🎨 Design & Customization
- **Dark / Light / Custom Themes** — Pick any color, we generate a full palette
- **Event-Type Animations** — Confetti for parties, floating clouds for trips, pulse for sports
- **Command Palette** — Cmd+K for power users to navigate and act instantly
- **Responsive** — Beautiful on desktop, tablet, and mobile

### 📊 Dashboard & Analytics
- **Animated Stats** — Total events, upcoming count, completion rate
- **Charts** — Events by type, monthly timeline, status breakdown
- **Activity Heatmap** — GitHub-style visualization of your busiest days

### 👥 Collaboration
- **Share Links** — Share your calendar or individual events without requiring login
- **Team/Organization** — Create teams, assign roles (admin/editor/viewer), manage permissions
- **Event Invitations** — Send RSVP invitations with public response pages
- **Audience Polls** — Create polls with deadlines for group decisions

### 📤 Import & Export
- **ICS Export** — Single event or full calendar to Google Calendar, Outlook, Apple Calendar
- **CSV Import/Export** — Bulk import events from spreadsheets
- **Add to Calendar Buttons** — One-click add to Google Calendar or Outlook

### 📝 Event Lifecycle
- **Notifications** — Default and custom reminders (1h before, 1 day before, etc.)
- **Post-Event Reflections** — Rate, review, and add photos after events
- **Activity Log** — Full audit trail of all changes

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Database | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| AI | Google Gemini API (Free) |
| Styling | Tailwind CSS + shadcn/ui |
| Calendar | FullCalendar React |
| Animations | Framer Motion |
| Charts | Recharts |
| Deployment | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google Gemini](https://aistudio.google.com/apikey) API key (for AI features)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/eventsync.git
cd eventsync

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Anthropic keys

# 4. Set up the database
# Go to your Supabase project → SQL Editor
# Paste the contents of supabase-schema.sql and run it

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're ready to go! 🎉

### Demo Account
For the live demo, use:
- **Email:** demo@eventsync.app
- **Password:** demo123456

---

## 🏗️ Architecture

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable React components
├── lib/
│   ├── supabase/  # Database client & auth
│   ├── ai/        # Claude API integration
│   ├── hooks/     # Custom React hooks
│   ├── utils/     # Helpers (dates, colors, export)
│   └── validators/# Zod schemas
└── types/         # TypeScript type definitions
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `GOOGLE_GEMINI_API_KEY` | ✅ | Google Gemini API key (free) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your app's URL |

---

## 📄 License

MIT

---

<div align="center">
  Built with ❤️ using Next.js, Supabase, and Gemini AI
</div>
