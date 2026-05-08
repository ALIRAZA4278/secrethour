-- Add tag column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS tag TEXT;

-- Product visibility & stock
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden   BOOLEAN DEFAULT FALSE;

-- Order admin notes
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_pct INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default promo code
INSERT INTO promo_codes (code, discount_pct, active)
VALUES ('MIDNIGHTHOUR', 10, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Create testimonials table (for testimonials page review form)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  location TEXT,
  body TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  body TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
