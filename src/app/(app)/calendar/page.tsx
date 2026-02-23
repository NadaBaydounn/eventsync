'use client'

import { useCallback, useMemo } from 'react'
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

export default function CalendarPage() {
  const router = useRouter()
  const { events, loading, todayEvents } = useEvents()

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

      {/* Calendar */}
      <div className="min-h-0 flex-1 rounded-xl border bg-card p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          height="100%"
          dayMaxEvents={3}
          nowIndicator
          selectable
          selectMirror
          weekends
          eventDisplay="block"
        />
      </div>
    </motion.div>
  )
}
