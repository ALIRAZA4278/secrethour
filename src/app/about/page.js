import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export const metadata = {
  title: 'About — Secret Hour',
  description: 'Secret Hour was born from a quiet realization — that even the strongest marriages can fall into routine.',
};

const VALUES = [
  { title: 'Privacy',    desc: 'What happens in your Secret Hour stays there. Always.' },
  { title: 'Intention',  desc: 'Every card is designed with purpose and emotional depth.' },
  { title: 'Connection', desc: "We exist to bring people closer. That's it." },
];

export default function AboutPage() {
  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <Navbar />

      {/* Header — pt-[160px] matches original */}
      <section className="pt-[160px] pb-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-2">The Brand</p>
          <h1 className="text-[48px] font-light text-cream" style={serif}>Secret Hour</h1>
        </div>
      </section>

      {/* Content sections */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-16">

          {/* Our Story */}
          <div className="space-y-4">
            <h2 className="text-2xl text-cream" style={serif}>Our Story</h2>
            <div className="h-px w-12 bg-gold-border" />
            <p className="text-[16px] leading-[26px] mt-6" style={{ color: 'rgb(147,133,108)' }}>
              Secret Hour was born from a quiet realization — that even the strongest marriages can fall into routine. Not because love fades, but because life gets loud.
            </p>
            <p className="text-[16px] leading-[26px]" style={{ color: 'rgb(147,133,108)' }}>
              We created something intentional. Something that asks couples to pause, look at each other, and remember why they chose this life together. No screens. No distractions. Just two people and a deck of cards that knows how to ask the right questions.
            </p>
          </div>

          {/* Why We Exist */}
          <div className="space-y-4">
            <h2 className="text-2xl text-cream" style={serif}>Why We Exist</h2>
            <div className="h-px w-12 bg-gold-border" />
            <p className="text-[16px] leading-[26px] mt-6" style={{ color: 'rgb(147,133,108)' }}>
              Marriage is the most important relationship you&apos;ll ever have — yet it&apos;s the one most often neglected. We believe that with the right prompts, the right setting, and the right intention, any couple can rediscover the depth that first brought them together.
            </p>
          </div>

          {/* Our Values */}
          <div className="space-y-4">
            <h2 className="text-2xl text-cream" style={serif}>Our Values</h2>
            <div className="h-px w-12 bg-gold-border" />
            <div className="grid sm:grid-cols-3 gap-8 pt-4">
              {VALUES.map((v) => (
                <div key={v.title} className="space-y-3">
                  <h3 className="text-[18px] font-normal text-gold" style={serif}>{v.title}</h3>
                  <div className="h-px w-8 bg-gold-border/50" />
                  <p className="text-[16px] leading-[26px]" style={{ color: 'rgb(147,133,108)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
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
