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
  const totalPrice = items.reduce((s, i) => s + i.numericPrice * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, addToCart, removeFromCart, updateQty, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
