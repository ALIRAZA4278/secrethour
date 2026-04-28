'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const serif = { fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)" };

export default function CartDrawer() {
  const { items, open, setOpen, removeFromCart, updateQty, totalPrice } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-sh-card border-l border-gold-border z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold-border/40">
          <h2 className="italic text-xl text-cream" style={serif}>Your Cart</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-cream/60 hover:text-cream transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-cream/45 italic text-sm text-center mt-12" style={serif}>
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.slug} className="flex gap-4 border-b border-gold-border/30 pb-4">
                <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-sh-bg">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-cream text-sm leading-snug" style={serif}>{item.title}</h3>
                  <p className="text-gold text-sm mt-0.5">{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.slug, item.qty - 1)}
                      className="text-cream/60 hover:text-cream transition-colors w-6 h-6 flex items-center justify-center border border-gold-border/40 hover:border-gold"
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="text-cream text-sm w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.slug, item.qty + 1)}
                      className="text-cream/60 hover:text-cream transition-colors w-6 h-6 flex items-center justify-center border border-gold-border/40 hover:border-gold"
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.slug)}
                      className="ml-auto text-cream/40 hover:text-cream/80 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gold-border/40 space-y-4">
            <div className="flex justify-between text-lg" style={serif}>
              <span className="text-cream italic">Total</span>
              <span className="text-gold">Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full text-center py-4 bg-burgundy border border-gold-muted text-gold-btn-text text-[11px] font-medium uppercase tracking-[0.2em] btn-glow transition-all duration-300"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
