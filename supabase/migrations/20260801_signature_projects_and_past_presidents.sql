-- Signature projects + past presidents
--
-- Docker isn't running locally, so apply this in the Supabase dashboard SQL
-- editor (Project → SQL Editor → New query → paste → Run).
--
-- Safe to re-run: every statement is guarded.

-- ─────────────────────────────────────────────────────────────
-- 1. Signature projects
--
-- "Signature" is a property of an initiative, not a second list. This keeps
-- the five signature projects editable in Admin → Initiatives alongside
-- everything else, instead of drifting out of sync with a hardcoded array.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.initiatives
    ADD COLUMN IF NOT EXISTS is_signature BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.initiatives.is_signature IS
    'Club signature project — surfaced in the signed Act III block on the homepage.';

-- Partial index: the public homepage only ever queries the signature few.
CREATE INDEX IF NOT EXISTS initiatives_is_signature_idx
    ON public.initiatives (display_order)
    WHERE is_signature = true;

-- Seed the five signature projects. ON CONFLICT keeps any copy, imagery, or
-- impact figures the board has already written for a slug that exists
-- (Vaagai was seeded in phase 2) and only promotes it to signature.
-- Copy transcribed from the 2026-27 President Elect year-plan deck (slide 12).
INSERT INTO public.initiatives
    (slug, title, category, short_description, full_description, is_signature, is_featured, display_order)
VALUES
    ('visil', 'Visil', 'Back to school days',
     'Reviving classic school sports games to reignite the joy and camaraderie of childhood.',
     'The "VISIL - Back to School Days" project aims to reignite the joy and camaraderie of childhood through the revival of classic school sports games, organising a series of events and activities that evoke nostalgia and fond memories of school days.',
     true, true, 1),
    ('vawez', 'Vawez', 'Culture for clean water',
     'A cultural dance showcase raising funds to fit water-saving taps in schools.',
     'VAWEZ is a cultural dance showcase designed to highlight the talents of performers. The event raises funds for fitting water-saving taps in schools, promoting sustainability and responsible water usage among students and staff.',
     true, true, 2),
    ('vaagai', 'Vaagai', 'Elder care',
     'Ganesh Chaturthi celebrations in old age homes, so elderly residents share in the festival.',
     'The VAAGAI project spreads joy and festive cheer by organising special events and activities in old age homes during Ganesh Chaturthi, creating a vibrant and inclusive environment where elderly residents can take part in cultural rituals.',
     true, true, 3),
    ('vannangal', 'Vannangal', 'Orphanage outreach',
     'Speakers bringing knowledge, skills and support to young people living in orphanages.',
     'Through the VANNANGAL project, speakers make a meaningful difference in the lives of people living in orphanages, empowering them with the knowledge, skills and support to overcome obstacles and pursue their dreams with confidence and resilience.',
     true, true, 4),
    ('peace', 'Peace', 'International service',
     'Rotaractors worldwide sharing the peace symbol — one collective image of solidarity.',
     'PEACE fosters global unity by showcasing solidarity through a simple but powerful act: Rotaractors worldwide sharing selfies with the peace symbol, creating a collective visual representation of our commitment to peace and unity.',
     true, true, 5)
ON CONFLICT (slug) DO UPDATE
    SET is_signature     = true,
        display_order    = EXCLUDED.display_order,
        -- Only fill copy the board hasn't already written for itself.
        category          = COALESCE(NULLIF(initiatives.category, ''), EXCLUDED.category),
        short_description = COALESCE(NULLIF(initiatives.short_description, ''), EXCLUDED.short_description),
        full_description  = COALESCE(NULLIF(initiatives.full_description, ''), EXCLUDED.full_description);

-- ─────────────────────────────────────────────────────────────
-- 2. Past presidents
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.past_presidents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    term          TEXT NOT NULL,           -- e.g. '2024–25'
    note          TEXT,                    -- one line on what defined the term
    image_url     TEXT,
    display_order INT DEFAULT 0,           -- ascending = most recent first
    created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.past_presidents IS
    'Roll of past club presidents, shown on /about. Ordered by display_order ascending (most recent first).';

CREATE INDEX IF NOT EXISTS past_presidents_display_order_idx
    ON public.past_presidents (display_order);

ALTER TABLE public.past_presidents ENABLE ROW LEVEL SECURITY;

-- The roll is public record; writes go through the service-role client in
-- server-actions.ts, which bypasses RLS and is already guarded by Clerk auth.
DROP POLICY IF EXISTS "Past presidents are viewable by everyone" ON public.past_presidents;
CREATE POLICY "Past presidents are viewable by everyone"
    ON public.past_presidents
    FOR SELECT
    USING (true);
