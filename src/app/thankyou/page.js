'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function ThankYouPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('sh_order') || '{}');
      setData(stored);
      sessionStorage.removeItem('sh_order');

      if (stored.total) {
        const firePixel = (retries = 15) => {
          if (typeof window !== 'undefined' && window.fbq) {
            // Prepare contents array with detailed item information
            const contents = (stored.items || []).map(item => ({
              id: item.slug || item.title,
              title: item.title,
              quantity: item.qty,
              unit_price: item.unitPrice || item.price,
              price: item.totalPrice || (item.price * item.qty),
            }));

            // Fire Purchase event with detailed data
            window.fbq('track', 'Purchase', {
              value: stored.total,
              currency: 'PKR',
              num_items: (stored.items || []).reduce((s, i) => s + (i.qty || 1), 0),
              content_ids: (stored.items || []).map(i => i.slug || i.title),
              content_type: 'product',
              contents: contents,
              subtotal: stored.subtotal,
              discount: stored.discount,
            });

            // Fire ViewContent events for each item (optional - for more detailed analytics)
            (stored.items || []).forEach(item => {
              window.fbq('track', 'ViewContent', {
                content_ids: [item.slug || item.title],
                content_name: item.title,
                content_type: 'product',
                value: item.totalPrice || (item.price * item.qty),
                currency: 'PKR',
                quantity: item.qty,
              });
            });
          } else if (retries > 0) {
            setTimeout(() => firePixel(retries - 1), 300);
          }
        };
        firePixel();
      }
    } catch {}
  }, []);

  const name    = data?.name    || '';
  const email   = data?.email   || '';
  const payment = data?.payment || '';
  const total   = data?.total   || 0;
  const items   = data?.items   || [];

  const paymentLabel = payment === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(57,19,26), rgb(11,10,9) 60%)' }}>
      <MetaPixel />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">

          {/* Header card */}
          <div className="text-center border border-gold-border/30 px-8 py-10" style={{ background: 'rgba(11,10,9,0.6)' }}>
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.35em] mb-2">Secret Hour</p>
            <h1 className="text-3xl md:text-4xl italic text-gold mb-4" style={serif}>Order Placed</h1>
            <div className="w-10 h-px bg-gold-border mx-auto mb-5" />
            <p className="text-cream italic text-base leading-relaxed" style={serif}>
              Thank you{name ? `, ${name}` : ''}.
            </p>
            <p className="text-cream/50 text-sm leading-relaxed mt-2" style={serif}>
              Your order has been received and is being prepared.
              {email && <><br /><span className="text-cream/70">{email}</span></>}
            </p>
          </div>

          {/* Order items */}
          {items.length > 0 && (
            <div className="border border-gold-border/30 px-6 py-5" style={{ background: 'rgba(11,10,9,0.6)' }}>
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em] mb-4">Your Order</p>
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {item.img && (
                      <div className="relative w-14 h-14 shrink-0 bg-burgundy/20 border border-gold-border/20">
                        <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm leading-snug" style={serif}>{item.title}</p>
                      {item.variation && (
                        <p className="text-cream/40 text-[10px] uppercase tracking-[0.15em] mt-0.5">{item.variation}</p>
                      )}
                      <p className="text-cream/50 text-xs mt-0.5">x{item.qty}</p>
                    </div>
                    <p className="text-gold text-sm shrink-0" style={serif}>
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total + Payment */}
              <div className="border-t border-gold-border/20 mt-5 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-cream/50 text-xs uppercase tracking-[0.2em]">Payment</span>
                  <span className={`text-xs px-2.5 py-1 border rounded-full font-medium ${
                    payment === 'bank'
                      ? 'bg-blue-950/50 text-blue-300 border-blue-700/50'
                      : 'bg-burgundy/30 text-gold/80 border-gold-border/30'
                  }`}>
                    {paymentLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cream italic text-base" style={serif}>Total</span>
                  <span className="text-gold text-lg font-semibold" style={serif}>
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer note + CTA */}
          <div className="text-center space-y-4">
            <p className="text-cream/30 text-[10px] uppercase tracking-[0.2em]">
              Discreet Packaging · No Mention of Brand Outside
            </p>
            <Link
              href="/shop"
              className="inline-block bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300 hover:bg-[#5a1a24]"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
