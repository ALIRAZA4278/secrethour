'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Shop',         href: '/shop' },
  { label: 'Card Game', href: '/product/midnight-deck' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'About',        href: '/about' },
  { label: 'Contact',      href: '/contact' },
];

const LOGO = '/logo.png';

export default function Navbar() {
  const pathname                = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setOpen, totalItems }  = useCart();


  return (
    <>
    {/* Announcement Bar */}
    <div className="w-full overflow-hidden py-1.5" style={{ background: 'hsl(350 80% 5%)' }}>
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-gold text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium px-16">
            Get 10% Off on Online Payment — Pay via Bank Transfer &nbsp;&nbsp;•&nbsp;&nbsp; Free Delivery Across Pakistan
          </span>
        ))}
      </div>
    </div>
    <nav className="w-full bg-black/90 backdrop-blur-sm border-b border-gold-border/40">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link href="/" className="relative w-40 h-11 shrink-0">
          <Image src={LOGO} alt="Secret Hour" fill className="object-contain object-left" priority unoptimized />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${
                  pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
                    ? 'text-gold'
                    : 'text-cream/75 hover:text-gold'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {searchOpen ? (
            <div className="flex items-center gap-2 border border-gold-border/60 px-3 py-1.5 bg-sh-card/80 w-44 sm:w-52">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-cream/80 placeholder:text-cream/35 text-sm outline-none w-full"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-cream/50 hover:text-cream transition-colors"
                aria-label="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button aria-label="Search" onClick={() => setSearchOpen(true)} className="text-cream/75 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          )}
          <Link href="/track" aria-label="Track order" className="text-cream/75 hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </Link>
          <button
            aria-label="Open cart"
            onClick={() => setOpen(true)}
            className="relative text-cream/75 hover:text-gold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-sh-bg text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            className="lg:hidden text-cream/75 hover:text-gold transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-black/95 border-t border-gold-border/30 px-6 py-5">
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream/75 hover:text-gold text-[11px] font-medium uppercase tracking-[0.18em] transition-colors block"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
    </>
  );
}
