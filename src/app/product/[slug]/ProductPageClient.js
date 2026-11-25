'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import MetaPixel from '../../components/MetaPixel';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { getSale, fmtPKR, payUnitPrice } from '../../../lib/pricing';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
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

// Heroicons-outline path data, kept in one place so the page reads cleanly.
const ICONS = {
  left: 'M15.75 19.5 8.25 12l7.5-7.5',
  right: 'm8.25 4.5 7.5 7.5-7.5 7.5',
  cart: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z',
  truck: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987 1.106',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z',
  cube: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  tag: 'M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  play: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z',
  gift: 'M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
  box: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
};

function Icon({ name, size = 18, className = '', strokeWidth = 1.5 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Stars({ value = 5, className = 'text-sm' }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`${className} ${i <= Math.round(value) ? 'text-gold' : 'text-cream/20'}`}>★</span>
      ))}
    </span>
  );
}

// Delivery estimate: ordered today, then the delivery window by city. The date is
// worked out after mount only, so the server HTML and first client render match.
function DeliveryEstimate() {
  const [today, setToday] = useState(null);
  useEffect(() => {
    // Pakistan has no DST (UTC+5), so Pakistan time is just UTC shifted.
    const t = setTimeout(() => {
      const pkt = new Date(Date.now() + 5 * 3600 * 1000);
      setToday(pkt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    { icon: 'box', label: 'Ordered', sub: 'Today', sub2: today ? `(${today})` : null },
    { icon: 'truck', label: 'Karachi', sub: '24–48 hrs' },
    { icon: 'cube', label: 'Other cities', sub: '4–6 business days' },
  ];

  return (
    <div className="border border-gold-border/40 rounded-lg p-4" style={{ background: 'rgb(40 3 10 / 0.45)' }}>
      <p className="flex items-center gap-2.5 text-cream/75 text-sm">
        <Icon name="clock" size={22} className="text-gold shrink-0" />
        <span>Estimated delivery</span>
      </p>
      <div className="relative mt-5 grid grid-cols-3 text-center">
        <div className="absolute left-[16%] right-[16%] top-5 border-t border-dashed border-gold-border/60" aria-hidden="true" />
        {steps.map((s) => (
          <div key={s.label} className="relative flex flex-col items-center gap-1.5">
            <span className="w-10 h-10 rounded-full border border-gold-muted bg-sh-bg flex items-center justify-center text-gold">
              <Icon name={s.icon} size={18} />
            </span>
            <span className="text-cream/85 text-xs font-medium">{s.label}</span>
            <span className="text-cream/50 text-[11px] leading-tight">{s.sub}{s.sub2 && <><br />{s.sub2}</>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TRUST = [
  { icon: 'truck', title: 'Free Delivery', sub: 'Across Pakistan' },
  { icon: 'lock', title: '100% Private', sub: 'Discreet Packaging' },
  { icon: 'cube', title: 'Easy Returns', sub: '7-Day Hassle Free' },
  { icon: 'shield', title: 'Secure Payments', sub: 'Your data is safe' },
];

export default function ProductPageClient({ product, images, related, upsell, reviews, sets = [], testimonials = [], payPct = null }) {
  const router = useRouter();
  const { items: cartItems, addToCart, setOpen, promo, setPromo } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  // When a bundle option choice with its own picture is selected, it takes
  // over the main image; picking a normal thumbnail clears it.
  const [overrideImage, setOverrideImage] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [variationError, setVariationError] = useState(false);
  const [qty, setQty] = useState(1);
  const [customNote, setCustomNote] = useState('');
  // Per-component choices for bundles (bow colour, candle scent, …).
  const [options, setOptions] = useState({});
  const [missingOptions, setMissingOptions] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [promoInput, setPromoInput] = useState(promo?.code || '');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  // Mobile sticky buy bar: hidden until the shopper scrolls down to "Choose Your Set"
  // (or, on products without sets, past the main Buy Now button).
  const stickyTriggerRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // "Choose Your Set": the admin-picked products, other than this one. Each is its
  // own product, so choosing one opens its page.
  const setChoices = sets;
  // Don't show a product again below once it is already offered as a set.
  const shownSlugs = new Set(sets.map((x) => x.slug));
  const showUpsell = upsell && !shownSlugs.has(upsell.slug);
  if (showUpsell) shownSlugs.add(upsell.slug);
  // Products the admin hand-picked under "You May Also Love" always show, even if they
  // also appear above. Only the auto-filled fallback skips products already shown.
  const relatedPicked = Array.isArray(product.related_slugs) && product.related_slugs.length > 0;
  const relatedList = relatedPicked ? related : related.filter((x) => !shownSlugs.has(x.slug));

  useEffect(() => {
    const el = stickyTriggerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    // Show once the trigger has entered the viewport or been scrolled past (above it).
    const io = new IntersectionObserver(([e]) => {
      setShowStickyBar(e.isIntersecting || e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [sets.length]);

  // Snippet pool: this product's own reviews, else the site's customer stories.
  const snippets = reviews.length
    ? reviews
    : testimonials.map((t) => ({
        id: t.id,
        reviewer_name: [t.name, t.location].filter(Boolean).join(', ') || 'Customer',
        rating: null,
        body: t.body,
      }));
  const ownReviews = reviews.length > 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (snippets.length > 1) {
        setReviewIdx(i => (i + 1) % snippets.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [snippets.length]);

  // A sale on the product applies to whichever variation is chosen, at the same
  // percentage. Without this the sale vanished the moment a variation was selected.
  const variationPrice = (v) => {
    const sale = getSale(product);
    const base = v?.price;
    // No price (or 0) on a variation means "same as the product", not "free".
    if (!base) return sale.effective;
    if (!sale.onSale) return base;
    return Math.round(base * (1 - sale.pct / 100));
  };

  const optionGroups = product.option_groups?.length ? product.option_groups : [];

  // A variation can bring its own pictures (e.g. Black vs Red); while one is chosen the
  // gallery shows only those, otherwise the product's own pictures.
  const gallery = selectedVariation?.images?.length ? selectedVariation.images : images;

  const cartItem = () => {
    const effNumeric = variationPrice(selectedVariation);
    return {
      slug: product.slug,
      title: product.title,
      price: fmtPKR(effNumeric),
      numericPrice: effNumeric,
      listPrice: getSale(product).onSale ? (selectedVariation?.price || getSale(product).original) : null,
      img: gallery[0],
      variation: selectedVariation?.name || null,
      options: Object.keys(options).length ? options : null,
      bulkDiscountQty: product.bulk_discount_qty || null,
      bulkDiscountPct: product.bulk_discount_pct || null,
      customNote: customNote.trim() || null,
    };
  };

  // Every choice the product offers has to be made before it can be added.
  const blockedByChoices = () => {
    const missing = optionGroups.filter(g => !options[g.label]).map(g => g.label);
    const needsVariation = product.variations?.length > 0 && !selectedVariation;
    setMissingOptions(missing);
    setVariationError(needsVariation);
    if (!needsVariation && !missing.length) return false;
    document.getElementById(needsVariation ? 'variation-selector' : 'option-groups')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  };

  const handleAddToCart = () => {
    if (blockedByChoices()) return;
    addToCart(cartItem(), qty);
  };

  const buyNow = () => {
    if (blockedByChoices()) return;
    addToCart(cartItem(), qty);
    setOpen(false);
    router.push('/checkout');
  };

  // "+" on a set card adds that product to the cart as an add-on. Products that need
  // a choice first (variation / option groups) open their page to make it instead.
  const addSetToCart = (p) => {
    if (p.variations?.length || p.option_groups?.length) {
      router.push(`/product/${p.slug}`);
      return;
    }
    const sl = getSale(p);
    addToCart({
      slug: p.slug,
      title: p.title,
      price: fmtPKR(sl.effective),
      numericPrice: sl.effective,
      listPrice: sl.onSale ? sl.original : null,
      img: p.img,
      variation: null,
      options: null,
      bulkDiscountQty: p.bulk_discount_qty || null,
      bulkDiscountPct: p.bulk_discount_pct || null,
      customNote: null,
    }, 1);
  };

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch(`/api/promo?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) { setPromo(null); setPromoError(data.error || 'Invalid code'); }
      else setPromo({ code, pct: data.discount });
    } catch {
      setPromoError('Could not verify code');
    }
    setPromoLoading(false);
  };

  // Gallery: product images, plus the video as a final slide when there is one.
  const hasVideo = !!product.video_url;
  const stepImage = (dir) => {
    setShowVideo(false);
    setOverrideImage(null);
    setActiveImg((i) => (i + dir + gallery.length) % gallery.length);
  };

  const sale = getSale(product);
  const original = selectedVariation?.price || sale.original;
  // Payment-based pricing (admin -> Site Content): a % off the original price for Cash on
  // Delivery and a bigger one for Bank Transfer / online. The cart holds the COD price.
  const payCod = payPct ? payUnitPrice(original, payPct.cod) : null;
  const payOnline = payPct ? payUnitPrice(original, payPct.online) : null;
  const shown = payPct ? payCod : variationPrice(selectedVariation);
  const ratingAvg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const inStock = product.in_stock !== false;
  const review = snippets.length ? snippets[reviewIdx % snippets.length] : null;

  // Variation + option-group pickers for this product, shown above the quantity row.
  const renderChoices = () => (
    <>
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
                  onClick={() => {
                    setSelectedVariation(isSelected ? null : (v?.name ? v : { name: v, price: null }));
                    setVariationError(false);
                    // Each variation has its own gallery, so start it from the first picture.
                    setActiveImg(0); setOverrideImage(null); setShowVideo(false);
                  }}
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
            <div className="border border-gold-border/30 p-3 space-y-1" style={{ background: 'rgb(40 3 10 / 0.55)' }}>
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

      {/* Per-component choices (bundles like the Experience Box). A choice is
          either a plain string (legacy data) or { value, image, description,
          tagline }. `image` swaps the main product photo; the detail panel only
          renders when a `tagline` is set. */}
      {optionGroups.length > 0 && (
        <div id="option-groups" className="space-y-5">
          {optionGroups.map((group) => {
            const isMissing = missingOptions.includes(group.label);
            const choices = (group.choices || []).map(c => (typeof c === 'string' ? { value: c } : c));
            const selectedChoice = choices.find(c => c.value === options[group.label]);
            const pick = (choice, selected) => {
              setOptions(prev => {
                const next = { ...prev };
                if (selected) delete next[group.label];
                else next[group.label] = choice.value;
                return next;
              });
              setMissingOptions(prev => prev.filter(l => l !== group.label));
              setShowVideo(false);
              setOverrideImage(selected ? null : (choice.image || null));
            };
            // "Free gift" card (a group with a gift_title): picture tiles in a highlighted panel.
            if (group.gift_title) {
              return (
                <div key={group.label} className={`rounded-xl border p-4 md:p-5 space-y-3 ${isMissing ? 'border-red-400/60' : 'border-gold/50'}`} style={{ background: 'rgb(40 3 10 / 0.45)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-9 h-9 shrink-0 rounded-lg border border-gold-muted flex items-center justify-center text-gold"><Icon name="gift" size={18} /></span>
                      <div className="min-w-0">
                        <p className="text-cream font-semibold text-lg leading-tight" style={serif}>{group.gift_title}</p>
                        {group.gift_note && <p className="text-cream/65 text-sm mt-0.5">{group.gift_note}</p>}
                      </div>
                    </div>
                    {group.gift_badge && (
                      <span className="shrink-0 bg-gold text-sh-bg text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm">{group.gift_badge}</span>
                    )}
                  </div>
                  <p className={`text-sm ${isMissing ? 'text-red-400' : 'text-cream/80'}`}>
                    {isMissing ? 'Please choose your preferred color to continue:' : 'Choose your preferred color:'}
                  </p>
                  <div role="radiogroup" aria-label={group.label} className="grid grid-cols-2 gap-3">
                    {choices.map((choice) => {
                      const selected = options[group.label] === choice.value;
                      return (
                        <button
                          key={choice.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => pick(choice, selected)}
                          className={`text-left rounded-lg overflow-hidden border-2 transition-colors ${selected ? 'border-gold bg-gold/5' : 'border-gold-border/50 hover:border-gold-muted'}`}
                        >
                          <span className="relative block aspect-[2/1] bg-sh-card">
                            {choice.image && <Image src={choice.image} alt="" fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />}
                          </span>
                          <span className="flex items-center gap-2 px-3 py-2.5">
                            <span className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${selected ? 'border-gold' : 'border-cream/40'}`}>
                              {selected && <span className="w-2 h-2 rounded-full bg-gold" />}
                            </span>
                            <span className="text-sm text-cream">{choice.value}{group.gift_item ? ` ${group.gift_item}` : ''}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <div key={group.label} className="space-y-2">
                <p className={`text-[10px] uppercase tracking-[0.25em] ${isMissing ? 'text-red-400' : 'text-cream/50'}`}>
                  {isMissing ? `Please choose ${group.label}` : group.label}
                </p>
                <div className={`flex flex-wrap gap-2 ${isMissing ? 'ring-1 ring-red-400/50 p-2' : ''}`}>
                  {choices.map((choice) => {
                    const selected = options[group.label] === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => {
                          setOptions(prev => {
                            const next = { ...prev };
                            if (selected) delete next[group.label];
                            else next[group.label] = choice.value;
                            return next;
                          });
                          setMissingOptions(prev => prev.filter(l => l !== group.label));
                          setShowVideo(false);
                          setOverrideImage(selected ? null : (choice.image || null));
                        }}
                        className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                          selected
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-gold-border/50 text-cream/65 hover:border-gold/60 hover:text-cream'
                        }`}
                      >
                        {choice.value}
                      </button>
                    );
                  })}
                </div>
                {selectedChoice?.tagline && (
                  <div className="border border-gold-border/30 p-3 space-y-1" style={{ background: 'rgb(40 3 10 / 0.55)' }}>
                    {selectedChoice.description && (
                      <p className="text-gold/70 text-[10px] uppercase tracking-[0.2em]">{selectedChoice.description}</p>
                    )}
                    <p className="text-cream/60 text-xs italic leading-relaxed">{selectedChoice.tagline}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div className="theme-wine bg-sh-bg text-cream min-h-screen flex flex-col">
      <MetaPixel />
      <Navbar />

      {/* ── Main product section ── */}
      <section className="relative py-8 md:py-12">
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
          {/* Breadcrumb — above the gallery on mobile, inside the details column on desktop */}
          <nav aria-label="Breadcrumb" className="lg:hidden flex items-center gap-2 text-cream/55 text-[11px] mb-3">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/shop" className="hover:text-gold transition-colors">Products</Link>
            <span aria-hidden="true">›</span>
            <span className="text-cream/75 truncate">{product.title}</span>
          </nav>
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-5 md:gap-12 items-start">

            {/* Left: gallery — sticky on desktop */}
            <div className="space-y-3 lg:sticky lg:top-20">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gold-border/40 bg-sh-card">
                {showVideo && hasVideo ? (
                  <video src={product.video_url} controls autoPlay playsInline className="absolute inset-0 w-full h-full object-cover bg-black" />
                ) : (
                  <Image src={overrideImage || gallery[activeImg] || gallery[0]} alt={`${product.title} Secret Hour`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-contain" priority />
                )}
                {gallery.length > 1 && !showVideo && (
                  <>
                    <button type="button" onClick={() => stepImage(-1)} aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 border border-gold-border/60 text-cream hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                      <Icon name="left" size={18} strokeWidth={2} />
                    </button>
                    <button type="button" onClick={() => stepImage(1)} aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 border border-gold-border/60 text-cream hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                      <Icon name="right" size={18} strokeWidth={2} />
                    </button>
                  </>
                )}
              </div>
              {(gallery.length > 1 || hasVideo) && (
                <div className="grid grid-cols-5 gap-2.5">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show image ${i + 1}`}
                      onClick={() => { setActiveImg(i); setOverrideImage(null); setShowVideo(false); }}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                        activeImg === i && !showVideo ? 'border-gold' : 'border-gold-border/40 hover:border-gold-muted'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} Secret Hour`} fill sizes="110px" className="object-cover" />
                    </button>
                  ))}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className={`aspect-square rounded border-2 flex flex-col items-center justify-center gap-1.5 text-cream/80 transition-colors bg-sh-card ${
                        showVideo ? 'border-gold' : 'border-gold-border/40 hover:border-gold-muted'
                      }`}
                    >
                      <span className="w-9 h-9 rounded-full border border-cream/70 flex items-center justify-center">
                        <Icon name="play" size={16} strokeWidth={2} />
                      </span>
                      <span className="text-[11px]">Watch Video</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right: product details */}
            <div className="space-y-5">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 text-cream/55 text-[11px]">
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                <span aria-hidden="true">›</span>
                <Link href="/shop" className="hover:text-gold transition-colors">Products</Link>
                <span aria-hidden="true">›</span>
                <span className="text-cream/75">{product.title}</span>
              </nav>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Avatar stack from real testimonial names (initials, no stock faces). */}
                  {testimonials.some((t) => t.name?.trim()) && (
                    <div className="flex shrink-0" aria-hidden="true">
                      {testimonials.filter((t) => t.name?.trim()).slice(0, 4).map((t, i) => (
                        <span
                          key={t.id}
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold text-gold-light -ml-3 first:ml-0"
                          style={{
                            background: ['#7a1a2b', '#8f2a38', '#5c1220', '#6e3a1e'][i % 4],
                            borderColor: '#2a050c',
                            fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                          }}
                        >
                          {t.name.trim().charAt(0).toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="text-cream/90 text-sm font-medium">Loved by 200+ couples</p>
                    <p className="text-cream/50 text-xs">Real stories. Stronger connections.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {product.category && (
                    <span className="inline-block text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 py-1 border border-gold-border/70 text-cream/80 rounded-sm">{product.category}</span>
                  )}
                  {product.tag && (
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm ${
                      product.tag === 'best-seller' ? 'bg-gold text-sh-bg' :
                      product.tag === 'new-arrival' ? 'bg-blue-600 text-white' :
                      'bg-burgundy text-gold border border-gold-muted'
                    }`}>
                      {product.tag === 'best-seller' ? 'Best Seller' : product.tag === 'new-arrival' ? 'New Arrival' : 'On Sale'}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl text-gold-light leading-[1.1]" style={serif}>{product.title}</h1>

                {/* Stars only when real ratings exist — never an invented 5.0 */}
                {ratingAvg != null && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Stars value={ratingAvg} className="text-lg" />
                    <Link href="/testimonials" className="text-cream/70 text-sm hover:text-gold transition-colors">
                      {ratingAvg.toFixed(1)} ({reviews.length} Verified {reviews.length === 1 ? 'Review' : 'Reviews'})
                    </Link>
                  </div>
                )}

                {product.subtitle && <p className="text-cream/70 text-base md:text-lg">{product.subtitle}</p>}
                {product.tagline && <p className="text-cream/50 text-xs italic" style={serif}>{product.tagline}</p>}
              </div>

              {/* Price */}
              <div>
                {payPct ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                      <p className="text-4xl md:text-[2.6rem] text-gold leading-none" style={serif}>{fmtPKR(payOnline)}</p>
                      <p className="text-lg text-cream/45 line-through" style={serif}>{fmtPKR(original)}</p>
                      <span className="bg-burgundy text-gold-light border border-gold-border/70 text-xs font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded">{payPct.online}% OFF</span>
                    </div>
                    <p className="text-cream/60 text-xs uppercase tracking-[0.18em]">with Bank Transfer / Online Payment</p>
                    <div className="inline-flex items-center flex-wrap gap-x-3 gap-y-1 border border-gold-border/40 rounded-lg px-3 py-2" style={{ background: 'rgb(40 3 10 / 0.35)' }}>
                      <span className="text-gold text-lg font-semibold" style={serif}>{fmtPKR(payCod)}</span>
                      <span className="text-gold-light text-[11px] font-semibold uppercase tracking-[0.08em]">{payPct.cod}% OFF</span>
                      <span className="text-cream/60 text-xs">with Cash on Delivery</span>
                    </div>
                  </div>
                ) : sale.onSale ? (
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                    <p className="text-4xl md:text-[2.6rem] text-gold leading-none" style={serif}>{fmtPKR(shown)}</p>
                    <p className="text-lg text-cream/45 line-through" style={serif}>{fmtPKR(original)}</p>
                    <span className="bg-burgundy text-gold-light border border-gold-border/70 text-xs font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded">{sale.pct}% OFF</span>
                  </div>
                ) : (
                  <p className="text-4xl md:text-[2.6rem] text-gold leading-none" style={serif}>
                    {selectedVariation?.price ? fmtPKR(selectedVariation.price) : product.price}
                  </p>
                )}
                {product.bulk_discount_qty && product.bulk_discount_pct && (
                  <p className="text-green-400/90 text-xs uppercase tracking-[0.15em] mt-1.5 font-medium">
                    Buy {product.bulk_discount_qty} and save {product.bulk_discount_pct}%
                  </p>
                )}
              </div>

              {renderChoices()}

              {/* Secret note field */}
              {product.custom_text_enabled && (
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-cream/50">Secret Note / Custom Text</p>
                  <textarea
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    rows={3}
                    placeholder="Add your personalised message or custom text…"
                    className="w-full bg-transparent border border-gold-border/40 text-cream text-sm px-3 py-2.5 placeholder-cream/25 focus:outline-none focus:border-gold-border/70 resize-none"
                  />
                </div>
              )}

              {/* Qty + Add to Cart */}
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-gold-border/60 rounded">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-full min-h-[52px] flex items-center justify-center text-cream/70 hover:text-cream transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                  </button>
                  <span className="w-10 text-center text-cream text-base" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(q => q + 1)}
                    className="w-11 h-full min-h-[52px] flex items-center justify-center text-cream/70 hover:text-cream transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-gold text-sh-bg text-base font-semibold rounded px-6 py-3.5 hover:brightness-110 transition"
                >
                  <Icon name="cart" size={22} strokeWidth={1.8} /> Add to Cart
                </button>
              </div>
              {product.bulk_discount_qty && product.bulk_discount_pct && qty >= product.bulk_discount_qty && (
                <p className="text-green-400 text-[11px] font-bold uppercase tracking-wide">{product.bulk_discount_pct}% off unlocked!</p>
              )}

              <button
                type="button"
                ref={sets.length === 0 ? stickyTriggerRef : undefined}
                onClick={buyNow}
                className="w-full border border-gold-muted text-gold-light text-base font-semibold rounded px-6 py-3.5 hover:bg-burgundy hover:border-gold transition-colors"
              >
                Buy Now
              </button>

              {/* Promo code */}
              <div className="border border-gold-border/40 rounded-lg p-4 space-y-3" style={{ background: 'rgb(40 3 10 / 0.45)' }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-cream/85 text-sm font-medium shrink-0">
                    <Icon name="tag" size={20} className="text-gold" /> Apply Promo Code
                  </span>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); if (promo) setPromo(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyPromo(); }}
                    placeholder="Enter promo code"
                    aria-label="Promo code"
                    className="flex-1 min-w-[140px] px-3 py-2 bg-sh-card/60 border border-gold-border/40 rounded text-cream/85 text-sm placeholder:text-cream/25 outline-none focus:border-gold-muted"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="bg-burgundy border border-gold-muted text-gold-btn-text text-xs font-medium uppercase tracking-[0.12em] px-5 py-2 rounded disabled:opacity-50"
                  >
                    {promoLoading ? '…' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-red-400 text-xs">{promoError}</p>}
                {promo && !promoError && (
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="flex items-center gap-1.5 text-green-400 font-medium">
                      <Icon name="check" size={18} /> {promo.pct}% discount applied!
                    </span>
                    <span className="text-cream/55">
                      You&apos;ll save {fmtPKR(Math.round(shown * qty * promo.pct / 100))} on this order.
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className={`flex items-center gap-2 text-sm ${inStock ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} aria-hidden="true" />
                  {inStock ? 'In stock, ready to ship' : 'Currently out of stock'}
                </p>
                {product.stock_note && (
                  <p className="text-cream/45 text-xs uppercase tracking-[0.18em]">{product.stock_note}</p>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 pt-1">
                {TRUST.map((t) => (
                  <div key={t.title} className="flex flex-col items-center text-center gap-1.5">
                    <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-gold-muted flex items-center justify-center text-gold">
                      <Icon name={t.icon} size={20} />
                    </span>
                    <span className="text-cream/85 text-[11px] sm:text-xs font-medium leading-tight">{t.title}</span>
                    <span className="text-cream/45 text-[10px] sm:text-[11px] leading-tight">{t.sub}</span>
                  </div>
                ))}
              </div>

              {/* Review snippet */}
              {review && (
                <div className="border border-gold-border/40 rounded-lg p-4 flex items-center gap-3" style={{ background: 'rgb(40 3 10 / 0.45)' }}>
                  {snippets.length > 1 && (
                    <button type="button" aria-label="Previous review" onClick={() => setReviewIdx(i => (i - 1 + snippets.length) % snippets.length)}
                      className="text-cream/45 hover:text-gold transition-colors shrink-0"><Icon name="left" size={18} /></button>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-cream text-sm font-semibold">{review.reviewer_name}</span>
                      {review.rating != null && <Stars value={review.rating} className="text-sm" />}
                    </div>
                    <p className="text-cream/75 text-sm leading-relaxed line-clamp-3">&ldquo;{review.body}&rdquo;</p>
                    <p className="flex items-center gap-1.5 text-gold/80 text-xs"><Icon name="check" size={14} /> {ownReviews ? 'Verified purchase' : 'Customer story'}</p>
                  </div>
                  {snippets.length > 1 && (
                    <button type="button" aria-label="Next review" onClick={() => setReviewIdx(i => (i + 1) % snippets.length)}
                      className="text-cream/45 hover:text-gold transition-colors shrink-0"><Icon name="right" size={18} /></button>
                  )}
                </div>
              )}

              {/* Choose Your Set */}
              {sets.length > 0 && (
                <div ref={stickyTriggerRef} className="space-y-3 pt-2">
                  <div>
                    <h2 className="text-3xl text-gold-light" style={serif}>Choose Your Set</h2>
                    <p className="text-cream/55 text-sm mt-1">More ways to make your moments special.</p>
                  </div>
                  <div className="space-y-3">
                    {setChoices.map((p) => {
                      const s = getSale(p);
                      const sub = p.subtitle || p.tagline;
                      const thumb = p.img;
                      return (
                        <div key={p.slug} className="relative">
                          <Link
                            href={`/product/${p.slug}`}
                            className="w-full text-left flex gap-3 sm:gap-4 rounded-lg p-3 sm:p-4 pb-14 sm:pb-4 border border-gold-border/40 hover:border-gold transition-colors"
                          >
                            <span className="relative w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden shrink-0 bg-sh-card">
                              {thumb && <Image src={thumb} alt="" fill sizes="96px" className="object-cover" />}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="flex items-start justify-between gap-3">
                                <span className="min-w-0">
                                  <span className="block text-cream text-base font-semibold leading-snug" style={serif}>
                                    {p.tag === 'best-seller' && <span className="text-gold mr-1" aria-hidden="true">★</span>}
                                    {p.title}
                                  </span>
                                  {sub && <span className="block text-cream/55 text-xs mt-0.5">{sub}</span>}
                                </span>
                                <span className="text-right shrink-0">
                                  <span className="block text-gold text-lg font-semibold" style={serif}>{fmtPKR(s.effective)}</span>
                                  {s.onSale && <span className="block text-cream/40 text-xs line-through">{fmtPKR(s.original)}</span>}
                                </span>
                              </span>
                              {s.onSale && (
                                <span className="inline-flex mt-2 rounded-full overflow-hidden text-[11px] font-semibold">
                                  <span className="bg-gold/85 text-sh-bg px-2.5 py-0.5">Save {fmtPKR(s.original - s.effective)}</span>
                                  <span className="bg-gold text-sh-bg px-2.5 py-0.5 border-l border-sh-bg/20">{s.pct}% OFF</span>
                                </span>
                              )}
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => addSetToCart(p)}
                            aria-label={`Add ${p.title} to cart`}
                            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold/10 hover:bg-gold hover:text-sh-bg text-gold text-xs font-semibold px-3.5 py-1.5 transition-colors"
                          >
                            {cartItems.some((i) => i.slug === p.slug) ? (
                              <><Icon name="check" size={14} strokeWidth={2} /> Added</>
                            ) : (
                              <><span className="text-base leading-none">+</span> Add</>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <DeliveryEstimate />

              {product.description && <p className="text-cream/65 leading-relaxed text-sm pt-2">{product.description}</p>}

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

              {/* Crafted by Secret Hour */}
              <div className="flex items-center gap-3 pt-2">
                <Image src={LOGO} alt="Secret Hour" width={24} height={24} className="w-6 h-6 object-contain opacity-80" />
                <span className="text-cream/45 text-[10px] uppercase tracking-[0.3em]">Crafted by Secret Hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Strip ── */}
      {product.quote && (
        <section className="py-14 px-6 border-t border-gold-border/20 text-center" style={{ background: 'radial-gradient(ellipse at center, rgb(89 13 25 / 0.35) 0%, transparent 70%)' }}>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-cream/80 italic text-xl md:text-2xl leading-relaxed" style={serif}>{product.quote}</p>
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em]">{product.quote_label}</p>
          </div>
        </section>
      )}

      {/* ── Complete Your Experience ── */}
      {showUpsell && (
        <section className="py-14 px-4 md:px-6 border-t border-gold-border/20" style={{ background: 'radial-gradient(ellipse at bottom, rgb(89 13 25 / 0.35) 0%, transparent 70%)' }}>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.35em] mb-2">Complete Your Experience</p>
              <h2 className="text-2xl md:text-3xl italic text-cream" style={serif}>A few more touches</h2>
            </div>
            <div className="border border-gold-border/40 flex items-center gap-4 p-4 hover:border-gold transition-colors duration-300" style={{ background: 'var(--color-sh-card)' }}>
              <Link href={`/product/${upsell.slug}`} className="relative w-20 h-20 shrink-0 bg-sh-card block">
                <Image src={upsell.img} alt={`${upsell.title} Secret Hour`} fill className="object-contain" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${upsell.slug}`} className="text-cream italic text-base hover:text-gold transition-colors block" style={serif}>{upsell.title}</Link>
                {(() => {
                  const s = getSale(upsell);
                  return s.onSale ? (
                    <p className="mt-0.5 flex items-baseline gap-2" style={serif}>
                      <span className="text-gold text-sm">{fmtPKR(s.effective)}</span>
                      <span className="text-cream/40 text-xs line-through">{fmtPKR(s.original)}</span>
                    </p>
                  ) : (
                    <p className="text-gold text-sm mt-0.5" style={serif}>{upsell.price}</p>
                  );
                })()}
              </div>
              <button
                onClick={() => { const s = getSale(upsell); addToCart({ slug: upsell.slug, title: upsell.title, price: fmtPKR(s.effective), numericPrice: s.effective, listPrice: s.onSale ? s.original : null, img: upsell.img, variation: null, bulkDiscountQty: null, bulkDiscountPct: null, customNote: null }); }}
                className="shrink-0 bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 btn-glow transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── You May Also Love ── */}
      {relatedList.length > 0 && (
        <section className="py-20 border-t border-gold/10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 justify-center mb-12">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/30" />
              <h2 className="text-2xl italic text-cream" style={serif}>You May Also Love</h2>
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/30" />
            </div>
            {/* Flex + centred, so one or two picks sit in the middle instead of the left */}
            <div className="flex flex-wrap justify-center gap-5 md:gap-6">
              {relatedList.map((p) => (
                <div key={p.slug} className="group flex flex-col w-[calc(50%-0.625rem)] md:w-[calc(33.333%-1rem)] border border-gold-border/40 hover:border-gold transition-colors duration-300">
                  <Link href={`/product/${p.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-sh-card">
                      <Image src={p.img} alt={`${p.title} Secret Hour`} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    </div>
                  </Link>
                  <div className="p-4 text-center space-y-2 flex-1 flex flex-col">
                    <Link href={`/product/${p.slug}`} className="text-sm italic text-cream leading-snug hover:text-gold transition-colors" style={serif}>{p.title}</Link>
                    {(() => {
                      const s = getSale(p);
                      return s.onSale ? (
                        <p className="flex items-baseline justify-center gap-2" style={serif}>
                          <span className="text-gold text-base">{fmtPKR(s.effective)}</span>
                          <span className="text-cream/40 text-xs line-through">{fmtPKR(s.original)}</span>
                        </p>
                      ) : (
                        <p className="text-gold text-base" style={serif}>{p.price}</p>
                      );
                    })()}
                    <button
                      onClick={() => addSetToCart(p)}
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
                  <div key={r.id} className="w-full shrink-0 border border-gold-border/40 p-7 md:p-10 text-center" style={{ background: 'rgb(40 3 10 / 0.55)' }}>
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
                      className="w-6 h-6 flex items-center justify-center"
                      aria-label={`Review ${i + 1}`}
                      aria-current={i === reviewIdx ? 'true' : undefined}
                    >
                      <span className={`block transition-all duration-300 rounded-full ${i === reviewIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/20 hover:bg-cream/40'}`} />
                    </button>
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
      <div className={showStickyBar ? 'h-20 lg:h-0' : 'h-0'} />

      {/* Mobile sticky Add to Cart + Buy Now */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-sh-bg/95 backdrop-blur-sm border-t border-gold-border/40 p-3 pr-[84px] flex gap-3 transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`} aria-hidden={!showStickyBar}>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-gold text-sh-bg text-[11px] font-semibold uppercase tracking-[0.18em] py-3.5 rounded transition-all"
        >
          Add to Cart
        </button>
        <button
          onClick={buyNow}
          className="flex-1 border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.18em] py-3.5 rounded transition-all text-center hover:bg-burgundy flex items-center justify-center"
        >
          Buy Now
        </button>
      </div>

      <Footer />
    </div>
  );
}
