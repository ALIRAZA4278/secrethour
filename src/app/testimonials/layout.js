export const metadata = {
  title: 'What Couples Say — Secret Hour Reviews Pakistan',
  description: 'Read real reviews from married couples across Pakistan who have used Secret Hour products. See how The Midnight Deck and our gift sets have transformed their evenings.',
  openGraph: {
    title: 'What Couples Say — Secret Hour Reviews Pakistan',
    description: 'Real reviews from married couples across Pakistan who use Secret Hour. See why couples love The Midnight Deck and our intimate gift sets.',
    url: 'https://secrethour.pk/testimonials',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Couples Say — Secret Hour Reviews Pakistan',
    description: 'Real reviews from couples across Pakistan.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://secrethour.pk/testimonials' },
};

export default function TestimonialsLayout({ children }) {
  return children;
}
