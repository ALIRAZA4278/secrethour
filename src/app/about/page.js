import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const SILK = 'https://secrethour.lovable.app/assets/bg-silk-B9_HjwKe.jpg';

export const metadata = {
  title: 'About — Secret Hour',
  description: 'Secret Hour was born from a quiet realization — that even the strongest marriages can fall into routine.',
};

const VALUES = [
  {
    title: 'Privacy',
    desc: 'What happens in your Secret Hour stays there. Always.',
  },
  {
    title: 'Intention',
    desc: 'Every card is designed with purpose and emotional depth.',
  },
  {
    title: 'Connection',
    desc: 'We exist to bring people closer. That\'s it.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-gold text-[10px] uppercase tracking-[0.3em]">The Brand</span>
          <h1 className="text-5xl md:text-6xl text-cream" style={serif}>Secret Hour</h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-8 pointer-events-none">
          <Image src={SILK} alt="" fill className="object-cover" unoptimized />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl italic text-cream" style={serif}>Our Story</h2>
            <div className="h-px w-12 bg-gold-border" />
            <p className="text-cream/70 leading-relaxed">
              Secret Hour was born from a quiet realization — that even the strongest marriages can fall into routine. Not because love fades, but because life gets loud.
            </p>
            <p className="text-cream/70 leading-relaxed">
              We created something intentional. Something that asks couples to pause, look at each other, and remember why they chose this life together. No screens. No distractions. Just two people and a deck of cards that knows how to ask the right questions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl italic text-cream" style={serif}>Why We Exist</h2>
            <div className="h-px w-12 bg-gold-border" />
            <p className="text-cream/70 leading-relaxed">
              Marriage is the most important relationship you&apos;ll ever have — yet it&apos;s the one most often neglected. We believe that with the right prompts, the right setting, and the right intention, any couple can rediscover the depth that first brought them together.
            </p>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <h2 className="text-3xl italic text-cream" style={serif}>Our Values</h2>
            <div className="h-px w-12 bg-gold-border" />
            <div className="grid sm:grid-cols-3 gap-6 pt-2">
              {VALUES.map((v) => (
                <div key={v.title} className="space-y-3">
                  <h3 className="text-gold text-base italic" style={serif}>{v.title}</h3>
                  <div className="h-px w-8 bg-gold-border/50" />
                  <p className="text-cream/60 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 text-center"
            >
              Explore the Collection
            </Link>
            <Link
              href="/contact"
              className="border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 text-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
