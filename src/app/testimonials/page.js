import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = '/assets/bg-silk-B9_HjwKe.jpg';

export const metadata = {
  title: 'Testimonials — Secret Hour',
  description: 'Loved by couples like you. Whispered back to us — in confidence.',
};

const FEATURED = {
  quote: "Our wedding night felt sacred. We will never forget the way it began.",
  author: "Ayesha & Hamza",
};

const TESTIMONIALS = [
  { quote: "We laughed, we cried, we finally talked. Beautifully made.", author: "Anonymous, Lahore" },
  { quote: "It felt like a private little ritual just for us.", author: "Sara & Bilal" },
  { quote: "Discreet, elegant, and so romantic. Worth every rupee.", author: "Anonymous, Karachi" },
  { quote: "A gift I will give every newlywed couple I love.", author: "Mariam & Usman" },
];

const STATS = [
  {
    label: 'Deeper Bond',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    label: 'Playful & Tender',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    label: 'Premium Experience',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
];

export default function TestimonialsPage() {
  return (
    <div className="text-cream min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(40,12,18) 0%, rgb(9,8,7) 55%)' }}>
      <Navbar />

      <div className="relative flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SILK} alt="" className="absolute inset-0 w-full h-full object-cover opacity-8 rotate-180 pointer-events-none" />

        {/* Header */}
        <section className="relative z-10 pt-36 pb-12 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl italic text-cream" style={serif}>
              Loved by Couples Like You
            </h1>
            <p className="text-cream/55 italic text-base" style={serif}>
              Whispered back to us — in confidence.
            </p>
          </div>
        </section>

        {/* Featured testimonial */}
        <section className="relative z-10 px-6 pb-12">
          <div className="max-w-2xl mx-auto border border-gold-border p-10 md:p-14 text-center space-y-6" style={{ background: 'rgba(11,10,9,0.6)' }}>
            <div className="flex justify-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-gold text-xl">★</span>
              ))}
            </div>
            <div className="text-5xl text-gold/30 leading-none font-serif">&ldquo;</div>
            <p className="text-cream text-xl md:text-2xl italic leading-relaxed" style={serif}>
              {FEATURED.quote}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-gold-border" />
              <span className="text-gold text-sm italic" style={serif}>— {FEATURED.author}</span>
              <div className="h-px w-10 bg-gold-border" />
            </div>
          </div>
        </section>

        {/* Grid testimonials */}
        <section className="relative z-10 px-6 pb-16">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="border border-gold-border/60 p-8 space-y-5" style={{ background: 'rgba(11,10,9,0.5)' }}>
                <div className="text-3xl text-gold/30 leading-none font-serif">&ldquo;</div>
                <p className="text-cream/75 italic leading-relaxed text-sm" style={serif}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-gold-border" />
                  <p className="text-gold/70 text-[10px] uppercase tracking-[0.25em]">— {t.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="relative z-10 py-12 px-6 border-t border-gold-border/20">
          <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
            {STATS.map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                {icon}
                <span className="text-cream/70 italic text-sm" style={serif}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 pb-20 px-6 text-center">
          <Link
            href="/shop"
            className="inline-block border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.25em] px-12 py-4 btn-glow transition-all duration-300 hover:bg-burgundy"
          >
            Shop the Collection
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
