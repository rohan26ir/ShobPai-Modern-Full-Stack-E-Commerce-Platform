"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product } from "@/data/products";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  CartItem,
} from "@/store/slices/cartSlice";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from "@/store/slices/wishlistSlice";

export type { CartItem };

export interface User {
  name: string;
  email: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("shobpai_logged_in");
    const storedEmail = localStorage.getItem("shobpai_user_email");
    if (storedAuth === "true" && storedEmail) {
      setIsLoggedIn(true);
      setUser({ name: storedEmail.split("@")[0], email: storedEmail });
    }
  }, []);

  const login = (email: string) => {
    setIsLoggedIn(true);
    const u = { name: email.split("@")[0] || "User", email };
    setUser(u);
    localStorage.setItem("shobpai_logged_in", "true");
    localStorage.setItem("shobpai_user_email", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("shobpai_logged_in");
    localStorage.removeItem("shobpai_user_email");
  };

  // Cart actions via Redux
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch(addToCartAction({ product, quantity }));
  };

  const removeFromCart = (productId: string) => {
    dispatch(removeFromCartAction(productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    dispatch(updateQuantityAction({ productId, delta }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cartItems]
  );

  // Wishlist actions via Redux
  const addToWishlist = (product: Product) => {
    dispatch(addToWishlistAction(product));
  };

  const removeFromWishlist = (productId: string) => {
    dispatch(removeFromWishlistAction(productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
