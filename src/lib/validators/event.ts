import { z } from 'zod'
import { EVENT_TYPES, EVENT_STATUSES, PRIORITIES, VISIBILITIES } from '@/types/events'

// ============================================
// EVENT SCHEMAS
// ============================================

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  event_type: z.enum(EVENT_TYPES).default('general'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  all_day: z.boolean().default(false),
  location: z.string().max(500).optional().nullable(),
  virtual_link: z.string().url().optional().nullable().or(z.literal('')),
  status: z.enum(EVENT_STATUSES).default('upcoming'),
  priority: z.enum(PRIORITIES).default('normal'),
  visibility: z.enum(VISIBILITIES).default('private'),
  budget: z.number().min(0).optional().nullable(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    return new Date(data.end_time) >= new Date(data.start_time)
  }
  return true
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
})

export type EventFormValues = z.infer<typeof eventFormSchema>

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(nameRegex, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .transform((v) => v.trim()),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(nameRegex, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .transform((v) => v.trim()),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

// ============================================
// INVITATION SCHEMA
// ============================================

export const invitationSchema = z.object({
  invitee_email: z.string().email(),
  invitee_name: z.string().optional(),
})

// ============================================
// POLL SCHEMA
// ============================================

export const pollSchema = z.object({
  question: z.string().min(1).max(500),
  poll_type: z.enum(['single', 'multiple', 'text', 'date_picker']).default('single'),
  options: z.array(z.object({
    id: z.string(),
    label: z.string().min(1),
    emoji: z.string().optional(),
  })).min(2, 'At least 2 options required'),
  deadline: z.string().optional().nullable(),
  is_anonymous: z.boolean().default(false),
  allow_other: z.boolean().default(false),
})

// ============================================
// LOCK EVENT SCHEMA
// ============================================

export const lockEventSchema = z.object({
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

// ============================================
// SHARE LINK SCHEMA
// ============================================

export const shareLinkSchema = z.object({
  scope: z.enum(['single_event', 'calendar', 'org_calendar']),
  target_id: z.string().uuid(),
  permissions: z.enum(['view', 'comment']).default('view'),
  password: z.string().optional(),
  expires_at: z.string().optional().nullable(),
})

// ============================================
// REFLECTION SCHEMA
// ============================================

export const reflectionSchema = z.object({
  thoughts: z.string().max(5000).optional(),
  rating: z.number().min(1).max(5),
  mood: z.enum(['amazing', 'good', 'okay', 'meh', 'bad']).optional(),
  improvements: z.string().max(2000).optional(),
  highlights: z.string().max(2000).optional(),
})

// ============================================
// NOTIFICATION SCHEMA
// ============================================

export const customNotificationSchema = z.object({
  event_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  message: z.string().max(1000).optional(),
  scheduled_for: z.string().min(1, 'Schedule time is required'),
})

// ============================================
// ORGANIZATION SCHEMA
// ============================================

export const orgSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional(),
})

export const orgMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
  permissions: z.object({
    can_create: z.boolean().default(false),
    can_edit: z.boolean().default(false),
    can_delete: z.boolean().default(false),
    can_invite: z.boolean().default(false),
    can_export: z.boolean().default(false),
  }),
})
