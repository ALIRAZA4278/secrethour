'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const IMG = {
  logo:      'https://secrethour.lovable.app/assets/logo-secret-hour-DN-hyC6c.png',
  hero:      'https://secrethour.lovable.app/assets/hero-couple-CSWWAnnc.jpg',
  silk:      'https://secrethour.lovable.app/assets/bg-silk-B9_HjwKe.jpg',
  cardGame:  'https://secrethour.lovable.app/assets/sh-card-game-Cw972EQC.png',
  bridalBox: 'https://secrethour.lovable.app/assets/sh-bridal-box-Bmv6nl8o.jpg',
  nightSet:  'https://secrethour.lovable.app/assets/sh-night-set-DlV1-dhc.jpg',
};

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Shop',         href: '/shop' },
  { label: 'Card Game',    href: '/product/secret-hour-card-experience' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

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

const SOCIAL = [
  {
    label: 'Instagram',
    href:  'https://www.instagram.com/secrethour.pk',
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href:  'https://www.facebook.com/people/Secret-Hour/61585460425456/',
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href:  'https://wa.me/message/5QY6DQTFQQGEC1',
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href:  'mailto:info@secrethour.pk',
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail]       = useState('');

  return (
    <div className="bg-sh-bg text-cream min-h-screen">

      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gold-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative w-36 h-10 shrink-0">
            <Image src={IMG.logo} alt="Secret Hour" fill className="object-contain object-left" priority />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream/75 hover:text-gold text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-cream/75 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            <button aria-label="Cart" className="text-cream/75 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
              </svg>
            </button>
            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              className="md:hidden text-cream/75 hover:text-gold transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/95 border-t border-gold-border/30 px-6 py-5">
            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-cream/75 hover:text-gold text-[11px] font-medium uppercase tracking-[0.18em] transition-colors block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src={IMG.hero} alt="Secret Hour couple" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-[1.15] text-cream" style={serif}>
            The hours that{' '}
            <span className="text-gold">belong to you</span>
          </h1>
          <p className="text-cream/75 text-lg md:text-xl italic mb-12 max-w-xl mx-auto leading-relaxed" style={serif}>
            Quietly luxurious gifts crafted for married couples — to slow down, come closer, and remember why.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="border border-gold text-gold text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-gold hover:text-sh-bg transition-colors duration-300 min-w-[240px] text-center"
            >
              Explore the Collection
            </Link>
            <Link
              href="/product/secret-hour-card-experience"
              className="border border-gold text-gold text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-gold hover:text-sh-bg transition-colors duration-300 min-w-[240px] text-center"
            >
              Discover the Card Game
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Product ────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Silk texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src={IMG.silk} alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Image with decorative border frame */}
          <div className="relative p-3 border border-gold-border">
            <div className="relative aspect-[4/3]">
              <Image
                src={IMG.cardGame}
                alt="Secret Hour – The Couple's Card Experience"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold-border" />
              <span className="text-gold text-[10px] uppercase tracking-[0.3em]">Featured</span>
              <div className="h-px w-8 bg-gold-border" />
            </div>

            <h2 className="text-4xl md:text-5xl italic leading-tight text-cream" style={serif}>
              Secret Hour
              <br />
              <span className="text-gold-light">The Couple&apos;s Card Experience</span>
            </h2>

            <p className="text-cream/65 leading-relaxed text-sm">
              A private invitation to rediscover each other. Crafted for married couples, The Midnight
              Deck turns ordinary nights into unforgettable rituals. Housed in a matte black box with
              soft gold detailing.
            </p>

            <p className="text-3xl text-gold" style={serif}>Rs. 3,499</p>

            <Link
              href="/product/secret-hour-card-experience"
              className="inline-block border border-gold text-gold text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-sh-bg transition-colors duration-300"
            >
              Open the Box
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bundles ─────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-sh-card">
        <div className="max-w-5xl mx-auto">
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

          <div className="grid md:grid-cols-2 gap-8">
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
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-xl italic text-cream" style={serif}>{p.title}</h3>
                  <p className="text-cream/55 text-sm">{p.subtitle}</p>
                  <p className="text-gold" style={serif}>{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src={IMG.silk} alt="" fill className="object-cover" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl italic text-center mb-16 text-cream" style={serif}>
            Whispered Back to Us
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="border border-gold-border p-8 space-y-5 bg-sh-card/60">
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
      <section className="py-24 px-6 bg-sh-muted text-center">
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
              className="flex-1 bg-sh-card border border-gold-border text-cream/80 placeholder:text-cream/30 px-5 py-4 text-sm outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              className="bg-burgundy border border-l-0 border-gold-border text-gold text-[11px] font-medium uppercase tracking-[0.2em] px-6 py-4 hover:bg-burgundy/70 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="bg-sh-bg border-t border-gold-border/30 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <div className="relative w-36 h-10">
              <Image src={IMG.logo} alt="Secret Hour" fill className="object-contain object-left" />
            </div>
            <p className="text-cream/45 text-sm leading-relaxed max-w-[200px]">
              Quiet luxuries for married couples — made for the hours that belong only to you.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-5">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.3em]">Shop</h4>
            <ul className="space-y-3">
              {[
                ['All Products', '/shop'],
                ['Card Game',    '/product/secret-hour-card-experience'],
                ['Bridal Box',   '/product/bridal-box'],
                ['Night Set',    '/product/intimate-night-set'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-cream/55 hover:text-gold text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* House */}
          <div className="space-y-5">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.3em]">House</h4>
            <ul className="space-y-3">
              {[
                ['About Us',      '/about'],
                ['Testimonials',  '/testimonials'],
                ['Contact',       '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-cream/55 hover:text-gold text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div className="space-y-5">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.3em]">Follow</h4>
            <div className="flex gap-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-gold-border flex items-center justify-center text-cream/55 hover:text-gold hover:border-gold transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-cream/40 text-xs">info@secrethour.pk</p>
          </div>
        </div>

        <div className="border-t border-gold-border/25 pt-8 text-center">
          <p className="text-cream/25 text-xs tracking-[0.12em]">
            © 2026 Secret Hour · Discreet Packaging · Private Experience
          </p>
        </div>
      </footer>

    </div>
  );
}
