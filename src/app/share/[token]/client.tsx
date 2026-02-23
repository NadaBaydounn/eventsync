'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  CalendarDays,
  Clock,
  MapPin,
  Link2,
  ExternalLink,
  Download,
  Users,
  Send,
  Check,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { formatDateRange, formatDuration } from '@/lib/utils/dates'
import { exportEventToICS } from '@/lib/utils/export'
import { cn } from '@/lib/utils'
import type { Event } from '@/types/events'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ShareTheme {
  emoji: string
  label: string
  gradient: string
  primaryColor: string
  bgTint: string
  bgTintDark: string
}

interface SharePageClientProps {
  event: Event
  theme: ShareTheme
  goingCount: number
  maybeCount: number
  googleCalUrl: string
  outlookCalUrl: string
}

export function SharePageClient({
  event,
  theme,
  goingCount,
  maybeCount,
  googleCalUrl,
  outlookCalUrl,
}: SharePageClientProps) {
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [rsvpStatus, setRsvpStatus] = useState<
    'accepted' | 'maybe' | 'declined' | null
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleRsvp = async () => {
    if (!rsvpEmail.trim() || !rsvpStatus) {
      toast.error('Please enter your email and select a response')
      return
    }
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('event_invitations').upsert(
        {
          event_id: event.id,
          invitee_name: rsvpName.trim() || null,
          invitee_email: rsvpEmail.trim().toLowerCase(),
          status: rsvpStatus,
          responded_at: new Date().toISOString(),
        },
        { onConflict: 'event_id,invitee_email' }
      )
      if (error) throw error
      setSubmitted(true)
      const labels = {
        accepted: 'Attending',
        maybe: 'Maybe',
        declined: 'Not attending',
      }
      toast.success(`RSVP submitted: ${labels[rsvpStatus]}`)
    } catch {
      toast.error('Failed to submit RSVP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            'bg-gradient-to-br py-16 text-center',
            theme.gradient
          )}
        >
          {/* Decorative blobs */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-4">
            <span className="mb-4 inline-block text-6xl">{theme.emoji}</span>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
              {event.title}
            </h1>
            <Badge className="mt-3 border-white/30 bg-white/20 text-white">
              {theme.emoji} {theme.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Date & Time */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${theme.primaryColor}15` }}
              >
                <CalendarDays
                  className="h-5 w-5"
                  style={{ color: theme.primaryColor }}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date & Time</p>
                <p className="text-sm font-medium">
                  {formatDateRange(
                    event.start_time,
                    event.end_time,
                    event.all_day
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${theme.primaryColor}15` }}
              >
                <Clock
                  className="h-5 w-5"
                  style={{ color: theme.primaryColor }}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">
                  {formatDuration(event.start_time, event.end_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <MapPin
                    className="h-5 w-5"
                    style={{ color: theme.primaryColor }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {event.location}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Virtual Link */}
          {event.virtual_link && (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <Link2
                    className="h-5 w-5"
                    style={{ color: theme.primaryColor }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Virtual</p>
                  <a
                    href={event.virtual_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Join Online
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendee Count */}
        {(goingCount > 0 || maybeCount > 0) && (
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {goingCount > 0 && `${goingCount} going`}
              {goingCount > 0 && maybeCount > 0 && ' · '}
              {maybeCount > 0 && `${maybeCount} maybe`}
            </span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-2 text-sm font-semibold">About this event</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>
        )}

        {/* RSVP Form */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">RSVP</h2>
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${theme.primaryColor}15` }}
              >
                <Check
                  className="h-6 w-6"
                  style={{ color: theme.primaryColor }}
                />
              </div>
              <p className="text-sm font-medium">Thanks for responding!</p>
              <p className="text-xs text-muted-foreground">
                Your RSVP has been recorded.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Your name (optional)"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Your email *"
                required
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
              />

              {/* RSVP Status Buttons */}
              <div className="flex gap-2">
                {(
                  [
                    {
                      status: 'accepted' as const,
                      label: 'Attending',
                      activeClass:
                        'border-green-500 bg-green-50 dark:bg-green-950/30',
                    },
                    {
                      status: 'maybe' as const,
                      label: 'Maybe',
                      activeClass:
                        'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
                    },
                    {
                      status: 'declined' as const,
                      label: "Can't go",
                      activeClass:
                        'border-red-400 bg-red-50 dark:bg-red-950/30',
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={() => setRsvpStatus(opt.status)}
                    className={cn(
                      'flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                      rsvpStatus === opt.status
                        ? opt.activeClass
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <Button
                className="w-full gap-2"
                disabled={submitting || !rsvpEmail.trim() || !rsvpStatus}
                onClick={handleRsvp}
                style={{
                  backgroundColor: theme.primaryColor,
                  borderColor: theme.primaryColor,
                }}
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </Button>
            </div>
          )}
        </div>

        {/* Add to Calendar */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">Add to Calendar</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(googleCalUrl, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Google Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.open(outlookCalUrl, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Outlook
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => exportEventToICS(event)}
            >
              <Download className="h-3.5 w-3.5" />
              Download .ics
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <span className="font-semibold text-foreground">EventSync</span>
          </p>
        </div>
      </div>
    </div>
  )
}
