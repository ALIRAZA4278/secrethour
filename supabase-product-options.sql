-- Per-product option groups: a bundle like the Experience Box needs several
-- choices at once (bow colour, candle scent), which `variations` can't express
-- because that is a single pick that also sets the price.
--
-- Shape: [{"label": "Bow Colour", "choices": ["Black", "Red"]}, ...]
-- Managed from the admin Products tab. Safe to re-run.
ALTER TABLE products ADD COLUMN IF NOT EXISTS option_groups JSONB DEFAULT '[]';

-- Seed the Experience Box with the choices its components already offer, only
-- if nothing has been set yet, so later admin edits stick.
UPDATE products
SET option_groups = '[
  {"label": "Bow Colour",   "choices": ["Black", "Red"]},
  {"label": "Candle Scent", "choices": ["Midnight Oud", "Amber Rose", "Vanilla Ember"]}
]'::jsonb
WHERE slug = 'the-secret-hour-experience-box'
  AND (option_groups IS NULL OR option_groups = '[]'::jsonb);
