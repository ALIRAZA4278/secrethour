// Editable site content (admin → Site Content). These are the values the site shipped
// with, so nothing changes until an admin saves something. Pure data + validation, safe
// to import from both server and client code.

export const DEFAULT_ANNOUNCEMENT = {
  enabled: true,
  text: 'Get 10% Off on Online Payment — Pay via Bank Transfer   •   Free Delivery Across Pakistan',
};

export const DEFAULT_HERO = {
  headline: 'The hours that',
  highlight: 'belong to you',
  cta1_text: 'Explore the Experience',
  cta1_href: '/shop',
  cta2_text: 'Take the Quiz',
  cta2_href: '/quiz',
  badges: ['Discreet Packaging', 'Trusted by Couples', 'Designed for Comfort'],
  slides: [
    { desk: '/Banners/1.jpg.jpeg', mob: '/Banners/1 mob.jpg.jpeg', alt: 'Secret Hour couple gift boxes on dark silk' },
    { desk: '/Banners/2.jpg.jpeg', mob: '/Banners/2 mob.jpg.jpeg', alt: 'The Midnight Deck card game by Secret Hour' },
  ],
};

export const SITE_KEYS = ['announcement', 'hero'];

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
// Links and images may only be a site path or an https URL (never javascript: etc).
const safeUrl = (v) => {
  const s = str(v, 600);
  // "//host" and "/\host" are protocol-relative: they look like paths but leave the site.
  if (s.startsWith('//') || s.startsWith('/\\')) return '';
  return s.startsWith('/') || s.startsWith('https://') ? s : '';
};

// Coerces whatever is stored (or submitted) into a complete, safe value, falling back
// to the default for anything missing — so a half-filled row can never break the page.
export function normalizeSetting(key, raw) {
  const v = raw && typeof raw === 'object' ? raw : {};
  if (key === 'announcement') {
    return {
      enabled: v.enabled !== false,
      text: str(v.text, 300) || DEFAULT_ANNOUNCEMENT.text,
    };
  }
  if (key === 'hero') {
    const d = DEFAULT_HERO;
    const slides = (Array.isArray(v.slides) ? v.slides : [])
      .slice(0, 8)
      .map((s) => ({ desk: safeUrl(s?.desk), mob: safeUrl(s?.mob), alt: str(s?.alt, 200) }))
      // A slide needs at least one image; a missing one falls back to the other.
      .filter((s) => s.desk || s.mob)
      .map((s) => ({ desk: s.desk || s.mob, mob: s.mob || s.desk, alt: s.alt || 'Secret Hour' }));
    const badges = (Array.isArray(v.badges) ? v.badges : []).map((b) => str(b, 60)).filter(Boolean).slice(0, 5);
    return {
      headline: str(v.headline, 120) || d.headline,
      highlight: str(v.highlight, 80),
      cta1_text: str(v.cta1_text, 40) || d.cta1_text,
      cta1_href: safeUrl(v.cta1_href) || d.cta1_href,
      cta2_text: str(v.cta2_text, 40),
      cta2_href: safeUrl(v.cta2_href) || d.cta2_href,
      badges,
      slides: slides.length ? slides : d.slides,
    };
  }
  return null;
}
