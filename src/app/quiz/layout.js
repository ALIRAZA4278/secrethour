export const metadata = {
  title: 'Discover Your Perfect Couple Gift — Connection Quiz | Secret Hour',
  description: 'Discover your perfect Secret Hour experience in less than a minute. A short quiz for married couples in Pakistan to find the right card game, candle, or gift set.',
  openGraph: {
    title: 'Discover Your Perfect Couple Gift — Connection Quiz',
    description: 'Discover which Secret Hour experience is perfect for your relationship — in under a minute.',
    url: 'https://secrethour.pk/quiz',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Perfect Couple Gift — Connection Quiz',
    description: 'Find the right Secret Hour experience for your relationship stage.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://secrethour.pk/quiz' },
};

export default function QuizLayout({ children }) {
  return children;
}
