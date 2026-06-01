const PAGE_META = {
  faq: {
    title: 'FAQ — Couple Gifts, Delivery & Returns | Secret Hour Pakistan',
    description: 'Answers to common questions about Secret Hour — discreet packaging, delivery times across Pakistan, payment options, returns, and whether our products are right for you.',
  },
  shipping: {
    title: 'Shipping Policy — Free Delivery Across Pakistan | Secret Hour',
    description: 'Secret Hour offers free delivery across all of Pakistan. Orders typically arrive in 2–5 business days. Learn about our shipping process and dispatch times.',
  },
  refund: {
    title: 'Refund Policy | Secret Hour Pakistan',
    description: 'Secret Hour\'s refund policy — how to request a refund, eligibility criteria, and what to expect. We aim to make every order right.',
  },
  returns: {
    title: 'Returns & Exchanges | Secret Hour Pakistan',
    description: 'Return or exchange a Secret Hour product within 7 days of delivery if unopened. Contact info@secrethour.pk to start a return.',
  },
  privacy: {
    title: 'Privacy Policy | Secret Hour Pakistan',
    description: 'How Secret Hour collects, uses, and protects your personal information. Your privacy and discretion are our top priorities.',
  },
  terms: {
    title: 'Terms & Conditions | Secret Hour Pakistan',
    description: 'Secret Hour terms and conditions — your rights, our responsibilities, and how we operate as a brand.',
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is the packaging discreet?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All Secret Hour orders are shipped in plain, unmarked packaging with no external branding or indication of contents. The sender name on the waybill reads 'Secret Hour' only — nothing else." } },
    { "@type": "Question", "name": "How long does delivery take?", "acceptedAnswer": { "@type": "Answer", "text": "Delivery across Pakistan typically takes 2–5 business days. Major cities like Karachi, Lahore, and Islamabad usually receive orders within 2–3 business days. We offer free delivery across Pakistan on all orders." } },
    { "@type": "Question", "name": "What payment options are available?", "acceptedAnswer": { "@type": "Answer", "text": "We accept Cash on Delivery (COD) across Pakistan, and online bank transfers. Paying via bank transfer gives you an additional 10% discount on your order." } },
    { "@type": "Question", "name": "Is Secret Hour suitable for newly married couples?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Secret Hour products are designed specifically with married couples in mind — including those recently wed. The Midnight Deck and Bridal Box are especially popular as wedding night gifts and nikkah gifts in Pakistan." } },
    { "@type": "Question", "name": "Can I return a product?", "acceptedAnswer": { "@type": "Answer", "text": "We accept returns within 7 days of delivery if the product is unopened and in original condition. Please contact us at info@secrethour.pk to initiate a return." } },
    { "@type": "Question", "name": "Is Secret Hour available across all of Pakistan?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We ship to all cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and beyond. Delivery is always free." } },
  ]
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = PAGE_META[slug] || { title: 'Secret Hour', description: 'Quiet luxuries for married couples in Pakistan.' };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://secrethour.pk/info/${slug}` },
    openGraph: { title: meta.title, description: meta.description, url: `https://secrethour.pk/info/${slug}` },
  };
}

export default async function InfoLayout({ children, params }) {
  const { slug } = await params;
  const isFaq = slug === 'faq';

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://secrethour.pk/" },
      { "@type": "ListItem", "position": 2, "name": PAGE_META[slug]?.title?.split(' —')[0] || slug.toUpperCase(), "item": `https://secrethour.pk/info/${slug}` }
    ]
  };

  return (
    <>
      {isFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
