export const metadata = {
  title: 'Track Your Order — Secret Hour',
  description: 'Check the live status of your Secret Hour delivery. Enter your Order ID to track in real time.',
  openGraph: {
    title: 'Track Your Order — Secret Hour',
    description: 'Check the live status of your Secret Hour delivery. Fast & discreet shipping across Pakistan.',
    url: 'https://secrethour.pk/track',
    type: 'website',
    images: [
      {
        url: 'https://secrethour.pk/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Track Secret Hour Order',
      }
    ],
  },
  alternates: { canonical: 'https://secrethour.pk/track' },
  robots: { index: false },
};

export default function TrackLayout({ children }) {
  return children;
}
