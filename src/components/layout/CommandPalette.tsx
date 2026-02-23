'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'cmdk'
import {
  CalendarDays,
  LayoutDashboard,
  Plus,
  Sun,
  Moon,
  Sparkles,
  CalendarRange,
  Settings,
  Users,
} from 'lucide-react'

import { useAppStore } from '@/lib/store'
import { useEvents } from '@/lib/hooks/useEvents'
import { getEventTheme } from '@/lib/constants/event-themes'
import { formatRelative } from '@/lib/utils/dates'

export function CommandPalette() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { commandPaletteOpen, setCommandPaletteOpen, toggleAIChat } =
    useAppStore()
  const { events } = useEvents()

  // Close on route change
  useEffect(() => {
    setCommandPaletteOpen(false)
  }, [])

  const runAction = (fn: () => void) => {
    setCommandPaletteOpen(false)
    fn()
  }

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      label="Command palette"
    >
      <CommandInput placeholder="Search events, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Events */}
        {events.length > 0 && (
          <CommandGroup heading="Events">
            {events.slice(0, 8).map((event) => {
              const eventTheme = getEventTheme(event.event_type)
              return (
                <CommandItem
                  key={event.id}
                  value={`${event.title} ${event.event_type}`}
                  onSelect={() =>
                    runAction(() => router.push(`/events/${event.id}`))
                  }
                >
                  <span className="mr-2 text-base">{eventTheme.emoji}</span>
                  <span className="flex-1 truncate">{event.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatRelative(event.start_time)}
                  </span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Quick Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runAction(() => router.push('/events/new'))}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(() => router.push('/calendar'))}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Go to Calendar
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(() => router.push('/events'))}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            Go to Events
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(() => router.push('/dashboard'))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(() => router.push('/team'))}
          >
            <Users className="mr-2 h-4 w-4" />
            Go to Team
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(() => router.push('/settings'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Go to Settings
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runAction(() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              )
            }
          >
            {theme === 'dark' ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            Toggle Dark Mode
          </CommandItem>
          <CommandItem onSelect={() => runAction(toggleAIChat)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Open AI Chat
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
