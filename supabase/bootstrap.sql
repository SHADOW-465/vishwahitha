-- =============================================================================
-- Vishwahita — unified Supabase bootstrap (empty project → app-ready)
-- =============================================================================
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS / ON CONFLICT.
--
-- Auth model: Clerk owns identity. Server mutations use the service-role key
-- (bypasses RLS). Public pages use the anon key → SELECT policies matter.
-- Admin role in the app is Clerk publicMetadata.role === "admin"; the users.role
-- column is for RLS helpers / directory sync, not the sole admin gate.
--
-- After apply:
--   1. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
--   2. Set SUPABASE_SERVICE_ROLE_KEY (server only)
--   3. Sign in once as a member so syncUserToSupabase upserts you
--   4. Optional: UPDATE public.users SET role = 'admin' WHERE id = 'user_...';
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,                          -- Clerk user id (e.g. user_...)
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'member'
        CHECK (role IN ('member', 'admin')),
    tutorial_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_online BOOLEAN NOT NULL DEFAULT false,
    created_by TEXT NOT NULL,                    -- Clerk id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,                     -- Clerk id
    status TEXT NOT NULL CHECK (status IN ('attending', 'apologies')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (event_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,                      -- Clerk id
    tag TEXT NOT NULL DEFAULT 'general'
        CHECK (tag IN ('event', 'update', 'urgent', 'general')),
    visibility TEXT NOT NULL DEFAULT 'public'
        CHECK (visibility IN ('public', 'members')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    impact_stat TEXT,
    impact_label TEXT,
    hero_image_url TEXT,
    color_class TEXT DEFAULT 'border-white/10',
    is_featured BOOLEAN NOT NULL DEFAULT true,
    is_legacy BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.initiative_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- App reads both shapes: teaser uses image_url/caption; grid uses url/title/type
    url TEXT,
    image_url TEXT,
    title TEXT,
    caption TEXT,
    type TEXT NOT NULL DEFAULT 'image'
        CHECK (type IN ('image', 'video')),
    initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pulse_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_label TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES public.pulse_forms(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (form_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT
);

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    type TEXT DEFAULT 'suggestion',
    member_id TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age TEXT,
    occupation TEXT,
    message TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'contact'
        CHECK (kind IN ('contact', 'prospect')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'under_review', 'planned', 'done', 'declined')),
    vote_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.idea_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (idea_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.idea_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent column upgrades if an older partial schema already exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS tutorial_completed_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS is_legacy BOOLEAN DEFAULT false;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.initiatives ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;

ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT 'general';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS author_id TEXT;

ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL;
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image';
ALTER TABLE public.gallery_media ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (date);
CREATE INDEX IF NOT EXISTS idx_events_public ON public.events (is_public);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_member ON public.event_rsvps (member_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON public.announcements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_initiatives_featured ON public.initiatives (is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_initiatives_legacy ON public.initiatives (is_legacy);
CREATE INDEX IF NOT EXISTS idx_board_display ON public.board_members (display_order);
CREATE INDEX IF NOT EXISTS idx_milestones_display ON public.milestones (display_order);
CREATE INDEX IF NOT EXISTS idx_ideas_created ON public.ideas (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON public.gallery_media (created_at DESC);

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
-- Architecture: Clerk auth + service-role key for ALL server mutations
-- (supabase-admin.ts). Service role bypasses RLS automatically.
-- Anon key is used only for public SELECT (and contact form INSERT).
-- Member clubroom pages that query with the anon client need SELECT policies
-- on member tables; writes still go through service-role server actions.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiative_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulse_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulse_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;

-- Drop legacy policy names from older migrations
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
              'users','events','event_rsvps','documents','board_members',
              'announcements','initiatives','initiative_gallery','gallery_media',
              'pulse_forms','pulse_responses','page_sections','feedback',
              'contact_messages','milestones','ideas','idea_votes','idea_comments'
          )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Public marketing SELECTs
CREATE POLICY "events_public_select" ON public.events
    FOR SELECT USING (is_public = true);

CREATE POLICY "board_public_select" ON public.board_members
    FOR SELECT USING (true);

CREATE POLICY "announcements_public_select" ON public.announcements
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "initiatives_public_select" ON public.initiatives
    FOR SELECT USING (true);

CREATE POLICY "initiative_gallery_public_select" ON public.initiative_gallery
    FOR SELECT USING (true);

CREATE POLICY "gallery_media_public_select" ON public.gallery_media
    FOR SELECT USING (true);

CREATE POLICY "page_sections_public_select" ON public.page_sections
    FOR SELECT USING (true);

CREATE POLICY "milestones_public_select" ON public.milestones
    FOR SELECT USING (true);

-- Contact / prospect form (also works if client ever uses anon insert)
CREATE POLICY "contact_public_insert" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Member-facing SELECTs (pages use anon client + Clerk gate in Next.js)
-- Not secret PII beyond what members already share in-club.
CREATE POLICY "users_select" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "documents_select" ON public.documents
    FOR SELECT USING (true);

CREATE POLICY "event_rsvps_select" ON public.event_rsvps
    FOR SELECT USING (true);

CREATE POLICY "pulse_forms_select" ON public.pulse_forms
    FOR SELECT USING (true);

CREATE POLICY "pulse_responses_select" ON public.pulse_responses
    FOR SELECT USING (true);

CREATE POLICY "feedback_select" ON public.feedback
    FOR SELECT USING (true);

CREATE POLICY "ideas_select" ON public.ideas
    FOR SELECT USING (true);

CREATE POLICY "idea_votes_select" ON public.idea_votes
    FOR SELECT USING (true);

CREATE POLICY "idea_comments_select" ON public.idea_comments
    FOR SELECT USING (true);

CREATE POLICY "contact_select" ON public.contact_messages
    FOR SELECT USING (true);

CREATE POLICY "announcements_all_select" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "events_all_select" ON public.events
    FOR SELECT USING (true);

-- No anon INSERT/UPDATE/DELETE on CMS or clubroom tables.
-- All of those go through service-role server actions after Clerk auth().

-- ---------------------------------------------------------------------------
-- 3. Seed content (honest club facts only — no vanity metrics)
-- ---------------------------------------------------------------------------

INSERT INTO public.page_sections (section_key, content) VALUES
    ('hero_headline', '{"line1": "Service Above", "line2": "Self."}'::jsonb),
    ('hero_subtext', '{"text": "Rotaract Club of Vishwahita — young leaders in Chennai, RI District 3234. Unite for Good. Rise Above."}'::jsonb),
    ('about_story', '{"paragraphs": ["The Rotaract Club of Vishwahita is a community of young leaders dedicated to service, fellowship, and professional growth in Chennai.", "Chartered 10 March 1999 and sponsored by the Rotary Club of Madras Industrial City, we serve under RI District 3234, Group 02. Vishwahita means universal friendship."]}'::jsonb),
    ('footer_tagline', '{"text": "Unite for Good · Rise Above — Rotaract Club of Vishwahita, RI District 3234."}'::jsonb),
    ('mission', '{"mission": "Empower young leaders in Chennai to drive community-led change through service, fellowship, and professional growth.", "vision": "A club known for reliable service, clear leadership, and universal friendship — Vishwahita."}'::jsonb),
    ('standing', '{"charter": "10 March 1999", "sponsor": "Rotary Club of Madras Industrial City", "district": "3234", "group": "02"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.initiatives (
    slug, title, category, short_description, impact_stat, impact_label, color_class, display_order, is_featured, is_legacy
) VALUES
    (
        'vaagai',
        'Vaagai',
        'Community',
        'Connecting youth with elders through structured visits, skill-sharing, and companionship.',
        NULL,
        NULL,
        'border-accent-gold/30',
        1,
        true,
        true
    ),
    (
        'indru',
        'INDRU',
        'Professional',
        'Delivering curated learning and knowledge culture among members and the community.',
        NULL,
        NULL,
        'border-accent-teal/30',
        2,
        true,
        false
    ),
    (
        'wishfit',
        'WishFit',
        'Community',
        'Collecting and distributing quality clothing to families in need during festive seasons.',
        NULL,
        NULL,
        'border-accent-red/30',
        3,
        true,
        false
    )
ON CONFLICT (slug) DO NOTHING;

-- Exactly one legacy flagship if none set
UPDATE public.initiatives
SET is_legacy = true
WHERE slug = 'vaagai'
  AND NOT EXISTS (SELECT 1 FROM public.initiatives WHERE is_legacy = true);

INSERT INTO public.board_members (name, role, image_url, display_order)
SELECT * FROM (VALUES
    ('Rtr. Mahalakshmi', 'Club President', '/Mahalakshmi.jpeg', 1),
    ('Rtr. Nandhini', 'Club Secretary', '/Nandhini.jpeg', 2)
) AS v(name, role, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.board_members LIMIT 1);

INSERT INTO public.milestones (year, title, body, display_order)
SELECT * FROM (VALUES
    ('1999', 'Club chartered', 'Rotaract Club of Vishwahita chartered on 10 March 1999.', 1),
    ('—', 'Sponsored by Rotary Club of Madras Industrial City', 'Parent Rotary club partnership.', 2),
    ('—', 'RI District 3234 · Group 02', 'Serving Chennai under District 3234.', 3)
) AS v(year, title, body, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.milestones LIMIT 1);

-- ---------------------------------------------------------------------------
-- Done. Verify: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- =============================================================================
