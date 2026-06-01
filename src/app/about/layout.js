export const metadata = {
  title: 'About Secret Hour — Quiet Luxuries for Married Couples in Pakistan',
  description: 'Secret Hour was born from a belief that married couples deserve beautiful rituals. We make quiet luxuries for couples in Pakistan — designed to slow down and reconnect.',
  openGraph: {
    title: 'About Secret Hour — Quiet Luxuries for Married Couples in Pakistan',
    description: 'Secret Hour was born from a belief that married couples deserve beautiful rituals. We make quiet luxuries for couples — designed to slow down and reconnect.',
    url: 'https://secrethour.pk/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://secrethour.pk/about' },
};

export default function AboutLayout({ children }) {
  return children;
}
