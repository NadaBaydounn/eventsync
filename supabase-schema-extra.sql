-- ===========================================
-- EventSync — Additional Tables (Run AFTER main schema)
-- ===========================================

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
-- CALENDAR LAYERS (multi-calendar)
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
-- CO-HOSTS
-- ============================================
CREATE TABLE event_cohosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{"can_manage_guests": true, "can_edit_event": false, "can_manage_budget": false, "can_send_messages": true, "can_manage_tasks": true, "can_manage_polls": true}',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- ============================================
-- EVENT TASKS (host planning)
-- ============================================
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

-- ============================================
-- EVENT BUDGET ITEMS
-- ============================================
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

-- ============================================
-- EVENT TIMELINE (Run of Show)
-- ============================================
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

-- ============================================
-- EVENT ANNOUNCEMENTS
-- ============================================
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

-- ============================================
-- EVENT MESSAGES
-- ============================================
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

-- ============================================
-- EVENT PHOTOS
-- ============================================
CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS FOR ALL NEW TABLES
-- ============================================
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_cohosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

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

-- Co-hosts
CREATE POLICY "Hosts manage cohosts" ON event_cohosts FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Cohosts view own" ON event_cohosts FOR SELECT USING (user_id = auth.uid());

-- Tasks
CREATE POLICY "Hosts/cohosts manage tasks" ON event_tasks FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);

-- Budget
CREATE POLICY "Hosts manage budget" ON event_budget_items FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Cohosts view budget" ON event_budget_items FOR SELECT USING (
  event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);

-- Timeline
CREATE POLICY "Hosts/cohosts manage timeline" ON event_timeline_items FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);

-- Announcements
CREATE POLICY "Anyone views announcements" ON event_announcements FOR SELECT USING (true);
CREATE POLICY "Hosts/cohosts create announcements" ON event_announcements FOR INSERT WITH CHECK (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
  OR event_id IN (SELECT event_id FROM event_cohosts WHERE user_id = auth.uid())
);

-- Messages
CREATE POLICY "Hosts send messages" ON event_messages FOR ALL USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);

-- Photos
CREATE POLICY "Anyone upload photos" ON event_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone view photos" ON event_photos FOR SELECT USING (true);
CREATE POLICY "Uploaders manage photos" ON event_photos FOR DELETE USING (uploaded_by = auth.uid());
