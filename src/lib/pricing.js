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
