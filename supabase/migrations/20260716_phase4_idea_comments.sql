-- Phase 4 idea comments (MCP: phase4_idea_comments)
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
