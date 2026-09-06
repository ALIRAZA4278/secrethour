'use client';

import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.slug === action.item.slug);
      if (existing) {
        return state.map((i) =>
          i.slug === action.item.slug ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
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

// Returns effective unit price for an item (applies bulk discount if threshold met)
export function itemEffectivePrice(item) {
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
  const [items, dispatch] = useReducer(cartReducer, []);
  const [open, setOpen] = useState(false);

  function addToCart(item) {
    dispatch({ type: 'ADD', item });
    setOpen(true);
  }
  function removeFromCart(slug) {
    dispatch({ type: 'REMOVE', slug });
  }
  function updateQty(slug, qty) {
    dispatch({ type: 'UPDATE_QTY', slug, qty });
  }

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
