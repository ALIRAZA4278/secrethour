-- "Choose Your Set" on the product page: other products (usually bundles) the
-- customer can pick instead of / alongside this one, in the order given.
-- Managed from the admin Products tab. Safe to re-run.
ALTER TABLE products ADD COLUMN IF NOT EXISTS set_slugs TEXT[];

-- Optional product video (mp4/webm URL). Shows as a "Watch Video" thumbnail
-- in the gallery when set.
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
