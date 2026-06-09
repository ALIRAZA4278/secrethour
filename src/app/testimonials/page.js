'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';
import { supabase } from '../../lib/supabase';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const SILK = '/assets/bg-silk-B9_HjwKe.jpg';

const FALLBACK_FEATURED = {
  quote: "Our wedding night felt sacred. We will never forget the way it began.",
  author: "Ayesha & Hamza",
};

const FALLBACK_GRID = [
  { quote: "We laughed, we cried, we finally talked. Beautifully made.", author: "Anonymous, Lahore" },
  { quote: "It felt like a private little ritual just for us.", author: "Sara & Bilal" },
  { quote: "Discreet, elegant, and so romantic. Worth every rupee.", author: "Anonymous, Karachi" },
  { quote: "A gift I will give every newlywed couple I love.", author: "Mariam & Usman" },
];

const STATS = [
  {
    label: 'Deeper Bond',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    label: 'Playful & Tender',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    label: 'Premium Experience',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
];

const INP = 'w-full bg-transparent border border-gold-border/50 text-cream/90 placeholder:text-cream/30 px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors';

export default function TestimonialsPage() {
  const [form, setForm] = useState({ name: '', email: '', location: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, name, location, body')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setApproved(data); });
  }, []);

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const displayName = form.name.trim()
    ? form.name.trim()
    : 'Anonymous';
  const displayAuthor = form.location.trim()
    ? `${displayName}, ${form.location.trim()}`
    : displayName;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email.trim() || !form.body.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { error: err } = await supabase.from('testimonials').insert({
        name: form.name.trim() || null,
        email: form.email.trim(),
        location: form.location.trim() || null,
        body: form.body.trim(),
      });
      if (err) throw err;
      setSubmitted(true);
    } catch (e) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="text-cream min-h-screen flex flex-col" style={{ background: 'radial-gradient(at center top, rgb(40,12,18) 0%, rgb(9,8,7) 55%)' }}>
      <MetaPixel />
      <Navbar />

      <div className="relative flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SILK} alt="" className="absolute inset-0 w-full h-full object-cover opacity-8 rotate-180 pointer-events-none" />

        {/* Header */}
        <section className="relative z-10 pt-10 pb-12 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl md:text-5xl italic text-cream" style={serif}>
              Loved by Couples Like You
            </h1>
            <p className="text-cream/55 italic text-base" style={serif}>
              Whispered back to us — in confidence.
            </p>
          </div>
        </section>

        {/* Featured testimonial */}
        {(() => {
          const feat = approved[0]
            ? { quote: approved[0].body, author: approved[0].location ? `${approved[0].name || 'Anonymous'}, ${approved[0].location}` : (approved[0].name || 'Anonymous') }
            : FALLBACK_FEATURED;
          return (
            <section className="relative z-10 px-6 pb-12">
              <div className="max-w-2xl mx-auto border border-gold-border p-10 md:p-14 text-center space-y-6" style={{ background: 'rgba(11,10,9,0.6)' }}>
                <div className="flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-gold text-xl">★</span>)}
                </div>
                <div className="text-5xl text-gold/30 leading-none font-serif">&ldquo;</div>
                <p className="text-cream text-xl md:text-2xl italic leading-relaxed" style={serif}>{feat.quote}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-10 bg-gold-border" />
                  <span className="text-gold text-sm italic" style={serif}>— {feat.author}</span>
                  <div className="h-px w-10 bg-gold-border" />
                </div>
              </div>
            </section>
          );
        })()}

        {/* Grid testimonials */}
        {(() => {
          const gridItems = approved.length > 1 ? approved.slice(1) : approved.length === 1 ? [] : null;
          const grid = gridItems
            ? gridItems.map(t => ({
                quote: t.body,
                author: t.location ? `${t.name || 'Anonymous'}, ${t.location}` : (t.name || 'Anonymous'),
              }))
            : FALLBACK_GRID;
          return (
            <section className="relative z-10 px-6 pb-16">
              <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
                {grid.map((t, i) => (
                  <div key={i} className="border border-gold-border/60 p-8 space-y-5" style={{ background: 'rgba(11,10,9,0.5)' }}>
                    <div className="text-3xl text-gold/30 leading-none font-serif">&ldquo;</div>
                    <p className="text-cream/75 italic leading-relaxed text-sm" style={serif}>{t.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-gold-border" />
                      <p className="text-gold/70 text-[10px] uppercase tracking-[0.25em]">— {t.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Stats strip */}
        <section className="relative z-10 py-12 px-6 border-t border-gold-border/20">
          <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
            {STATS.map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                {icon}
                <span className="text-cream/70 italic text-sm" style={serif}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Write a Review ── */}
        <section className="relative z-10 px-6 py-16 border-t border-gold-border/20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">Share Your Experience</p>
              <h2 className="text-2xl md:text-3xl italic text-cream" style={serif}>Write a Review</h2>
              <p className="text-cream/45 text-xs mt-2 italic" style={serif}>
                Your review will appear after approval.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

              {/* Form */}
              <div>
                {submitted ? (
                  <div className="border border-gold-border/50 p-8 text-center space-y-3" style={{ background: 'rgba(11,10,9,0.6)' }}>
                    <p className="text-gold text-2xl">✦</p>
                    <p className="text-cream italic text-lg" style={serif}>Thank you.</p>
                    <p className="text-cream/55 text-sm italic" style={serif}>
                      Your review has been received and will be shared after a quick review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={f('email')}
                        placeholder="Email address *"
                        className={INP}
                      />
                      <p className="text-cream/30 text-[10px] mt-1.5 px-1">
                        For record-keeping only — your email will never appear on the website.
                      </p>
                    </div>

                    <input
                      type="text"
                      value={form.name}
                      onChange={f('name')}
                      placeholder="Your name (optional — shows as Anonymous if left blank)"
                      className={INP}
                    />

                    <input
                      type="text"
                      value={form.location}
                      onChange={f('location')}
                      placeholder="City / Location (optional)"
                      className={INP}
                    />

                    <textarea
                      required
                      rows={5}
                      value={form.body}
                      onChange={f('body')}
                      placeholder="Share your experience..."
                      className={`${INP} resize-none`}
                    />

                    {error && (
                      <p className="text-red-400 text-xs">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !form.email.trim() || !form.body.trim()}
                      className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] uppercase tracking-[0.2em] py-3.5 btn-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting…' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>

              {/* Live preview */}
              <div>
                <p className="text-cream/30 text-[10px] uppercase tracking-[0.25em] mb-4 text-center">Preview</p>
                <div
                  className="border p-8 space-y-5 transition-all duration-300"
                  style={{
                    background: 'rgba(11,10,9,0.5)',
                    borderColor: form.body.trim() ? 'rgba(180,140,80,0.6)' : 'rgba(180,140,80,0.2)',
                  }}
                >
                  <div className="text-3xl text-gold/30 leading-none font-serif">&ldquo;</div>
                  <p className="text-cream/75 italic leading-relaxed text-sm min-h-15" style={serif}>
                    {form.body.trim() || (
                      <span className="text-cream/20">Your review will appear here as you type…</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-6 bg-gold-border" />
                    <p className="text-gold/70 text-[10px] uppercase tracking-[0.25em]">— {displayAuthor}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 pb-20 px-6 text-center border-t border-gold-border/20 pt-10">
          <Link
            href="/shop"
            className="inline-block border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.25em] px-12 py-4 btn-glow transition-all duration-300 hover:bg-burgundy"
          >
            Shop the Collection
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
