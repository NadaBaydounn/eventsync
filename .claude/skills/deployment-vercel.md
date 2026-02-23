# Skill: Deployment & Vercel

## Vercel Deployment
- Framework: Next.js (auto-detected)
- Build command: `next build`
- Output: `.next/`
- Node.js: 20.x

## Environment Variables (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_GEMINI_API_KEY=AIza...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=EventSync
```

## Deploy Commands
```bash
git add .
git commit -m "feat: description"
git push origin main
# Vercel auto-deploys on push
```

## Post-Deploy Checklist
- [ ] Update NEXT_PUBLIC_APP_URL to Vercel URL
- [ ] Add Vercel URL to Supabase Auth → Site URL
- [ ] Add Vercel URL to Supabase Auth → Redirect URLs
- [ ] Test auth flow on production
- [ ] Test AI features on production
- [ ] Verify real-time subscriptions work

## Build Troubleshooting
- TypeScript errors: Fix all before deploying
- Missing env vars: Check Vercel dashboard → Settings → Environment Variables
- API routes failing: Check server-side env vars are set (not NEXT_PUBLIC_)
