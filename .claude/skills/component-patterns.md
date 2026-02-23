# Skill: Component Patterns & UI Conventions

## shadcn/ui Component Usage

### Available Components
button, card, input, label, textarea, select, dialog, dropdown-menu, popover, tabs, badge, avatar, separator, scroll-area, sheet, skeleton, switch, tooltip, command, calendar, form, checkbox, radio-group, progress, alert-dialog

### Import Pattern
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Animation Patterns

### Page Transitions
```tsx
import { motion } from "framer-motion"
import { pageVariants } from "@/lib/constants/animations"

<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
  {children}
</motion.div>
```

### Stagger Lists
```tsx
import { staggerContainer, staggerItem } from "@/lib/constants/animations"

<motion.div variants={staggerContainer} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Card Hover
```tsx
import { cardHover, cardTap } from "@/lib/constants/animations"

<motion.div whileHover={cardHover} whileTap={cardTap}>
  <Card>...</Card>
</motion.div>
```

## Event Type Theming
```tsx
import { getEventTheme } from "@/lib/constants/event-themes"

const theme = getEventTheme(event.event_type)
// theme.emoji, theme.gradient, theme.primaryColor, theme.calendarChip, etc.

<div className={`bg-gradient-to-r ${theme.gradient}`}>
  <span>{theme.emoji}</span> {theme.label}
</div>
```

## Form Pattern
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema, type EventFormValues } from "@/lib/validators/event"

const form = useForm<EventFormValues>({
  resolver: zodResolver(eventFormSchema),
  defaultValues: { event_type: "general", priority: "normal" }
})
```

## Loading States
Always show skeletons while data loads:
```tsx
if (loading) return (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
  </div>
)
```

## Toast Notifications
```tsx
import { toast } from "sonner"
toast.success("Event created! 🎉")
toast.error("Failed to save event")
toast.loading("Saving...")
```
