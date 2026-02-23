// ============================================
// EVENT TYPES
// ============================================

export const EVENT_TYPES = [
  'party', 'educational', 'trip', 'business', 'sports', 'concert',
  'dining', 'birthday', 'tech', 'health', 'art', 'wedding', 'volunteer', 'general',
] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const EVENT_STATUSES = ['upcoming', 'attending', 'maybe', 'declined', 'completed', 'cancelled'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export const VISIBILITIES = ['private', 'team', 'public'] as const
export type Visibility = (typeof VISIBILITIES)[number]

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: EventType
  start_time: string
  end_time: string
  all_day: boolean
  location: string | null
  location_lat: number | null
  location_lng: number | null
  virtual_link: string | null
  status: EventStatus
  is_recurring: boolean
  recurrence_rule: string | null
  is_locked: boolean
  lock_password_hash: string | null
  color_override: string | null
  priority: Priority
  visibility: Visibility
  budget: number | null
  tags: string[]
  attachments: Attachment[]
  created_by: string
  org_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Attachment {
  name: string
  url: string
  type: string
}

export interface EventFormData {
  title: string
  description?: string
  event_type: EventType
  start_time: string
  end_time: string
  all_day?: boolean
  location?: string
  virtual_link?: string
  status?: EventStatus
  priority?: Priority
  visibility?: Visibility
  budget?: number
  tags?: string[]
  metadata?: Record<string, unknown>
}

// ============================================
// INVITATIONS
// ============================================

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'maybe'

export interface EventInvitation {
  id: string
  event_id: string
  invitee_email: string
  invitee_name: string | null
  invitee_user_id: string | null
  status: InviteStatus
  rsvp_message: string | null
  token: string
  sent_at: string
  responded_at: string | null
}

// ============================================
// USER / PROFILE
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system'
export type UserPlan = 'free' | 'premium'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  theme_mode: ThemeMode
  custom_color: string
  plan: UserPlan
  notification_preferences: NotificationPreferences
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  reminders: string[] // ['1h', '1d', '1w']
}

// ============================================
// ORGANIZATION / TEAM
// ============================================

export type OrgRole = 'admin' | 'editor' | 'viewer'

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  created_by: string
  settings: Record<string, unknown>
  max_members: number
  created_at: string
}

export interface OrgMember {
  id: string
  org_id: string
  user_id: string
  role: OrgRole
  permissions: OrgPermissions
  invited_by: string | null
  invited_at: string
  accepted_at: string | null
  // Joined from profiles
  profile?: Profile
}

export interface OrgPermissions {
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  can_invite: boolean
  can_export: boolean
}

// ============================================
// SHARE
// ============================================

export type ShareScope = 'single_event' | 'calendar' | 'org_calendar'

export interface ShareLink {
  id: string
  token: string
  created_by: string
  scope: ShareScope
  target_id: string
  permissions: 'view' | 'comment'
  password_hash: string | null
  expires_at: string | null
  view_count: number
  created_at: string
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType = 'reminder' | 'invitation' | 'update' | 'rsvp' | 'custom' | 'ai_suggestion'

export interface Notification {
  id: string
  user_id: string
  event_id: string | null
  type: NotificationType
  title: string
  message: string | null
  is_read: boolean
  scheduled_for: string | null
  sent_at: string | null
  action_url: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ============================================
// REFLECTIONS
// ============================================

export type Mood = 'amazing' | 'good' | 'okay' | 'meh' | 'bad'

export interface EventReflection {
  id: string
  event_id: string
  user_id: string
  thoughts: string | null
  rating: number // 1-5
  mood: Mood | null
  improvements: string | null
  highlights: string | null
  images: string[]
  created_at: string
}

// ============================================
// POLLS
// ============================================

export type PollType = 'single' | 'multiple' | 'text' | 'date_picker'

export interface PollOption {
  id: string
  label: string
  emoji?: string
}

export interface EventPoll {
  id: string
  event_id: string
  created_by: string
  question: string
  poll_type: PollType
  options: PollOption[]
  deadline: string | null
  is_anonymous: boolean
  allow_other: boolean
  is_closed: boolean
  created_at: string
}

export interface PollResponse {
  id: string
  poll_id: string
  respondent_email: string | null
  respondent_user_id: string | null
  selected_options: unknown
  responded_at: string
}

// ============================================
// AI
// ============================================

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AIConversation {
  id: string
  user_id: string
  event_id: string | null
  context: 'general' | 'planning' | 'suggestions' | 'import'
  messages: AIMessage[]
  created_at: string
  updated_at: string
}

export interface AISuggestion {
  what_to_wear: string
  what_to_bring: string[]
  how_to_prepare: string[]
  travel_info: string
  weather: string
  etiquette: string[]
}

export interface AIEventPlan {
  checklist: { task: string; deadline: string; priority: string }[]
  budget: { total_estimate: number; categories: { name: string; estimate: number }[] }
  guest_suggestions: string[]
  logistics: { timeline: string[]; equipment: string[]; venue_tips: string[] }
  content: { speech_outline: string; activities: string[] }
  risks: { risk: string; mitigation: string }[]
}

// ============================================
// ACTIVITY LOG
// ============================================

export interface ActivityLogEntry {
  id: string
  user_id: string | null
  org_id: string | null
  action: string
  target_type: string | null
  target_id: string | null
  details: Record<string, unknown>
  created_at: string
}
