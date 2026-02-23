'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  CalendarDays,
  MapPin,
  ArrowUpDown,
} from 'lucide-react'

import { useEvents } from '@/lib/hooks/useEvents'
import { EVENT_TYPES, EVENT_STATUSES } from '@/types/events'
import type { EventType, EventStatus } from '@/types/events'
import { getEventTheme } from '@/lib/constants/event-themes'
import { formatRelative } from '@/lib/utils/dates'
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  cardHover,
  cardTap,
} from '@/lib/constants/animations'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  attending:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  maybe:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  completed:
    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300',
  cancelled:
    'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  normal: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
  low: 'bg-gray-50 text-gray-500 dark:bg-gray-800/30 dark:text-gray-500',
}

export default function EventsPage() {
  const router = useRouter()
  const { events, loading } = useEvents()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredEvents = useMemo(() => {
    const searchLower = search.toLowerCase()
    return events
      .filter((e) => {
        if (search && !e.title.toLowerCase().includes(searchLower) &&
            !e.description?.toLowerCase().includes(searchLower) &&
            !e.location?.toLowerCase().includes(searchLower)) {
          return false
        }
        if (typeFilter !== 'all' && e.event_type !== typeFilter) return false
        if (statusFilter !== 'all' && e.status !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date')
          return (
            new Date(a.start_time).getTime() -
            new Date(b.start_time).getTime()
          )
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        if (sortBy === 'priority')
          return (
            (PRIORITY_ORDER[a.priority] ?? 2) -
            (PRIORITY_ORDER[b.priority] ?? 2)
          )
        return 0
      })
  }, [events, search, typeFilter, statusFilter, sortBy])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
            Events
          </h1>
          <Badge variant="secondary">{events.length}</Badge>
        </div>
        <Button
          className="gap-2"
          onClick={() => router.push('/events/new')}
        >
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as EventType | 'all')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EVENT_TYPES.map((type) => {
              const theme = getEventTheme(type)
              return (
                <SelectItem key={type} value={type}>
                  <span className="mr-1">{theme.emoji}</span>
                  {theme.label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as EventStatus | 'all')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {EVENT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as 'date' | 'title' | 'priority')}
        >
          <SelectTrigger className="w-[130px]">
            <ArrowUpDown className="mr-1 h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex rounded-lg border">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-l-lg transition-colors',
              viewMode === 'grid'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-r-lg transition-colors',
              viewMode === 'list'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      {(search || typeFilter !== 'all' || statusFilter !== 'all') && (
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}{' '}
          {search && `for "${search}"`}
        </p>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'No matching events'
                : 'No events yet'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Create your first event to get started.'}
            </p>
          </div>
          {!search && typeFilter === 'all' && statusFilter === 'all' && (
            <Button onClick={() => router.push('/events/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredEvents.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEvents.map((event) => {
            const theme = getEventTheme(event.event_type)
            return (
              <motion.div
                key={event.id}
                variants={staggerItem}
                whileHover={cardHover}
                whileTap={cardTap}
                className="cursor-pointer overflow-hidden rounded-xl border bg-card transition-colors"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                {/* Color stripe */}
                <div
                  className={cn(
                    'h-1.5 bg-gradient-to-r',
                    theme.gradient
                  )}
                />

                <div className="p-4">
                  {/* Title row */}
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{theme.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatRelative(event.start_time)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                        STATUS_COLORS[event.status]
                      )}
                    >
                      {event.status}
                    </span>
                    {event.priority !== 'normal' && (
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                          PRIORITY_COLORS[event.priority]
                        )}
                      >
                        {event.priority}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredEvents.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {filteredEvents.map((event) => {
            const theme = getEventTheme(event.event_type)
            return (
              <motion.div
                key={event.id}
                variants={staggerItem}
                className="flex cursor-pointer items-center gap-4 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <span className="text-xl">{theme.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelative(event.start_time)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                      STATUS_COLORS[event.status]
                    )}
                  >
                    {event.status}
                  </span>
                  {event.priority !== 'normal' && (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                        PRIORITY_COLORS[event.priority]
                      )}
                    >
                      {event.priority}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
