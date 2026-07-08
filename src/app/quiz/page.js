'use client';

import { useState, useEffect } from 'react';
import MetaPixel from '../components/MetaPixel';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

const QUESTIONS = [
  {
    q: 'How long have you been together?',
    options: [
      { text: 'Just started', score: 1 },
      { text: 'A few months', score: 2 },
      { text: '1–3 years', score: 2 },
      { text: '3+ years', score: 3 },
    ],
  },
  {
    q: 'What feels most true for you both right now?',
    options: [
      { text: 'Getting to know each other', score: 1 },
      { text: 'Breaking the awkwardness', score: 1 },
      { text: 'Building comfort slowly', score: 2 },
      { text: 'Creating our first rituals', score: 3 },
    ],
  },
  {
    q: 'When was the last time you felt truly connected?',
    options: [
      { text: 'This week', score: 3 },
      { text: 'A few weeks ago', score: 2 },
      { text: 'A few months ago', score: 1 },
      { text: "Honestly... I can't remember", score: 0 },
    ],
  },
  {
    q: 'When did you last appreciate your partner — out loud — for something small?',
    options: [
      { text: 'Today or yesterday', score: 3 },
      { text: 'Sometime this week', score: 2 },
      { text: "It's been a while", score: 1 },
      { text: "I don't really do that", score: 0 },
    ],
  },
  {
    q: 'What does your usual night together look like?',
    options: [
      { text: 'Slow, present, just us', score: 3 },
      { text: 'Cosy but a little routine', score: 2 },
      { text: 'Mostly screens and silence', score: 1 },
      { text: 'We barely share the night', score: 0 },
    ],
  },
  {
    q: 'Are you ready to explore something deeper?',
    options: [
      { text: 'Yes, fully', score: 3 },
      { text: 'Maybe', score: 2 },
      { text: 'Not sure', score: 1 },
      { text: 'Prefer to keep things light', score: 0 },
    ],
  },
];

const MAX_SCORE = 18;

const RESULT_SLUGS = ['midnight-deck', 'intimate-night-set', 'bridal-box'];
const UPSELL_SLUG  = 'midnight-glow-candle';

function getResultMeta(pct) {
  if (pct <= 35) return {
    note: 'Every great love story starts with intention. Begin gently — let curiosity lead. There is no rush tonight.',
    slug: 'midnight-deck',
    desc: 'Gentle prompts designed to open conversations and deepen connection — one card at a time.',
  };
  if (pct <= 65) return {
    note: 'Something beautiful is waiting to be deepened between you. Let this evening be a quiet beginning.',
    slug: 'intimate-night-set',
    desc: 'Three small luxuries to set the scene for a night that belongs only to you.',
  };
  return {
    note: "You're already connected — now it's time to explore deeper. This is your secret hour.",
    slug: 'bridal-box',
    desc: 'A complete experience for couples ready to celebrate their bond in the most beautiful way.',
  };
}

export default function QuizPage() {
  const { addToCart } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [dbProducts, setDbProducts] = useState({});

  useEffect(() => {
    supabase
      .from('products')
      .select('slug, title, price, numeric_price, img')
      .in('slug', [...RESULT_SLUGS, UPSELL_SLUG])
      .neq('hidden', true)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(p => { map[p.slug] = p; });
          setDbProducts(map);
        }
      });
  }, []);

  const totalScore = answers.reduce((sum, s) => sum + s, 0);
  const pct = Math.round((totalScore / MAX_SCORE) * 100);
  const meta = step === 6 ? getResultMeta(pct) : null;
  const dbP  = meta ? dbProducts[meta.slug] : null;
  const result = meta && dbP ? {
    note: meta.note,
    product: {
      slug:         meta.slug,
      name:         dbP.title,
      desc:         meta.desc,
      price:        dbP.price,
      numericPrice: dbP.numeric_price,
      img:          dbP.img || '',
    },
  } : meta ? { note: meta.note, product: null } : null;
  const upsell = dbProducts[UPSELL_SLUG] || null;
  const progressPct = step === 6 ? 100 : Math.round((step / 6) * 100);

  function select(score) {
    const next = [...answers.slice(0, step), score];
    setAnswers(next);
    setStep(step < 5 ? step + 1 : 6);
  }

  function retake() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <div
      className="text-cream min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(at center top, rgb(57,19,26) 0%, rgb(9,8,7) 65%)' }}
    >
      <MetaPixel />
      <Navbar />

      <main className="flex-1 pt-10 pb-20 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] mb-3">The Connection Quiz</p>
            <h1 className="text-2xl md:text-4xl italic text-gold" style={serif}>
              Discover Your Secret Hour
            </h1>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-cream/50 text-[11px] uppercase tracking-[0.2em]">
                {step < 6 ? `Step ${step + 1} / 6` : 'Complete'}
              </span>
              <span className="text-gold text-[11px] tracking-[0.2em]">{progressPct}%</span>
            </div>
            <div className="h-px w-full bg-gold-border/30 relative">
              <div
                className="absolute top-0 left-0 h-px bg-gold transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {step < 6 ? (
            /* Question card */
            <div
              className="border border-gold-border/50 p-8 md:p-10"
              style={{ background: 'rgba(11,10,9,0.7)' }}
            >
              <p className="text-xl md:text-2xl italic text-center text-cream leading-relaxed mb-6" style={serif}>
                {QUESTIONS[step].q}
              </p>

              <div className="space-y-3">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => select(opt.score)}
                    className="w-full cursor-pointer text-left px-5 py-4 border border-gold-border/40 text-cream/80 text-sm hover:border-gold hover:text-cream transition-all duration-200"
                    style={{ background: 'rgba(20,15,10,0.6)' }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="cursor-pointer text-cream/40 text-[11px] uppercase tracking-[0.2em] hover:text-gold transition-colors mt-6 block"
                >
                  ← Back
                </button>
              )}
            </div>
          ) : (
            /* Result */
            <div className="space-y-5">

              {/* Score */}
              <div
                className="border border-gold-border/50 p-8 text-center"
                style={{ background: 'rgba(11,10,9,0.7)' }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70 mb-4">Your Connection Readiness</p>
                <p className="text-5xl md:text-6xl text-gold mb-4" style={serif}>{pct}%</p>
                <p className="italic text-cream/70 text-sm leading-relaxed" style={serif}>{result.note}</p>
              </div>

              {/* Recommended product */}
              {result.product && (
                <div
                  className="border border-gold-border/50 p-6"
                  style={{ background: 'rgba(11,10,9,0.7)' }}
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70 mb-5 text-center">Recommended for You</p>
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="relative w-28 h-28 shrink-0 bg-sh-bg mx-auto sm:mx-0">
                      {result.product.img && <Image src={result.product.img} alt={result.product.name} fill className="object-contain" unoptimized />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg italic text-cream leading-snug" style={serif}>{result.product.name}</h2>
                      <p className="text-cream/55 text-xs leading-relaxed">{result.product.desc}</p>
                      <p className="text-gold text-base" style={serif}>{result.product.price}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => addToCart({
                            slug: result.product.slug,
                            title: result.product.name,
                            price: result.product.price,
                            numericPrice: result.product.numericPrice,
                            img: result.product.img,
                          })}
                          className="bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 btn-glow transition-all"
                        >
                          Begin Your Experience
                        </button>
                        <Link
                          href={`/product/${result.product.slug}`}
                          className="border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 hover:bg-burgundy transition-all"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upsell */}
              {upsell && (
                <div
                  className="border border-gold-border/50 p-5 flex items-center gap-4"
                  style={{ background: 'rgba(11,10,9,0.7)' }}
                >
                  <div className="relative w-16 h-16 shrink-0 bg-burgundy/40">
                    {upsell.img && <Image src={upsell.img} alt={upsell.title} fill className="object-cover" unoptimized />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-gold/60 mb-0.5">Add the Mood</p>
                    <p className="italic text-cream text-sm" style={serif}>{upsell.title}</p>
                    <p className="text-gold/80 text-xs">{upsell.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart({
                      slug: upsell.slug,
                      title: upsell.title,
                      price: upsell.price,
                      numericPrice: upsell.numeric_price,
                      img: upsell.img || '',
                    })}
                    className="shrink-0 border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.15em] px-4 py-2 hover:bg-burgundy transition-all"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Retake */}
              <div className="text-center pt-2">
                <button
                  onClick={retake}
                  className="text-cream/40 text-[11px] uppercase tracking-[0.25em] hover:text-gold transition-colors"
                >
                  ↻ Retake the Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
