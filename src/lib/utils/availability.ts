import { format, addDays, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns'
import type { Event } from '@/types/events'

interface TimeSlot {
  start: Date
  end: Date
}

/**
 * Calculate free time slots for the next N days based on existing events.
 * Working hours: 9 AM - 6 PM by default.
 */
export function getAvailableSlots(
  events: Event[],
  days = 5,
  workingHoursStart = 9,
  workingHoursEnd = 18,
  slotMinMinutes = 30
): Record<string, TimeSlot[]> {
  const today = new Date()
  const dateRange = eachDayOfInterval({
    start: today,
    end: addDays(today, days - 1),
  })

  const availability: Record<string, TimeSlot[]> = {}

  for (const day of dateRange) {
    const dayKey = format(day, 'yyyy-MM-dd')
    const dayStart = new Date(day)
    dayStart.setHours(workingHoursStart, 0, 0, 0)
    const dayEnd = new Date(day)
    dayEnd.setHours(workingHoursEnd, 0, 0, 0)

    // Get events for this day, sorted by start time
    const dayEvents = events
      .filter(e => {
        const eventStart = new Date(e.start_time)
        const eventEnd = new Date(e.end_time)
        return eventStart < dayEnd && eventEnd > dayStart
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    // Find gaps
    const slots: TimeSlot[] = []
    let cursor = dayStart

    for (const event of dayEvents) {
      const eventStart = new Date(event.start_time)
      const eventEnd = new Date(event.end_time)

      // Clamp to working hours
      const effectiveStart = eventStart < dayStart ? dayStart : eventStart
      const effectiveEnd = eventEnd > dayEnd ? dayEnd : eventEnd

      // Gap before this event
      if (cursor < effectiveStart) {
        const gapMinutes = (effectiveStart.getTime() - cursor.getTime()) / (1000 * 60)
        if (gapMinutes >= slotMinMinutes) {
          slots.push({ start: new Date(cursor), end: new Date(effectiveStart) })
        }
      }

      // Move cursor past this event
      if (effectiveEnd > cursor) {
        cursor = new Date(effectiveEnd)
      }
    }

    // Gap after last event
    if (cursor < dayEnd) {
      const gapMinutes = (dayEnd.getTime() - cursor.getTime()) / (1000 * 60)
      if (gapMinutes >= slotMinMinutes) {
        slots.push({ start: new Date(cursor), end: new Date(dayEnd) })
      }
    }

    if (slots.length > 0) {
      availability[dayKey] = slots
    }
  }

  return availability
}

/**
 * Format availability as copyable text.
 * Output example:
 *   I'm available:
 *   • Mon, Jan 20: 2:00 PM – 4:00 PM
 *   • Tue, Jan 21: 10:00 AM – 12:00 PM, 2:00 PM – 5:00 PM
 */
export function formatAvailabilityText(
  availability: Record<string, TimeSlot[]>
): string {
  const lines: string[] = ["I'm available:"]

  for (const [dateKey, slots] of Object.entries(availability)) {
    const date = new Date(dateKey)
    const dayLabel = format(date, 'EEE, MMM d')
    const timeRanges = slots
      .map(s => `${format(s.start, 'h:mm a')} – ${format(s.end, 'h:mm a')}`)
      .join(', ')
    lines.push(`• ${dayLabel}: ${timeRanges}`)
  }

  if (lines.length === 1) {
    return "No available time slots in the next few days."
  }

  return lines.join('\n')
}

/**
 * Copy availability to clipboard.
 */
export async function copyAvailability(events: Event[], days = 5): Promise<string> {
  const slots = getAvailableSlots(events, days)
  const text = formatAvailabilityText(slots)
  await navigator.clipboard.writeText(text)
  return text
}
