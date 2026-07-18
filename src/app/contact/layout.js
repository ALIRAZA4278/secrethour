export const metadata = {
  title: 'Contact Secret Hour — Get in Touch | Pakistan',
  description: 'Have a question about your order or want to know which Secret Hour product is right for you? Reach us via email, WhatsApp, or our contact form. We reply within 24 hours.',
  openGraph: {
    title: 'Contact Secret Hour — Get in Touch',
    description: 'Get in touch with Secret Hour for orders, gifting advice, or support. We reply within 24 hours.',
    url: 'https://www.secrethour.pk/contact',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.secrethour.pk/contact' },
};

export default function ContactLayout({ children }) {
  return children;
}
