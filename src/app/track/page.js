'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const inputCls = 'w-full px-4 py-3 bg-black/30 border border-gold-border/40 rounded text-cream/80 text-sm placeholder:text-cream/25 outline-none focus:border-gold-muted transition-colors';
const labelCls = 'block text-[10px] uppercase tracking-[0.2em] text-cream/50 mb-1.5';

const STATUS_CONFIG = {
  'At Merchant Warehouse':  { icon: '📦', color: 'text-amber-400',  bar: 1 },
  'At PostEx Warehouse':    { icon: '🏭', color: 'text-blue-400',   bar: 2 },
  'Out for Delivery':       { icon: '🚚', color: 'text-green-400',  bar: 3 },
  'Delivered':              { icon: '✅', color: 'text-emerald-400', bar: 4 },
  'Attempt Made':           { icon: '🔔', color: 'text-yellow-400', bar: 2 },
  'Delivery Under Review':  { icon: '🔍', color: 'text-purple-400', bar: 2 },
  'Returned':               { icon: '↩️', color: 'text-red-400',    bar: 0 },
};

const STEPS = [
  { label: 'Order Placed',        icon: '🛍️' },
  { label: 'At Warehouse',        icon: '📦' },
  { label: 'Out for Delivery',    icon: '🚚' },
  { label: 'Delivered',           icon: '✅' },
];

export default function TrackPage() {
  const [tab,      setTab]      = useState('tracking'); // 'tracking' | 'order'
  const [tracking, setTracking] = useState('');
  const [orderId,  setOrderId]  = useState('');
  const [contact,  setContact]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');

  async function trackByNumber(e) {
    e.preventDefault();
    if (!tracking.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch(`/api/postex/track?tracking=${encodeURIComponent(tracking.trim())}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ tracking: tracking.trim(), ...data });
    } catch (err) {
      setError(err.message || 'Could not find tracking information.');
    }
    setLoading(false);
  }

  async function trackByOrder(e) {
    e.preventDefault();
    if (!orderId.trim() || !contact.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch(`/api/track-order?orderId=${encodeURIComponent(orderId.trim())}&contact=${encodeURIComponent(contact.trim())}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Order not found. Please check your details.');
    }
    setLoading(false);
  }

  const status  = result?.orderStatus || result?.transactionStatusMessage || '';
  const cfg     = STATUS_CONFIG[status] || { icon: '📬', color: 'text-gold', bar: 1 };
  const barStep = cfg.bar;

  return (
    <div className="min-h-screen flex flex-col text-cream" style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(11,10,9) 60%)' }}>
      <MetaPixel />
      <Navbar />

      <main className="flex-1 pt-10 pb-20 px-4">
        <div className="max-w-xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-gold/60 text-[10px] uppercase tracking-[0.4em] mb-3">Secret Hour</p>
            <h1 className="text-3xl md:text-4xl italic text-gold mb-3" style={serif}>Track Your Order</h1>
            <p className="text-cream/45 text-sm italic" style={serif}>Enter your tracking number or order details below.</p>
          </div>

          {/* Tab toggle */}
          <div className="flex border border-gold-border/30 rounded mb-6 overflow-hidden">
            {[
              { id: 'tracking', label: 'Tracking Number' },
              { id: 'order',    label: 'Order ID + Contact' },
            ].map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setError(''); setResult(null); }}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  tab === t.id
                    ? 'bg-burgundy text-gold-btn-text'
                    : 'text-cream/50 hover:text-cream/80'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="border border-gold-border/25 rounded-lg p-6 md:p-8" style={{ background: 'rgba(11,10,9,0.6)' }}>

            {tab === 'tracking' ? (
              <form onSubmit={trackByNumber} className="space-y-5">
                <div>
                  <label className={labelCls}>PostEx Tracking Number</label>
                  <input
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    placeholder="e.g. 28628390000001"
                    className={inputCls}
                    required
                  />
                  <p className="text-cream/30 text-[10px] mt-1.5">You can find this in your order confirmation email.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] py-4 btn-glow transition-all duration-300 disabled:opacity-60">
                  {loading ? 'Tracking…' : 'Track Order'}
                </button>
              </form>
            ) : (
              <form onSubmit={trackByOrder} className="space-y-5">
                <div>
                  <label className={labelCls}>Order ID</label>
                  <input
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    placeholder="e.g. 7EF981BA (from your email)"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Email or Phone Number</label>
                  <input
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="Email or WhatsApp number"
                    className={inputCls}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] py-4 btn-glow transition-all duration-300 disabled:opacity-60">
                  {loading ? 'Finding Order…' : 'Track Order'}
                </button>
              </form>
            )}

            {/* Error */}
            {error && (
              <div className="mt-5 px-4 py-3 border border-red-900/50 bg-red-950/30 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-8 space-y-6 border-t border-gold-border/20 pt-6">

                {/* Status badge */}
                <div className="text-center space-y-2">
                  <p className="text-4xl">{cfg.icon}</p>
                  <p className={`text-xl font-medium italic ${cfg.color}`} style={serif}>{status || 'In Transit'}</p>
                  {result.updatedDate && (
                    <p className="text-cream/40 text-xs">Last updated: {result.updatedDate}</p>
                  )}
                </div>

                {/* Progress bar */}
                {barStep > 0 && (
                  <div className="flex items-center gap-1">
                    {STEPS.map((step, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 transition-all ${
                          i < barStep ? 'border-gold bg-gold/20' : 'border-gold-border/30 bg-black/20'
                        }`}>
                          {step.icon}
                        </div>
                        <p className={`text-[9px] uppercase tracking-[0.1em] text-center leading-tight ${
                          i < barStep ? 'text-gold' : 'text-cream/30'
                        }`}>{step.label}</p>
                        {i < STEPS.length - 1 && (
                          <div className="hidden" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Details — all PostEx fields */}
                <div className="space-y-0 bg-black/20 border border-gold-border/20 rounded overflow-hidden">
                  {[
                    ['Tracking #',        result.tracking || result.trackingNumber],
                    ['Order Ref',         result.orderRefNumber],
                    ['Customer',          result.customerName],
                    ['Phone',             result.customerPhone],
                    ['City',              result.cityName],
                    ['Delivery Address',  result.deliveryAddress],
                    ['Status',            result.orderStatus || result.transactionStatusMessage],
                    ['Status Code',       result.orderStatusCode],
                    ['Order Type',        result.orderType],
                    ['Items',             result.items],
                    ['Amount',            result.invoicePayment ? `Rs. ${Number(result.invoicePayment).toLocaleString()}` : null],
                    ['Order Detail',      result.orderDetail],
                    ['Transaction Notes', result.transactionNotes],
                    ['Booking Date',      result.bookingDate],
                    ['Updated Date',      result.updatedDate],
                    ['Rider Name',        result.riderName],
                    ['Rider Phone',       result.riderPhone],
                    ['Return Tracking',   result.returnTrackingNumber],
                  ].filter(([, v]) => v !== null && v !== undefined && v !== '').map(([l, v], i) => (
                    <div key={l} className={`flex justify-between gap-4 px-4 py-2.5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <span className="text-cream/40 text-[10px] uppercase tracking-[0.15em] shrink-0 pt-0.5">{l}</span>
                      <span className="text-cream/80 text-right text-xs leading-relaxed">{String(v)}</span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-cream/30 text-[10px] uppercase tracking-[0.2em]">
                  Discreet Packaging · No Brand Name Outside
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
