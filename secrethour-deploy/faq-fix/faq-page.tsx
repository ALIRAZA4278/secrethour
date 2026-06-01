// =============================================================
// FAQ PAGE FIX — app/info/faq/page.tsx
//
// PROBLEM: FAQ answers are hidden behind JS toggles.
//          Google and AI systems can only see the questions,
//          not the answers. This kills rich result eligibility.
//
// FIX: Use <details>/<summary> HTML — answers are always in
//      the DOM (visible to Googlebot), just visually collapsible.
//      Add FAQPage schema so answers appear in Google results.
// =============================================================

import type { Metadata } from 'next'
import { faqSchema, faqBreadcrumb } from '@/schema/schema-all-pages'

export const metadata: Metadata = {
  title: 'FAQ — Delivery, Returns & Couple Gifts | Secret Hour Pakistan',
  description: 'Answers to common questions about Secret Hour — discreet packaging, delivery times across Pakistan, payment options, returns, and whether our products are right for you.',
  alternates: { canonical: 'https://secrethour.pk/info/faq' },
  openGraph: {
    title: 'FAQ — Delivery, Returns & Couple Gifts | Secret Hour Pakistan',
    description: 'Everything you need to know about ordering from Secret Hour.',
    url: 'https://secrethour.pk/info/faq',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: 'Is the packaging discreet?',
    answer: 'Yes. All Secret Hour orders are shipped in plain, unmarked packaging with no external branding or indication of contents. The sender name on the waybill reads "Secret Hour" only — nothing else.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery across Pakistan typically takes 2–5 business days. Major cities like Karachi, Lahore, and Islamabad usually receive orders within 2–3 business days. Delivery is free on all orders.',
  },
  {
    question: 'What payment options are available?',
    answer: 'We accept Cash on Delivery (COD) across Pakistan, and online bank transfers. Paying via bank transfer gives you an additional 10% discount on your order.',
  },
  {
    question: 'What if I feel unsure before buying?',
    answer: 'Take our free Experience Quiz at secrethour.pk/quiz to find the best product for your situation in under a minute. You can also WhatsApp us directly and we will help you choose — no pressure.',
  },
  {
    question: 'Can I return a product?',
    answer: 'We accept returns within 7 days of delivery if the product is unopened and in original condition. Please contact us at info@secrethour.pk to initiate a return.',
  },
  {
    question: 'Is this suitable for newly married couples?',
    answer: 'Yes. The Midnight Deck and Bridal Box are especially popular as wedding night gifts and nikkah gifts in Pakistan. Our products are designed for married couples at every stage.',
  },
  {
    question: "What if we've been married for years?",
    answer: 'Secret Hour is for every stage of marriage. Many customers are long-married couples looking to reconnect and break out of routine. The Midnight Deck helps couples rediscover each other through conversation and play.',
  },
  {
    question: 'Do I need guidance to use the product?',
    answer: 'No guidance is needed. The Midnight Deck comes with clear instructions inside the box. All products are designed to be intuitive and easy to use from the moment you open them.',
  },
  {
    question: 'What if I need help or have questions?',
    answer: 'You can reach us via WhatsApp at https://wa.me/message/5QY6DQTFQQGEC1 or email us at info@secrethour.pk. We aim to respond within 24 hours.',
  },
  {
    question: 'How can I contact you?',
    answer: 'Email us at info@secrethour.pk, message us on WhatsApp, or use the contact form at secrethour.pk/contact. We are available 7 days a week.',
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Schema markup — makes answers appear in Google search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqBreadcrumb) }}
      />

      <main>
        <h1>Frequently Asked</h1>

        {/*
          KEY FIX: Use <details>/<summary> instead of JS accordion.
          Answers are ALWAYS rendered in the HTML — never hidden from Googlebot.
          The browser handles the expand/collapse natively with zero JS.
        */}
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <details key={i} open={i === 0}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <p>
          Still have questions?{' '}
          <a href="/contact">Contact us →</a>
        </p>
      </main>
    </>
  )
}

/*
CSS to style the details/summary (add to your global CSS or component):

details {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

details summary {
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::after {
  content: '+';
  font-size: 20px;
  font-weight: 300;
  flex-shrink: 0;
}

details[open] summary::after {
  content: '−';
}

details p {
  margin-top: 0.75rem;
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  padding-bottom: 0.5rem;
}
*/
