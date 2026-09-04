"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { hydrateCart } from "./slices/cartSlice";
import { hydrateWishlist } from "./slices/wishlistSlice";
import { fetchProducts, fetchCategories } from "./slices/shopSlice";

function ReduxHydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate cart from localStorage
    try {
      const savedCart = localStorage.getItem("shobpai_cart");
      if (savedCart) {
        store.dispatch(hydrateCart(JSON.parse(savedCart)));
      }
    } catch {}

    // Hydrate wishlist from localStorage
    try {
      const savedWishlist = localStorage.getItem("shobpai_wishlist");
      if (savedWishlist) {
        store.dispatch(hydrateWishlist(JSON.parse(savedWishlist)));
      }
    } catch {}

    // Dispatch initial products and categories fetch
    store.dispatch(fetchProducts());
    store.dispatch(fetchCategories());
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxHydrator>{children}</ReduxHydrator>
    </Provider>
  );
}
