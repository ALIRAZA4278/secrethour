import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getServerSupabase } from '../../lib/supabase-server';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = '/assets/bg-silk-B9_HjwKe.jpg';
const LOGO = '/assets/logo-secret-hour-DN-hyC6c.png';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop — Secret Hour',
  description: 'Quiet luxuries, made for the hours that belong only to the two of you.',
};

export default async function ShopPage() {
  let products = [];
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from('products')
      .select('slug, title, category, img, price')
      .order('created_at');
    if (data) products = data;
  } catch {
    // Supabase unavailable — show empty state
  }

  return (
    <div className="text-cream flex flex-col bg-sh-bg">
      <Navbar />

      <div className="relative flex-1" style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SILK} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 rotate-180 pointer-events-none z-0" loading="lazy" />

        {/* Header */}
        <section className="relative z-10 py-12 md:py-20 mt-[88px] text-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Secret Hour" className="h-14 w-auto mx-auto mb-6 opacity-90 object-contain" />
          <h1 className="text-4xl md:text-5xl italic text-cream mb-3" style={serif}>
            The <span className="text-gold">Secret Hour</span> Collection
          </h1>
          <p className="text-cream/55 italic text-sm max-w-md mx-auto" style={serif}>
            Quiet luxuries, made for the hours that belong only to the two of you.
          </p>
        </section>

        {/* Products grid */}
        <section className="relative z-10 px-5 md:px-7 pb-24 pt-8">
          {products.length === 0 ? (
            <p className="text-center text-cream/40 italic py-20" style={serif}>No products available yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 max-w-6xl mx-auto">
              {products.map((p) => (
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
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
