// =============================================================
// NEXT.JS METADATA FIXES FOR SECRETHOUR.PK
// Your site is built on Next.js (confirmed via meta-next-size-adjust).
// Next.js has a built-in Metadata API — use it instead of manual
// <head> tags. This works with both App Router and Pages Router.
// =============================================================


// =============================================================
// OPTION A — APP ROUTER (if your /app folder exists)
// File: app/layout.tsx  (root layout — applies to ALL pages)
// =============================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://secrethour.pk'),
  authors: [{ name: 'Secret Hour' }],
  creator: 'Secret Hour',
  robots: { index: true, follow: true },
  openGraph: {
    siteName: 'Secret Hour',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

// Then in each individual page file, export its own metadata:


// =============================================================
// app/page.tsx — HOMEPAGE metadata
// =============================================================

export const metadata: Metadata = {
  title: 'Couple Gifts in Pakistan — Card Games, Candles & Intimate Sets | Secret Hour',
  description: 'Secret Hour makes quiet luxuries for married couples in Pakistan — a couples card game, luxury candles, and intimate gift sets. Free delivery. Discreet packaging.',
  alternates: { canonical: 'https://secrethour.pk/' },
  openGraph: {
    title: 'Couple Gifts in Pakistan — Card Games, Candles & Intimate Sets',
    description: 'Quiet luxuries for married couples in Pakistan. The Midnight Deck card game, luxury candles, and intimate gift sets. Free delivery nationwide. Discreet packaging.',
    url: 'https://secrethour.pk/',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Secret Hour — couple gifts laid out on a dark silk surface',
    }],
  },
  twitter: {
    title: 'Couple Gifts in Pakistan — Card Games, Candles & Intimate Sets',
    description: 'Quiet luxuries for married couples in Pakistan. Free delivery. Discreet packaging.',
    images: ['/og-image.jpg'],
  },
}


// =============================================================
// app/shop/page.tsx — SHOP PAGE metadata
// =============================================================

export const metadata: Metadata = {
  title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
  description: 'Browse The Midnight Deck couples card game, Midnight Glow Candle, Silk Bond, and more. Free delivery across Pakistan. Discreet packaging on every order.',
  alternates: { canonical: 'https://secrethour.pk/shop' },
  openGraph: {
    title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
    description: 'Browse the full Secret Hour collection — couples card games, candles, and intimate gift sets. Free delivery across Pakistan.',
    url: 'https://secrethour.pk/shop',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
    description: 'The full Secret Hour collection. Free delivery across Pakistan.',
    images: ['/og-image.jpg'],
  },
}


// =============================================================
// app/product/[slug]/page.tsx — PRODUCT PAGES metadata
// Dynamic metadata using generateMetadata()
// This generates unique metadata per product automatically.
// =============================================================

import type { Metadata } from 'next'

const productMeta: Record<string, { title: string; description: string; image: string; price: string }> = {
  'the-midnight-deck': {
    title: 'The Midnight Deck — Couples Card Game in Pakistan | Secret Hour',
    description: 'The Midnight Deck is a couples card game with playful dares and deep questions — for married couples in Pakistan. Rs. 2,999. Free delivery. Discreet packaging.',
    image: '/assets/sh-card-game-Cw972EQC.png',
    price: '2999',
  },
  'bridal-box': {
    title: 'Bridal Box — Luxury Wedding Night Gift in Pakistan | Secret Hour',
    description: 'A curated luxury gift set for newly married couples. Perfect as a wedding night or nikkah gift in Pakistan. Free delivery. Discreet packaging.',
    image: '/og-image.jpg',
    price: '4999',
  },
  'intimate-night-set': {
    title: 'Intimate Night Set — Couple Gift in Pakistan | Secret Hour',
    description: 'A complete intimate set for married couples in Pakistan by Secret Hour. Free delivery. Discreet packaging on every order.',
    image: '/og-image.jpg',
    price: '3499',
  },
  'midnight-glow-candle': {
    title: 'Midnight Glow Candle — Luxury Couple Candle in Pakistan | Secret Hour',
    description: 'Set the mood for intimate evenings. The Midnight Glow Candle is a luxury scented candle for married couples. Rs. 1,499. Free delivery across Pakistan.',
    image: '/og-image.jpg',
    price: '1499',
  },
  'silk-bond': {
    title: 'Silk Bond — Intimate Set for Couples in Pakistan | Secret Hour',
    description: 'A thoughtful intimate set for married couples in Pakistan by Secret Hour. Rs. 999. Free delivery. Discreet packaging.',
    image: '/og-image.jpg',
    price: '999',
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = productMeta[params.slug] ?? {
    title: 'Product | Secret Hour Pakistan',
    description: 'Quiet luxuries for married couples in Pakistan.',
    image: '/og-image.jpg',
    price: '',
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://secrethour.pk/product/${params.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://secrethour.pk/product/${params.slug}`,
      type: 'website',
      images: [{ url: meta.image, width: 1200, height: 630 }],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  }
}


// =============================================================
// app/about/page.tsx — ABOUT PAGE metadata
// =============================================================

export const metadata: Metadata = {
  title: 'About Secret Hour — Quiet Luxuries for Married Couples in Pakistan',
  description: 'Secret Hour was born from a belief that married couples deserve beautiful rituals. We make quiet luxuries for couples in Pakistan — designed to slow down and reconnect.',
  alternates: { canonical: 'https://secrethour.pk/about' },
  openGraph: {
    title: 'About Secret Hour — Quiet Luxuries for Married Couples in Pakistan',
    description: 'Secret Hour was born from a belief that married couples deserve beautiful rituals.',
    url: 'https://secrethour.pk/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'About Secret Hour — Quiet Luxuries for Married Couples in Pakistan',
    description: 'We make quiet luxuries for couples in Pakistan — designed to slow down and reconnect.',
    images: ['/og-image.jpg'],
  },
}


// =============================================================
// app/info/faq/page.tsx — FAQ PAGE metadata
// =============================================================

export const metadata: Metadata = {
  title: 'FAQ — Delivery, Returns & Couple Gifts | Secret Hour Pakistan',
  description: 'Answers to common questions about Secret Hour — discreet packaging, delivery times across Pakistan, payment options, returns, and whether our products are right for you.',
  alternates: { canonical: 'https://secrethour.pk/info/faq' },
  openGraph: {
    title: 'FAQ — Delivery, Returns & Couple Gifts | Secret Hour Pakistan',
    description: 'Everything you need to know about ordering from Secret Hour — packaging, delivery, payment, and returns.',
    url: 'https://secrethour.pk/info/faq',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}


// =============================================================
// app/testimonials/page.tsx — TESTIMONIALS PAGE metadata
// =============================================================

export const metadata: Metadata = {
  title: 'What Couples Say — Secret Hour Reviews Pakistan',
  description: 'Read reviews from married couples across Pakistan who use Secret Hour products. See how The Midnight Deck and our gift sets have transformed their evenings.',
  alternates: { canonical: 'https://secrethour.pk/testimonials' },
  openGraph: {
    title: 'What Couples Say — Secret Hour Reviews Pakistan',
    description: 'Real reviews from married couples across Pakistan.',
    url: 'https://secrethour.pk/testimonials',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}


// =============================================================
// OPTION B — PAGES ROUTER (if your /pages folder exists)
// Use next/head in each page component instead.
// =============================================================

import Head from 'next/head'

// Example: pages/shop.tsx
export default function ShopPage() {
  return (
    <>
      <Head>
        <title>Shop Couple Gifts Pakistan — Secret Hour Collection</title>
        <meta name="description" content="Browse The Midnight Deck couples card game, Midnight Glow Candle, Silk Bond, and more. Free delivery across Pakistan. Discreet packaging on every order." />
        <link rel="canonical" href="https://secrethour.pk/shop" />
        <meta property="og:title" content="Shop Couple Gifts Pakistan — Secret Hour Collection" />
        <meta property="og:description" content="Browse the full Secret Hour collection. Free delivery across Pakistan." />
        <meta property="og:url" content="https://secrethour.pk/shop" />
        <meta property="og:image" content="https://secrethour.pk/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop Couple Gifts Pakistan — Secret Hour Collection" />
        <meta name="twitter:image" content="https://secrethour.pk/og-image.jpg" />
      </Head>
      {/* your page content */}
    </>
  )
}
