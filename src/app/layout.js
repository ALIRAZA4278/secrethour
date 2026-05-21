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
    default: 'Secret Hour — Quiet Luxuries for Married Couples',
    template: '%s | Secret Hour',
  },
  description:
    'Quietly luxurious gifts crafted for married couples in Pakistan — card games, candles, and intimate sets to slow down, come closer, and reconnect.',
  keywords: ['couple gifts pakistan', 'wedding night gift', 'intimacy gifts', 'bridal box pakistan', 'secret hour', 'card game for couples', 'midnight deck'],
  authors: [{ name: 'Secret Hour', url: BASE_URL }],
  creator: 'Secret Hour',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: BASE_URL,
    siteName: 'Secret Hour',
    title: 'Secret Hour — Quiet Luxuries for Married Couples',
    description: 'Quietly luxurious gifts crafted for married couples in Pakistan — card games, candles, and intimate sets to slow down, come closer, and reconnect.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Secret Hour' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secret Hour — Quiet Luxuries for Married Couples',
    description: 'Quietly luxurious gifts crafted for married couples in Pakistan.',
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

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2181372859353301');
          fbq('track', 'PageView');
        `}</Script>
        <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2181372859353301&ev=PageView&noscript=1" />` }} />
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
