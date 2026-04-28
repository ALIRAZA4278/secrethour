'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { PRODUCTS, getProduct } from '../../data/products';
import { useCart } from '../../context/CartContext';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = 'https://secrethour.lovable.app/assets/bg-silk-B9_HjwKe.jpg';
const LOGO = 'https://secrethour.lovable.app/assets/logo-secret-hour-DN-hyC6c.png';

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const product = getProduct(slug);
  if (!product) notFound();

  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <Navbar />

      {/* ── Main product section: 2-column grid (image left, details right) ── */}
      <section className="relative py-12 overflow-hidden mt-[64px]">
        <Image src={SILK} alt="" fill className="object-cover opacity-15" unoptimized />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left: square image + thumbnails */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded overflow-hidden border border-gold-border/40 bg-sh-card">
                <Image
                  src={product.images[activeImg]}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-colors bg-sh-card ${
                        activeImg === i ? 'border-gold' : 'border-gold-border/40 hover:border-gold-muted'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-contain" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: product details */}
            <div className="space-y-7">
              <div>
                <p className="text-gold/80 text-xs uppercase tracking-[0.3em] mb-3">{product.category}</p>
                <h1 className="text-3xl md:text-4xl italic text-gold leading-tight" style={serif}>
                  {product.title}
                </h1>
                <p className="text-cream/60 italic mt-4 text-lg" style={serif}>{product.subtitle}</p>
              </div>

              <p className="text-3xl text-gold" style={serif}>{product.price}</p>

              <p className="text-cream/65 leading-relaxed text-sm">{product.description}</p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart({ slug: product.slug, title: product.title, price: product.price, numericPrice: product.numericPrice, img: product.images[0] })}
                  className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 flex-1"
                >
                  Add to Cart
                </button>
                <button className="border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 flex-1">
                  Buy Now
                </button>
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h3 className="text-cream italic text-xl" style={serif}>What&apos;s Included</h3>
                <ul className="space-y-2">
                  {product.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-cream/65 text-sm">
                      <span className="text-gold mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How It Works */}
              {product.howItWorks?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-cream italic text-xl" style={serif}>How It Works</h3>
                  <ol className="space-y-3">
                    {product.howItWorks.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-cream/65 text-sm">
                        <span className="text-gold shrink-0 text-[11px] font-medium tracking-[0.1em] mt-0.5">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Feature badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Discreet Packaging', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                  )},
                  { label: 'Private Experience', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  )},
                  { label: 'Made for Couples', icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  )},
                ].map(({ icon, label }) => (
                  <div key={label} className="border border-gold-border p-4 flex flex-col items-center gap-2 text-center">
                    {icon}
                    <span className="text-cream/65 text-[10px] uppercase tracking-[0.18em]">{label}</span>
                  </div>
                ))}
              </div>

              {/* Crafted by Secret Hour */}
              <div className="flex items-center gap-3 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO} alt="" className="w-6 h-6 object-contain opacity-80" />
                <span className="text-cream/45 text-[10px] uppercase tracking-[0.3em]">Crafted by Secret Hour</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── You May Also Love ── */}
      <section className="py-20 border-t border-gold/10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 justify-center mb-12">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/30" />
            <h2 className="text-2xl italic text-cream" style={serif}>You May Also Love</h2>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {related.map((p) => (
              <div key={p.slug} className="rounded overflow-hidden group flex flex-col border border-gold-border/40 hover:border-gold transition-colors duration-300">
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-sh-card">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-contain group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                </Link>
                <div className="p-4 text-center space-y-2 flex-1 flex flex-col">
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-sm italic text-cream leading-snug hover:text-gold transition-colors"
                    style={serif}
                  >
                    {p.title}
                  </Link>
                  <p className="text-gold text-base" style={serif}>{p.price}</p>
                  <button
                    onClick={() => addToCart({ slug: p.slug, title: p.title, price: p.price, numericPrice: p.numericPrice, img: p.img })}
                    className="mt-auto border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] px-4 py-2 btn-glow transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
