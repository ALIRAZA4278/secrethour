'use client';

import { createContext, useContext, useReducer, useState } from 'react';
import { bundlePct, bundleUnitPrice } from '../../lib/pricing';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const addQty = action.qty || 1;
      const existing = state.find((i) => i.slug === action.item.slug);
      if (existing) {
        // Adding a bundle over a product already in the cart folds it into the bundle.
        const bundleFields = action.item.bundleTiers
          ? { bundleTiers: action.item.bundleTiers, bulkDiscountQty: null, bulkDiscountPct: null }
          : {};
        return state.map((i) =>
          i.slug === action.item.slug ? { ...i, ...bundleFields, qty: i.qty + addQty } : i
        );
      }
      return [...state, { ...action.item, qty: addQty }];
    }
    case 'REMOVE':
      return state.filter((i) => i.slug !== action.slug);
    case 'UPDATE_QTY': {
      if (action.qty < 1) return state.filter((i) => i.slug !== action.slug);
      return state.map((i) =>
        i.slug === action.slug ? { ...i, qty: action.qty } : i
      );
    }
    default:
      return state;
  }
}

// The price to strike through: the pre-sale list price when the product was on
// sale, otherwise the plain unit price. `numericPrice` is already sale-adjusted,
// so without `listPrice` the cart could never show what the customer saved.
export function itemCompareAtPrice(item) {
  const list = Number(item?.listPrice) || 0;
  return list > item.numericPrice ? list : item.numericPrice;
}

// Total discount off the list price, sale and bulk combined, as a percentage.
export function itemDiscountPct(item) {
  const compareAt = itemCompareAtPrice(item);
  const eff = itemEffectivePrice(item);
  if (!(compareAt > eff)) return 0;
  return Math.round((1 - eff / compareAt) * 100);
}

// Effective unit price: the bundle discount while the bundle still qualifies,
// otherwise the bulk discount once its quantity threshold is met.
export function itemEffectivePrice(item) {
  if (item.bundlePct > 0) {
    return bundleUnitPrice(item.numericPrice, item.bundlePct);
  }
  if (
    item.bulkDiscountQty >= 2 &&
    item.bulkDiscountPct > 0 &&
    item.qty >= item.bulkDiscountQty
  ) {
    return Math.round(item.numericPrice * (1 - item.bulkDiscountPct / 100));
  }
  return item.numericPrice;
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [open, setOpen] = useState(false);

  function addToCart(item, qty) {
    dispatch({ type: 'ADD', item, qty });
    setOpen(true);
  }
  function removeFromCart(slug) {
    dispatch({ type: 'REMOVE', slug });
  }
  function updateQty(slug, qty) {
    dispatch({ type: 'UPDATE_QTY', slug, qty });
  }

  // The bundle discount is re-derived from what is still in the cart, so removing
  // bundle items drops the rest to the tier they now qualify for (or none).
  const bundleCount = cartItems.reduce((s, i) => s + (i.bundleTiers ? i.qty : 0), 0);
  const items = cartItems.map((i) =>
    i.bundleTiers ? { ...i, bundlePct: bundlePct(bundleCount, i.bundleTiers) } : i
  );

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + itemEffectivePrice(i) * i.qty, 0);
  // What the same basket would have cost at list price — drives the "you saved" line.
  const totalCompareAt = items.reduce((s, i) => s + itemCompareAtPrice(i) * i.qty, 0);
  const totalSavings = Math.max(0, totalCompareAt - totalPrice);

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, addToCart, removeFromCart, updateQty, totalItems, totalPrice, totalCompareAt, totalSavings }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
