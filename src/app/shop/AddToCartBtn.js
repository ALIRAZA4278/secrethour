'use client';

import { useCart } from '../context/CartContext';

export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();

  function handle(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      slug:         product.slug,
      title:        product.title,
      price:        product.price,
      numericPrice: product.numeric_price,
      img:          product.img,
    });
  }

  return (
    <button
      onClick={handle}
      className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] py-3 btn-glow transition-all duration-300 hover:bg-[#5a1a24]">
      Add to Cart
    </button>
  );
}
