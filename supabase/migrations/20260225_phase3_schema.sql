-- ============================================================
-- Phase 3: Full Feature Expansion
-- ============================================================

-- 1. ALTER existing announcements table (from BroadcastCenter)
--    Add missing columns. If table doesn't exist yet, CREATE it.
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.announcements
    ADD COLUMN IF NOT EXISTS tag TEXT CHECK (tag IN ('event','update','urgent','general')) DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS visibility TEXT CHECK (visibility IN ('public','members')) DEFAULT 'public',
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 2. Initiatives table (replaces hardcoded array in ProjectShuffler)
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
    is_featured BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Per-initiative gallery
CREATE TABLE IF NOT EXISTS public.initiative_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID REFERENCES public.initiatives(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Seed the 3 existing hardcoded initiatives
INSERT INTO public.initiatives (slug, title, category, short_description, impact_stat, impact_label, color_class, display_order)
VALUES
    ('vaagai', 'Vaagai', 'Elder Care', 'Connecting youth with elders through structured visits, skill-sharing and companionship programs.', '320', 'elders served', 'border-accent-gold/30', 1),
    ('indru', 'INDRU', 'Daily Knowledge', 'Delivering one curated insight every day to build a culture of continuous learning among members.', '365', 'insights delivered', 'border-accent-teal/30', 2),
    ('wishfit', 'WishFit', 'Festive Clothing Drive', 'Collecting and distributing quality clothing to underprivileged families during festive seasons.', '1200', 'garments donated', 'border-accent-red/30', 3)
ON CONFLICT (slug) DO NOTHING;

-- 5. Weekly Pulse forms
CREATE TABLE IF NOT EXISTS public.pulse_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_label TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Weekly Pulse responses
CREATE TABLE IF NOT EXISTS public.pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.pulse_forms(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(form_id, member_id)
);

-- 7. CMS page sections
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT
);

-- Seed default CMS content
INSERT INTO public.page_sections (section_key, content) VALUES
    ('hero_headline', '{"line1": "Service Above", "line2": "Self."}'),
    ('hero_subtext', '{"text": "Community Luxe. We are the Rotaract Club of Vishwahita — merging high-end execution with dedicated NGO roots."}'),
    ('about_story', '{"paragraphs": ["The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects.", "Sponsored by Rotary International, we operate under the guiding principle of Service Above Self — executing high-quality, sustainable programs that address local needs while building a network of global citizens."]}'),
    ('footer_tagline', '{"text": "A community of young leaders taking action to build a better world."}')
ON CONFLICT (section_key) DO NOTHING;

-- 8. Add initiative_id to gallery_media for tagging
ALTER TABLE public.gallery_media
    ADD COLUMN IF NOT EXISTS initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL;

-- 9. RLS Policies

-- announcements: public ones readable by all, members-only by authenticated
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public announcements viewable by all" ON public.announcements;
CREATE POLICY "Public announcements viewable by all" ON public.announcements
    FOR SELECT USING (visibility = 'public');
DROP POLICY IF EXISTS "Members see all announcements" ON public.announcements;
CREATE POLICY "Members see all announcements" ON public.announcements
    FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements" ON public.announcements
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- initiatives: public read
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Initiatives viewable by all" ON public.initiatives;
CREATE POLICY "Initiatives viewable by all" ON public.initiatives FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage initiatives" ON public.initiatives;
CREATE POLICY "Admins manage initiatives" ON public.initiatives
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- initiative_gallery: public read
ALTER TABLE public.initiative_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Initiative gallery viewable by all" ON public.initiative_gallery;
CREATE POLICY "Initiative gallery viewable by all" ON public.initiative_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage initiative gallery" ON public.initiative_gallery;
CREATE POLICY "Admins manage initiative gallery" ON public.initiative_gallery
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- pulse_forms: authenticated read
ALTER TABLE public.pulse_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members read pulse forms" ON public.pulse_forms;
CREATE POLICY "Members read pulse forms" ON public.pulse_forms FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins manage pulse forms" ON public.pulse_forms;
CREATE POLICY "Admins manage pulse forms" ON public.pulse_forms
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- pulse_responses: members insert own, admins read all
ALTER TABLE public.pulse_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members submit own pulse response" ON public.pulse_responses;
CREATE POLICY "Members submit own pulse response" ON public.pulse_responses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND member_id = auth.uid()::text);
DROP POLICY IF EXISTS "Members read own response" ON public.pulse_responses;
CREATE POLICY "Members read own response" ON public.pulse_responses
    FOR SELECT USING (member_id = auth.uid()::text);
DROP POLICY IF EXISTS "Admins read all responses" ON public.pulse_responses;
CREATE POLICY "Admins read all responses" ON public.pulse_responses
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- page_sections: public read, admin write
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Page sections readable by all" ON public.page_sections;
CREATE POLICY "Page sections readable by all" ON public.page_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage page sections" ON public.page_sections;
CREATE POLICY "Admins manage page sections" ON public.page_sections
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
