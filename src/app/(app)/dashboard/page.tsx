'use client'

import { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  CalendarCheck,
  BarChart3,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useEvents } from '@/lib/hooks/useEvents'
import { EVENT_THEMES, getEventTheme } from '@/lib/constants/event-themes'
import { formatRelative, format } from '@/lib/utils/dates'
import {
  pageVariants,
  staggerContainer,
  staggerItem,
} from '@/lib/constants/animations'
import type { EventType } from '@/types/events'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Animated counter hook
function useAnimatedCount(target: number, duration = 1000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) {
      setCount(0)
      return
    }
    let start = 0
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * target)
      setCount(start)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return count
}

const STAT_CARDS = [
  {
    label: 'Total Events',
    icon: CalendarDays,
    color: '#6366F1',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/20',
    iconClass: 'text-indigo-500',
  },
  {
    label: 'Upcoming',
    icon: BarChart3,
    color: '#22C55E',
    bgClass: 'bg-green-50 dark:bg-green-950/20',
    iconClass: 'text-green-500',
  },
  {
    label: 'Completed',
    icon: CalendarCheck,
    color: '#3B82F6',
    bgClass: 'bg-blue-50 dark:bg-blue-950/20',
    iconClass: 'text-blue-500',
  },
  {
    label: 'Completion Rate',
    icon: TrendingUp,
    color: '#10B981',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
    iconClass: 'text-emerald-500',
    isPercentage: true,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { events, loading, upcomingEvents } = useEvents()

  // Stat counts
  const totalCount = events.length
  const upcomingCount = upcomingEvents.length
  const completedCount = events.filter(
    (e) => e.status === 'completed'
  ).length
  const pastAndDoneCount = events.filter(
    (e) => e.status === 'completed' || e.status === 'cancelled' || new Date(e.end_time) < new Date()
  ).length
  const completionRate = pastAndDoneCount > 0
    ? Math.round((completedCount / pastAndDoneCount) * 100)
    : 0

  // Animated counts
  const animTotal = useAnimatedCount(totalCount)
  const animUpcoming = useAnimatedCount(upcomingCount)
  const animCompleted = useAnimatedCount(completedCount)
  const animCompletionRate = useAnimatedCount(completionRate)
  const animValues = [animTotal, animUpcoming, animCompleted, animCompletionRate]

  // Events by type for pie chart
  const typeData = useMemo(() => {
    const counts: Partial<Record<EventType, number>> = {}
    events.forEach((e) => {
      counts[e.event_type] = (counts[e.event_type] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: EVENT_THEMES[type as EventType]?.label ?? type,
        value: count,
        color: EVENT_THEMES[type as EventType]?.primaryColor ?? '#6366F1',
        emoji: EVENT_THEMES[type as EventType]?.emoji ?? '',
      }))
      .sort((a, b) => b.value - a.value)
  }, [events])

  // Monthly timeline for area chart (last 6 months)
  const monthlyData = useMemo(() => {
    const months: { month: string; count: number }[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = format(d, 'yyyy-MM')
      const label = format(d, 'MMM')
      const count = events.filter((e) => {
        const eMonth = format(new Date(e.start_time), 'yyyy-MM')
        return eMonth === key
      }).length
      months.push({ month: label, count })
    }
    return months
  }, [events])

  // Next 5 upcoming events
  const nextEvents = upcomingEvents.slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="space-y-6 p-6"
    >
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Your event analytics at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              variants={staggerItem}
              className={cn(
                'rounded-xl border p-4 transition-shadow hover:shadow-md',
                card.bgClass
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/80">
                  <Icon className={cn('h-5 w-5', card.iconClass)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    {animValues[i]}{card.isPercentage ? '%' : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Events by Type — Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-4 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold">Events by Type</h2>
          {typeData.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
              No events yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
                        <span className="font-medium">
                          {d.emoji} {d.name}
                        </span>
                        : {d.value} event{d.value !== 1 ? 's' : ''}
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          {typeData.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {typeData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.emoji} {d.name} ({d.value})
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Monthly Timeline — Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-4 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold">Monthly Timeline</h2>
          {events.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
              No events yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorCount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6366F1"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366F1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  className="text-xs"
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
                        <p className="font-medium">{label}</p>
                        <p className="text-muted-foreground">
                          {payload[0].value} event
                          {payload[0].value !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border bg-card p-4 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Upcoming Events</h2>
          {nextEvents.length > 0 && (
            <button
              onClick={() => router.push('/calendar')}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {nextEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No upcoming events. Time to plan something!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {nextEvents.map((event) => {
              const theme = getEventTheme(event.event_type)
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="text-lg">{theme.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelative(event.start_time)}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'shrink-0 text-[10px]',
                      theme.calendarChip,
                      theme.calendarChipDark
                    )}
                  >
                    {theme.label.split(' / ')[0]}
                  </Badge>
                </button>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
