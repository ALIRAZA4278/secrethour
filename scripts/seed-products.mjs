import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually (no dotenv dependency)
const envText = readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envText.split('\n')
    .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const PRODUCTS = [
  {
    slug: 'secret-hour-card-experience',
    category: 'Card Game',
    tagline: 'Designed for meaningful connection',
    title: "Secret Hour – The Couple's Card Experience",
    subtitle: 'A private invitation to rediscover each other.',
    price: 'Rs. 3,499',
    numeric_price: 3499,
    stock_note: 'Limited stock available',
    img: '/assets/sh-card-game-Cw972EQC.png',
    images: ['/assets/sh-card-game-Cw972EQC.png', '/assets/sh-cards-prompts-BszawJq3.png', '/assets/sh-card-back-BT2gsHSE.png'],
    description: 'Crafted for married couples, The Midnight Deck turns ordinary nights into unforgettable rituals. Quiet questions, playful dares and tender prompts across four intimate categories — all wrapped in a matte black box with soft gold detailing.',
    features: ['Easy to use', 'No awkwardness', 'Perfect for couples at any stage', 'Designed for a private, comfortable experience'],
    included: ['48 prompt cards', 'Wild cards across four intimate categories', 'How to Play guide', 'Discreet matte black gift box'],
    how_it_works: ['Light a candle and pour two glasses of your favourite drink.', 'Take turns drawing a card — Wild, Sensual, Playful or Romantic.', 'Move from soft prompts to deeper, more intimate ones at your own pace.'],
    quote: '"This isn\'t just a product — it\'s a moment you create together."',
    quote_label: 'Loved by couples across Pakistan',
    upsell_slug: 'velvet-bond',
    faq: [
      { q: 'Is it discreet?', a: 'Yes — every order ships in plain packaging with no product details visible from the outside.' },
      { q: 'Is it easy to use?', a: 'Absolutely. Everything is designed to feel natural and intuitive — no instructions needed, no awkwardness.' },
      { q: 'Is it suitable for newly married couples?', a: 'Yes. Secret Hour is crafted especially to help couples ease in, build comfort, and connect at their own pace.' },
    ],
  },
  {
    slug: 'bridal-box',
    category: 'Bundle',
    title: 'The Secret Hour Bridal Box',
    subtitle: 'The wedding-night gift she will never forget.',
    price: 'Rs. 8,999',
    numeric_price: 8999,
    img: '/assets/sh-bridal-box-Bmv6nl8o.jpg',
    images: ['/assets/sh-bridal-box-Bmv6nl8o.jpg', '/assets/sh-card-game-Cw972EQC.png', '/assets/sh-candle-B33huzfN.jpg'],
    description: 'A complete wedding-night experience, thoughtfully assembled. The Bridal Box brings together our most intimate pieces — wrapped in layers of silk tissue, sealed with a wax stamp, and delivered in a keepsake outer box.',
    features: [],
    included: ['Secret Hour Card Game', 'Midnight Glow Candle', 'Velvet Bond satin tie', 'Your Secret Note message card', 'Luxury keepsake gift box'],
    how_it_works: ['Gift before or on the wedding night.', 'Unbox together — slowly.', 'Let the evening unfold at your own pace.'],
    faq: [],
  },
  {
    slug: 'intimate-night-set',
    category: 'Bundle',
    title: 'The Intimate Night Set',
    subtitle: 'Three small luxuries. One unforgettable evening.',
    price: 'Rs. 5,499',
    numeric_price: 5499,
    img: '/assets/sh-night-set-DlV1-dhc.jpg',
    images: ['/assets/sh-night-set-DlV1-dhc.jpg', '/assets/sh-candle-B33huzfN.jpg', '/assets/sh-card-game-Cw972EQC.png'],
    description: 'For the couple that wants to reconnect without an occasion. The Intimate Night Set is designed for any evening you want to make feel different — quieter, warmer, closer.',
    features: [],
    included: ['Secret Hour Card Game', 'Midnight Glow Candle', 'Sweet Moments chocolate collection'],
    how_it_works: ['Choose a quiet evening, no plans, no phones.', 'Light the candle and open the chocolates.', 'Draw your first card and let the night find its own rhythm.'],
    faq: [],
  },
  {
    slug: 'midnight-glow-candle',
    category: 'Candle',
    title: 'Midnight Glow Candle',
    subtitle: 'A scent that sets the mood before a word is spoken.',
    price: 'Rs. 1,499',
    numeric_price: 1499,
    img: '/assets/sh-candle-B33huzfN.jpg',
    images: ['/assets/sh-candle-B33huzfN.jpg', '/assets/sh-night-set-DlV1-dhc.jpg'],
    description: 'Hand-poured in small batches, the Midnight Glow burns for up to 40 hours. Its warm, woody fragrance — sandalwood and oud — is designed to slow the room down and invite presence.',
    features: [],
    included: ['200g hand-poured soy wax candle', 'Sandalwood & oud fragrance', 'Up to 40-hour burn time', 'Matte black glass vessel'],
    how_it_works: ['Trim the wick to 5mm before each use.', 'Allow the wax to melt fully to the edges on the first burn.', 'Extinguish after 4 hours. Re-light when ready.'],
    faq: [],
  },
  {
    slug: 'sweet-moments-chocolates',
    category: 'Chocolates',
    title: 'Sweet Moments Collection',
    subtitle: 'Eight handcrafted chocolates for two.',
    price: 'Rs. 1,200',
    numeric_price: 1200,
    img: '/assets/sh-chocolates-BzBJo79h.jpg',
    images: ['/assets/sh-chocolates-BzBJo79h.jpg'],
    description: 'Eight artisan chocolates, each one a small pause. The Sweet Moments Collection is made to be shared slowly — one at a time, between conversations, in the hours that belong only to you.',
    features: [],
    included: ['8 handcrafted artisan chocolates', 'Assorted flavours: dark, milk & white', 'Gift-boxed with the Secret Hour seal'],
    how_it_works: ['Open together.', 'Share one at a time.', 'No rushing.'],
    faq: [],
  },
  {
    slug: 'velvet-bond',
    category: 'Intimate',
    title: 'Velvet Bond',
    subtitle: 'A soft, intentional ritual for two.',
    price: 'Rs. 999',
    numeric_price: 999,
    img: '/assets/sh-velvet-bond-CTb2fah6.jpg',
    images: ['/assets/sh-velvet-bond-CTb2fah6.jpg'],
    description: 'Made from pure satin, the Velvet Bond is a soft tie designed for couples who want to add a layer of trust and intention to their evenings. Comes with a small gold Secret Hour charm.',
    features: [],
    included: ['Pure satin tie in deep crimson', 'Gold Secret Hour charm', 'Discreet branded envelope'],
    how_it_works: ['Use as part of a Secret Hour evening.', 'Let trust lead the way.'],
    faq: [],
  },
  {
    slug: 'your-secret-note',
    category: 'Card',
    title: 'Your Secret Note',
    subtitle: 'Say the things you save for the dark.',
    price: 'Rs. 300',
    numeric_price: 300,
    img: '/assets/sh-message-card-BQ1uKHY7.jpg',
    images: ['/assets/sh-message-card-BQ1uKHY7.jpg'],
    description: 'A thick matte black card with minimal gold typography — a small, personal way to leave a message that lingers.',
    features: [],
    included: ['1 luxury matte card', 'Black ribbon & envelope'],
    how_it_works: [],
    faq: [],
  },
];

async function seed() {
  console.log('Seeding products to Supabase...\n');
  for (const p of PRODUCTS) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'slug' });
    if (error) {
      console.error(`✗ ${p.slug}: ${error.message}`);
    } else {
      console.log(`✓ ${p.title}`);
    }
  }
  console.log('\nDone! Check your Supabase products table.');
}

seed();
