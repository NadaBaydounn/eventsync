# Skill: Database Schema Reference

## Core Tables

### profiles
User profiles, auto-created on signup via trigger.
- `id` UUID (PK, references auth.users)
- `full_name`, `email`, `avatar_url`
- `theme_mode` (light/dark/system), `custom_color`
- `plan` (free/premium)
- `notification_preferences` JSONB
- `onboarding_completed` boolean

### events
Main events table with 14 event types.
- `id` UUID (PK)
- `title`, `description`, `event_type`
- `start_time`, `end_time`, `all_day`
- `location`, `location_lat`, `location_lng`, `virtual_link`
- `status` (upcoming/attending/maybe/declined/completed/cancelled)
- `priority` (low/normal/high/urgent)
- `visibility` (private/team/public)
- `is_recurring`, `recurrence_rule`
- `is_locked`, `lock_password_hash`
- `budget`, `tags[]`, `attachments` JSONB
- `created_by` UUID, `org_id` UUID

### event_invitations
- `event_id`, `invitee_email`, `invitee_name`, `invitee_user_id`
- `status` (pending/accepted/declined/maybe)
- `token` (unique, for RSVP links)

### share_links
- `token` (unique), `scope` (single_event/calendar/org_calendar)
- `target_id`, `permissions` (view/comment)
- `password_hash`, `expires_at`, `view_count`

## Host/Attendee Tables

### event_cohosts
- `event_id`, `user_id`, `permissions` JSONB

### event_tasks
- `event_id`, `title`, `assignee_id`
- `due_type` (relative/absolute), `due_relative`, `due_date`
- `priority`, `category`, `is_completed`

### event_budget_items
- `event_id`, `category`, `item_name`
- `estimated_amount`, `actual_amount`
- `status` (estimated/committed/paid)

### event_timeline_items
- `event_id`, `time`, `title`, `icon`
- `status` (upcoming/in_progress/completed/skipped)

### event_announcements
- `event_id`, `author_id`, `title`, `content`
- `is_pinned`, `visibility` (all/confirmed/cohosts)

### event_photos
- `event_id`, `uploaded_by`, `image_url`, `caption`, `is_cover`

## Feature Tables

### event_reflections
- `event_id`, `user_id`, `thoughts`, `rating` (1-5), `mood`
- `improvements`, `highlights`, `images[]`

### event_polls / poll_responses
- Polls: `question`, `poll_type`, `options` JSONB, `deadline`
- Responses: `selected_options` JSONB

### event_templates
- `user_id`, `name`, `event_type`, `template_data` JSONB
- `is_public`, `use_count`

### event_checklists
- `event_id`, `user_id`, `items` JSONB

### event_reactions
- `event_id`, `user_id`, `emoji`

## Indexes
- `idx_events_start_time` — For date range queries
- `idx_events_created_by` — For user's events
- `idx_events_title_search` — GIN index for full-text search
