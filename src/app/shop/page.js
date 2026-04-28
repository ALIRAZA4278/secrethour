import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/products';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = 'https://secrethour.lovable.app/assets/bg-silk-B9_HjwKe.jpg';
const LOGO = 'https://secrethour.lovable.app/assets/logo-secret-hour-DN-hyC6c.png';

export const metadata = {
  title: 'Shop — Secret Hour',
  description: 'Quiet luxuries, made for the hours that belong only to the two of you.',
};

export default function ShopPage() {
  return (
    <div className="text-cream flex flex-col bg-sh-bg">

      <Navbar />

      {/* Main content with silk background */}
      <div className="relative flex-1" style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SILK} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 rotate-180 pointer-events-none z-0" loading="lazy" />

        {/* Header */}
        <section className="relative z-10 py-20 mt-16 text-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="Secret Hour"
            className="h-14 w-auto mx-auto mb-6 opacity-90 object-contain"
          />
          <h1 className="text-4xl md:text-5xl italic text-cream mb-3" style={serif}>
            The <span className="text-gold">Secret Hour</span> Collection
          </h1>
          <p className="text-cream/55 italic text-sm max-w-md mx-auto" style={serif}>
            Quiet luxuries, made for the hours that belong only to the two of you.
          </p>
        </section>

        {/* Products grid */}
        <section className="relative z-10 px-5 md:px-7 pb-24 pt-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 max-w-6xl mx-auto">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/product/${p.slug}`}
                className="rounded overflow-hidden group flex flex-col border border-gold-border/60 hover:border-gold transition-colors duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-sh-card">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-contain group-hover:scale-[1.03] transition-transform duration-700"
                    unoptimized
                  />
                </div>
                <div className="px-4 py-3 text-center space-y-1 flex-1 flex flex-col justify-between">
                  <p className="text-gold/70 text-[10px] uppercase tracking-[0.3em]">{p.category}</p>
                  <h2 className="text-sm md:text-base italic text-cream leading-snug line-clamp-2" style={serif}>
                    {p.title}
                  </h2>
                  <p className="text-gold text-base md:text-lg pt-1" style={serif}>{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
