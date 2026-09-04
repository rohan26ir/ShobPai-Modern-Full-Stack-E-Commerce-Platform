import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      try {
        localStorage.setItem("shobpai_cart", JSON.stringify(state.items));
      } catch {}
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      try {
        localStorage.setItem("shobpai_cart", JSON.stringify(state.items));
      } catch {}
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; delta: number }>
    ) => {
      const { productId, delta } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === productId
      );
      if (existing) {
        const nextQty = existing.quantity + delta;
        if (nextQty <= 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          );
        } else {
          existing.quantity = nextQty;
        }
      }
      try {
        localStorage.setItem("shobpai_cart", JSON.stringify(state.items));
      } catch {}
    },
    clearCart: (state) => {
      state.items = [];
      try {
        localStorage.removeItem("shobpai_cart");
      } catch {}
    },
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
