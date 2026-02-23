import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isPast,
  isFuture,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  addHours,
  addDays,
  addMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns'

/**
 * Format a date for display. Smart formatting based on proximity.
 */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`
  if (isThisWeek(date)) return format(date, 'EEEE, h:mm a') // "Tuesday, 3:00 PM"
  if (isThisMonth(date)) return format(date, 'MMM d, h:mm a') // "Jan 15, 3:00 PM"
  return format(date, 'MMM d, yyyy h:mm a') // "Jan 15, 2025 3:00 PM"
}

/**
 * Format date range (e.g., "Jan 15, 3:00 PM – 5:00 PM")
 */
export function formatDateRange(startStr: string, endStr: string, allDay = false): string {
  const start = new Date(startStr)
  const end = new Date(endStr)

  if (allDay) {
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'MMMM d, yyyy') // All-day, same day
    }
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}` // Multi-day
  }

  // Same day
  if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    return `${format(start, 'MMM d, yyyy')} · ${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`
  }

  // Multi-day with times
  return `${format(start, 'MMM d, h:mm a')} – ${format(end, 'MMM d, h:mm a, yyyy')}`
}

/**
 * "In 2 hours", "3 days ago", etc.
 */
export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

/**
 * Duration between two dates in human-readable form.
 */
export function formatDuration(startStr: string, endStr: string): string {
  const start = new Date(startStr)
  const end = new Date(endStr)
  const mins = differenceInMinutes(end, start)

  if (mins < 60) return `${mins}min`
  const hours = differenceInHours(end, start)
  if (hours < 24) {
    const remainingMins = mins % 60
    return remainingMins > 0 ? `${hours}h ${remainingMins}min` : `${hours}h`
  }
  const days = differenceInDays(end, start)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

/**
 * Check if an event is happening right now.
 */
export function isHappeningNow(startStr: string, endStr: string): boolean {
  const now = new Date()
  return new Date(startStr) <= now && now <= new Date(endStr)
}

/**
 * Get default datetime strings for event form (start: next hour, end: start + 1h).
 */
export function getDefaultEventTimes(): { start: string; end: string } {
  const now = new Date()
  const start = addHours(startOfDay(addDays(now, 0)), now.getHours() + 1)
  const end = addHours(start, 1)
  return {
    start: format(start, "yyyy-MM-dd'T'HH:mm"),
    end: format(end, "yyyy-MM-dd'T'HH:mm"),
  }
}

// Re-export commonly used date-fns functions
export {
  format,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  addHours,
  addDays,
  addMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
}
