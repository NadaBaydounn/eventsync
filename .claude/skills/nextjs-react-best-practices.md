# Skill: Next.js 16 + React Best Practices

## Server vs Client Components

### Server Components (default)
- Can directly fetch data from Supabase
- Cannot use hooks, state, effects, or browser APIs
- Use for: layouts, pages that fetch data, static content

### Client Components ("use client")
- Required for: useState, useEffect, event handlers, browser APIs
- Use for: forms, interactive UI, animations, real-time updates

### Pattern: Server wrapper + Client component
```tsx
// page.tsx (Server)
import { createClient } from "@/lib/supabase/server"
import { ClientComponent } from "./client-component"

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from("events").select("*")
  return <ClientComponent initialData={data} />
}
```

## Data Fetching
- Server components: Use Supabase server client directly
- Client components: Use `useEvents()` or `useAuth()` hooks
- API routes: For mutations and AI calls
- Real-time: Supabase channels in useEvents hook

## Error Handling
- Always wrap async operations in try/catch
- Show toast notifications for user-facing errors: `toast.error("message")`
- Show success toasts: `toast.success("message")`
- Use loading states with Skeleton components

## Performance
- Use `dynamic(() => import(...))` for heavy components (FullCalendar, Recharts)
- Minimize "use client" — keep it at the lowest level needed
- Use React.memo for expensive list items
