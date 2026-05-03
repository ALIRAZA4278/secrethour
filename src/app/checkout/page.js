'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { supabase } from '../../lib/supabase';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const labelCls = 'block text-[11px] uppercase tracking-[0.18em] text-cream/50 mb-1.5';
const inputCls = 'w-full px-4 py-3 bg-sh-card/60 border border-gold-border/40 rounded text-cream/80 text-sm placeholder:text-cream/20 outline-none focus:border-gold-muted transition-colors';
const cardCls = 'rounded-lg p-6 md:p-7 border border-gold-border/20 bg-gradient-to-b from-sh-card/50 to-sh-card/20 backdrop-blur-sm';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, setOpen } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: 'Pakistan',
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const discount = promoApplied && payment === 'bank' ? Math.round(totalPrice * 0.10) : 0;
  const total = totalPrice - discount;

  async function handleSubmit(e) {
    e.preventDefault();
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
        country: form.country,
        payment_method: payment,
        subtotal: totalPrice,
        discount,
        total,
      })
      .select('id')
      .single();

    if (!orderErr && order) {
      await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: order.id,
          product_slug: item.slug,
          product_title: item.title,
          product_img: item.img,
          quantity: item.qty,
          price: item.numericPrice,
        }))
      );
    }
    setSubmitted(true);
  }

  /* ── Empty cart ── */
  if (totalItems === 0 && !submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(57,19,26), rgb(11,10,9) 60%)' }}>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pt-24">
          <p className="text-3xl italic text-cream/70" style={serif}>Your cart is empty</p>
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

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(57,19,26), rgb(11,10,9) 60%)' }}>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-24">
          <div className={`${cardCls} max-w-md w-full space-y-5`}>
            <p className="text-gold text-3xl italic" style={serif}>Order Placed</p>
            <p className="text-cream/55 text-sm italic leading-relaxed" style={serif}>
              Thank you, {form.firstName}. Your order has been received.<br />
              We will be in touch at {form.email}.
            </p>
            <p className="text-cream/30 text-[10px] uppercase tracking-[0.2em]">
              Discreet Packaging · No Mention of Brand Outside
            </p>
            <Link href="/shop" className="inline-block border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] px-8 py-3 btn-glow transition-all duration-300">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(57,19,26), rgb(11,10,9) 60%)' }}>
      <Navbar />

      <main className="pt-36 md:pt-40 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">

          {/* ── Header ── */}
          <div className="text-center mb-10">
            <p className="text-gold/70 text-[10px] uppercase tracking-[0.3em] mb-3">Secure Checkout</p>
            <h1 className="text-4xl md:text-5xl italic text-gold" style={serif}>Almost yours</h1>
            <div className="flex items-center justify-center gap-2 mt-4 text-cream/45 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Encrypted · Discreet · Trusted by couples across Pakistan
            </div>
          </div>

          {/* ── 2-col grid ── */}
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">

              {/* Left column */}
              <div className="space-y-6">

                {/* Shipping Details */}
                <div className={cardCls}>
                  <div className="flex items-center gap-2 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987-1.106v-.828" />
                    </svg>
                    <h2 className="italic text-lg text-cream" style={serif}>Shipping Details</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input type="text" required value={form.firstName} onChange={set('firstName')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input type="text" required value={form.lastName} onChange={set('lastName')} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" required value={form.email} onChange={set('email')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+92 ..." className={inputCls} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelCls}>Address</label>
                    <input type="text" required value={form.address} onChange={set('address')} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className={labelCls}>City</label>
                      <input type="text" required value={form.city} onChange={set('city')} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Postal Code</label>
                      <input type="text" value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className={labelCls}>Country</label>
                      <select value={form.country} onChange={set('country')} className={`${inputCls} cursor-pointer`}>
                        <option value="Pakistan">Pakistan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className={cardCls}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                    <h2 className="italic text-lg text-cream" style={serif}>Payment Method</h2>
                  </div>
                  <p className="text-gold text-[10px] uppercase tracking-[0.2em] mb-4">✦ Pay Online &amp; Get 10% Discount</p>

                  <div className="space-y-3">
                    {/* Bank Transfer */}
                    <label className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${payment === 'bank' ? 'border-gold/50 bg-gold/5' : 'border-gold-border/30 hover:border-gold/30'}`}>
                      <input type="radio" name="payment" value="bank" checked={payment === 'bank'} onChange={() => setPayment('bank')} className="mt-0.5 accent-gold" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold/70">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                            <span className="italic text-cream text-sm" style={serif}>Bank Transfer</span>
                          </div>
                          <span className="bg-gold/20 text-gold text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded ml-auto">10% Off</span>
                        </div>
                        <p className="text-cream/40 text-xs mt-0.5">Fastest processing. Discount applied automatically.</p>

                        {/* Bank details — inside the card */}
                        {payment === 'bank' && (
                          <div className="mt-4 pt-4 border-t border-gold/20 space-y-3">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                              <div>
                                <p className="text-cream/45 text-[10px] uppercase tracking-[0.15em]">Account Title</p>
                                <p className="text-cream text-sm font-medium mt-0.5">Secret Hour</p>
                              </div>
                              <div>
                                <p className="text-cream/45 text-[10px] uppercase tracking-[0.15em]">Bank</p>
                                <p className="text-cream text-sm font-medium mt-0.5">Bank Alfalah</p>
                              </div>
                              <div>
                                <p className="text-cream/45 text-[10px] uppercase tracking-[0.15em]">Account No.</p>
                                <p className="text-cream text-sm font-medium mt-0.5 tracking-wide">08301010882946</p>
                              </div>
                              <div>
                                <p className="text-cream/45 text-[10px] uppercase tracking-[0.15em]">IBAN</p>
                                <p className="text-cream text-xs font-medium mt-0.5 tracking-wide">PK15ALFH0830001010882946</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 pt-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold/60 shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                              </svg>
                              <p className="text-gold/70 text-xs leading-relaxed">
                                After payment, share screenshot on{' '}
                                <a href="https://wa.me/message/5QY6DQTFQQGEC1" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold-light">
                                  WhatsApp
                                </a>{' '}
                                to confirm your order.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${payment === 'cod' ? 'border-gold/50 bg-gold/5' : 'border-gold-border/30 hover:border-gold/30'}`}>
                      <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="mt-0.5 accent-gold" />
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold/70">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 1-.987-1.106v-.828" />
                        </svg>
                        <div>
                          <span className="italic text-cream text-sm" style={serif}>Cash on Delivery</span>
                          <p className="text-cream/40 text-xs mt-0.5">Pay in cash when your discreet package arrives.</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-gold-border/20">
                    {[
                      { icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z', label: 'Secure Checkout' },
                      { icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z', label: 'Private & Discreet' },
                      { icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', label: 'Verified Orders' },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold/60">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                        </svg>
                        <span className="text-cream/40 text-[9px] uppercase tracking-[0.18em]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — Order Summary */}
              <div className={`${cardCls} h-fit lg:sticky lg:top-24`}>
                <h2 className="italic text-xl text-cream mb-6" style={serif}>Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-3 items-center border-b border-gold-border/20 pb-4">
                      <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-sh-bg">
                        <Image src={item.img} alt={item.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm leading-snug" style={serif}>{item.title}</p>
                        <p className="text-cream/40 text-xs mt-0.5">Qty {item.qty}</p>
                      </div>
                      <p className="text-gold text-sm shrink-0">Rs. {(item.numericPrice * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="border-t border-gold-border/20 pt-4 mb-4">
                  <div className="flex items-center gap-1.5 text-cream/40 text-[10px] uppercase tracking-[0.2em] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    Promo Code
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="MIDNIGHTHOUR"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => setPromoApplied(promoCode.length > 0)}
                      className="btn-dark px-5 text-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && payment === 'bank' && (
                    <p className="text-gold/70 text-xs mt-1.5">10% discount applied!</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-gold-border/20 pt-4">
                  <div className="flex justify-between text-cream/55">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gold/70">
                      <span>Discount (10%)</span>
                      <span>− Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-cream/55">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gold-border/20 mt-1" style={serif}>
                    <span className="italic text-cream">Total</span>
                    <span className="text-gold">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place order */}
                <button
                  type="submit"
                  className="w-full mt-6 bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] py-4 btn-glow transition-all duration-300"
                >
                  Place Order
                </button>

                <p className="text-center text-cream/25 text-[9px] uppercase tracking-[0.2em] mt-4">
                  Discreet Packaging · No Mention of Brand Outside
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
