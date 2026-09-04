import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/data/products";

export interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((p) => p.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
      try {
        localStorage.setItem("shobpai_wishlist", JSON.stringify(state.items));
      } catch {}
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      try {
        localStorage.setItem("shobpai_wishlist", JSON.stringify(state.items));
      } catch {}
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      try {
        localStorage.setItem("shobpai_wishlist", JSON.stringify(state.items));
      } catch {}
    },
    hydrateWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  hydrateWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
