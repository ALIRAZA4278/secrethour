export const metadata = {
  title: "About Secret Hour — Pakistan's First Intimate Gifting Brand",
  description: "Secret Hour is Pakistan's first brand built exclusively for married couples. Learn our story, our mission, and why thousands of couples across Pakistan trust us.",
  openGraph: {
    title: "About Secret Hour — Pakistan's First Intimate Gifting Brand",
    description: "Secret Hour is Pakistan's first brand built exclusively for married couples. Learn our story, our mission, and why thousands of couples across Pakistan trust us.",
    url: 'https://www.secrethour.pk/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.secrethour.pk/about' },
};

export default function AboutLayout({ children }) {
  return children;
}
