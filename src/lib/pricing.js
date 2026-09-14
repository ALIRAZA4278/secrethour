// Sale/discount helper. `sale_price` is an admin-set fixed price (in PKR).
// A product is "on sale" when sale_price is set and lower than numeric_price.
export function getSale(product) {
  const original = Number(product?.numeric_price) || 0;
  const sale     = Number(product?.sale_price) || 0;
  const onSale   = sale > 0 && sale < original;
  return {
    onSale,
    original,                        // original price (number)
    effective: onSale ? sale : original,  // price to actually charge (number)
    pct: onSale ? Math.round((1 - sale / original) * 100) : 0,
  };
}

export const fmtPKR = (n) => `Rs. ${(Number(n) || 0).toLocaleString()}`;

// Best bundle discount reached by `count` bundle items (0 when no tier applies).
export function bundlePct(count, tiers) {
  return (tiers || []).reduce(
    (pct, t) => (count >= t.min_items && t.discount_pct > pct ? t.discount_pct : pct),
    0
  );
}

// Rounded per unit, so the bundle builder and the cart always agree to the rupee.
export function bundleUnitPrice(price, pct) {
  return Math.round(price * (1 - pct / 100));
}
