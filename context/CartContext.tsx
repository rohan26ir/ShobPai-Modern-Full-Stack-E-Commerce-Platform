"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, products } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

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
  // Authentication state initialized from localStorage if available
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

  // Initialize cart with mock items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: products[0], quantity: 2 },
    { product: products[1], quantity: 1 },
  ]);

  // Wishlist state (1 item)
  const [wishlistItems, setWishlistItems] = useState<Product[]>([products[2]]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((p) => p.id === productId);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

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
