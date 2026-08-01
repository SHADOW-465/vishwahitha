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
INSERT INTO public.initiatives
    (slug, title, category, short_description, is_signature, is_featured, display_order)
VALUES
    ('visil',     'Visil',     'Signature project', 'A flagship Vishwahita programme.', true, true, 1),
    ('vawez',     'Vawez',     'Signature project', 'A flagship Vishwahita programme.', true, true, 2),
    ('vaagai',    'Vaagai',    'Elder Care',        'Connecting youth with elders through structured visits, skill-sharing and companionship programmes.', true, true, 3),
    ('vannangal', 'Vannangal', 'Signature project', 'A flagship Vishwahita programme.', true, true, 4),
    ('peace',     'Peace',     'Signature project', 'A flagship Vishwahita programme.', true, true, 5)
ON CONFLICT (slug) DO UPDATE
    SET is_signature  = true,
        display_order = EXCLUDED.display_order;

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
