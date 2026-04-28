import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

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
  { quote: "A gift I will give every newlywed couple I love.", author: "Anonymous, Islamabad" },
  { quote: "The card game pulled us out of routine. We've never talked like this before.", author: "Anonymous" },
  { quote: "Beautifully made. It feels like a gift you'd buy for someone you really love.", author: "Anonymous" },
  { quote: "The bridal box made our wedding night unforgettable. Truly magical.", author: "Fatima & Omar" },
  { quote: "I didn't expect to cry. The cards asked the right questions.", author: "Anonymous, Rawalpindi" },
];

export default function TestimonialsPage() {
  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
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
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto border border-gold-border p-10 md:p-14 text-center space-y-6">
          <div className="flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gold text-xl">★</span>
            ))}
          </div>
          <div className="text-4xl text-gold/40 leading-none" style={serif}>&ldquo;</div>
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
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="border border-gold-border p-8 space-y-5">
              <div className="text-2xl text-gold/40 leading-none" style={serif}>&ldquo;</div>
              <p className="text-cream/75 italic leading-relaxed text-sm" style={serif}>
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-gold-border" />
                <p className="text-gold-muted text-[10px] uppercase tracking-[0.25em]">— {t.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
