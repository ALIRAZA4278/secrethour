import { getServerSupabase } from './supabase-server';
import { DEFAULT_HERO, normalizeSetting } from './site-defaults';

// Home page hero content for server rendering. Any failure (table not created yet,
// network) quietly falls back to the built-in defaults, so the page always renders.
export async function getHeroSettings() {
  try {
    const { data, error } = await getServerSupabase()
      .from('site_settings')
      .select('value')
      .eq('key', 'hero')
      .maybeSingle();
    if (error || !data) return DEFAULT_HERO;
    return normalizeSetting('hero', data.value);
  } catch {
    return DEFAULT_HERO;
  }
}
