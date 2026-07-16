-- Phase 1 Public House: contact messages + legacy flag + online events
-- Apply in Supabase SQL editor if not using CLI.

ALTER TABLE public.initiatives
    ADD COLUMN IF NOT EXISTS is_legacy BOOLEAN DEFAULT false;

ALTER TABLE public.events
    ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age TEXT,
    occupation TEXT,
    message TEXT NOT NULL,
    kind TEXT DEFAULT 'contact' CHECK (kind IN ('contact', 'prospect')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read contact messages" ON public.contact_messages;
CREATE POLICY "Admins read contact messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Prefer one legacy project: Vaagai as default flagship if none set
UPDATE public.initiatives
SET is_legacy = true
WHERE slug = 'vaagai'
  AND NOT EXISTS (SELECT 1 FROM public.initiatives WHERE is_legacy = true);

INSERT INTO public.page_sections (section_key, content) VALUES
    ('mission', '{"mission": "Empower young leaders in Chennai to drive community-led change through service, fellowship, and professional growth.", "vision": "A club known for reliable service, clear leadership, and universal friendship — Vishwahita."}'),
    ('standing', '{"charter": "10 March 1999", "sponsor": "Rotary Club of Madras Industrial City", "district": "3234", "group": "01"}')
ON CONFLICT (section_key) DO NOTHING;
