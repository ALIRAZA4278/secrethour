-- Editable site content: the announcement bar above the header and the home page hero
-- (banner images + the text on top). Managed from admin → Site Content. Safe to re-run.
--
-- One row per setting: key = 'announcement' | 'hero', value = JSON. Until a row exists the
-- site uses its built-in defaults, so running this changes nothing on its own.
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Anyone can READ (the public site needs it). There is deliberately NO insert/update
-- policy: writes go through /api/site-settings, which checks the admin login and uses
-- the service-role key, so the public anon key cannot rewrite the homepage.
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_settings_read" ON site_settings;
CREATE POLICY "site_settings_read" ON site_settings
  FOR SELECT USING (true);
