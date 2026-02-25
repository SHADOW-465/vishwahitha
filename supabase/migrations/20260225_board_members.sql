CREATE TABLE IF NOT EXISTS public.board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0
);
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Board viewable by all" ON public.board_members;
CREATE POLICY "Board viewable by all" ON public.board_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage board" ON public.board_members;
CREATE POLICY "Admins manage board" ON public.board_members FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
