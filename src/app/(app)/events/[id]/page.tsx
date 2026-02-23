'use client'

import { use, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  MapPin,
  Link2,
  Clock,
  CalendarDays,
  ChevronLeft,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
  Share2,
  Shield,
  Eye,
  Users,
  Tag,
  DollarSign,
  CheckCircle2,
  Circle,
  Loader2,
  ListChecks,
  Mail,
  UserCheck,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useEvents } from '@/lib/hooks/useEvents'
import { useAuth } from '@/lib/hooks/useAuth'
import { getEventTheme } from '@/lib/constants/event-themes'
import { DEFAULT_CHECKLISTS } from '@/lib/constants/defaults'
import {
  formatDateRange,
  formatDuration,
  formatRelative,
  isHappeningNow,
} from '@/lib/utils/dates'
import {
  exportEventToICS,
  getGoogleCalendarURL,
  getOutlookCalendarURL,
} from '@/lib/utils/export'
import { determineEventRole } from '@/types/roles'
import type { EventTask, EventBudgetItem } from '@/types/roles'
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  eventAnimations,
} from '@/lib/constants/animations'
import type { Event, EventInvitation } from '@/types/events'
import type { EventRole } from '@/types/roles'
import { cn } from '@/lib/utils'
import { ShareDialog } from '@/components/events/shared/ShareDialog'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { deleteEvent } = useEvents()
  const { user } = useAuth()
  const supabase = createClient()

  const [event, setEvent] = useState<Event | null>(null)
  const [role, setRole] = useState<EventRole>('viewer')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [invitations, setInvitations] = useState<EventInvitation[]>([])
  const [tasks, setTasks] = useState<EventTask[]>([])
  const [budgetItems, setBudgetItems] = useState<EventBudgetItem[]>([])
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const fetchEvent = useCallback(async () => {
    setLoading(true)
    const [
      { data: eventData, error },
      { data: { user: authUser } },
      { data: inviteData },
      { data: taskData },
      { data: budgetData },
    ] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      supabase.auth.getUser(),
      supabase.from('event_invitations').select('*').eq('event_id', id),
      supabase.from('event_tasks').select('*').eq('event_id', id).order('sort_order'),
      supabase.from('event_budget_items').select('*').eq('event_id', id),
    ])

    if (error || !eventData) {
      setEvent(null)
    } else {
      setEvent(eventData as Event)
      setInvitations((inviteData as EventInvitation[]) || [])
      setTasks((taskData as EventTask[]) || [])
      setBudgetItems((budgetData as EventBudgetItem[]) || [])

      const inviteeUserIds = (inviteData || [])
        .map((inv: EventInvitation) => inv.invitee_user_id)
        .filter(Boolean) as string[]

      const userRole = determineEventRole(
        eventData.created_by,
        authUser?.id ?? null,
        [],
        inviteeUserIds
      )
      setRole(userRole)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  const handleDelete = async () => {
    if (!event) return
    setDeleting(true)
    const success = await deleteEvent(event.id)
    if (success) {
      router.push('/events')
    }
    setDeleting(false)
    setDeleteDialogOpen(false)
  }

  const toggleChecked = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleRsvp = async (status: 'accepted' | 'maybe' | 'declined') => {
    if (!user || !event) return
    setRsvpLoading(true)
    try {
      const existing = invitations.find(
        (inv) => inv.invitee_user_id === user.id || inv.invitee_email === user.email
      )
      if (existing) {
        await supabase
          .from('event_invitations')
          .update({ status, responded_at: new Date().toISOString() })
          .eq('id', existing.id)
      }
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === existing?.id ? { ...inv, status, responded_at: new Date().toISOString() } : inv
        )
      )
      const labels = { accepted: 'Accepted', maybe: 'Maybe', declined: 'Declined' }
      toast.success(`RSVP updated: ${labels[status]}`)
    } catch {
      toast.error('Failed to update RSVP')
    } finally {
      setRsvpLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  // Not found
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <CalendarDays className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Event not found</h2>
        <p className="text-sm text-muted-foreground">
          This event may have been deleted or you don&apos;t have access.
        </p>
        <Button variant="outline" onClick={() => router.push('/calendar')}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Calendar
        </Button>
      </div>
    )
  }

  const theme = getEventTheme(event.event_type)
  const isLive = isHappeningNow(event.start_time, event.end_time)
  const checklist = DEFAULT_CHECKLISTS[event.event_type] || DEFAULT_CHECKLISTS.general
  const checklistProgress =
    checklist.length > 0
      ? Math.round((checkedItems.size / checklist.length) * 100)
      : 0

  // RSVP stats
  const rsvpAccepted = invitations.filter((i) => i.status === 'accepted').length
  const rsvpMaybe = invitations.filter((i) => i.status === 'maybe').length
  const rsvpDeclined = invitations.filter((i) => i.status === 'declined').length
  const rsvpPending = invitations.filter((i) => i.status === 'pending').length
  const rsvpTotal = invitations.length
  const rsvpResponded = rsvpAccepted + rsvpMaybe + rsvpDeclined
  const rsvpResponseRate = rsvpTotal > 0 ? Math.round((rsvpResponded / rsvpTotal) * 100) : 0

  // Task stats
  const tasksCompleted = tasks.filter((t) => t.is_completed).length
  const tasksTotal = tasks.length

  // Budget stats
  const budgetEstimated = budgetItems.reduce((sum, b) => sum + b.estimated_amount, 0)
  const budgetActual = budgetItems.reduce((sum, b) => sum + (b.actual_amount ?? 0), 0)

  // Current user RSVP status
  const myInvitation = user
    ? invitations.find(
        (inv) => inv.invitee_user_id === user.id || inv.invitee_email === user.email
      )
    : null

  // Attendees going
  const attendeesGoing = invitations.filter((i) => i.status === 'accepted')
  const attendeesMaybe = invitations.filter((i) => i.status === 'maybe')

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="mx-auto max-w-3xl px-4 py-8"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Hero Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6',
          theme.bgTint,
          theme.bgTintDark
        )}
      >
        {/* Gradient accent bar */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r',
            theme.gradient
          )}
        />

        <div className="flex items-start gap-4">
          {/* Animated emoji */}
          <motion.span
            variants={
              eventAnimations[theme.animation] ?? eventAnimations.fadeSlide
            }
            animate="animate"
            className="text-5xl"
          >
            {theme.emoji}
          </motion.span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                {event.title}
              </h1>
              {isLive && (
                <Badge
                  variant="destructive"
                  className="animate-pulse gap-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Live
                </Badge>
              )}
            </div>

            {/* Type badge */}
            <Badge
              variant="secondary"
              className={cn(
                'mt-2',
                theme.calendarChip,
                theme.calendarChipDark
              )}
            >
              {theme.emoji} {theme.label}
            </Badge>

            {/* Date/Time */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDateRange(event.start_time, event.end_time, event.all_day)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(event.start_time, event.end_time)}
              </span>
            </div>

            {/* Location & Virtual Link */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {event.location && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              )}
              {event.virtual_link && (
                <a
                  href={event.virtual_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  Join Virtual
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Status / Priority / Visibility badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {event.status}
              </Badge>
              {event.priority !== 'normal' && (
                <Badge
                  variant={
                    event.priority === 'urgent' || event.priority === 'high'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="capitalize"
                >
                  {event.priority} priority
                </Badge>
              )}
              <Badge variant="outline" className="gap-1 capitalize">
                {event.visibility === 'private' ? (
                  <Shield className="h-3 w-3" />
                ) : event.visibility === 'team' ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                {event.visibility}
              </Badge>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 text-xs"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* ========== HOST VIEW ========== */}
      {role === 'host' && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Quick Actions */}
          <motion.div
            variants={staggerItem}
            className="flex flex-wrap gap-3"
          >
            <Button
              onClick={() => router.push(`/events/${event.id}/edit`)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Event
            </Button>

            <Dialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Event</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &ldquo;{event.title}
                    &rdquo;? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => exportEventToICS(event)}
                >
                  Download .ics
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(getGoogleCalendarURL(event), '_blank')
                  }
                >
                  Add to Google Calendar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(getOutlookCalendarURL(event), '_blank')
                  }
                >
                  Add to Outlook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <ShareDialog
              event={event}
              open={shareDialogOpen}
              onOpenChange={setShareDialogOpen}
            />
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-3 gap-3"
          >
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <Mail className="h-4 w-4" style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{rsvpTotal}</p>
                  <p className="text-xs text-muted-foreground">Invited</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <UserCheck className="h-4 w-4" style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{rsvpAccepted}</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${theme.primaryColor}15` }}
                >
                  <ListChecks className="h-4 w-4" style={{ color: theme.primaryColor }} />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">
                    {tasksTotal > 0 ? `${tasksCompleted}/${tasksTotal}` : '0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RSVP Progress Bar */}
          {rsvpTotal > 0 && (
            <motion.div variants={staggerItem} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">RSVP Progress</span>
                <span className="text-muted-foreground">
                  {rsvpResponded} of {rsvpTotal} responded ({rsvpResponseRate}%)
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                {rsvpAccepted > 0 && (
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(rsvpAccepted / rsvpTotal) * 100}%` }}
                  />
                )}
                {rsvpMaybe > 0 && (
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${(rsvpMaybe / rsvpTotal) * 100}%` }}
                  />
                )}
                {rsvpDeclined > 0 && (
                  <div
                    className="h-full bg-red-400 transition-all"
                    style={{ width: `${(rsvpDeclined / rsvpTotal) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Accepted ({rsvpAccepted})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  Maybe ({rsvpMaybe})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Declined ({rsvpDeclined})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  Pending ({rsvpPending})
                </span>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div variants={staggerItem}>
            <Tabs defaultValue="overview">
              <TabsList variant="line">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="guests">
                  Guests{rsvpTotal > 0 && ` (${rsvpTotal})`}
                </TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="rounded-xl border bg-card p-4">
                  <h3 className="mb-2 text-sm font-semibold">Details</h3>
                  {event.description ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      No description provided.
                    </p>
                  )}
                  {event.budget != null && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Budget: ${event.budget.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Created {formatRelative(event.created_at)}</p>
                  {event.updated_at !== event.created_at && (
                    <p>Last updated {formatRelative(event.updated_at)}</p>
                  )}
                </div>
              </TabsContent>

              {/* Guests Tab */}
              <TabsContent value="guests" className="mt-4">
                {invitations.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Users className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No guests invited yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {invitations.map((inv) => {
                      const statusColors: Record<string, string> = {
                        accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                        maybe: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                        declined: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                        pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                      }
                      return (
                        <div
                          key={inv.id}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50"
                        >
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: theme.primaryColor }}
                          >
                            {(inv.invitee_name || inv.invitee_email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {inv.invitee_name || inv.invitee_email}
                            </p>
                            {inv.invitee_name && (
                              <p className="truncate text-xs text-muted-foreground">
                                {inv.invitee_email}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'shrink-0 text-xs capitalize',
                              statusColors[inv.status]
                            )}
                          >
                            {inv.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Checklist Tab */}
              <TabsContent value="checklist" className="mt-4 space-y-3">
                {tasks.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {tasksCompleted}/{tasksTotal} completed
                      </span>
                    </div>
                    <Progress
                      value={tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0}
                      className="h-2"
                    />
                    <div className="space-y-1">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                            task.is_completed && 'text-muted-foreground line-through'
                          )}
                        >
                          {task.is_completed ? (
                            <CheckCircle2
                              className="h-5 w-5 shrink-0"
                              style={{ color: theme.primaryColor }}
                            />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1">{task.title}</span>
                          {task.priority === 'high' && !task.is_completed && (
                            <Badge variant="destructive" className="text-[10px]">
                              High
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {checkedItems.size}/{checklist.length} done
                      </span>
                    </div>
                    <Progress value={checklistProgress} className="h-2" />
                    <div className="space-y-1">
                      {checklist.map((item, i) => {
                        const checked = checkedItems.has(i)
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleChecked(i)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50',
                              checked && 'text-muted-foreground line-through'
                            )}
                          >
                            {checked ? (
                              <CheckCircle2
                                className="h-5 w-5 shrink-0"
                                style={{ color: theme.primaryColor }}
                              />
                            ) : (
                              <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                            )}
                            {item}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Budget Tab */}
              <TabsContent value="budget" className="mt-4">
                {budgetItems.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <DollarSign className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No budget items yet
                    </p>
                    {event.budget != null && (
                      <p className="text-xs text-muted-foreground">
                        Event budget: ${event.budget.toFixed(2)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Budget Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground">Estimated</p>
                        <p className="text-lg font-bold">${budgetEstimated.toFixed(2)}</p>
                      </div>
                      <div className="rounded-xl border bg-card p-3">
                        <p className="text-xs text-muted-foreground">Actual Spent</p>
                        <p className="text-lg font-bold">${budgetActual.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Budget Items */}
                    <div className="space-y-1">
                      {budgetItems.map((item) => {
                        const statusColors: Record<string, string> = {
                          estimated: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
                          committed: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                          paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                        }
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.item_name}
                              </p>
                              <p className="text-xs capitalize text-muted-foreground">
                                {item.category}
                              </p>
                            </div>
                            <p className="text-sm font-medium tabular-nums">
                              ${(item.actual_amount ?? item.estimated_amount).toFixed(2)}
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                'shrink-0 text-[10px] capitalize',
                                statusColors[item.status]
                              )}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}

      {/* ========== ATTENDEE / VIEWER VIEW ========== */}
      {role !== 'host' && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* RSVP Toggle (attendees only) */}
          {role === 'attendee' && myInvitation && (
            <motion.div variants={staggerItem} className="space-y-2">
              <h2 className="text-lg font-semibold">Your RSVP</h2>
              <div className="flex gap-2">
                {(['accepted', 'maybe', 'declined'] as const).map((status) => {
                  const isActive = myInvitation.status === status
                  const config = {
                    accepted: { label: 'Accept', color: 'bg-green-500', hoverBg: 'hover:bg-green-50 dark:hover:bg-green-950/30', activeBorder: 'border-green-500' },
                    maybe: { label: 'Maybe', color: 'bg-yellow-400', hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30', activeBorder: 'border-yellow-400' },
                    declined: { label: 'Decline', color: 'bg-red-400', hoverBg: 'hover:bg-red-50 dark:hover:bg-red-950/30', activeBorder: 'border-red-400' },
                  }[status]
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={rsvpLoading}
                      onClick={() => handleRsvp(status)}
                      className={cn(
                        'flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all',
                        isActive
                          ? `${config.activeBorder} ${config.hoverBg}`
                          : 'border-transparent bg-muted/50',
                        !isActive && config.hoverBg
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isActive && (
                          <span className={cn('h-2 w-2 rounded-full', config.color)} />
                        )}
                        {config.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Description */}
          {event.description && (
            <motion.div variants={staggerItem} className="space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <div className="rounded-xl border bg-card p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Preparation Checklist */}
          <motion.div variants={staggerItem} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preparation Checklist</h2>
              <span className="text-sm text-muted-foreground">
                {checkedItems.size}/{checklist.length} done
              </span>
            </div>
            <Progress value={checklistProgress} className="h-2" />
            <div className="space-y-1">
              {checklist.map((item, i) => {
                const checked = checkedItems.has(i)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleChecked(i)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50',
                      checked && 'text-muted-foreground line-through'
                    )}
                  >
                    {checked ? (
                      <CheckCircle2
                        className="h-5 w-5 shrink-0"
                        style={{ color: theme.primaryColor }}
                      />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    {item}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Who's Going */}
          {(attendeesGoing.length > 0 || attendeesMaybe.length > 0) && (
            <motion.div variants={staggerItem} className="space-y-3">
              <h2 className="text-lg font-semibold">Who&apos;s Going</h2>
              <p className="text-sm text-muted-foreground">
                {attendeesGoing.length} attending
                {attendeesMaybe.length > 0 && `, ${attendeesMaybe.length} maybe`}
              </p>
              <div className="space-y-1">
                {[...attendeesGoing, ...attendeesMaybe].slice(0, 10).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2"
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {(inv.invitee_name || inv.invitee_email)[0].toUpperCase()}
                    </div>
                    <span className="text-sm">
                      {inv.invitee_name || inv.invitee_email}
                    </span>
                    {inv.status === 'maybe' && (
                      <Badge variant="secondary" className="text-[10px]">
                        Maybe
                      </Badge>
                    )}
                  </div>
                ))}
                {attendeesGoing.length + attendeesMaybe.length > 10 && (
                  <p className="px-3 text-xs text-muted-foreground">
                    +{attendeesGoing.length + attendeesMaybe.length - 10} more
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Export Options */}
          <motion.div variants={staggerItem} className="space-y-2">
            <h2 className="text-lg font-semibold">Add to Calendar</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => exportEventToICS(event)}
              >
                <Download className="h-4 w-4" />
                Download .ics
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  window.open(getGoogleCalendarURL(event), '_blank')
                }
              >
                <ExternalLink className="h-4 w-4" />
                Google Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  window.open(getOutlookCalendarURL(event), '_blank')
                }
              >
                <ExternalLink className="h-4 w-4" />
                Outlook
              </Button>
            </div>
          </motion.div>

          {event.budget != null && (
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <DollarSign className="h-4 w-4" />
              Budget: ${event.budget.toFixed(2)}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
