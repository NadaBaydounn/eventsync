import { createEvents, type EventAttributes } from 'ics'
import type { Event } from '@/types/events'

/**
 * Convert an Event to ICS format and trigger download.
 */
export function exportEventToICS(event: Event): void {
  const icsEvent = eventToICSAttributes(event)
  createEvents([icsEvent], (error, value) => {
    if (error) {
      console.error('ICS generation error:', error)
      return
    }
    downloadFile(value, `${slugify(event.title)}.ics`, 'text/calendar')
  })
}

/**
 * Export multiple events as a single .ics file.
 */
export function exportCalendarToICS(events: Event[], filename = 'eventsync-calendar'): void {
  const icsEvents = events.map(eventToICSAttributes)
  createEvents(icsEvents, (error, value) => {
    if (error) {
      console.error('ICS generation error:', error)
      return
    }
    downloadFile(value, `${filename}.ics`, 'text/calendar')
  })
}

/**
 * Export events to CSV.
 */
export function exportEventsToCSV(events: Event[]): void {
  const headers = ['Title', 'Type', 'Start', 'End', 'Location', 'Status', 'Priority', 'Description']
  const rows = events.map(e => [
    escapeCsvField(e.title),
    e.event_type,
    e.start_time,
    e.end_time,
    escapeCsvField(e.location || ''),
    e.status,
    e.priority,
    escapeCsvField(e.description || ''),
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  downloadFile(csv, 'eventsync-events.csv', 'text/csv')
}

/**
 * Generate a "Add to Google Calendar" URL.
 */
export function getGoogleCalendarURL(event: Event): string {
  const start = new Date(event.start_time).toISOString().replace(/-|:|\.\d\d\d/g, '')
  const end = new Date(event.end_time).toISOString().replace(/-|:|\.\d\d\d/g, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description || '',
    location: event.location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate an "Add to Outlook" URL.
 */
export function getOutlookCalendarURL(event: Event): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.start_time,
    enddt: event.end_time,
    body: event.description || '',
    location: event.location || '',
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
}

// ============================================
// HELPERS
// ============================================

function eventToICSAttributes(event: Event): EventAttributes {
  const start = new Date(event.start_time)
  const end = new Date(event.end_time)

  return {
    title: event.title,
    description: event.description || undefined,
    location: event.location || undefined,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
    end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
    status: event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED',
    url: event.virtual_link || undefined,
    categories: [event.event_type],
  }
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}
