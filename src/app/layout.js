import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

const BASE_URL = 'https://secrethour.pk';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Secret Hour — Couple Gifts & Intimate Sets | Pakistan',
    template: '%s',
  },
  description:
    'Pakistan\'s first intimate gifting brand for married couples. Shop couples card games, scented candles, romantic sets & the Bridal Bundle. Discreet delivery nationwide.',
  keywords: ['couple gifts pakistan', 'wedding night gift pakistan', 'intimacy gifts pakistan', 'bridal box pakistan', 'card game for couples', 'midnight deck', 'secret hour'],
  authors: [{ name: 'Secret Hour', url: BASE_URL }],
  creator: 'Secret Hour',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: BASE_URL,
    siteName: 'Secret Hour',
    title: 'Couple Gifts in Pakistan — Card Games, Candles & Intimate Sets',
    description: 'Quiet luxuries for married couples in Pakistan. The Midnight Deck card game, luxury candles, and intimate gift sets. Free delivery nationwide. Discreet packaging.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Secret Hour — couple gifts laid out on a dark silk surface' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Couple Gifts in Pakistan — Card Games, Candles & Intimate Sets',
    description: 'Quiet luxuries for married couples in Pakistan. Free delivery. Discreet packaging.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Organization schema — all pages */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Secret Hour",
          "url": "https://secrethour.pk",
          "logo": "https://secrethour.pk/logo.png",
          "description": "Quietly luxurious gifts crafted for married couples in Pakistan — card games, candles, and intimate sets to slow down, come closer, and reconnect.",
          "foundingLocation": { "@type": "Place", "name": "Pakistan" },
          "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "email": "info@secrethour.pk", "availableLanguage": ["English", "Urdu"] },
          "sameAs": ["https://www.instagram.com/secrethour.pk", "https://www.facebook.com/people/Secret-Hour/61585460425456/"],
          "areaServed": { "@type": "Country", "name": "Pakistan" }
        }) }} />
        {/* Website schema — homepage sitelinks */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Secret Hour",
          "url": "https://secrethour.pk",
          "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://secrethour.pk/shop?q={search_term_string}" }, "query-input": "required name=search_term_string" }
        }) }} />
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KDWZNSR8');
        `}</Script>

        {/* Google Analytics — G-E08ZDX9KFY */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-E08ZDX9KFY" strategy="afterInteractive" />
        <Script id="gtag-1" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E08ZDX9KFY');
        `}</Script>

        {/* Google Analytics — G-E52568V4BP */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-E52568V4BP" strategy="afterInteractive" />
        <Script id="gtag-2" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E52568V4BP');
        `}</Script>

      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* GTM noscript fallback */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KDWZNSR8" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
