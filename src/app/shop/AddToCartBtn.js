'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { getSale, fmtPKR } from '../../lib/pricing';

export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Anything with choices to make has to be configured on the product page.
  const needsChoices = product.variations?.length > 0 || product.option_groups?.length > 0;

  function handle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (needsChoices) {
      router.push(`/product/${product.slug}`);
      return;
    }
    const sale = getSale(product);
    addToCart({
      slug:            product.slug,
      title:           product.title,
      price:           fmtPKR(sale.effective),
      numericPrice:    sale.effective,
      listPrice:       sale.onSale ? sale.original : null,
      img:             product.img,
      bulkDiscountQty: product.bulk_discount_qty || null,
      bulkDiscountPct: product.bulk_discount_pct || 0,
    });
  }

  return (
    <button
      onClick={handle}
      className="w-full bg-burgundy border border-gold-muted text-gold-btn-text text-[10px] uppercase tracking-[0.18em] py-3 btn-glow transition-all duration-300 hover:bg-[#5a1a24]">
      {needsChoices ? 'Select Options' : 'Add to Cart'}
    </button>
  );
}
