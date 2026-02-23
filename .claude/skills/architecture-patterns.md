# Architecture Patterns

## Application Layers

### 1. Presentation Layer (src/components/, src/app/)
- React components with shadcn/ui
- Framer Motion animations
- Responsive design with Tailwind v4
- Event-type theming system

### 2. State Management Layer (src/lib/hooks/, src/lib/store.ts)
- Zustand for global UI state (sidebar, panels, modals)
- Custom hooks for data (useAuth, useEvents)
- React Hook Form for form state
- Supabase real-time subscriptions for live updates

### 3. Business Logic Layer (src/lib/utils/, src/lib/validators/)
- Zod schemas for validation
- Date utilities for smart formatting
- Color engine for theme generation
- Export utilities (ICS, CSV, Google Calendar URLs)

### 4. Data Access Layer (src/lib/supabase/, src/app/api/)
- Supabase client (browser + server)
- API routes for server-side operations
- Row Level Security for authorization
- Real-time channels for live updates

### 5. AI Layer (src/lib/ai/)
- Google Gemini client wrapper
- System prompts per use case
- Streaming for chat interface
- Vision for image extraction

## Data Flow
```
User Action → Component → Hook/Store → Supabase/API → Database
                                    ↓
                              Real-time subscription
                                    ↓
                           Component re-renders
```

## Authentication Flow
```
Login → Supabase Auth → JWT Cookie → Middleware validates → Server Component reads user
                                                        → Client Component uses useAuth()
```

## Event Creation Flow
```
Type Selector → Form Fill → Zod Validation → useEvents.createEvent() → Supabase INSERT
                                                                     → Real-time update
                                                                     → Toast notification
                                                                     → Navigate to calendar
```
