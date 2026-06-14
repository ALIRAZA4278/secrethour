'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import MetaPixel from '../../components/MetaPixel';
import Footer from '../../components/Footer';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../context/CartContext';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = '/assets/bg-silk-B9_HjwKe.jpg';
const LOGO = '/assets/logo-secret-hour-DN-hyC6c.png';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold-border/25">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left text-cream/80 text-sm hover:text-cream transition-colors"
      >
        <span style={serif} className="italic">{q}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          className={`text-gold shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <p className="pb-4 text-cream/55 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const { addToCart, setOpen, updateQty } = useCart();

  function cartItem() {
    const varPrice = selectedVariation?.price;
    return {
      slug: product?.slug,
      title: product?.title,
      price: varPrice ? `Rs. ${varPrice.toLocaleString()}` : product?.price,
      numericPrice: varPrice ?? product?.numeric_price,
      img: images?.[0],
      variation: selectedVariation?.name || null,
      bulkDiscountQty: product?.bulk_discount_qty || null,
      bulkDiscountPct: product?.bulk_discount_pct || null,
    };
  }

  function handleAddToCart() {
    if (product?.variations?.length > 0 && !selectedVariation) {
      setVariationError(true);
      document.getElementById('variation-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setVariationError(false);
    const item = cartItem();
    addToCart(item);
    if (qty > 1) updateQty(item.slug, qty);
  }

  function buyNow() {
    if (product?.variations?.length > 0 && !selectedVariation) {
      setVariationError(true);
      document.getElementById('variation-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setVariationError(false);
    const item = cartItem();
    addToCart(item);
    if (qty > 1) updateQty(item.slug, qty);
    setOpen(false);
    router.push('/checkout');
  }

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [upsell, setUpsell] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [variationError, setVariationError] = useState(false);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState('loading'); // 'loading' | 'found' | 'notfound'
  const [reviews, setReviews] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        let pQuery = supabase.from('products').select('*').eq('slug', slug);
        if (!isPreview) pQuery = pQuery.neq('hidden', true);
        const allQuery = supabase.from('products').select('slug, title, price, numeric_price, img, category').neq('slug', slug).neq('hidden', true);
        const [{ data: p, error: pErr }, { data: all }] = await Promise.all([pQuery.single(), allQuery]);
        if (pErr || !p) { setStatus('notfound'); return; }
        setProduct(p);
        setRelated((all || []).slice(0, 3));
        if (p.upsell_slug) {
          const found = (all || []).find(x => x.slug === p.upsell_slug);
          setUpsell(found || null);
        }
        if (p.variations?.length > 0) {
          const vanillaOud = p.variations.find(v =>
            (typeof v === 'string' ? v : v?.name)?.toLowerCase().includes('vanilla oud')
          );
          if (vanillaOud) setSelectedVariation(typeof vanillaOud === 'string' ? { name: vanillaOud, price: null } : vanillaOud);
        }
        setStatus('found');
      } catch {
        setStatus('notfound');
      }
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('product_reviews')
      .select('id, reviewer_name, rating, body, created_at')
      .eq('product_slug', slug)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []));
  }, [slug]);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setReviewIdx(i => (i + 1) % reviews.length), 4000);
    return () => clearInterval(t);
  }, [reviews]);

  if (status === 'loading') {
    return (
      <div className="bg-sh-bg min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-cream/40 italic text-lg animate-pulse" style={serif}>Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (status === 'notfound') {
    if (!isPreview) router.replace('/shop');
    return <div className="min-h-screen flex items-center justify-center text-white text-sm opacity-50">Product not found.</div>;
  }

  const images = product.images?.length ? product.images : [product.img].filter(Boolean);

  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <MetaPixel />
      <Navbar />

      {/* ── Main product section ── */}
      <section className="relative py-8 md:py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SILK} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-14 items-start">

            {/* Left: image + thumbnails — sticky on desktop */}
            <div className="space-y-4 lg:sticky lg:top-20">
              <div className="relative aspect-square rounded overflow-hidden border border-gold-border/40">
                <Image src={images[activeImg]} alt={product.title} fill className="object-cover" priority unoptimized />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                        activeImg === i ? 'border-gold' : 'border-gold-border/40 hover:border-gold-muted'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: product details */}
            <div className="space-y-6">
              <div>
                <p className="text-gold/80 text-xs uppercase tracking-[0.3em] mb-1">{product.category}</p>
                {product.tag && (
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 mb-2 ${
                    product.tag === 'best-seller' ? 'bg-gold text-sh-bg' :
                    product.tag === 'new-arrival' ? 'bg-blue-600 text-white' :
                    'bg-burgundy text-gold border border-gold-muted'
                  }`}>
                    {product.tag === 'best-seller' ? 'Best Seller' : product.tag === 'new-arrival' ? 'New Arrival' : 'On Sale'}
                  </span>
                )}
                {product.tagline && (
                  <p className="text-cream/50 text-xs italic mb-3" style={serif}>{product.tagline}</p>
                )}
                <h1 className="text-3xl md:text-3xl italic text-gold leading-tight" style={serif}>{product.title}</h1>

                {/* Star rating below title */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-base text-gold">★</span>
                    ))}
                  </div>
                  <Link href="/testimonials" className="text-cream/70 text-xs uppercase tracking-[0.15em] hover:text-gold transition-colors">Verified Reviews</Link>
                </div>

                <p className="text-cream/60 italic mt-3 text-base md:text-lg" style={serif}>{product.subtitle}</p>
              </div>

              <div>
                <p className="text-3xl text-gold" style={serif}>
                  {selectedVariation?.price ? `Rs. ${selectedVariation.price.toLocaleString()}` : product.price}
                </p>
                {product.stock_note && (
                  <p className="text-cream/45 text-xs uppercase tracking-[0.18em] mt-1">{product.stock_note}</p>
                )}
                {product.bulk_discount_qty && product.bulk_discount_pct && (
                  <p className="text-green-400/90 text-xs uppercase tracking-[0.15em] mt-1.5 font-medium">
                    Buy {product.bulk_discount_qty} and save {product.bulk_discount_pct}%
                  </p>
                )}
              </div>

              {/* Variations */}
              {product.variations?.length > 0 && (
                <div id="variation-selector" className="space-y-3">
                  <p className={`text-[10px] uppercase tracking-[0.25em] ${variationError ? 'text-red-400' : 'text-cream/50'}`}>
                    {variationError ? 'Please select an option' : 'Select Option'}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${variationError ? 'ring-1 ring-red-400/50 p-2' : ''}`}>
                    {product.variations.map((v) => {
                      const label = v?.name ?? v;
                      const isSelected = selectedVariation?.name === label || selectedVariation === label;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => { setSelectedVariation(isSelected ? null : (v?.name ? v : { name: v, price: null })); setVariationError(false); }}
                          className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                            isSelected
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-gold-border/50 text-cream/65 hover:border-gold/60 hover:text-cream'
                          }`}
                        >
                          {/^\d+(\.\d+)?$/.test(label) ? `${label}ml` : label}
                        </button>
                      );
                    })}
                  </div>
                  {selectedVariation && (selectedVariation.description || selectedVariation.tagline) && (
                    <div className="border border-gold-border/30 p-3 space-y-1" style={{ background: 'rgba(11,10,9,0.5)' }}>
                      {selectedVariation.description && (
                        <p className="text-gold/70 text-[10px] uppercase tracking-[0.2em]">{selectedVariation.description}</p>
                      )}
                      {selectedVariation.tagline && (
                        <p className="text-cream/60 text-xs italic leading-relaxed">{selectedVariation.tagline}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Qty selector */}
              <div className="flex items-center gap-3">
                <p className="text-cream/50 text-[10px] uppercase tracking-[0.25em]">Qty</p>
                <div className="flex items-center border border-gold-border/50">
                  <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-cream/60 hover:text-cream transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="w-10 text-center text-cream text-sm">{qty}</span>
                  <button type="button" onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-cream/60 hover:text-cream transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
                {product.bulk_discount_qty && product.bulk_discount_pct && qty >= product.bulk_discount_qty && (
                  <span className="text-green-400 text-[10px] font-bold uppercase tracking-wide">{product.bulk_discount_pct}% off unlocked!</span>
                )}
              </div>

              {/* Buttons — directly below price */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 flex-1"
                >
                  Add to Cart
                </button>
                <button
                  onClick={buyNow}
                  className="border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 flex-1 text-center hover:bg-burgundy"
                >
                  Buy Now
                </button>
              </div>

              <p className="text-cream/65 leading-relaxed text-sm">{product.description}</p>

              {/* Features checklist */}
              {product.features?.length > 0 && (
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-cream/70 text-sm">
                      <span className="text-gold text-sm shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Inline trust badges */}
              <div className="flex flex-col sm:flex-row gap-3 text-cream/45 text-[10px] uppercase tracking-[0.15em]">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                  Discreet delivery · No labels · 100% private
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  </svg>
                  High demand — limited batches available
                </div>
              </div>

              {/* What's Included */}
              {product.included?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-cream italic text-xl" style={serif}>What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {product.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/65 text-sm">
                        <span className="text-gold mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How It Works */}
              {product.how_it_works?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-cream italic text-xl" style={serif}>How It Works</h3>
                  <ol className="space-y-3">
                    {product.how_it_works.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/65 text-sm">
                        <span className="text-gold shrink-0 text-[11px] font-medium tracking-[0.1em] mt-0.5">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Feature badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Discreet Packaging', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /> },
                  { label: 'Private Experience', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /> },
                  { label: 'Made for Couples', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /> },
                  { label: 'Free Delivery', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987-1.106v-.828" /> },
                ].map(({ icon, label }) => (
                  <div key={label} className="border border-gold-border p-3 md:p-4 flex flex-col items-center gap-2 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">{icon}</svg>
                    <span className="text-cream/65 text-[10px] uppercase tracking-[0.18em]">{label}</span>
                  </div>
                ))}
              </div>

              {/* Crafted by Secret Hour */}
              <div className="flex items-center gap-3 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="" className="w-6 h-6 object-contain opacity-80" />
                <span className="text-cream/45 text-[10px] uppercase tracking-[0.3em]">Crafted by Secret Hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Strip ── */}
      {product.quote && (
        <section className="py-14 px-6 border-t border-gold-border/20 text-center" style={{ background: 'radial-gradient(ellipse at center, hsl(350 40% 8%) 0%, hsl(20 5% 3%) 70%)' }}>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-cream/80 italic text-xl md:text-2xl leading-relaxed" style={serif}>{product.quote}</p>
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em]">{product.quote_label}</p>
          </div>
        </section>
      )}

      {/* ── Complete Your Experience ── */}
      {upsell && (
        <section className="py-14 px-4 md:px-6 border-t border-gold-border/20" style={{ background: 'radial-gradient(ellipse at bottom, hsl(350 45% 7%) 0%, hsl(20 5% 3%) 70%)' }}>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.35em] mb-2">Complete Your Experience</p>
              <h2 className="text-2xl md:text-3xl italic text-cream" style={serif}>A few more touches</h2>
            </div>
            <div className="border border-gold-border/40 flex items-center gap-4 p-4 hover:border-gold transition-colors duration-300" style={{ background: 'hsl(350 50% 8%)' }}>
              <Link href={`/product/${upsell.slug}`} className="relative w-20 h-20 shrink-0 bg-sh-card block">
                <Image src={upsell.img} alt={upsell.title} fill className="object-contain" unoptimized />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${upsell.slug}`} className="text-cream italic text-base hover:text-gold transition-colors block" style={serif}>{upsell.title}</Link>
                <p className="text-gold text-sm mt-0.5" style={serif}>{upsell.price}</p>
              </div>
              <button
                onClick={() => addToCart({ slug: upsell.slug, title: upsell.title, price: upsell.price, numericPrice: upsell.numeric_price, img: upsell.img })}
                className="shrink-0 bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 btn-glow transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {product.faq?.length > 0 && (
        <section className="py-16 px-4 md:px-6 border-t border-gold-border/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl italic text-center mb-8 text-cream" style={serif}>
              Quick <span className="text-gold-light">questions</span>
            </h2>
            <div className="border border-gold-border/40 divide-y divide-gold-border/20 px-5">
              {product.faq.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── You May Also Love ── */}
      {related.length > 0 && (
        <section className="py-20 border-t border-gold/10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 justify-center mb-12">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/30" />
              <h2 className="text-2xl italic text-cream" style={serif}>You May Also Love</h2>
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {related.map((p) => (
                <div key={p.slug} className="group flex flex-col border border-gold-border/40 hover:border-gold transition-colors duration-300">
                  <Link href={`/product/${p.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-sh-card">
                      <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" unoptimized />
                    </div>
                  </Link>
                  <div className="p-4 text-center space-y-2 flex-1 flex flex-col">
                    <Link href={`/product/${p.slug}`} className="text-sm italic text-cream leading-snug hover:text-gold transition-colors" style={serif}>{p.title}</Link>
                    <p className="text-gold text-base" style={serif}>{p.price}</p>
                    <button
                      onClick={() => addToCart({ slug: p.slug, title: p.title, price: p.price, numericPrice: p.numeric_price, img: p.img })}
                      className="mt-auto bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-4 py-2 btn-glow transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews Slider ── */}
      {reviews.length > 0 && (
        <section className="py-16 px-4 md:px-6 border-t border-gold-border/20">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.35em] mb-2">Customer Voices</p>
              <h2 className="text-2xl md:text-3xl italic text-cream" style={serif}>
                What they <span className="text-gold-light">say</span>
              </h2>
              {(() => {
                const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
                return (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-base ${i < Math.round(avg) ? 'text-gold' : 'text-cream/20'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-cream/50 text-sm">{avg.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                  </div>
                );
              })()}
            </div>

            {/* Slide */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${reviewIdx * 100}%)` }}
              >
                {reviews.map((r) => (
                  <div key={r.id} className="w-full shrink-0 border border-gold-border/40 p-7 md:p-10 text-center" style={{ background: 'rgba(11,10,9,0.5)' }}>
                    <p className="text-cream/75 text-base md:text-lg leading-relaxed italic mb-6" style={serif}>&ldquo;{r.body}&rdquo;</p>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < r.rating ? 'text-gold' : 'text-cream/20'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-cream/50 text-xs uppercase tracking-[0.2em]">{r.reviewer_name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setReviewIdx(i => (i - 1 + reviews.length) % reviews.length)}
                  className="text-cream/40 hover:text-gold transition-colors"
                  aria-label="Previous review"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewIdx(i)}
                      className={`transition-all duration-300 rounded-full ${i === reviewIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/20 hover:bg-cream/40'}`}
                      aria-label={`Review ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setReviewIdx(i => (i + 1) % reviews.length)}
                  className="text-cream/40 hover:text-gold transition-colors"
                  aria-label="Next review"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:h-0" />

      {/* Mobile sticky Add to Cart + Buy Now */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-sh-bg/95 backdrop-blur-sm border-t border-gold-border/40 p-3 flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.18em] py-3.5 btn-glow transition-all"
        >
          Add to Cart
        </button>
        <button
          onClick={buyNow}
          className="flex-1 border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.18em] py-3.5 transition-all text-center hover:bg-burgundy flex items-center justify-center"
        >
          Buy Now
        </button>
      </div>

      <Footer />
    </div>
  );
}
