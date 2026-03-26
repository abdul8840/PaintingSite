import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    coupon: null,
    couponDiscount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i._id === item._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, item.stock || 10);
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock || 10));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.couponDiscount = 0;
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponDiscount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
export const selectCartTotal = (state) => {
  const subtotal = state.cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const discount = state.cart.couponDiscount || 0;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  return { subtotal, shipping, discount, tax, total: Math.round((subtotal - discount + shipping + tax) * 100) / 100 };
};

export default cartSlice.reducer;