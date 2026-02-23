# EventSync — Claude Code Configuration

## Project Overview
EventSync is an AI-powered event scheduling platform built with Next.js 16, Tailwind v4, Supabase, and Google Gemini AI.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **AI**: Google Gemini 2.0 Flash (free tier)
- **State**: Zustand
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Calendar**: FullCalendar React
- **Forms**: React Hook Form + Zod

## Critical Technical Constraints

### Tailwind v4 (NOT v3)
- Use `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
- Use `@theme {}` NOT `@layer base { :root {} }`
- Opacity modifiers like `bg-white/80` do NOT work in `@apply` — use plain CSS
- Color utilities use CSS variables defined in `@theme` block

### Next.js 16
- App Router with server/client components
- `"use client"` required for components with hooks, state, browser APIs
- `middleware.ts` is deprecated, use `proxy.ts` (but our middleware still works)
- Server components can directly access Supabase via `src/lib/supabase/server.ts`

### Supabase Auth
- Browser client: `src/lib/supabase/client.ts`
- Server client: `src/lib/supabase/server.ts`
- Middleware: `src/lib/supabase/middleware.ts`
- Auth callback: `src/app/auth/callback/route.ts`
- Profile auto-created via DB trigger on signup

### Google Gemini AI
- Client: `src/lib/ai/client.ts` (already configured)
- Functions: `chat()`, `extractFromImage()`, `streamChat()`, `generate()`
- System prompts: `src/lib/ai/prompts/index.ts`
- API routes: `src/app/api/ai/chat/route.ts`, `src/app/api/ai/extract/route.ts`

## Pre-Built Infrastructure (DO NOT RECREATE)
These files are already written and tested:
- `src/lib/supabase/*` — All Supabase clients
- `src/lib/ai/*` — Gemini AI client + prompts
- `src/lib/hooks/*` — useAuth, useEvents, useKeyboard
- `src/lib/utils/*` — cn, colors, dates, export, qrcode, availability
- `src/lib/validators/*` — Zod schemas for all forms
- `src/lib/constants/*` — Event themes (14 types), animations, defaults, demo data
- `src/lib/store.ts` — Zustand global store
- `src/types/*` — Full TypeScript types for events, roles
- `src/app/globals.css` — Theme system with dark mode

## Architecture Patterns

### File Organization
```
src/
├── app/              # Next.js routes
│   ├── (auth)/       # Login, register (no sidebar)
│   ├── (app)/        # Authenticated pages (with sidebar)
│   ├── api/          # API routes (server-side)
│   ├── share/[token] # Public event pages
│   └── invite/[token]# RSVP pages
├── components/       # React components
│   ├── ui/           # shadcn/ui primitives
│   ├── layout/       # AppShell, sidebar, topbar
│   ├── events/       # Event-related components
│   │   ├── host/     # Host command center
│   │   ├── attendee/ # Attendee preparation hub
│   │   ├── shared/   # Shared between roles
│   │   └── viewer/   # Public view
│   ├── calendar/     # Calendar components
│   ├── dashboard/    # Dashboard widgets
│   └── ai/           # AI chat panel
├── lib/              # Utilities and business logic
└── types/            # TypeScript types
```

### Component Conventions
- Use `"use client"` only when needed (hooks, state, effects, browser APIs)
- Use shadcn/ui components as base (Button, Card, Input, etc.)
- Animate with Framer Motion (use presets from `src/lib/constants/animations.ts`)
- Toast notifications via `sonner` — `import { toast } from "sonner"`
- Icons from `lucide-react`
- Forms with `react-hook-form` + `@hookform/resolvers/zod`

### Database (23 tables)
Main tables: profiles, events, event_invitations, share_links, notifications, event_reflections, event_polls, poll_responses, ai_conversations, event_templates, event_checklists, event_reactions, event_cohosts, event_tasks, event_budget_items, event_timeline_items, event_announcements, event_messages, event_photos, organizations, org_members, calendar_layers, activity_log

### Event Types (14)
party, educational, trip, business, sports, concert, dining, birthday, tech, health, art, wedding, volunteer, general — each with unique emoji, gradient, colors, animation

### Host vs Attendee System
- Host (event.created_by === currentUser): Sees Command Center with guest management, tasks, budget, timeline
- Attendee: Sees Preparation Hub with RSVP, checklist, AI suggestions
- Viewer (share link): Sees public landing page
- Use `determineEventRole()` from `src/types/roles.ts`

## Code Standards
- Always handle loading and error states
- Use skeleton components for loading
- Add Framer Motion animations for page transitions
- Color-code events by type using `getEventTheme()`
- Use `cn()` from `src/lib/utils/cn.ts` for conditional classes
- Format dates with utilities from `src/lib/utils/dates.ts`

## Agent Team Instructions
When working as part of an agent team:
- Read this file first to understand the full project context
- Check existing files before creating new ones
- Follow the established patterns in existing components
- Use the pre-built hooks and utilities — don't recreate them
- Test with `npm run dev` after major changes
