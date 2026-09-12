'use client';

import Image from 'next/image';

export const CARD_BACK = '/assets/CARDS/card-back.png';

export const MOOD_CARDS = [
  { label: 'Playful',  img: '/assets/CARDS/playful.png' },
  { label: 'Romantic', img: '/assets/CARDS/romantic.png' },
  { label: 'Sensual',  img: '/assets/CARDS/sensual.png' },
  { label: 'Wild',     img: '/assets/CARDS/wild.png' },
];

// The card art rounds at 85px on a 1000x1400 canvas, so the frame has to round
// by the same proportion (8.5% of width = 6.07% of height) or dark wedges show
// at the corners and the reveal glow reads square. The glow stays outside the
// card so it never washes over the artwork.
export const cardFlipStyles = `
  .card-flip {
    perspective: 1500px;
    cursor: pointer;
    border-radius: 8.5% / 6.07%;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
  }
  .card-flip.is-flipped {
    box-shadow: 0 0 60px 14px rgba(214, 178, 94, 0.5);
  }
  .card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  .card-flip.is-flipped .card-flip-inner { transform: rotateY(180deg); }
  .card-flip-face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 8.5% / 6.07%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .card-flip-back { transform: rotateY(180deg); }
`;

export function MoodFlipCard({ label, img, flipped, onToggle, style, className = '', sizes = '(min-width: 640px) 24vw, 45vw' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flipped}
      aria-label={flipped ? `${label} — tap to hide` : `Tap to reveal ${label}`}
      className={`card-flip relative aspect-5/7 w-full ${flipped ? 'is-flipped' : ''} ${className}`}
      style={style}
    >
      <div className="card-flip-inner">
        <div className="card-flip-face">
          <Image src={CARD_BACK} alt="Secret Hour — tap to reveal" fill sizes={sizes} className="object-cover" />
        </div>
        <div className="card-flip-face card-flip-back">
          <Image src={img} alt={`Secret Hour — ${label}`} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    </button>
  );
}
