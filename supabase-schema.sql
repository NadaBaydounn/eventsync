-- ===========================================
-- EventSync — Full Database Schema
-- ===========================================
-- Paste this into Supabase SQL Editor and run it
-- ===========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  theme_mode TEXT DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
  custom_color TEXT DEFAULT '#6366F1',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "reminders": ["1h", "1d"]}',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ORGANIZATIONS
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  settings JSONB DEFAULT '{}',
  max_members INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{"can_create": false, "can_edit": false, "can_delete": false, "can_invite": false, "can_export": false}',
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(org_id, user_id)
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT DEFAULT 'general' CHECK (event_type IN (
    'party', 'educational', 'trip', 'business', 'sports', 'concert',
    'dining', 'birthday', 'tech', 'health', 'art', 'wedding', 'volunteer', 'general'
  )),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  virtual_link TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'attending', 'maybe', 'declined', 'completed', 'cancelled')),
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  is_locked BOOLEAN DEFAULT false,
  lock_password_hash TEXT,
  color_override TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
  budget DECIMAL(10,2),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_org_id ON events(org_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_title_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================
-- EVENT INVITATIONS
-- ============================================
CREATE TABLE event_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_name TEXT,
  invitee_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  rsvp_message TEXT,
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(event_id, invitee_email)
);

-- ============================================
-- SHARE LINKS
-- ============================================
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('single_event', 'calendar', 'org_calendar')),
  target_id UUID NOT NULL,
  permissions TEXT DEFAULT 'view' CHECK (permissions IN ('view', 'comment')),
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'invitation', 'update', 'rsvp', 'custom', 'ai_suggestion')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================
-- EVENT REFLECTIONS
-- ============================================
CREATE TABLE event_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  thoughts TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  mood TEXT CHECK (mood IN ('amazing', 'good', 'okay', 'meh', 'bad')),
  improvements TEXT,
  highlights TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- POLLS
-- ============================================
CREATE TABLE event_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  poll_type TEXT DEFAULT 'single' CHECK (poll_type IN ('single', 'multiple', 'text', 'date_picker')),
  options JSONB NOT NULL DEFAULT '[]',
  deadline TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT false,
  allow_other BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES event_polls(id) ON DELETE CASCADE,
  respondent_email TEXT,
  respondent_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  selected_options JSONB NOT NULL,
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, respondent_email)
);

-- ============================================
-- AI CONVERSATIONS
-- ============================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  context TEXT CHECK (context IN ('general', 'planning', 'suggestions', 'import')),
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG
-- ============================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_log(user_id, created_at DESC);

-- ============================================
-- EVENT TEMPLATES (save & reuse)
-- ============================================
CREATE TABLE event_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  use_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENT CHECKLISTS (packing/prep)
-- ============================================
CREATE TABLE event_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- EVENT REACTIONS (emoji reactions)
-- ============================================
CREATE TABLE event_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id, emoji)
);

-- ============================================
-- CALENDAR LAYERS (multi-calendar support)
-- ============================================
CREATE TABLE calendar_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366F1',
  is_visible BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'local',
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_layers ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);

-- Events
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (
  created_by = auth.uid()
  OR org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  OR visibility = 'public'
);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (created_by = auth.uid());

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can create notifications" ON notifications FOR INSERT WITH CHECK (user_id = auth.uid());

-- Invitations
CREATE POLICY "Event owners can manage invitations" ON event_invitations FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Invitees can view their invitations" ON event_invitations FOR SELECT USING (
  invitee_user_id = auth.uid() OR invitee_email IN (SELECT email FROM profiles WHERE id = auth.uid())
);

-- Share links
CREATE POLICY "Users can manage own share links" ON share_links FOR ALL USING (created_by = auth.uid());

-- AI conversations
CREATE POLICY "Users can manage own AI chats" ON ai_conversations FOR ALL USING (user_id = auth.uid());

-- Reflections
CREATE POLICY "Users can manage own reflections" ON event_reflections FOR ALL USING (user_id = auth.uid());

-- Activity log
CREATE POLICY "Users can view own activity" ON activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create activity" ON activity_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- Org members
CREATE POLICY "Org members can view their org" ON org_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Org admins can manage members" ON org_members FOR ALL USING (
  org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'admin')
);

-- Organizations
CREATE POLICY "Members can view their orgs" ON organizations FOR SELECT USING (
  id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  OR created_by = auth.uid()
);
CREATE POLICY "Users can create orgs" ON organizations FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Polls
CREATE POLICY "Event owners can manage polls" ON event_polls FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Anyone can view polls" ON event_polls FOR SELECT USING (true);
CREATE POLICY "Anyone can respond to polls" ON poll_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Poll creators can view responses" ON poll_responses FOR SELECT USING (
  poll_id IN (
    SELECT ep.id FROM event_polls ep
    JOIN events e ON ep.event_id = e.id
    WHERE e.created_by = auth.uid()
  )
);

-- Templates
CREATE POLICY "Users manage own templates" ON event_templates FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public templates viewable" ON event_templates FOR SELECT USING (is_public = true);

-- Checklists
CREATE POLICY "Users manage own checklists" ON event_checklists FOR ALL USING (user_id = auth.uid());

-- Reactions
CREATE POLICY "Users manage own reactions" ON event_reactions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view reactions" ON event_reactions FOR SELECT USING (true);

-- Calendar Layers
CREATE POLICY "Users manage own calendar layers" ON calendar_layers FOR ALL USING (user_id = auth.uid());


-- ============================================
-- HOST/ATTENDEE SYSTEM TABLES
-- ============================================

-- Co-hosts
CREATE TABLE event_cohosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{"can_manage_guests": true, "can_edit_event": false, "can_manage_budget": false, "can_send_messages": true, "can_manage_tasks": true, "can_manage_polls": true}',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- Event Tasks (host planning)
CREATE TABLE event_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_type TEXT DEFAULT 'relative' CHECK (due_type IN ('relative', 'absolute')),
  due_relative TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  sort_order INT DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Budget Items
CREATE TABLE event_budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  estimated_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_amount DECIMAL(10,2),
  status TEXT DEFAULT 'estimated' CHECK (status IN ('estimated', 'committed', 'paid')),
  paid_by UUID REFERENCES profiles(id),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Timeline (Run of Show)
CREATE TABLE event_timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES profiles(id),
  icon TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'skipped')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Announcements (host → attendees)
CREATE TABLE event_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'all' CHECK (visibility IN ('all', 'confirmed', 'cohosts')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Messages (host bulk messages)
CREATE TABLE event_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_filter TEXT DEFAULT 'all' CHECK (recipient_filter IN ('all', 'confirmed', 'pending', 'maybe', 'cohosts')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_count INT DEFAULT 0
);

-- Event Photos (shared gallery)
CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for host/attendee tables
ALTER TABLE event_cohosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts manage cohosts" ON event_cohosts FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Cohosts view own" ON event_cohosts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Hosts/cohosts manage tasks" ON event_tasks FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);
CREATE POLICY "Hosts manage budget" ON event_budget_items FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Cohosts view budget" ON event_budget_items FOR SELECT USING (
  event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);
CREATE POLICY "Hosts/cohosts manage timeline" ON event_timeline_items FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);
CREATE POLICY "Anyone views announcements" ON event_announcements FOR SELECT USING (true);
CREATE POLICY "Hosts/cohosts create announcements" ON event_announcements FOR INSERT WITH CHECK (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);
CREATE POLICY "Hosts send messages" ON event_messages FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Anyone upload photos" ON event_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone view photos" ON event_photos FOR SELECT USING (true);
CREATE POLICY "Uploaders manage photos" ON event_photos FOR DELETE USING (uploaded_by = auth.uid());
