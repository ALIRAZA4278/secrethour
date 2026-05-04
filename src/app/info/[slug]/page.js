import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    content: [
      { text: 'Delivery across Pakistan.', normal: true },
      { text: 'Processing: 1–2 days.', normal: true },
      { text: 'Delivery: 3–5 days.', normal: true },
      { text: 'All packaging is discreet.', normal: true },
    ],
  },
  refund: {
    title: 'Refund Policy',
    content: [
      { text: 'Due to the nature of our products, we do not offer refunds on opened items.', italic: true },
      { text: 'If you receive a damaged or incorrect product, contact us within 48 hours.' },
      { text: 'Eligible cases may receive replacement or store credit.' },
    ],
  },
  returns: {
    title: 'Return & Exchange Policy',
    content: [
      { text: 'Returns accepted only for damaged or incorrect items.' },
      { text: 'Items must be unused and reported within 48 hours.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    content: [
      { text: 'We respect your privacy and are committed to protecting your personal information.', italic: true },
      { text: 'At Secret Hour, all customer data is handled with strict confidentiality. Your information is only used to process your order and improve your experience.' },
      { text: 'We do not share or sell your data.' },
      { text: 'All orders are shipped in discreet packaging to protect your privacy.' },
      { text: 'We may occasionally send you updates about new products, exclusive offers, or experiences via email or WhatsApp. You can opt out at any time.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    content: [
      { text: 'By using this website, you agree to our terms.', italic: true },
      { text: 'All products, designs, and content belong to Secret Hour and are protected.' },
      { text: 'We may update pricing and policies anytime.' },
      { text: 'Orders are subject to availability and confirmation.' },
      { heading: 'Product Usage & Resale Restriction' },
      { text: 'All products sold under Secret Hour are licensed for personal use only.' },
      { text: 'Resale, redistribution, or commercial use of any product is strictly prohibited. These products may only be sold through the official Secret Hour website or authorized channels.' },
      { text: 'Any unauthorized resale may result in legal action.' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const policy = POLICIES[params.slug];
  if (!policy) return {};
  return {
    title: `${policy.title} — Secret Hour`,
  };
}

export default function PolicyPage({ params }) {
  const policy = POLICIES[params.slug];
  if (!policy) notFound();

  return (
    <div
      className="text-cream min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}
    >
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">Secret Hour</p>
          <h1 className="text-5xl md:text-6xl italic text-gold" style={serif}>
            {policy.title}
          </h1>
        </div>

        {/* Content card */}
        <div
          className="max-w-2xl mx-auto border border-gold-border/50 p-8 md:p-12 space-y-4"
          style={{ background: 'rgba(11,10,9,0.6)' }}
        >
          {policy.content.map((item, i) => {
            if (item.heading) {
              return (
                <h2
                  key={i}
                  className="text-xl italic text-gold pt-2"
                  style={serif}
                >
                  {item.heading}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className={`text-sm leading-relaxed ${item.italic ? 'italic text-cream/90' : 'text-cream/70'}`}
                style={item.italic ? serif : undefined}
              >
                {item.text}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/contact"
            className="text-gold-muted text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors"
          >
            Still have questions? Contact us →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
