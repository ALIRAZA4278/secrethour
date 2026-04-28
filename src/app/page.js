'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const IMG = {
  hero:      'https://secrethour.lovable.app/assets/hero-couple-CSWWAnnc.jpg',
  silk:      'https://secrethour.lovable.app/assets/bg-silk-B9_HjwKe.jpg',
  cardGame:  'https://secrethour.lovable.app/assets/sh-card-game-Cw972EQC.png',
  bridalBox: 'https://secrethour.lovable.app/assets/sh-bridal-box-Bmv6nl8o.jpg',
  nightSet:  'https://secrethour.lovable.app/assets/sh-night-set-DlV1-dhc.jpg',
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
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-[1.15] text-cream" style={serif}>
            The hours that{' '}
            <span className="text-gold-gradient">belong to you</span>
          </h1>
          <p className="text-cream/75 text-lg md:text-xl italic mb-12 max-w-xl mx-auto leading-relaxed" style={serif}>
            Quietly luxurious gifts crafted for married couples — to slow down, come closer, and remember why.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 min-w-60 text-center"
            >
              Explore the Collection
            </Link>
            <Link
              href="/product/secret-hour-card-experience"
              className="bg-sh-bg border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 min-w-60 text-center"
            >
              Discover the Card Game
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Product ────────────────────────────────── */}
      <section className="relative min-h-screen px-6 overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <Image src={IMG.silk} alt="" fill className="object-cover" unoptimized />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-20 items-center py-20">
          <div className="relative p-4 border border-gold-border bg-black">
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

          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-gold-border" />
              <span className="text-gold text-[10px] uppercase tracking-[0.3em]">Featured</span>
              <div className="h-px w-10 bg-gold-border" />
            </div>

            <h2 className="text-5xl md:text-6xl italic leading-tight text-cream" style={serif}>
              Secret Hour
              <br />
              <span className="text-gold-light">The Couple&apos;s Card Experience</span>
            </h2>

            <p className="text-cream/65 leading-relaxed text-base">
              A private invitation to rediscover each other. Crafted for married couples, The Midnight
              Deck turns ordinary nights into unforgettable rituals. Housed in a matte black box with
              soft gold detailing.
            </p>

            <p className="text-4xl text-gold" style={serif}>Rs. 3,499</p>

            <Link
              href="/product/secret-hour-card-experience"
              className="inline-block bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-5 btn-glow transition-all duration-300"
            >
              Open the Box
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bundles ─────────────────────────────────────────── */}
      <section className="relative min-h-screen px-6 flex items-center py-24" style={{ background: 'linear-gradient(to bottom, hsl(350 60% 12%) 0%, hsl(20 10% 4%) 100%)' }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] block mb-4">
              Curated Bundles
            </span>
            <h2 className="text-4xl md:text-5xl italic mb-4 text-cream" style={serif}>
              Gift the whole evening
            </h2>
            <p className="text-cream/55 italic text-sm" style={serif}>
              Thoughtfully assembled boxes for the moments that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {PRODUCTS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block border border-gold-border hover:border-gold transition-colors duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                <div className="p-8 space-y-3 bg-black/40 text-center">
                  <h3 className="text-2xl italic text-cream" style={serif}>{p.title}</h3>
                  <p className="text-cream/55 text-sm italic" style={serif}>{p.subtitle}</p>
                  <p className="text-gold text-xl" style={serif}>{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <Image src={IMG.silk} alt="" fill className="object-cover" unoptimized />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl italic text-center mb-16 text-cream" style={serif}>
            Whispered Back to Us
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
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
            className="flex mt-8"
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
              className="bg-burgundy border border-l-0 border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-6 py-4 btn-glow transition-all whitespace-nowrap"
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
