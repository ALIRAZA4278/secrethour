'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import MetaPixel from '../components/MetaPixel';
import Footer from '../components/Footer';
import { MOOD_CARDS, MoodFlipCard, cardFlipStyles } from '../components/MoodCards';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };
const DECK_HREF = '/product/midnight-deck';

const STEPS = [
  { n: '01', title: '2 players — just you and your partner.' },
  { n: '02', title: 'Choose who goes first.', note: 'Flip a coin, spin a bottle, or play rock-paper-scissors.' },
  { n: '03', title: 'Draw a card.' },
  { n: '04', title: 'Read the prompt aloud.' },
  { n: '05', title: 'Perform what the card asks.' },
  { n: '06', title: 'Let your partner decide how well you did.' },
];

const SCORES = [
  { points: '1',   label: 'Point',  note: 'The prompt was completed poorly or only partially.' },
  { points: '1.5', label: 'Points', note: 'The prompt was performed well.' },
  { points: '2',   label: 'Points', note: 'The prompt was performed perfectly.' },
];

const CATEGORIES = [
  { label: 'Playful',  blurb: 'Start light. Laugh a little. Break the routine.',            traits: ['Playful interaction', 'Teasing', 'Laughter', 'Unexpected little moments'] },
  { label: 'Romantic', blurb: 'Slow down and remember what makes you choose each other.',   traits: ['Appreciation', 'Meaningful conversation', 'Memories', 'Connection'] },
  { label: 'Sensual',  blurb: 'Let the mood change.',                                       traits: ['Attraction', 'Curiosity', 'Slower moments', 'Intimate conversation'] },
  { label: 'Wild',     blurb: "Just when you think you know what's coming next.",           traits: ['Unexpected twists', 'Dares', 'Bold moments', 'Unpredictability'] },
];

const TURN_FLOW = [
  { player: 'Player 1', steps: ['Draw', 'Perform', 'Player 2 scores'] },
  { player: 'Player 2', steps: ['Draw', 'Perform', 'Player 1 scores'] },
];

const EYEBROW = 'text-gold/70 text-[10px] uppercase tracking-[0.35em]';
const H2 = 'text-2xl sm:text-3xl md:text-4xl italic text-cream leading-tight';

function RevealCard({ card, caption }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-52 sm:w-60 md:w-64">
        <MoodFlipCard
          label={card.label}
          img={card.img}
          flipped={flipped}
          onToggle={() => setFlipped(f => !f)}
          sizes="(min-width: 768px) 256px, 208px"
        />
      </div>
      <p className={EYEBROW}>{flipped ? 'Tap to hide' : caption}</p>
    </div>
  );
}

export default function HowToPlayPage() {
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <div className="bg-sh-bg text-cream min-h-screen">
      <MetaPixel />
      <Navbar />
      <style>{cardFlipStyles}</style>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="relative px-4 md:px-6 py-16 md:py-24 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 10%) 0%, hsl(20 5% 3%) 65%)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6 text-center md:text-left">
            <p className={EYEBROW}>The Midnight Deck</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl italic text-cream leading-tight" style={serif}>
              How to Play <span className="text-gold-light">The Midnight Deck</span>
            </h1>
            <p className="text-cream/55 italic text-sm md:text-base" style={serif}>
              Two people. One deck. A night you won&apos;t play the same way twice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link href={DECK_HREF}
                className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 hover:bg-[#5a1a24] text-center">
                Get The Midnight Deck
              </Link>
              <a href="#start-here"
                className="border border-gold-border text-cream/70 text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:border-gold hover:text-gold text-center">
                See How It Works
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <RevealCard card={MOOD_CARDS[1]} caption="Click to reveal" />
          </div>
        </div>
      </section>

      {/* ─── The rules are simple ────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 text-center bg-sh-bg">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className={H2} style={serif}>The rules are simple.</h2>
          <p className="text-cream/55 italic text-sm md:text-base" style={serif}>
            Two people. A deck of prompts. And a night that can go somewhere completely unexpected.
          </p>
        </div>
      </section>

      {/* ─── Start here ──────────────────────────────────────── */}
      <section id="start-here" className="px-4 md:px-6 py-16 md:py-24 scroll-mt-24"
        style={{ background: 'linear-gradient(to bottom, hsl(20 5% 3%) 0%, hsl(20 10% 5%) 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-10 md:mb-14">
            <p className={EYEBROW}>How the game begins</p>
            <h2 className={H2} style={serif}>Start here.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map(s => (
              <div key={s.n} className="border border-gold-border/40 bg-sh-card p-6 space-y-2">
                <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em]">{s.n}</span>
                <p className="text-cream text-sm leading-relaxed">{s.title}</p>
                {s.note && <p className="text-cream/45 italic text-xs" style={serif}>{s.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Your turn ───────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 text-center bg-sh-bg">
        <div className="space-y-3 mb-10">
          <p className={EYEBROW}>A single turn</p>
          <h2 className={H2} style={serif}>Your turn.</h2>
        </div>
        <div className="flex justify-center">
          <RevealCard card={MOOD_CARDS[0]} caption="Tap to reveal" />
        </div>
      </section>

      {/* ─── Scoring ─────────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24"
        style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 10%) 0%, hsl(20 5% 3%) 65%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className={EYEBROW}>Scoring</p>
          <h2 className={`${H2} mt-3`} style={serif}>Every card is worth up to 2 points.</h2>
          <p className="text-cream/55 italic text-sm mt-4 max-w-xl mx-auto" style={serif}>
            Your partner judges the performance and awards the points based on how well the prompt was completed.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-10 md:mt-14">
            {SCORES.map(s => (
              <div key={s.points} className="border border-gold-border/40 bg-sh-card p-6 space-y-2">
                <p className="text-gold text-3xl md:text-4xl" style={serif}>{s.points}</p>
                <p className="text-gold/60 text-[10px] uppercase tracking-[0.3em]">{s.label}</p>
                <p className="text-cream/55 text-xs leading-relaxed pt-1">{s.note}</p>
              </div>
            ))}
          </div>
          <p className="text-cream/45 italic text-xs mt-8" style={serif}>
            The maximum score for each prompt is always 2 points.
          </p>
        </div>
      </section>

      {/* ─── The scoreboard ──────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 bg-sh-bg">
        <div className="max-w-3xl mx-auto text-center">
          <p className={EYEBROW}>The scoreboard</p>
          <h2 className={`${H2} mt-3`} style={serif}>First to 22 wins.</h2>

          <div className="border border-gold-border/40 bg-sh-card p-6 md:p-8 mt-10 space-y-6 text-left">
            {[{ name: 'Player 1', score: 12.5 }, { name: 'Player 2', score: 10 }].map(p => (
              <div key={p.name} className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em]">{p.name}</span>
                  <span className="text-cream" style={serif}>
                    {p.score}<span className="text-cream/40 text-sm"> / 22</span>
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${(p.score / 22) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-cream/55 italic text-sm mt-6" style={serif}>First player to reach 22 points wins.</p>
          <p className="text-cream/45 text-xs mt-1">Take turns drawing and performing prompts.</p>

          <div className="mt-8 space-y-3">
            {TURN_FLOW.map(row => (
              <div key={row.player} className="flex flex-wrap items-center justify-center gap-2">
                <span className="border border-gold-border/50 text-gold/80 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                  {row.player}
                </span>
                {row.steps.map(step => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="text-gold/40">→</span>
                    <span className="border border-gold-border/30 text-cream/65 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">
                      {step}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The categories ──────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24"
        style={{ background: 'linear-gradient(to bottom, hsl(20 5% 3%) 0%, hsl(350 40% 7%) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-10 md:mb-14">
            <p className={EYEBROW}>The categories</p>
            <h2 className={H2} style={serif}>Four ways the night can unfold.</h2>
            <p className="text-cream/55 italic text-sm" style={serif}>
              Select a card to turn it over. Only one card is ever face-up.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map(cat => {
              const card = MOOD_CARDS.find(c => c.label === cat.label);
              return (
                <div key={cat.label} className="space-y-4">
                  <MoodFlipCard
                    label={cat.label}
                    img={card.img}
                    flipped={openCategory === cat.label}
                    onToggle={() => setOpenCategory(c => (c === cat.label ? null : cat.label))}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                  <div className="border border-gold-border/40 bg-sh-card p-5 space-y-2">
                    <h3 className="text-gold text-xs uppercase tracking-[0.25em]">{cat.label}</h3>
                    <p className="text-cream/60 italic text-xs leading-relaxed" style={serif}>{cat.blurb}</p>
                    <ul className="space-y-1 pt-1">
                      {cat.traits.map(t => (
                        <li key={t} className="text-cream/50 text-xs flex gap-2">
                          <span className="text-gold/40">—</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Wild twist ──────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 10%) 0%, hsl(20 5% 3%) 65%)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-center md:text-left">
            <p className={EYEBROW}>Wild twist</p>
            <h2 className={H2} style={serif}>You never quite know what&apos;s coming.</h2>
            <p className="text-cream/55 italic text-sm" style={serif}>
              Some cards include unexpected Wild twists, so you never know exactly what comes next.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <RevealCard card={MOOD_CARDS[3]} caption="Tap to reveal" />
          </div>
        </div>
      </section>

      {/* ─── Winning isn't the point ─────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 text-center bg-sh-bg">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className={H2} style={serif}>Winning isn&apos;t always the point.</h2>
          <p className="text-cream/55 italic text-sm" style={serif}>You can play to 22.</p>
          <p className="text-cream/55 italic text-sm" style={serif}>Or forget the scoreboard entirely.</p>
          <p className="text-cream/55 italic text-sm" style={serif}>
            You can simply play for connection, laughter and intimacy.
          </p>
        </div>
      </section>

      {/* ─── Closing CTA ─────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-20 md:py-28 text-center"
        style={{ background: 'radial-gradient(ellipse at top, hsl(350 50% 10%) 0%, hsl(20 5% 3%) 65%)' }}>
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className={H2} style={serif}>
            There&apos;s no wrong way to <span className="text-gold-light">spend the night.</span>
          </h2>
          <div className="space-y-2">
            {['Play seriously.', 'Laugh your way through it.', 'Ignore the scoreboard.'].map(t => (
              <p key={t} className="text-cream/55 italic text-sm" style={serif}>{t}</p>
            ))}
          </div>
          <div className="pt-2 space-y-1">
            <p className="text-cream/45 text-xs uppercase tracking-[0.2em]">The only rule that really matters:</p>
            <p className="text-gold-light italic text-lg md:text-xl" style={serif}>Enjoy the time you have together.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <Link href={DECK_HREF}
              className="bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 btn-glow transition-all duration-300 hover:bg-[#5a1a24]">
              Get The Midnight Deck
            </Link>
            <Link href="/shop"
              className="border border-gold-border text-cream/70 text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 hover:border-gold hover:text-gold">
              Explore The Experience
            </Link>
          </div>
          <p className="text-cream/45 italic text-sm pt-6" style={serif}>
            You don&apos;t need another night out.<br />
            You just need an hour that feels different.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
