# Skill: Supabase Database Patterns

## Client Selection

### Server Components / API Routes
```tsx
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
```

### Client Components
```tsx
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()
```

## CRUD Operations

### Fetch with filters
```tsx
const { data, error } = await supabase
  .from("events")
  .select("*")
  .eq("created_by", user.id)
  .order("start_time", { ascending: true })
```

### Insert
```tsx
const { data, error } = await supabase
  .from("events")
  .insert({ ...eventData, created_by: user.id })
  .select()
  .single()
```

### Update
```tsx
const { data, error } = await supabase
  .from("events")
  .update({ title: "New Title", updated_at: new Date().toISOString() })
  .eq("id", eventId)
  .select()
  .single()
```

### Delete
```tsx
const { error } = await supabase
  .from("events")
  .delete()
  .eq("id", eventId)
```

## Search
```tsx
const { data } = await supabase
  .from("events")
  .select("*")
  .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
```

## Real-time Subscriptions
```tsx
const channel = supabase
  .channel("events-changes")
  .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
    refetch()
  })
  .subscribe()

// Cleanup
return () => supabase.removeChannel(channel)
```

## Auth
```tsx
// Sign up
await supabase.auth.signUp({ email, password, options: { data: { full_name } } })

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Get user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

## Row Level Security
All tables have RLS enabled. Queries automatically filter by authenticated user.
- Events: Users see own events + org events + public events
- Profiles: Public read, self-write
- Notifications: Self-only
- Invitations: Event owners manage, invitees can view own
