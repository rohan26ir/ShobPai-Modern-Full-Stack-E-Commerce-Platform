"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { Product } from "@/data/products";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  hydrateCart,
  CartItem,
} from "@/store/slices/cartSlice";
import {
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  hydrateWishlist,
} from "@/store/slices/wishlistSlice";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { FaShoppingBag, FaHeart, FaHeartBroken, FaTrashAlt } from "react-icons/fa";

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
  toggleWishlist: (product: Product) => void;
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

  // Authentication integration from AuthContext
  const { token, user: authUser, logout: authLogout } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Keep track of the last synced token to avoid redundant API calls
  const syncedTokenRef = useRef<string | null>(null);

  // Track user login state
  const isLoggedIn = Boolean(token || localUser);
  const currentUser: User | null = useMemo(() => {
    if (authUser?.email) {
      return {
        name: authUser.displayName || authUser.email.split("@")[0],
        email: authUser.email,
      };
    }
    return localUser;
  }, [authUser, localUser]);

  useEffect(() => {
    const storedAuth = localStorage.getItem("shobpai_logged_in");
    const storedEmail = localStorage.getItem("shobpai_user_email");
    if (storedAuth === "true" && storedEmail) {
      setLocalUser({ name: storedEmail.split("@")[0], email: storedEmail });
    }
  }, []);

  // Database Synchronization on Login
  useEffect(() => {
    if (!token) {
      syncedTokenRef.current = null;
      return;
    }

    // Only run sync once per authenticated token session
    if (syncedTokenRef.current === token) return;
    syncedTokenRef.current = token;

    let isMounted = true;

    async function syncUserDataWithDatabase() {
      try {
        // 1. Check local storage for guest cart items to merge
        let localCart: CartItem[] = [];
        try {
          const raw = localStorage.getItem("shobpai_cart");
          if (raw) localCart = JSON.parse(raw);
        } catch {}

        if (localCart.length > 0) {
          const payload = localCart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));
          await api.syncCart(payload, token);
        }

        // 2. Check local storage for guest wishlist items to merge
        let localWishlist: Product[] = [];
        try {
          const raw = localStorage.getItem("shobpai_wishlist");
          if (raw) localWishlist = JSON.parse(raw);
        } catch {}

        if (localWishlist.length > 0) {
          const productIds = localWishlist.map((p) => p.id);
          await api.syncWishlist(productIds, token);
        }

        // 3. Fetch canonical cart from Neon Database
        const dbCart = await api.getMyCart(token);
        if (isMounted && Array.isArray(dbCart)) {
          dispatch(hydrateCart(dbCart));
          try {
            localStorage.setItem("shobpai_cart", JSON.stringify(dbCart));
          } catch {}
        }

        // 4. Fetch canonical wishlist from Neon Database
        const dbWishlist = await api.getMyWishlist(token);
        if (isMounted && Array.isArray(dbWishlist)) {
          dispatch(hydrateWishlist(dbWishlist));
          try {
            localStorage.setItem("shobpai_wishlist", JSON.stringify(dbWishlist));
          } catch {}
        }
      } catch (error) {
        console.warn("[Cart/Wishlist DB Sync] Could not sync with database:", error);
      }
    }

    syncUserDataWithDatabase();

    return () => {
      isMounted = false;
    };
  }, [token, dispatch]);

  const login = (email: string) => {
    const u = { name: email.split("@")[0] || "User", email };
    setLocalUser(u);
    localStorage.setItem("shobpai_logged_in", "true");
    localStorage.setItem("shobpai_user_email", email);
  };

  const logout = async () => {
    setLocalUser(null);
    syncedTokenRef.current = null;
    localStorage.removeItem("shobpai_logged_in");
    localStorage.removeItem("shobpai_user_email");
    if (authLogout) {
      await authLogout();
    }
  };

  // Cart actions with Optimistic UI + PostgreSQL Sync
  const addToCart = (product: Product, quantity: number = 1) => {
    // 1. Optimistic update
    dispatch(addToCartAction({ product, quantity }));
    toast.success(`Added ${quantity > 1 ? `${quantity}x ` : ""}${product.name} to cart!`, {
      icon: <FaShoppingBag className="text-[#E5A842] text-lg shrink-0" />,
    });

    // 2. Background DB persist if logged in
    if (token) {
      api.addToCart(product.id, quantity, token).catch((err) => {
        console.warn("[Cart DB] Failed to save addToCart:", err);
      });
    }
  };

  const removeFromCart = (productId: string) => {
    // 1. Optimistic update
    dispatch(removeFromCartAction(productId));
    toast.success("Item removed from cart", {
      icon: <FaTrashAlt className="text-gray-400 text-lg shrink-0" />,
    });

    // 2. Background DB persist if logged in
    if (token) {
      api.removeFromCart(productId, token).catch((err) => {
        console.warn("[Cart DB] Failed to save removeFromCart:", err);
      });
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    // 1. Optimistic update
    dispatch(updateQuantityAction({ productId, delta }));

    // 2. Background DB persist if logged in
    if (token) {
      api.updateCartQuantity(productId, { delta }, token).catch((err) => {
        console.warn("[Cart DB] Failed to save updateQuantity:", err);
      });
    }
  };

  const clearCart = () => {
    // 1. Optimistic update
    dispatch(clearCartAction());
    toast("Cart cleared", {
      icon: <FaTrashAlt className="text-red-400 text-lg shrink-0" />,
    });

    // 2. Background DB persist if logged in
    if (token) {
      api.clearCart(token).catch((err) => {
        console.warn("[Cart DB] Failed to clear cart:", err);
      });
    }
  };

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cartItems]
  );

  // Wishlist actions with Optimistic UI + PostgreSQL Sync
  const addToWishlist = (product: Product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (!exists) {
      dispatch(addToWishlistAction(product));
      toast.success(`Added ${product.name} to wishlist!`, {
        icon: <FaHeart className="text-red-500 text-lg shrink-0" />,
      });
      if (token) {
        api.toggleWishlist(product.id, token).catch((err) => {
          console.warn("[Wishlist DB] Failed to save addToWishlist:", err);
        });
      }
    }
  };

  const removeFromWishlist = (productId: string) => {
    dispatch(removeFromWishlistAction(productId));
    toast("Removed from wishlist", {
      icon: <FaHeartBroken className="text-gray-400 text-lg shrink-0" />,
    });
    if (token) {
      api.removeFromWishlist(productId, token).catch((err) => {
        console.warn("[Wishlist DB] Failed to save removeFromWishlist:", err);
      });
    }
  };

  const toggleWishlist = (product: Product) => {
    const isSaved = wishlistItems.some((item) => item.id === product.id);
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
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
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isLoggedIn,
        user: currentUser,
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
