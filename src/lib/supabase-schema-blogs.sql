-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_status_created ON public.blogs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read of published blogs
CREATE POLICY "Allow public read published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

-- RLS Policy: Allow admin full access (you can adjust auth check based on your setup)
CREATE POLICY "Allow admin full access" ON public.blogs
  USING (true); -- This allows all operations; adjust based on your auth method

-- Create storage bucket for blog cover images (via Supabase dashboard)
-- Bucket name: blogs
-- Public: true
