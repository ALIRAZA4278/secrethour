'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { supabase } from '../../lib/supabase';
import { getSale, fmtPKR, bundlePct, bundleUnitPrice } from '../../lib/pricing';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const MOODS = ['Romantic', 'Playful', 'Sensual', 'Wild'];

// Mirrors the tiers seeded by supabase-bundle-builder.sql; used only until
// that table exists, after which the admin-managed rows take over.
const DEFAULT_TIERS = [
  { min_items: 2, discount_pct: 5 },
  { min_items: 3, discount_pct: 10 },
  { min_items: 4, discount_pct: 15 },
];

function QtyStepper({ qty, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, qty - 1))} disabled={qty === 0}
        aria-label="Remove one"
        className="w-7 h-7 flex items-center justify-center border border-gold-border/50 text-cream/70 hover:border-gold hover:text-gold transition disabled:opacity-30 disabled:hover:border-gold-border/50 disabled:hover:text-cream/70">
        −
      </button>
      <span className="w-5 text-center text-sm text-cream">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)}
        aria-label="Add one"
        className="w-7 h-7 flex items-center justify-center border border-gold-border/50 text-cream/70 hover:border-gold hover:text-gold transition">
        +
      </button>
    </div>
  );
}

export default function BuildABundlePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [mood, setMood] = useState(null);

  useEffect(() => {
    const COLS = 'slug, title, subtitle, tagline, img, numeric_price, sale_price';
    async function load() {
      // `moods` and the bundle tables only exist once supabase-bundle-builder.sql
      // has been run. Until then, still show the products and fall back to the
      // tiers that migration seeds, so the page works either way.
      let { data: prods } = await supabase.from('products')
        .select(`${COLS}, moods`).neq('hidden', true).order('created_at');
      if (!prods) {
        ({ data: prods } = await supabase.from('products')
          .select(COLS).neq('hidden', true).order('created_at'));
      }
      const [{ data: t, error: tiersError }, { data: pr }] = await Promise.all([
        supabase.from('bundle_discount_tiers').select('*').order('min_items'),
        supabase.from('bundle_presets').select('*').order('sort_order'),
      ]);
      setProducts(prods || []);
      // Fall back only while the table doesn't exist; an empty table means the
      // admin removed every tier on purpose.
      setTiers(tiersError ? DEFAULT_TIERS : (t || []));
      setPresets(pr || []);
      setLoading(false);
    }
    load();
  }, []);

  function setQty(slug, qty) {
    setQuantities(prev => {
      const next = { ...prev };
      if (qty <= 0) delete next[slug];
      else next[slug] = qty;
      return next;
    });
  }

  function applyPreset(preset) {
    const next = {};
    (preset.product_slugs || []).forEach(slug => { next[slug] = 1; });
    setQuantities(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selected = useMemo(
    () => products
      .filter(p => (quantities[p.slug] || 0) > 0)
      .map(p => ({ ...p, qty: quantities[p.slug] })),
    [products, quantities]
  );

  const totalItems = selected.reduce((s, i) => s + i.qty, 0);
  const subtotal    = selected.reduce((s, i) => s + getSale(i).effective * i.qty, 0);

  const minItemsRequired = tiers[0]?.min_items ?? 2;
  const nextTier    = tiers.find(t => totalItems < t.min_items) || null;
  const discountPct = bundlePct(totalItems, tiers);
  // Same per-unit rounding as the cart, so the two totals always match.
  const total       = selected.reduce((s, i) => s + bundleUnitPrice(getSale(i).effective, discountPct) * i.qty, 0);
  const discountAmt = subtotal - total;

  function handleAddBundle() {
    if (totalItems < minItemsRequired) return;
    // Items carry the tier ladder instead of a baked-in discounted price, so the
    // cart re-derives the discount if bundle items are later removed.
    selected.forEach(item => {
      const s = getSale(item);
      addToCart({
        slug: item.slug,
        title: item.title,
        price: fmtPKR(s.effective),
        numericPrice: s.effective,
        listPrice: s.onSale ? s.original : null,
        img: item.img,
        bulkDiscountQty: null,
        bulkDiscountPct: null,
        bundleTiers: tiers,
      }, item.qty);
    });
    setQuantities({});
  }

  return (
    <div className="bg-sh-bg text-cream min-h-screen">
      <MetaPixel />
      <Navbar />

      <section className="relative py-14 md:py-20 px-4 md:px-6 text-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 8%) 0%, hsl(20 5% 3%) 60%)' }}>
        <p className="text-gold/70 text-[10px] uppercase tracking-[0.35em]">Create Your Own</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl italic mt-3 text-cream" style={serif}>
          Build your <span className="text-gold-light">Secret Hour</span>
        </h1>
        <p className="text-cream/55 italic text-sm md:text-base max-w-xl mx-auto mt-4" style={serif}>
          Choose the pieces that fit your night. The more you add, the more you save — and every bundle arrives in one discreet matte black box.
        </p>
      </section>

      <section className="px-4 md:px-6 pb-20 max-w-6xl mx-auto">
        {/* Mood filter */}
        <div className="border border-gold-border/40 p-5 md:p-6 mb-8">
          <p className="text-gold/70 text-[10px] uppercase tracking-[0.3em] mb-3">What kind of night are you planning?</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button key={m} type="button"
                onClick={() => setMood(cur => (cur === m ? null : m))}
                className={`text-xs uppercase tracking-[0.15em] font-medium px-4 py-2 border transition ${
                  mood === m ? 'border-gold text-gold bg-gold/10' : 'border-gold-border/50 text-cream/70 hover:border-gold-muted'
                }`}>
                {m}
              </button>
            ))}
          </div>
          {mood && (
            <p className="text-gold/60 text-xs mt-3">✧ Suggested for a {mood.toLowerCase()} night — highlighted below.</p>
          )}
        </div>

        {loading ? (
          <p className="text-cream/50 text-sm italic text-center py-16">Loading…</p>
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            {/* Product grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {products.map(p => {
                const s = getSale(p);
                const qty = quantities[p.slug] || 0;
                const recommended = mood && (p.moods || []).includes(mood);
                return (
                  <div key={p.slug}
                    className={`border bg-sh-card flex flex-col transition-colors ${recommended ? 'border-gold' : 'border-gold-border/30'}`}>
                    <div className="relative aspect-square">
                      <Image src={p.img} alt={p.title} fill sizes="(min-width: 640px) 45vw, 90vw" className="object-cover" />
                      {recommended && (
                        <span className="absolute top-2 left-2 bg-gold text-sh-bg text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <h3 className="text-sm md:text-base italic text-cream leading-snug" style={serif}>{p.title}</h3>
                      {(p.subtitle || p.tagline) && (
                        <p className="text-cream/55 text-xs leading-snug">{p.subtitle || p.tagline}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-gold text-sm md:text-base" style={serif}>{fmtPKR(s.effective)}</span>
                          {s.onSale && <span className="text-cream/40 text-xs line-through">{fmtPKR(s.original)}</span>}
                        </div>
                        <QtyStepper qty={qty} onChange={v => setQty(p.slug, v)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <p className="text-cream/50 text-sm italic col-span-2 text-center py-10">No products available yet.</p>
              )}
            </div>

            {/* Your Bundle sidebar */}
            <div className="border border-gold-border/40 bg-sh-card p-5 md:p-6 space-y-4 lg:sticky lg:top-6">
              <p className="text-gold/70 text-[10px] uppercase tracking-[0.3em]">Your Bundle</p>

              {selected.length === 0 ? (
                <p className="text-cream/50 text-sm">Add at least {minItemsRequired} items to build your box.</p>
              ) : (
                <div className="space-y-2">
                  {selected.map(item => (
                    <div key={item.slug} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-cream/80">{item.title} <span className="text-cream/40">× {item.qty}</span></span>
                      <span className="text-cream/70 shrink-0">{fmtPKR(getSale(item).effective * item.qty)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gold-border/30 pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream/60">Subtotal</span>
                  <span className="text-cream/80">{fmtPKR(subtotal)}</span>
                </div>
                {discountPct > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gold-light">Bundle discount ({discountPct}%)</span>
                    <span className="text-gold-light">−{fmtPKR(discountAmt)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-cream font-medium">Total</span>
                  <span className="text-gold text-lg" style={serif}>{fmtPKR(total)}</span>
                </div>
              </div>

              {nextTier ? (
                <p className="text-gold/60 text-xs">
                  Add {nextTier.min_items - totalItems} more to unlock {nextTier.discount_pct}% off.
                </p>
              ) : totalItems > 0 && discountPct > 0 ? (
                <p className="text-gold/60 text-xs">Maximum bundle discount unlocked!</p>
              ) : null}

              <button type="button" onClick={handleAddBundle} disabled={totalItems < minItemsRequired}
                className="w-full text-center bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-6 py-4 btn-glow transition-all duration-300 hover:bg-[#5a1a24] disabled:opacity-40 disabled:pointer-events-none">
                {totalItems < minItemsRequired ? `Select at least ${minItemsRequired} items` : 'Add Bundle to Cart'}
              </button>

              <ul className="space-y-1.5 pt-1">
                {['Discreet matte black packaging', 'Private billing — no product names', 'Cash on delivery available'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-cream/55 text-xs">
                    <span className="text-gold text-xs leading-none">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Need inspiration? */}
        {presets.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl italic text-gold-light mb-6" style={serif}>Need inspiration?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {presets.map(preset => (
                <div key={preset.id} className="border border-gold-border/40 p-5 flex flex-col gap-3">
                  <h3 className="text-cream text-sm font-medium">{preset.name}</h3>
                  {preset.blurb && <p className="text-cream/55 text-xs leading-relaxed">{preset.blurb}</p>}
                  <button type="button" onClick={() => applyPreset(preset)}
                    className="mt-auto text-left text-gold text-[11px] uppercase tracking-[0.2em] hover:text-gold-light transition">
                    Use This
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
