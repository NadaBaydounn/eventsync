import type { Profile } from './events'

// ============================================
// ROLE SYSTEM
// ============================================

export type EventRole = 'host' | 'co-host' | 'attendee' | 'viewer'

export interface CohostPermissions {
  can_manage_guests: boolean
  can_edit_event: boolean
  can_manage_budget: boolean
  can_send_messages: boolean
  can_manage_tasks: boolean
  can_manage_polls: boolean
}

export interface EventCohost {
  id: string
  event_id: string
  user_id: string
  permissions: CohostPermissions
  invited_at: string
  accepted_at: string | null
  profile?: Profile
}

// ============================================
// HOST TOOLS
// ============================================

export interface EventTask {
  id: string
  event_id: string
  title: string
  description: string | null
  assignee_id: string | null
  due_type: 'relative' | 'absolute'
  due_relative: string | null // '2 weeks before', 'day of'
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  category: string | null // 'venue', 'catering', 'decor', 'logistics', 'content', 'communications'
  is_completed: boolean
  completed_at: string | null
  completed_by: string | null
  sort_order: number
  created_by: string
  created_at: string
  assignee?: Profile
}

export interface EventBudgetItem {
  id: string
  event_id: string
  category: string // 'venue', 'catering', 'decoration', 'entertainment', 'supplies', 'transportation', 'other'
  item_name: string
  estimated_amount: number
  actual_amount: number | null
  status: 'estimated' | 'committed' | 'paid'
  paid_by: string | null
  receipt_url: string | null
  notes: string | null
  created_at: string
}

export interface EventTimelineItem {
  id: string
  event_id: string
  time: string // '3:00 PM'
  title: string
  description: string | null
  assignee_id: string | null
  icon: string | null // emoji
  status: 'upcoming' | 'in_progress' | 'completed' | 'skipped'
  sort_order: number
  created_at: string
  assignee?: Profile
}

export interface EventAnnouncement {
  id: string
  event_id: string
  author_id: string
  title: string
  content: string
  is_pinned: boolean
  visibility: 'all' | 'confirmed' | 'cohosts'
  created_at: string
  author?: Profile
}

export interface EventMessage {
  id: string
  event_id: string
  sender_id: string
  recipient_filter: 'all' | 'confirmed' | 'pending' | 'maybe' | 'cohosts'
  subject: string
  body: string
  sent_at: string
  delivery_count: number
}

export interface EventPhoto {
  id: string
  event_id: string
  uploaded_by: string
  image_url: string
  caption: string | null
  is_cover: boolean
  created_at: string
  uploader?: Profile
}

// ============================================
// COMPUTED SUMMARIES
// ============================================

export interface BudgetSummary {
  total_budget: number
  total_spent: number
  total_committed: number
  total_estimated: number
  remaining: number
  per_person: number
  categories: {
    name: string
    estimated: number
    actual: number
    percentage: number
  }[]
}

export interface RSVPSummary {
  total_invited: number
  accepted: number
  declined: number
  maybe: number
  pending: number
  response_rate: number // 0-100
}

export interface TaskSummary {
  total: number
  completed: number
  overdue: number
  high_priority_pending: number
  completion_rate: number // 0-100
  next_due: EventTask | null
}

// ============================================
// ROLE DETECTION HELPER
// ============================================

/**
 * Determine the user's role for a given event.
 * Call this on event detail page to decide which UI to show.
 */
export function determineEventRole(
  eventCreatedBy: string,
  currentUserId: string | null,
  cohostUserIds: string[],
  inviteeUserIds: string[]
): EventRole {
  if (!currentUserId) return 'viewer'
  if (eventCreatedBy === currentUserId) return 'host'
  if (cohostUserIds.includes(currentUserId)) return 'co-host'
  if (inviteeUserIds.includes(currentUserId)) return 'attendee'
  return 'viewer'
}
