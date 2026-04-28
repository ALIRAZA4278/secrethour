'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const inputCls = 'w-full bg-sh-bg border border-gold-border/60 text-cream/80 placeholder:text-cream/25 px-4 py-3 text-sm outline-none focus:border-gold-muted transition-colors';
const labelCls = 'text-cream/55 text-[10px] uppercase tracking-[0.2em] block mb-1.5';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '', zip: '',
    notes: '',
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (totalItems === 0 && !submitted) {
    return (
      <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-2xl italic text-cream/70" style={serif}>Your cart is empty</p>
          <Link
            href="/shop"
            className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 btn-glow transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="border border-gold-border/40 p-12 max-w-md space-y-4">
            <p className="text-gold text-3xl italic" style={serif}>Order Placed</p>
            <p className="text-cream/55 text-sm italic" style={serif}>
              Thank you, {form.firstName}. Your order has been received.<br />
              We will be in touch at {form.email}.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] px-8 py-3 btn-glow transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shipping = 0;
  const total = totalPrice + shipping;

  return (
    <div className="bg-sh-bg text-cream min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl italic text-cream mb-10" style={serif}>Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

              {/* ── Left: Shipping form ── */}
              <div className="space-y-8">

                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="text-cream/70 text-[10px] uppercase tracking-[0.3em] pb-2 border-b border-gold-border/30">Contact</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input type="text" required value={form.firstName} onChange={set('firstName')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input type="text" required value={form.lastName} onChange={set('lastName')} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" required value={form.email} onChange={set('email')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="tel" required value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+92 300 0000000" />
                  </div>
                </div>

                {/* Shipping address */}
                <div className="space-y-4">
                  <h2 className="text-cream/70 text-[10px] uppercase tracking-[0.3em] pb-2 border-b border-gold-border/30">Shipping Address</h2>
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input type="text" required value={form.address} onChange={set('address')} className={inputCls} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>City</label>
                      <input type="text" required value={form.city} onChange={set('city')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Province</label>
                      <input type="text" required value={form.province} onChange={set('province')} className={inputCls} placeholder="e.g. Punjab" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Postal Code</label>
                    <input type="text" value={form.zip} onChange={set('zip')} className={inputCls} />
                  </div>
                </div>

                {/* Order notes */}
                <div className="space-y-2">
                  <label className={labelCls}>Order Notes <span className="normal-case tracking-normal text-cream/30">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set('notes')}
                    className={`${inputCls} resize-none`}
                    placeholder="Any special instructions or gift messages..."
                  />
                </div>
              </div>

              {/* ── Right: Order summary ── */}
              <div className="border border-gold-border/40 p-6 space-y-6 lg:sticky lg:top-24">
                <h2 className="text-cream italic text-xl" style={serif}>Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-3 border-b border-gold-border/20 pb-4">
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-sh-muted">
                        <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm leading-snug" style={serif}>{item.title}</p>
                        <p className="text-cream/45 text-xs mt-0.5">Qty: {item.qty}</p>
                      </div>
                      <p className="text-gold text-sm shrink-0">Rs. {(item.numericPrice * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-gold-border/30 pt-4">
                  <div className="flex justify-between text-cream/60">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-cream/60">
                    <span>Shipping</span>
                    <span className="text-gold/70">Free</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gold-border/30 mt-2" style={serif}>
                    <span className="text-cream italic">Total</span>
                    <span className="text-gold">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place order */}
                <button
                  type="submit"
                  className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] py-4 btn-glow transition-all duration-300"
                >
                  Place Order
                </button>

                <p className="text-center text-cream/30 text-xs italic" style={serif}>
                  Discreet packaging · Private experience
                </p>
              </div>

            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
