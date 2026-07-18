export const metadata = {
  title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
  description: 'Browse the full Secret Hour collection — The Midnight Deck couples card game, the Bridal Box, Midnight Glow Candle, and more. Free delivery across Pakistan.',
  openGraph: {
    title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
    description: 'Browse the full Secret Hour collection — couples card games, luxury candles, bridal boxes, and intimate sets. Free delivery across Pakistan.',
    url: 'https://www.secrethour.pk/shop',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Secret Hour product collection' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Couple Gifts Pakistan — Secret Hour Collection',
    description: 'The full Secret Hour collection. Free delivery across Pakistan.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.secrethour.pk/shop' },
};

export default function ShopLayout({ children }) {
  return children;
}
