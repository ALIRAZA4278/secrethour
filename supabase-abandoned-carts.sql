-- Run this once in your Supabase SQL editor to enable Abandoned Cart tracking

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT        UNIQUE NOT NULL,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  city        TEXT,
  items       JSONB       DEFAULT '[]',
  total       INTEGER     DEFAULT 0,
  status      TEXT        DEFAULT 'abandoned',  -- 'abandoned' | 'converted'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: auto-clean records older than 30 days (run manually or as a cron job)
-- DELETE FROM abandoned_carts WHERE updated_at < NOW() - INTERVAL '30 days';
