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

const FAQ_ITEMS = [
  {
    q: 'Is the packaging discreet?',
    a: 'Yes. All orders are delivered in plain packaging with no product details visible from the outside. No brand name, no description — just your delivery.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Processing takes 1–2 business days. Delivery across Pakistan typically takes 3–5 business days after dispatch.',
  },
  {
    q: 'What payment options are available?',
    a: 'We offer Cash on Delivery (COD) and Bank Transfer. Pay online via bank transfer and receive a 10% discount on your order.',
  },
  {
    q: 'What if I feel unsure before buying?',
    a: 'Take our Connection Quiz — it helps you find the right product for where you and your partner are right now. You can also reach us anytime via WhatsApp.',
  },
  {
    q: 'Can I return a product?',
    a: 'Returns are accepted only for damaged or incorrect items, reported within 48 hours of delivery. Items must be unused and in original packaging.',
  },
  {
    q: 'Is this suitable for newly married couples?',
    a: 'Absolutely. Secret Hour is crafted especially to help couples ease in, build comfort, and connect at their own pace — no awkwardness, no pressure.',
  },
  {
    q: "What if we've been married for years?",
    a: "Perfect. Our products are designed to bring back depth and presence, no matter how long you've been together. Many couples use them to break out of routine.",
  },
  {
    q: 'Do I need guidance to use the product?',
    a: 'No instructions needed. Everything is intuitive — just open the box together and let the evening find its own rhythm.',
  },
  {
    q: 'What if I need help or have questions?',
    a: 'Reach us on WhatsApp or through our contact page. We respond personally and promptly.',
  },
  {
    q: 'How can I contact you?',
    a: 'Via WhatsApp at the number on our contact page, or through the contact form at secrethour.pk/contact. We usually respond within a few hours.',
  },
];

export function generateStaticParams() {
  return [...Object.keys(POLICIES), 'faq', 'referral'].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === 'faq')      return { title: 'FAQ — Secret Hour' };
  if (slug === 'referral') return { title: 'Share & Earn — Secret Hour' };
  const policy = POLICIES[slug];
  if (!policy) return {};
  return { title: `${policy.title} — Secret Hour` };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;

  /* ── FAQ ── */
  if (slug === 'faq') {
    return (
      <div className="text-cream min-h-screen flex flex-col"
        style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
        <Navbar />
        <main className="flex-1 pt-10 pb-24 px-6">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">Secret Hour</p>
            <h1 className="text-3xl md:text-5xl italic text-gold" style={serif}>Frequently Asked</h1>
          </div>
          <div className="max-w-2xl mx-auto border border-gold-border/50 px-8 md:px-12 py-4 divide-y divide-gold-border/20"
            style={{ background: 'rgba(11,10,9,0.6)' }}>
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group py-1">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-left gap-4">
                  <span className="italic text-cream text-base md:text-lg leading-snug" style={serif}>
                    {item.q}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                    className="text-gold shrink-0 transition-transform duration-300 group-open:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="pb-5 text-cream/65 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href="/contact"
              className="text-gold-muted text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">
              Still have questions? Contact us →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Referral ── */
  if (slug === 'referral') {
    return (
      <div className="text-cream min-h-screen flex flex-col"
        style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
        <Navbar />
        <main className="flex-1 pt-10 pb-24 px-6">
          <div className="text-center mb-12">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">Secret Hour</p>
            <h1 className="text-2xl md:text-4xl italic text-gold leading-tight" style={serif}>
              Share the Experience,<br className="hidden sm:block" /> Get Rewarded
            </h1>
          </div>

          <div className="max-w-2xl mx-auto border border-gold-border/50 p-8 md:p-12 space-y-8"
            style={{ background: 'rgba(11,10,9,0.6)' }}>

            <p className="italic text-cream/80 text-sm md:text-base leading-relaxed" style={serif}>
              Loved your Secret Hour? Share it — and we&apos;ll thank you back.
            </p>

            <div className="space-y-5">
              <h2 className="text-xl italic text-gold" style={serif}>How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-gold/60 text-xs font-medium mt-0.5 shrink-0">1.</span>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    Record a video review and send it to us via{' '}
                    <a href="https://wa.me/message/5QY6DQTFQQGEC1" target="_blank" rel="noopener noreferrer"
                      className="text-gold hover:text-gold-light underline transition-colors">WhatsApp</a>
                    {' '}or{' '}
                    <a href="/contact" className="text-gold hover:text-gold-light underline transition-colors">Email</a>.
                  </p>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-gold-border/30" />
                  <span className="text-cream/35 text-xs italic" style={serif}>— or —</span>
                  <div className="h-px flex-1 bg-gold-border/30" />
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-gold/60 text-xs font-medium mt-0.5 shrink-0">2.</span>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    Post your experience on Instagram and tag + collaborate with us at{' '}
                    <a href="https://www.instagram.com/secrethour.pk?igsh=cHhsYnMwamFvcXpk"
                      target="_blank" rel="noopener noreferrer"
                      className="text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      @secrethour.pk
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gold-border/30 pt-7 space-y-2">
              <h2 className="text-xl italic text-gold" style={serif}>Your reward</h2>
              <p className="text-cream/70 text-sm leading-relaxed">
                Get <span className="text-gold font-bold text-base">25% OFF</span> on your next order.
              </p>
              <p className="text-cream/40 text-xs">
                We will send you a personal promo code once we verify your post or video.
              </p>
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/contact"
              className="text-gold-muted text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">
              Still have questions? Contact us →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Policy pages ── */
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="text-cream min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="text-center mb-12">
          <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">Secret Hour</p>
          <h1 className="text-3xl md:text-5xl italic text-gold" style={serif}>{policy.title}</h1>
        </div>
        <div className="max-w-2xl mx-auto border border-gold-border/50 p-8 md:p-12 space-y-4"
          style={{ background: 'rgba(11,10,9,0.6)' }}>
          {policy.content.map((item, i) => {
            if (item.heading) {
              return <h2 key={i} className="text-xl italic text-gold pt-2" style={serif}>{item.heading}</h2>;
            }
            return (
              <p key={i} className={`text-sm leading-relaxed ${item.italic ? 'italic text-cream/90' : 'text-cream/70'}`}
                style={item.italic ? serif : undefined}>
                {item.text}
              </p>
            );
          })}
        </div>
        <div className="text-center mt-14">
          <Link href="/contact"
            className="text-gold-muted text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">
            Still have questions? Contact us →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
