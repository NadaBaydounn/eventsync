# 🚀 STEP-BY-STEP: From Zero to Running App
# Everything 100% FREE — No Credit Card Needed

---

## ⚠️ COST REALITY CHECK

| Tool | Free? | Notes |
|------|-------|-------|
| **Claude Code (in VS Code)** | ✅ Included in your Claude Pro/Max subscription | You already have this |
| **Next.js** | ✅ Free | Open source |
| **Supabase** | ✅ Free tier | 500MB DB, 1GB storage, 50K users — more than enough |
| **Vercel** | ✅ Free tier | Hobby plan, unlimited deploys |
| **Anthropic Claude API** | ❌ PAID | $3/M input tokens — **WE CANNOT USE THIS FOR THE APP** |
| **Google Gemini API** | ✅ FREE tier | 15 RPM on Gemini 2.0 Flash — **USE THIS INSTEAD** |
| **Groq API** | ✅ FREE tier | Very fast, generous limits — **BACKUP OPTION** |
| **All npm packages** | ✅ Free | Open source |
| **GitHub** | ✅ Free | For repo + Vercel connection |

### THE FIX: Replace Anthropic API with Google Gemini
Claude Code (your dev tool) = FREE with your subscription ✅
AI features inside your app = Use Google Gemini API (free tier) ✅

Google Gemini free tier gives you:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day
- Gemini 2.0 Flash (very capable for our use case)
- Vision support (for image/PDF event import!)
- NO credit card required

---

## STEP 0: PREREQUISITES (Do This Now)

### 0.1 — Create accounts (5 minutes total)

**A) Supabase (Database + Auth)**
1. Go to https://supabase.com
2. Click "Start your project" → Sign in with GitHub
3. Click "New Project"
4. Name: `eventsync`
5. Database password: generate a strong one, **SAVE IT**
6. Region: pick closest to you
7. Click "Create new project" → Wait ~2 minutes

**B) Google AI Studio (Free Gemini API Key)**
1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and save the key — this is your `GOOGLE_GEMINI_API_KEY`
5. That's it. No billing. No credit card. Free.

**C) Vercel (Deployment)**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Done — you'll connect a repo later

**D) GitHub Repo**
1. Go to https://github.com/new
2. Name: `eventsync`
3. Make it Public (judges need to see code)
4. Don't add README (we have our own)
5. Create repository

---

## STEP 1: SET UP PROJECT LOCALLY (10 minutes)

### 1.1 — Open VS Code and terminal

```bash
# Create and enter project directory
mkdir eventsync
cd eventsync
```

### 1.2 — Extract the zip I gave you

Copy ALL files from the `eventsync-complete-v3.zip` into this `eventsync/` directory.

You should see:
```
eventsync/
├── .claude/settings.json
├── .claudeignore
├── .env.example
├── CLAUDE.md
├── BATTLE_PLAN.md
├── README.md
├── bootstrap.sh
├── supabase-schema.sql
├── HOST_ATTENDEE_SYSTEM.md
├── COMPETITIVE_ANALYSIS.md
├── FEATURE_ADDITIONS.md
└── src/
    ├── app/
    ├── components/
    ├── lib/
    ├── types/
    └── ...
```

### 1.3 — Run the bootstrap script

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

This will:
- Create the Next.js project
- Install 35+ packages
- Set up shadcn/ui with 25+ components
- Create all directories

⏱️ Takes 2-3 minutes. Wait for it to finish.

### 1.4 — Set up environment variables

```bash
cp .env.example .env.local
```

Now edit `.env.local` with your actual keys:

```env
# Supabase — Find these in: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Google Gemini (FREE) — From Step 0.B
GOOGLE_GEMINI_API_KEY=AIzaSy...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EventSync
```

**Where to find Supabase keys:**
1. Go to your Supabase project dashboard
2. Click ⚙️ **Settings** (left sidebar, bottom)
3. Click **API** (under Configuration)
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 1.5 — Set up the database

1. Go to your Supabase project dashboard
2. Click **SQL Editor** (left sidebar)
3. Click "New Query"
4. Open `supabase-schema.sql` from your project
5. Copy the ENTIRE contents
6. Paste into Supabase SQL Editor
7. Click **Run** (or Cmd+Enter)
8. You should see "Success. No rows returned" — that's correct!

### 1.6 — Enable Google Auth (optional but impressive)

1. In Supabase dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. You'll need a Google OAuth Client ID:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add `http://localhost:3000` and your future Vercel URL to authorized origins
   - Add `https://xxxxx.supabase.co/auth/v1/callback` to redirect URIs
4. Paste Client ID and Secret into Supabase

**Skip this if it's too complex** — email/password auth works fine without it.

### 1.7 — Test locally

```bash
npm run dev
```

Open http://localhost:3000 — you should see the default Next.js page (we'll replace it with Claude Code).

---

## STEP 2: CONFIGURE CLAUDE CODE

### 2.1 — Open Claude Code in VS Code

Make sure you're in the `eventsync/` directory in VS Code.

Open Claude Code panel (Cmd+Shift+P → "Claude: Open Chat" or however you access it).

### 2.2 — First message to Claude Code

Copy and paste this EXACT message:

```
Read the CLAUDE.md file in the project root. This is an event scheduler competition project. All the infrastructure code is already in src/ — Supabase clients, auth middleware, hooks, types, validators, AI prompts, theme engine, animation presets, demo data, and export utilities are all pre-built.

IMPORTANT CHANGES FROM THE CLAUDE.md:
- We are using Google Gemini API (free) instead of Anthropic Claude API for AI features inside the app
- The env variable is GOOGLE_GEMINI_API_KEY (not ANTHROPIC_API_KEY)  
- Use the @google/generative-ai npm package
- Use model "gemini-2.0-flash" for all AI features (chat, OCR, planning, suggestions)
- The Gemini API supports vision (image input) just like Claude — use it for event import from images

First task: Install the Google Gemini SDK, then update src/lib/ai/client.ts to use Gemini instead of Anthropic. Keep the same function signatures (chat, extractFromImage, streamChat) so the rest of the codebase doesn't need changes.

Then build the root layout (src/app/layout.tsx) with:
- Inter + Plus Jakarta Sans fonts
- ThemeProvider (next-themes) with dark/light/system
- Sonner toast provider
- The globals.css is already written

Then build the auth pages (login + register with Supabase email/password).

Then build the main app layout with sidebar + topbar.

Go step by step, one file at a time. After each file, I'll tell you to continue.
```

### 2.3 — Let Claude Code work

Claude Code will:
1. Install `@google/generative-ai`
2. Rewrite the AI client for Gemini
3. Build the root layout
4. Build auth pages
5. Build the main layout

After each piece, review quickly and say "continue" or "looks good, next".

---

## STEP 3: BUILD FEATURES (Follow the Battle Plan)

After the foundation is ready, follow this order. Give Claude Code one task at a time:

### Phase 1: Core (tell Claude Code each of these)

```
Build the event creation form at src/app/(app)/events/new/page.tsx. 
Use the EventTypeSelector that shows all 14 event types with their themed 
previews (emoji, color, gradient). When a type is selected, the form 
background, button color, and accent should morph to match the event theme.
Use React Hook Form + Zod validation from src/lib/validators/event.ts.
Include all fields: title, description, type, start/end time, location, 
status, priority, tags. Save to Supabase using the useEvents hook.
```

```
Build the calendar page at src/app/(app)/calendar/page.tsx using FullCalendar.
Show month/week/day/list views. Events should be color-coded by their event 
type using the calendarChip colors from src/lib/constants/event-themes.ts.
Click an event to see a popover preview. Handle overlapping events like 
Google Calendar. Use the useEvents hook for data.
```

```
Build the event detail page at src/app/(app)/events/[id]/page.tsx.
Detect if the user is the HOST or ATTENDEE using the determineEventRole 
function from src/types/roles.ts. Show different UIs:
- HOST: Command center with stats, RSVP progress, guest list, task checklist
- ATTENDEE: Preparation hub with RSVP toggle, prep checklist, AI suggestions
Use the event type theme for the hero card.
```

```
Build the search functionality. Add a search bar in the topbar that searches 
events by title, description, and location. Add filter chips for event type 
and status. Use the searchEvents function from useEvents hook.
```

### Phase 2: Differentiators

```
Build the dashboard page at src/app/(app)/dashboard/page.tsx with Recharts.
Include: animated stat counter cards (total events, upcoming, completed),
events by type donut chart, monthly timeline line chart, status breakdown
horizontal bar chart, and a GitHub-style heatmap showing busiest days.
Use Framer Motion for entrance animations. Use stagger animation for cards.
```

```
Build the theme customization. In settings page, add a color picker with 
the preset colors from src/lib/utils/colors.ts. When user picks a color, 
generate the full palette using generateThemeVars() and apply it as CSS 
variables. Also add dark/light/system toggle. Save preference to Supabase 
profile.
```

```
Build the AI chat panel. Floating button bottom-right, slide-out panel.
Use Google Gemini via our src/lib/ai/client.ts. Stream responses.
The chatbot should understand natural language like "add a dinner next 
Friday at 7pm at Olive Garden" and create events from it.
```

```
Build the share system. Share button on events generates a unique token,
stored in share_links table. The public page at /share/[token] shows a 
beautiful Luma-style landing page with event details, map, Add to Calendar 
buttons (Google, Outlook, .ics), QR code, and RSVP form. No login required.
```

### Phase 3: Polish & Deploy

```
Build the export system: .ics export for single events and full calendar,
CSV export, and "Add to Google Calendar" / "Add to Outlook" buttons using 
the functions in src/lib/utils/export.ts. Add these to event detail pages 
and the calendar page toolbar.
```

```
Add the command palette using cmdk. Cmd+K opens it. Search events by title,
quick actions: New Event, Go to Calendar, Go to Dashboard, Toggle Dark Mode,
Open AI Chat. Add keyboard shortcuts for common actions.
```

```
Seed demo data. Create a "Load Demo Data" button in settings that calls
generateDemoEvents() from src/lib/constants/demo-data.ts and inserts 18 
events into Supabase. This way judges see a living app immediately.
```

---

## STEP 4: DEPLOY TO VERCEL (5 minutes)

### 4.1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: EventSync - AI-powered event scheduler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eventsync.git
git push -u origin main
```

### 4.2 — Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your `eventsync` GitHub repo
3. Framework: Next.js (auto-detected)
4. **Environment Variables** — Add ALL of these:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (update after first deploy)
   - `NEXT_PUBLIC_APP_NAME` = EventSync
5. Click **Deploy**
6. Wait ~2 minutes

### 4.3 — Update URLs after deploy

1. Copy your Vercel URL (e.g., `https://eventsync-xyz.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Add this URL to Supabase Auth → URL Configuration → Site URL
4. Add to Supabase Auth → Redirect URLs: `https://eventsync-xyz.vercel.app/**`
5. Redeploy on Vercel (Settings → Deployments → Redeploy)

### 4.4 — Create a demo account

1. Open your live URL
2. Register with: `demo@eventsync.app` / `demo123456`
3. Load demo data via the settings button
4. Now judges can log in and see a full app

---

## STEP 5: FINAL CHECKLIST

Before submitting:

```
[ ] App loads at the Vercel URL
[ ] Can register and login
[ ] Can create events with themed types
[ ] Calendar shows events with correct colors
[ ] Can edit and delete events
[ ] Can search events
[ ] Dashboard shows charts
[ ] AI chat works (Gemini)
[ ] Share links work (public page loads without login)
[ ] Dark mode works
[ ] Mobile responsive (test on phone)
[ ] Demo account has sample events
[ ] README.md has live URL, setup instructions, feature list
[ ] GitHub repo is public
```

---

## GOOGLE GEMINI QUICK REFERENCE

### Install
```bash
npm install @google/generative-ai
```

### Usage (replace our Anthropic client)
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// Text chat
const result = await model.generateContent('Hello!')
const text = result.response.text()

// Streaming
const streamResult = await model.generateContentStream('Tell me about events')
for await (const chunk of streamResult.stream) {
  console.log(chunk.text())
}

// Vision (image → event extraction)
const imageResult = await model.generateContent([
  'Extract event details from this image as JSON',
  { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
])
```

### Free Limits
- 15 requests per minute
- 1,500 requests per day  
- 1M tokens per minute
- More than enough for a demo/competition

---

## TROUBLESHOOTING

### "Module not found" errors
```bash
npm install  # reinstall all deps
```

### Supabase auth not working
- Check that Site URL in Supabase matches your app URL
- Check that Redirect URLs include your domain with `/**`
- Make sure `.env.local` has correct keys (no spaces, no quotes around values)

### Vercel deploy fails
```bash
npm run build  # test locally first — fix any TypeScript errors
```

### Gemini API errors
- Verify key at https://aistudio.google.com/apikey
- Check you're not exceeding 15 RPM
- Make sure the key is in server-side code only (not NEXT_PUBLIC_)

### Claude Code tips
- If Claude Code writes something wrong, say "that's wrong because X, fix it"
- If it's slow, break tasks into smaller pieces
- Always test after each feature: `npm run dev` and check in browser
- If a file has errors, paste the error message to Claude Code

---

## TIME ALLOCATION DURING COMPETITION

| Minutes | What to Do | Priority |
|---------|-----------|----------|
| 0-2 | Open Claude Code, paste first prompt | 🔴 |
| 2-8 | Root layout + Auth pages + Main layout | 🔴 |
| 8-10 | **DEPLOY TO VERCEL** (get URL live!) | 🔴 |
| 10-22 | Event CRUD with themed form + list + detail | 🔴 |
| 22-30 | Calendar view (FullCalendar) | 🔴 |
| 30-35 | Search + Dashboard with charts | 🟡 |
| 35-42 | AI Chat + Share links | 🟡 |
| 42-48 | Theme customization + Export (.ics) | 🟡 |
| 48-52 | Host/Attendee views + Demo data seed | 🟢 |
| 52-55 | Command palette + Polish | 🟢 |
| 55-58 | Final deploy + test live URL | 🔴 |
| 58-60 | README final check + SUBMIT | 🔴 |

**RULE: Deploy every 15 minutes.** `git add . && git commit -m "wip" && git push` — Vercel auto-deploys.
