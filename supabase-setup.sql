-- ─────────────────────────────────────────
-- Products table additions
-- ─────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag      TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden   BOOLEAN DEFAULT FALSE;

-- ─────────────────────────────────────────
-- Orders table additions
-- ─────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─────────────────────────────────────────
-- Promo codes
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  code         TEXT    NOT NULL UNIQUE,
  discount_pct INTEGER NOT NULL DEFAULT 10,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO promo_codes (code, discount_pct, active)
VALUES ('MIDNIGHTHOUR', 10, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Allow anyone to read active promo codes (needed for checkout validation)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "promo_codes_read" ON promo_codes;
CREATE POLICY "promo_codes_read" ON promo_codes
  FOR SELECT USING (active = TRUE);

-- ─────────────────────────────────────────
-- Testimonials
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT,
  email      TEXT    NOT NULL,
  location   TEXT,
  body       TEXT    NOT NULL,
  approved   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to submit a testimonial
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_insert" ON testimonials;
CREATE POLICY "testimonials_insert" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Anyone can read (frontend filters approved=true in queries)
DROP POLICY IF EXISTS "testimonials_read" ON testimonials;
CREATE POLICY "testimonials_read" ON testimonials
  FOR SELECT USING (true);

-- ─────────────────────────────────────────
-- Product reviews
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_reviews (
  id            UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug  TEXT    NOT NULL,
  reviewer_name TEXT    NOT NULL,
  rating        INTEGER DEFAULT 5,
  body          TEXT    NOT NULL,
  approved      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anyone to submit a review
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_insert" ON product_reviews;
CREATE POLICY "reviews_insert" ON product_reviews
  FOR INSERT WITH CHECK (true);

-- Anyone can read (frontend filters approved=true in queries)
DROP POLICY IF EXISTS "reviews_read" ON product_reviews;
CREATE POLICY "reviews_read" ON product_reviews
  FOR SELECT USING (true);
