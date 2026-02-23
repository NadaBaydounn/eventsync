# Code Standards

## TypeScript
- Strict mode enabled
- Always type function parameters and return values
- Use `interface` for object shapes, `type` for unions/intersections
- Import types with `import type { ... }`
- No `any` — use `unknown` if type is uncertain

## Naming Conventions
- Components: PascalCase (`EventCard.tsx`)
- Hooks: camelCase with `use` prefix (`useEvents.ts`)
- Utils: camelCase (`formatEventDate()`)
- Constants: UPPER_SNAKE_CASE (`EVENT_TYPES`)
- Types/Interfaces: PascalCase (`EventFormData`)
- Files: kebab-case for utils (`event-themes.ts`), PascalCase for components

## Component Structure
```tsx
"use client" // only if needed

import { /* external */ } from "..."
import { /* internal */ } from "@/..."
import type { /* types */ } from "@/..."

interface ComponentProps { ... }

export function Component({ prop1, prop2 }: ComponentProps) {
  // hooks first
  // derived state
  // handlers
  // early returns (loading, error)
  // render
}
```

## File Organization
- One component per file (unless tightly coupled)
- Co-locate component-specific types in the same file
- Shared types go in `src/types/`
- Shared utilities go in `src/lib/utils/`
- Page-level components in route folders
- Reusable components in `src/components/`

## Error Handling
- Wrap Supabase calls in try/catch
- Always check `error` from Supabase responses
- Show user-friendly toast messages
- Log technical errors to console
- Never expose internal errors to users

## Performance
- Use `dynamic()` for heavy components
- Minimize client-side JavaScript
- Use server components where possible
- Optimize images with Next.js Image component
- Debounce search inputs
