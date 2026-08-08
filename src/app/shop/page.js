import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';
import { getServerSupabase } from '../../lib/supabase-server';
import { getSale, fmtPKR } from '../../lib/pricing';
import AddToCartBtn from './AddToCartBtn';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = '/assets/bg-silk-B9_HjwKe.jpg';
const LOGO = '/assets/logo-secret-hour-DN-hyC6c.png';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop Couple Gifts Online in Pakistan | Secret Hour',
  description: 'Browse Pakistan\'s only curated collection of intimate gifts for married couples. Card games, candles, silk bonds & bridal bundles. Fast discreet delivery across Pakistan.',
  openGraph: {
    title: 'Shop Couple Gifts Online in Pakistan | Secret Hour',
    description: 'Browse Pakistan\'s only curated collection of intimate gifts for married couples. Card games, candles, silk bonds & bridal bundles. Fast discreet delivery across Pakistan.',
    url: 'https://www.secrethour.pk/shop',
  },
  alternates: {
    canonical: 'https://www.secrethour.pk/shop',
  },
};

export default async function ShopPage() {
  let products = [];
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from('products')
      .select('slug, title, category, img, price, numeric_price, sale_price, tag, variations, bulk_discount_qty, bulk_discount_pct')
      .eq('hidden', false)
      .order('created_at');
    if (data) products = data;
  } catch {
    // Supabase unavailable — show empty state
  }

  return (
    <div className="text-cream flex flex-col bg-sh-bg">
      <MetaPixel />
      <Navbar />

      <div className="relative flex-1" style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
        <Image src={SILK} alt="Secret Hour" fill sizes="100vw" className="object-cover opacity-10 rotate-180 pointer-events-none z-0" />

        {/* Header */}
        <section className="relative z-10 py-12 md:py-20 text-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image src={LOGO} alt="Secret Hour" width={80} height={80} className="h-20 w-auto mx-auto mb-6 opacity-90 object-contain" />
          <h1 className="text-2xl md:text-4xl italic text-cream mb-3" style={serif}>
            The <span className="text-gold">Secret Hour</span> Collection
          </h1>
          <p className="text-cream/55 italic text-sm max-w-md mx-auto" style={serif}>
            Quiet luxuries, made for the hours that belong only to the two of you.
          </p>
          <p className="text-cream/40 text-xs max-w-xl mx-auto mt-4 leading-relaxed">
            Secret Hour makes thoughtfully designed products for married couples across Pakistan — from a{' '}
            <strong className="text-cream/60">couples card game</strong> and{' '}
            <strong className="text-cream/60">luxury scented candles</strong> to{' '}
            <strong className="text-cream/60">bridal gift sets</strong> and intimate collections.
            Every order ships free across Pakistan in discreet, unmarked packaging.
          </p>
        </section>

        {/* Products grid */}
        <section className="relative z-10 px-5 md:px-7 pb-24 pt-8">
          {products.length === 0 ? (
            <p className="text-center text-cream/40 italic py-20" style={serif}>No products available yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="rounded overflow-hidden group flex flex-col border border-gold-border/60 hover:border-gold transition-colors duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.img}
                      alt={`${p.title} Secret Hour`}
                      fill
                      className="object-cover"
                    />
                    {p.tag && (
                      <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 ${
                        p.tag === 'best-seller' ? 'bg-gold text-sh-bg' :
                        p.tag === 'new-arrival' ? 'bg-blue-600 text-white' :
                        'bg-burgundy text-gold border border-gold-muted'
                      }`}>
                        {p.tag === 'best-seller' ? 'Best Seller' : p.tag === 'new-arrival' ? 'New Arrival' : 'On Sale'}
                      </span>
                    )}
                  </div>
                  <div className="px-4 py-3 text-center space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-gold/70 text-[10px] uppercase tracking-[0.3em]">{p.category}</p>
                      <h2 className="text-sm md:text-base italic text-cream leading-snug line-clamp-2" style={serif}>
                        {p.title}
                      </h2>
                      {(() => {
                        const s = getSale(p);
                        return s.onSale ? (
                          <p className="pt-1 flex items-baseline justify-center gap-2" style={serif}>
                            <span className="text-gold text-base md:text-lg">{fmtPKR(s.effective)}</span>
                            <span className="text-cream/40 text-sm line-through">{fmtPKR(s.original)}</span>
                          </p>
                        ) : (
                          <p className="text-gold text-base md:text-lg pt-1" style={serif}>{p.price}</p>
                        );
                      })()}
                    </div>
                    <AddToCartBtn product={p} />
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
