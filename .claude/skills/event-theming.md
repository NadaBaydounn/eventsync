# Skill: Event Type Theming System

## 14 Event Types
Each type has a complete visual identity defined in `src/lib/constants/event-themes.ts`:

| Type | Emoji | Use Case |
|------|-------|----------|
| party | 🎉 | Celebrations, gatherings |
| educational | 📚 | Classes, workshops, lectures |
| trip | ✈️ | Travel, vacations, road trips |
| business | 💼 | Meetings, presentations, calls |
| sports | 🏋️ | Workouts, games, competitions |
| concert | 🎵 | Music events, shows, festivals |
| dining | 🍽️ | Restaurants, dinners, food events |
| birthday | 🎂 | Birthday celebrations |
| tech | 💻 | Hackathons, conferences, coding |
| health | 🏥 | Doctor, dentist, therapy |
| art | 🎨 | Galleries, museums, creative |
| wedding | 💒 | Weddings, engagement parties |
| volunteer | 🤝 | Community service, charity |
| general | 📅 | Default, miscellaneous |

## Theme Properties
```typescript
interface EventTheme {
  emoji: string
  icon: string           // lucide-react icon name
  label: string
  gradient: string       // Tailwind gradient classes
  bgTint: string         // Subtle background color
  ring: string           // Border/focus ring color
  calendarChip: string   // Calendar event chip classes
  primaryColor: string   // Hex color for charts/accents
  animation: string      // Animation preset name
  formDecoration: string // Description shown in form
  aiCategories: string[] // AI suggestion categories
}
```

## Usage Pattern
```tsx
import { getEventTheme, getEventTypeOptions } from "@/lib/constants/event-themes"

// Get theme for a specific type
const theme = getEventTheme("birthday")

// Apply to UI
<div style={{ background: theme.primaryColor }}>
  {theme.emoji} {theme.label}
</div>

// Calendar chips
<div className={theme.calendarChip}>Event Title</div>

// Get all types for selector
const options = getEventTypeOptions()
// [{ value: "party", label: "Party", emoji: "🎉" }, ...]
```

## Event-Specific Animations
From `src/lib/constants/animations.ts`:
- party/birthday → confetti burst
- trip → floating/bobbing
- sports → pulse
- health → breathing
- concert → wave
- tech → glitch
- art → sparkle
- business → subtle glow

## Dynamic Color Generation
From `src/lib/utils/colors.ts`:
```tsx
import { generatePalette, generateThemeVars } from "@/lib/utils/colors"

// Generate 11 shades from one color
const palette = generatePalette("#6366F1")
// { 50: "#EEF2FF", 100: "#E0E7FF", ..., 950: "#1E1B4B" }

// Generate CSS variables
const vars = generateThemeVars("#6366F1")
// Apply to element style or :root
```
