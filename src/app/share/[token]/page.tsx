import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEventTheme } from '@/lib/constants/event-themes'
import { getGoogleCalendarURL, getOutlookCalendarURL } from '@/lib/utils/export'
import type { Event, ShareLink } from '@/types/events'
import type { EventType } from '@/types/events'
import { SharePageClient } from './client'

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  // Fetch share link
  const { data: shareLink } = await supabase
    .from('share_links')
    .select('*')
    .eq('token', token)
    .single()

  if (!shareLink) {
    notFound()
  }

  const link = shareLink as ShareLink

  // Check expiration
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    notFound()
  }

  // Increment view count (fire and forget)
  supabase
    .from('share_links')
    .update({ view_count: (link.view_count || 0) + 1 })
    .eq('id', link.id)
    .then(() => {})

  // Fetch event
  const { data: eventData } = await supabase
    .from('events')
    .select('*')
    .eq('id', link.target_id)
    .single()

  if (!eventData) {
    notFound()
  }

  const event = eventData as Event
  const theme = getEventTheme(event.event_type)

  // Fetch invitation counts
  const { count: goingCount } = await supabase
    .from('event_invitations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('status', 'accepted')

  const { count: maybeCount } = await supabase
    .from('event_invitations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('status', 'maybe')

  // Build calendar URLs
  const googleCalUrl = getGoogleCalendarURL(event)
  const outlookCalUrl = getOutlookCalendarURL(event)

  return (
    <SharePageClient
      event={event}
      theme={{
        emoji: theme.emoji,
        label: theme.label,
        gradient: theme.gradient,
        primaryColor: theme.primaryColor,
        bgTint: theme.bgTint,
        bgTintDark: theme.bgTintDark,
      }}
      goingCount={goingCount || 0}
      maybeCount={maybeCount || 0}
      googleCalUrl={googleCalUrl}
      outlookCalUrl={outlookCalUrl}
    />
  )
}
