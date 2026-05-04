'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const IMG = {
  hero:      '/assets/hero-couple-CSWWAnnc.jpg',
  silk:      '/assets/bg-silk-B9_HjwKe.jpg',
  cardGame:  '/assets/sh-card-game-Cw972EQC.png',
  bridalBox: '/assets/sh-bridal-box-Bmv6nl8o.jpg',
  nightSet:  '/assets/sh-night-set-DlV1-dhc.jpg',
};

const PRODUCTS = [
  {
    href:     '/product/bridal-box',
    img:      IMG.bridalBox,
    alt:      'The Secret Hour Bridal Box',
    title:    'The Secret Hour Bridal Box',
    subtitle: 'The wedding-night gift she will never forget.',
    price:    'Rs. 8,999',
  },
  {
    href:     '/product/intimate-night-set',
    img:      IMG.nightSet,
    alt:      'The Intimate Night Set',
    title:    'The Intimate Night Set',
    subtitle: 'Three small luxuries. One unforgettable evening.',
    price:    'Rs. 5,499',
  },
];

const TESTIMONIALS = [
  { quote: "Our wedding night felt like a film. The bridal box made it unforgettable." },
  { quote: "The card game pulled us out of routine. We've never talked like this before." },
  { quote: "Beautifully made. It feels like a gift you'd buy for someone you really love." },
];

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="bg-sh-bg text-cream min-h-screen">

      <Navbar />

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl italic mb-4 leading-[1.15] text-cream" style={serif}>
            The hours that{' '}
            <span className="text-gold-gradient">belong to you</span>
          </h1>
          <p className="text-cream/75 text-base md:text-xl italic mb-3 max-w-xl mx-auto leading-relaxed" style={serif}>
            Quietly luxurious gifts crafted for married couples — to slow down, come closer, and remember why.
          </p>
          <p className="text-cream/55 text-sm italic mb-8 max-w-lg mx-auto" style={serif}>
            Create moments that bring you closer — privately, comfortably, beautifully.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 sm:min-w-52 text-center"
            >
              Explore the Experience
            </Link>
            <Link
              href="/product/secret-hour-card-experience"
              className="w-full sm:w-auto bg-sh-bg border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 sm:min-w-52 text-center"
            >
              Take the Quiz
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-cream/40 text-[9px] uppercase tracking-[0.2em]">
            <span>Discreet Packaging</span>
            <span className="hidden sm:inline">•</span>
            <span>Trusted by Couples</span>
            <span className="hidden sm:inline">•</span>
            <span>Designed for Comfort</span>
          </div>
        </div>
      </section>

      {/* ─── Featured Product ────────────────────────────────── */}
      <section className="relative min-h-screen px-4 md:px-6 overflow-hidden flex items-center bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.silk} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-20">
          <div className="relative p-3 md:p-5 border border-gold-border/40 bg-black">
            <div className="relative aspect-square">
              <Image
                src={IMG.cardGame}
                alt="Secret Hour – The Couple's Card Experience"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">
            <p className="text-gold/70 text-[10px] uppercase tracking-[0.35em]">Featured</p>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl italic leading-tight text-cream" style={serif}>
                <em>Secret Hour</em>
              </h2>
              <h2 className="text-4xl sm:text-5xl md:text-6xl italic leading-tight text-cream" style={serif}>
                <em>The Couple&apos;s Card Experience</em>
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
              <p className="text-3xl md:text-4xl text-gold" style={serif}>Rs. 3,499</p>
              <p className="text-cream/30 text-[9px] uppercase tracking-[0.2em] mt-1">Including all taxes · Available in small batches</p>
            </div>

            <Link
              href="/product/secret-hour-card-experience"
              className="inline-block w-full sm:w-auto text-center bg-sh-bg border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 hover:bg-burgundy"
            >
              Open the Box
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bundles ─────────────────────────────────────────── */}
      <section className="relative min-h-screen px-4 md:px-6 flex items-center py-16 md:py-24" style={{ background: 'linear-gradient(to bottom, hsl(350 60% 12%) 0%, hsl(20 10% 4%) 100%)' }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] block mb-4">
              Curated Bundles
            </span>
            <h2 className="text-3xl md:text-5xl italic mb-4 text-cream" style={serif}>
              For a complete experience —<br className="hidden md:block" /> not just a product
            </h2>
            <p className="text-cream/55 italic text-sm" style={serif}>
              Thoughtfully assembled boxes for the moments that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {PRODUCTS.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block border border-gold-border hover:border-gold transition-colors duration-300 relative"
              >
                {i === 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-gold text-sh-bg text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1">
                    Best Seller
                  </span>
                )}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                <div className="p-6 md:p-8 space-y-2 md:space-y-3 bg-black/40 text-center">
                  <h3 className="text-xl md:text-2xl italic text-cream" style={serif}>{p.title}</h3>
                  <p className="text-cream/55 text-sm italic" style={serif}>{p.subtitle}</p>
                  <p className="text-gold text-lg md:text-xl" style={serif}>{p.price}</p>
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
            <h2 className="text-3xl md:text-5xl italic text-cream leading-tight" style={serif}>
              It&apos;s not about <span className="text-gold-light">the product.</span>
            </h2>
            <p className="text-cream/50 italic text-sm md:text-base leading-relaxed" style={serif}>
              It&apos;s about the moment you create together — the comfort, the connection, the memory.
            </p>
          </div>
          <div className="border-t border-gold-border/20 pt-12 space-y-5">
            <span className="text-gold/70 text-[10px] uppercase tracking-[0.35em] block">The Experience Quiz</span>
            <h3 className="text-3xl md:text-5xl italic text-cream" style={serif}>
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
          <h2 className="text-3xl md:text-5xl italic text-center mb-10 md:mb-16 text-cream" style={serif}>
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
          <h2 className="text-3xl md:text-4xl italic text-cream" style={serif}>
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
