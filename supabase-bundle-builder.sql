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
