-- Build-a-Bundle feature: mood tags on products, admin-editable discount
-- tiers, and admin-editable curated preset bundles. Safe to re-run.

-- Mood tags (Romantic / Playful / Sensual / Wild) used to highlight
-- recommended products on the Build-a-Bundle page. Edited per-product
-- from the admin Products tab.
ALTER TABLE products ADD COLUMN IF NOT EXISTS moods TEXT[] DEFAULT '{}';

-- The card deck spans all four categories, so it is recommended for every
-- mood. Only seeds products that have no moods set yet, so admin edits stick.
UPDATE products
SET moods = ARRAY['Romantic', 'Playful', 'Sensual', 'Wild']
WHERE (slug = 'midnight-deck' OR category = 'Card Game')
  AND (moods IS NULL OR moods = '{}');

-- Bundle discount tiers: "add N items total, unlock X% off the bundle".
-- Managed from the admin Bundles tab.
CREATE TABLE IF NOT EXISTS bundle_discount_tiers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_items     INTEGER NOT NULL,
  discount_pct  INTEGER NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the same tiers as the reference design, only if the table is empty.
INSERT INTO bundle_discount_tiers (min_items, discount_pct)
SELECT * FROM (VALUES (2, 5), (3, 10), (4, 15)) AS v(min_items, discount_pct)
WHERE NOT EXISTS (SELECT 1 FROM bundle_discount_tiers);

-- Curated "Need inspiration?" preset bundles. Managed from the admin
-- Bundles tab; each preset references real products by slug.
CREATE TABLE IF NOT EXISTS bundle_presets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  blurb          TEXT,
  product_slugs  TEXT[] NOT NULL DEFAULT '{}',
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Supabase enables RLS on new tables, and with no policy the anon key the site
-- and admin use gets empty results and rejected writes. Allow both, matching
-- how products is already reachable (admin login is client-side, not a Supabase role).
ALTER TABLE bundle_discount_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bundle_discount_tiers_read" ON bundle_discount_tiers;
CREATE POLICY "bundle_discount_tiers_read" ON bundle_discount_tiers
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "bundle_discount_tiers_write" ON bundle_discount_tiers;
CREATE POLICY "bundle_discount_tiers_write" ON bundle_discount_tiers
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE bundle_presets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bundle_presets_read" ON bundle_presets;
CREATE POLICY "bundle_presets_read" ON bundle_presets
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "bundle_presets_write" ON bundle_presets;
CREATE POLICY "bundle_presets_write" ON bundle_presets
  FOR ALL USING (true) WITH CHECK (true);
