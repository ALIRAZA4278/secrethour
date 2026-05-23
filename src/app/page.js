'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useCart } from './context/CartContext';
import { supabase } from '../lib/supabase';

const IMG = {
  silk:     '/assets/bg-silk-B9_HjwKe.jpg',
  cardGame: '/assets/sh-card-game-Cw972EQC.png',
};

const SLIDES = [
  { desk: '/assets/hero-couple-CSWWAnnc.jpg', mob: '/assets/hero-couple-CSWWAnnc.jpg' },
  { desk: '/Banners/1.jpg.jpeg',              mob: '/Banners/1 mob.jpg.jpeg' },
  { desk: '/Banners/2.jpg.jpeg',              mob: '/Banners/2 mob.jpg.jpeg' },
];

const TESTIMONIALS = [
  { quote: "Our wedding night felt like a film. The bridal box made it unforgettable." },
  { quote: "The card game pulled us out of routine. We've never talked like this before." },
  { quote: "Beautifully made. It feels like a gift you'd buy for someone you really love." },
];

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function Home() {
  const [email, setEmail] = useState('');
  const { addToCart } = useCart();
  const [products, setProducts] = useState({});
  const [bundles, setBundles] = useState([]);
  const [featImg, setFeatImg] = useState(0);

  // Hero slider
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  function resetTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4500);
  }

  function goTo(i) { setCurrent(i); resetTimer(); }
  function handlePrev() { prev(); resetTimer(); }
  function handleNext() { next(); resetTimer(); }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  }

  useEffect(() => {
    supabase
      .from('products')
      .select('slug, title, subtitle, price, numeric_price, img, images, tag')
      .neq('hidden', true)
      .then(({ data }) => {
        if (!data) return;
        const visible = data;

        // Midnight deck for featured section
        const deck = visible.find(p => p.slug.toLowerCase() === 'the-midnight-deck');
        if (deck) setProducts({ 'the-midnight-deck': deck });

        // First 2 visible products that are NOT the midnight deck
        setBundles(visible.filter(p => p.slug.toLowerCase() !== 'the-midnight-deck').slice(0, 2));
      });
  }, []);

  return (
    <div className="bg-sh-bg text-cream min-h-screen">

      <Navbar />

      {/* ─── Hero Slider ─────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: '100svh' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.mob} alt="" className="absolute inset-0 w-full h-full object-cover object-top md:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.desk} alt="" className="absolute inset-0 w-full h-full object-cover object-top hidden md:block" />
          </div>
        ))}

        {/* Dark overlay — gradient: darker at bottom where text is */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Centred text + CTA */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-20 md:pt-28 text-center px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl italic mb-6 leading-[1.15] text-cream drop-shadow-lg" style={serif}>
            The hours that{' '}
            <span className="text-gold-gradient">belong to you</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-7">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 sm:min-w-52 text-center"
            >
              Explore the Experience
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto bg-sh-bg/80 border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 sm:min-w-52 text-center"
            >
              Take the Quiz
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-cream/50 text-[9px] uppercase tracking-[0.2em]">
            <span>Discreet Packaging</span>
            <span className="hidden sm:inline">•</span>
            <span>Trusted by Couples</span>
            <span className="hidden sm:inline">•</span>
            <span>Designed for Comfort</span>
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/30 hover:bg-black/60 border border-white/20 text-white transition-all duration-200 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/30 hover:bg-black/60 border border-white/20 text-white transition-all duration-200 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Featured Product ────────────────────────────────── */}
      <section className="relative min-h-screen px-4 md:px-6 overflow-hidden flex items-center bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.silk} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-20">

          {/* Image slider — manual arrows only */}
          {(() => {
            const deck = products['the-midnight-deck'];
            const imgs = deck?.images?.length ? deck.images : [deck?.img || IMG.cardGame];
            return (
              <div className="relative aspect-square w-full overflow-hidden border border-gold-border/40 group">
                <Image
                  src={imgs[featImg] || IMG.cardGame}
                  alt="The Midnight Deck"
                  fill
                  className="object-cover transition-opacity duration-500"
                  unoptimized
                />
                {imgs.length > 1 && (
                  <>
                    <button
                      onClick={() => setFeatImg(i => (i - 1 + imgs.length) % imgs.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setFeatImg(i => (i + 1) % imgs.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {imgs.map((_, i) => (
                        <button key={i} onClick={() => setFeatImg(i)}
                          className={`rounded-full transition-all duration-300 ${i === featImg ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          <div className="space-y-5 md:space-y-6">
            <p className="text-gold/70 text-[10px] uppercase tracking-[0.35em]">Featured</p>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl italic leading-tight text-cream" style={serif}>
                <em>The Midnight Deck</em>
              </h2>
            </div>

            <p className="text-cream/55 italic text-sm" style={serif}>
              A private invitation to rediscover each other.
            </p>

            <p className="text-cream/60 leading-relaxed text-sm">
              Crafted for married couples, The Midnight Deck turns ordinary nights into unforgettable rituals. Playful dares and meaningful questions — all wrapped in a matte black box with soft gold detailing.
            </p>

            <ul className="space-y-2">
              {['Builds comfort naturally', 'No awkward moments', 'Easy to start, meaningful to continue'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-cream/65 text-sm">
                  <span className="text-gold text-sm leading-none">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div>
              <p className="text-3xl md:text-4xl text-gold" style={serif}>{products['the-midnight-deck']?.price || 'Rs. 2,999'}</p>
              <p className="text-cream/30 text-[9px] uppercase tracking-[0.2em] mt-1">Including all taxes · Available in small batches</p>
              <p className="text-gold/60 text-[9px] uppercase tracking-[0.2em] mt-1">🚚 Free Delivery across Pakistan</p>
            </div>

            <Link
              href="/product/the-midnight-deck"
              className="inline-block w-full sm:w-auto text-center bg-sh-bg border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 hover:bg-burgundy"
            >
              Open the Box
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bundles ─────────────────────────────────────────── */}
      <section className="relative px-4 md:px-6 py-16 md:py-20" style={{ background: 'linear-gradient(to bottom, hsl(350 60% 12%) 0%, hsl(20 10% 4%) 100%)' }}>
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] block mb-4">
              Curated Bundles
            </span>
            <h2 className="text-2xl md:text-3xl italic mb-3 text-cream" style={serif}>
              For a complete experience —<br className="hidden md:block" /> not just a product
            </h2>
            <p className="text-cream/55 italic text-sm" style={serif}>
              Thoughtfully assembled boxes for the moments that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {bundles.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`}
                className="group block border border-gold-border hover:border-gold transition-colors duration-300 relative">
                {p.tag === 'best-seller' && (
                  <span className="absolute top-3 left-3 z-10 bg-gold text-sh-bg text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1">
                    Best Seller
                  </span>
                )}
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image src={p.img} alt={p.title} fill className="object-cover" unoptimized />
                </div>
                <div className="p-4 space-y-1.5 bg-black/40 text-center">
                  <h3 className="text-sm md:text-base italic text-cream" style={serif}>{p.title}</h3>
                  <p className="text-cream/55 text-xs italic" style={serif}>{p.subtitle}</p>
                  <p className="text-gold text-base md:text-lg" style={serif}>{p.price}</p>
                  <button
                    onClick={(e) => { e.preventDefault(); addToCart({ slug: p.slug, title: p.title, price: p.price, numericPrice: p.numeric_price, img: p.img }); }}
                    className="mt-1 w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] py-2.5 btn-glow transition-all duration-300 hover:bg-[#5a1a24]"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Experience / Quiz CTA ───────────────────────────── */}
      <section className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden text-center" style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 8%) 0%, hsl(20 5% 3%) 60%)' }}>
        <div className="relative z-10 max-w-2xl mx-auto space-y-14">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-4xl italic text-cream leading-tight" style={serif}>
              It&apos;s not about <span className="text-gold-light">the product.</span>
            </h2>
            <p className="text-cream/50 italic text-sm md:text-base leading-relaxed" style={serif}>
              It&apos;s about the moment you create together — the comfort, the connection, the memory.
            </p>
          </div>
          <div className="border-t border-gold-border/20 pt-12 space-y-5">
            <span className="text-gold/70 text-[10px] uppercase tracking-[0.35em] block">The Experience Quiz</span>
            <h3 className="text-2xl md:text-4xl italic text-cream" style={serif}>
              Not sure where to <span className="text-gold-light">begin?</span>
            </h3>
            <p className="text-cream/50 italic text-sm" style={serif}>
              Discover your perfect Secret Hour experience — in less than a minute.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-2 border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 hover:bg-burgundy"
            >
              Start the Experience
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="relative py-16 md:py-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <Image src={IMG.silk} alt="" fill className="object-cover" unoptimized />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl italic text-center mb-10 md:mb-16 text-cream" style={serif}>
            Whispered Back to Us
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="border border-gold-border p-8 space-y-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-gold text-lg">★</span>
                  ))}
                </div>
                <p className="text-cream/75 italic leading-relaxed text-sm" style={serif}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-gold-muted text-[10px] uppercase tracking-[0.25em]">— Anonymous</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ────────────────────────────────────── */}
      <section className="border-t border-b border-gold-border/20 py-6 px-4 md:px-6 bg-sh-bg">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z', label: 'Discreet Packaging' },
            { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 01-.987-1.106v-.828', label: 'Cash on Delivery Available' },
            { icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z', label: 'Support Available Anytime' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              <span className="text-cream/60 text-[10px] uppercase tracking-[0.2em]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Newsletter ──────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-3xl italic text-cream" style={serif}>
            Join the Secret Hour Circle
          </h2>
          <p className="text-cream/55 italic text-sm" style={serif}>
            Quiet drops, private offers, and the occasional love letter.
          </p>

          <form
            className="flex flex-col sm:flex-row mt-8 gap-0"
            onSubmit={(e) => {
              e.preventDefault();
              setEmail('');
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-sh-card border border-gold-muted text-cream/80 placeholder:text-cream/30 px-5 py-4 text-sm outline-none focus:border-gold-btn-text transition-colors"
            />
            <button
              type="submit"
              className="bg-burgundy border border-gold-muted sm:border-l-0 text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-6 py-4 btn-glow transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />

    </div>
  );
}
