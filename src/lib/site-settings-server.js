import { getServerSupabase } from './supabase-server';
import { DEFAULT_HERO, DEFAULT_FEATURED, normalizeSetting } from './site-defaults';

// { cod, online } percentages for one product, or null when it has no payment-based pricing.
export async function getPaymentPricing(slug) {
  try {
    const { data } = await getServerSupabase()
      .from('site_settings')
      .select('value')
      .eq('key', 'payment_pricing')
      .maybeSingle();
    return data ? normalizeSetting('payment_pricing', data.value)[slug] || null : null;
  } catch {
    return null;
  }
}

// Home page content for server rendering. Any failure (table not created yet,
// network) quietly falls back to the built-in defaults, so the page always renders.
export async function getHomeSettings() {
  const fallback = { hero: DEFAULT_HERO, featured: DEFAULT_FEATURED };
  try {
    const { data, error } = await getServerSupabase()
      .from('site_settings')
      .select('key, value')
      .in('key', ['hero', 'featured']);
    if (error || !data) return fallback;
    const row = (k) => data.find((r) => r.key === k)?.value;
    return {
      hero: row('hero') ? normalizeSetting('hero', row('hero')) : DEFAULT_HERO,
      featured: row('featured') ? normalizeSetting('featured', row('featured')) : DEFAULT_FEATURED,
    };
  } catch {
    return fallback;
  }
}
