'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import type { EventClickArg, EventContentArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

import { useEvents } from '@/lib/hooks/useEvents'
import { getEventTheme } from '@/lib/constants/event-themes'
import { pageVariants } from '@/lib/constants/animations'
import type { EventType } from '@/types/events'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarPage() {
  const router = useRouter()
  const { events, loading, todayEvents } = useEvents()
  const calendarRef = useRef<FullCalendar>(null)

  // Calendar preferences
  const [firstDay, setFirstDay] = useState(0)
  const [customDays, setCustomDays] = useState(7)
  const [hiddenDays, setHiddenDays] = useState<number[]>([])

  const calendarEvents = useMemo(
    () =>
      events.map((event) => {
        const theme = getEventTheme(event.event_type)
        return {
          id: event.id,
          title: event.title,
          start: event.start_time,
          end: event.end_time,
          allDay: event.all_day,
          backgroundColor: event.color_override ?? theme.primaryColor,
          borderColor: 'transparent',
          textColor: '#ffffff',
          extendedProps: {
            event_type: event.event_type,
            emoji: theme.emoji,
            location: event.location,
            status: event.status,
          },
        }
      }),
    [events]
  )

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      router.push(`/events/${clickInfo.event.id}`)
    },
    [router]
  )

  const handleDateClick = useCallback(
    (clickInfo: DateClickArg) => {
      router.push(`/events/new?date=${clickInfo.dateStr}`)
    },
    [router]
  )

  const renderEventContent = useCallback((eventInfo: EventContentArg) => {
    const emoji = eventInfo.event.extendedProps.emoji as string
    return (
      <div className="flex items-center gap-1 truncate px-1">
        <span className="text-xs">{emoji}</span>
        <span className="truncate text-xs font-medium">
          {eventInfo.event.title}
        </span>
      </div>
    )
  }, [])

  function handleFirstDayChange(value: string) {
    if (value === 'today') {
      setFirstDay(new Date().getDay())
    } else {
      setFirstDay(parseInt(value))
    }
  }

  function handleCustomDaysChange(value: string) {
    const days = parseInt(value)
    setCustomDays(days)
    // Switch to the custom days view
    setTimeout(() => {
      calendarRef.current?.getApi().changeView('customDays')
    }, 0)
  }

  function toggleDay(dayIndex: number) {
    setHiddenDays((prev) => {
      if (prev.includes(dayIndex)) {
        return prev.filter((d) => d !== dayIndex)
      }
      // Don't hide all days — keep at least 1 visible
      if (prev.length >= 6) return prev
      return [...prev, dayIndex]
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex h-full flex-col gap-4 p-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            {todayEvents.length === 0
              ? 'No events today'
              : `${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today`}
          </p>
        </div>
        <Button
          onClick={() => router.push('/events/new')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Calendar Settings Bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card/50 px-4 py-2.5">
        {/* First Day of Week */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Week starts
          </span>
          <Select
            value={firstDay === new Date().getDay() ? 'today' : String(firstDay)}
            onValueChange={handleFirstDayChange}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              {DAY_LABELS.map((label, i) => (
                <SelectItem key={i} value={String(i)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border" />

        {/* Custom Days View */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Days
          </span>
          <Select value={String(customDays)} onValueChange={handleCustomDaysChange}>
            <SelectTrigger className="h-8 w-[72px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 5, 7, 10, 14].map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border" />

        {/* Day Visibility Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Show
          </span>
          <div className="flex gap-1">
            {DAY_SHORT.map((label, i) => {
              const isHidden = hiddenDays.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors',
                    isHidden
                      ? 'bg-muted text-muted-foreground line-through'
                      : 'bg-primary text-primary-foreground'
                  )}
                  title={`${isHidden ? 'Show' : 'Hide'} ${DAY_LABELS[i]}`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="min-h-0 flex-1 rounded-xl border bg-card p-4 shadow-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,customDays,timeGridDay,listWeek',
          }}
          views={{
            dayGridMonth: { buttonText: 'month' },
            timeGridWeek: { buttonText: 'week' },
            timeGridDay: { buttonText: 'day' },
            listWeek: { buttonText: 'list' },
            customDays: {
              type: 'timeGrid',
              duration: { days: customDays },
              buttonText: `${customDays}d`,
            },
          }}
          firstDay={firstDay}
          hiddenDays={hiddenDays}
          events={calendarEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          height="100%"
          dayMaxEvents={3}
          nowIndicator
          selectable
          selectMirror
          weekends={!hiddenDays.includes(0) || !hiddenDays.includes(6)}
          eventDisplay="block"
        />
      </div>
    </motion.div>
  )
}
