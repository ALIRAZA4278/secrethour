// =============================================================
// SHOP PAGE CONTENT FIX — app/shop/page.tsx
//
// PROBLEM: /shop has no crawlable category description.
//          Google sees only a heading and product names.
//          Nothing to rank for beyond the brand name.
//
// FIX: Add a 2-3 sentence intro above the product grid.
//      This targets keywords: "couple gifts Pakistan",
//      "wedding night gift", "card game for couples".
// =============================================================

import type { Metadata } from 'next'

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

export default function ShopPage() {
  return (
    <main>
      {/* Shop header — visible to Google, contains target keywords */}
      <section className="shop-intro">
        <h1>The Secret Hour Collection</h1>

        {/*
          ADD THIS PARAGRAPH — this is what's missing.
          It gives Google keywords and context to rank this page.
          Place it directly below the H1, above the product grid.
        */}
        <p>
          Secret Hour makes quiet luxuries for married couples across Pakistan —
          thoughtfully designed to help you slow down, reconnect, and create rituals
          that belong only to you. Whether you are looking for a{' '}
          <strong>wedding night gift</strong>, a <strong>couples card game</strong>,
          or something for an anniversary, you will find it here. Every order ships
          free across Pakistan in discreet, unmarked packaging.
        </p>
      </section>

      {/* Your existing product grid below — no changes needed */}
      {/* <ProductGrid /> */}
    </main>
  )
}
