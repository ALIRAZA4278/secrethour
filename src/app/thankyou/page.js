'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function ThankYouPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('sh_order') || '{}');
      setName(data.name || '');
      setEmail(data.email || '');
      sessionStorage.removeItem('sh_order');
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(57,19,26), rgb(11,10,9) 60%)' }}>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-10">
        <div className="max-w-lg w-full text-center space-y-8 border border-gold-border/30 px-8 py-14 md:px-14" style={{ background: 'rgba(11,10,9,0.6)' }}>
          <div className="space-y-2">
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.35em]">Secret Hour</p>
            <h1 className="text-3xl md:text-4xl italic text-gold" style={serif}>Order Placed</h1>
          </div>
          <div className="w-10 h-px bg-gold-border mx-auto" />
          <div className="space-y-3">
            {name && (
              <p className="text-cream italic text-base leading-relaxed" style={serif}>
                Thank you, {name}.
              </p>
            )}
            <p className="text-cream/55 text-sm leading-relaxed" style={serif}>
              Your order has been received and is being prepared.
              {email && (
                <><br />We will be in touch at <span className="text-cream/80">{email}</span>.</>
              )}
            </p>
          </div>
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
      </main>
      <Footer />
    </div>
  );
}
