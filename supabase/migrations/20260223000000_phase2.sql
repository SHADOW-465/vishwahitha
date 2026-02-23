-- Phase 2 Feature Expansion Migration

-- 1. Create `events` table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_by TEXT NOT NULL -- Clerk ID referencing profiles.id conceptually
);

-- 2. Create `event_rsvps` table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL, -- Clerk ID referencing profiles.id
    status TEXT CHECK (status IN ('attending', 'apologies')) NOT NULL,
    UNIQUE(event_id, member_id)
);

-- 3. Create `documents` table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for `events`
-- Public events readable by anon and authenticated
CREATE POLICY "Public events are viewable by everyone" ON public.events
    FOR SELECT USING (is_public = true);

-- ALL other operations (insert, update, delete) restricted to admins
-- Assuming we have a function `is_admin()` or we check `public.profiles`
CREATE POLICY "Admins can insert events" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin')
    );

CREATE POLICY "Admins can update events" ON public.events
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin')
    );

CREATE POLICY "Admins can delete events" ON public.events
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin')
    );

-- 5. RLS Policies for `event_rsvps`
-- Readable by authenticated users
CREATE POLICY "RSVPs are viewable by authenticated users" ON public.event_rsvps
    FOR SELECT USING (auth.role() = 'authenticated');

-- Members can insert/update their own RSVPs (this wasn't explicitly mentioned, but logically members RSVP for themselves. The prompt says "ALL inserts/updates/deletes are strictly restricted... wait.
-- Prompt: "ALL inserts/updates/deletes are strictly restricted to profiles where role === 'admin'."
-- Strictly following prompt:
CREATE POLICY "Admins can insert rsvps" ON public.event_rsvps
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins can update rsvps" ON public.event_rsvps
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins can delete rsvps" ON public.event_rsvps
    FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- Wait, the prompt said: "ALL inserts/updates/deletes are strictly restricted to profiles where role === 'admin'."
-- However, "When an admin posts an event, members see a one-click 'RSVP / Send Apologies' toggle that writes to the 'event_rsvps' table."
-- If a member corresponds to an RSVP, the member must be able to insert/update their own RSVP! I will allow users to insert/update their own RSVP, and admins can do anything. But let's follow the strict instruction for admins on everything else, and member for their own RSVP.

CREATE POLICY "Members can insert their own rsvp" ON public.event_rsvps
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND member_id = auth.uid()::text);

CREATE POLICY "Members can update their own rsvp" ON public.event_rsvps
    FOR UPDATE USING (auth.role() = 'authenticated' AND member_id = auth.uid()::text);

-- 6. RLS Policies for `documents`
-- Readable by authenticated users
CREATE POLICY "Documents are viewable by authenticated users" ON public.documents
    FOR SELECT USING (auth.role() = 'authenticated');

-- Admin ALL for documents
CREATE POLICY "Admins can insert documents" ON public.documents
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins can update documents" ON public.documents
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins can delete documents" ON public.documents
    FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
