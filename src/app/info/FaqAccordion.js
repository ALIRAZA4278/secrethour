'use client';

import { useState } from 'react';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="divide-y divide-gold-border/20">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
          >
            <span className="italic text-cream text-base md:text-lg leading-snug" style={serif}>
              {item.q}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
              viewBox="0 0 24 24" stroke="currentColor"
              className={`text-gold shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {open === i && (
            <p className="pb-5 text-cream/65 text-sm leading-relaxed">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
