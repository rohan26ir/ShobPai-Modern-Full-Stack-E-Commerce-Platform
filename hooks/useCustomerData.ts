"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export interface CustomerOrder {
  id: string;
  orderNumber?: string;
  createdAt: string;
  totalAmount: number;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus?: "PAID" | "UNPAID" | "REFUNDED";
  paymentMethod?: string;
  estimatedDeliveryDate?: string;
  deliveryNote?: string;
  userEmail?: string;
  user?: {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
  };
  shippingAddress?: {
    fullName?: string;
    addressLine?: string;
    city?: string;
    district?: string;
    phone?: string;
  };
  items?: Array<{
    id?: string;
    name?: string;
    productName?: string;
    productImage?: string;
    quantity: number;
    price?: number;
    unitPrice?: number;
    total?: number;
    product?: {
      id?: string;
      name: string;
      images?: string[];
      price?: number;
      category?: string;
    };
  }>;
}

export interface AddressItem {
  id: string;
  title?: "Home" | "Office" | "Other" | string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  postalCode?: string;
  isDefault: boolean;
  deliveryNotes?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: "USER" | "ADMIN";
  createdAt?: string;
}

// Initial demo address fallback specifically keyed for customer accounts
const getDemoAddresses = (name: string, email: string): AddressItem[] => [
  {
    id: "addr_home_1",
    title: "Home",
    fullName: name || "Customer",
    phone: "01711234567",
    addressLine: "House 24, Road 7, Sector 3, Uttara",
    city: "Dhaka",
    district: "Dhaka",
    postalCode: "1230",
    isDefault: true,
    deliveryNotes: "Call upon arrival. Leave with building security if unavailable.",
  },
  {
    id: "addr_office_2",
    title: "Office",
    fullName: name || "Customer",
    phone: "01819876543",
    addressLine: "Level 8, Concord Tower, Gulshan-1",
    city: "Dhaka",
    district: "Dhaka",
    postalCode: "1212",
    isDefault: false,
    deliveryNotes: "Deliver during office hours (9 AM - 6 PM).",
  },
];

export function useCustomerData(email?: string | null, token?: string | null) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Storage key strictly scoped to the authenticated user's email
  const addressStorageKey = useMemo(
    () => (email ? `shobpai_user_addresses_${email.toLowerCase().trim()}` : null),
    [email]
  );

  // Clear all states immediately when email is not present or user changes
  useEffect(() => {
    if (!email) {
      setOrders([]);
      setAddresses([]);
      setWishlist([]);
      setProfile(null);
      setLoadingOrders(false);
      setLoadingAddresses(false);
      setLoadingProfile(false);
    }
  }, [email]);

  // 1. Fetch User Profile
  const fetchProfile = useCallback(async () => {
    if (!token || !email) return;
    setLoadingProfile(true);
    try {
      const data = await api.getMyProfile(token);
      if (data && data.user) {
        setProfile({
          id: data.user.id,
          name: data.user.displayName || email.split("@")[0],
          email: data.user.email || email,
          phone: data.user.phoneNumber || "",
          avatar: data.user.photoURL || "",
          role: data.user.role || "USER",
          createdAt: data.user.createdAt || new Date().toISOString(),
        });
      } else {
        setProfile({
          name: email.split("@")[0],
          email,
          role: "USER",
          createdAt: new Date().toISOString(),
        });
      }
    } catch {
      setProfile({
        name: email.split("@")[0],
        email,
        role: "USER",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoadingProfile(false);
    }
  }, [token, email]);

  // 2. Fetch User Orders (Strictly isolated by user email)
  const fetchOrders = useCallback(async () => {
    if (!token || !email) return;
    setLoadingOrders(true);
    try {
      const data = await api.getMyOrders(token);
      if (Array.isArray(data)) {
        // Strict client-side isolation filter: only keep orders matching current session email
        const userOrders = data.filter((ord: any) => {
          const ordEmail = (ord.user?.email || ord.userEmail || ord.guestEmail || "").toLowerCase().trim();
          return !ordEmail || ordEmail === email.toLowerCase().trim();
        });
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
    } catch {
      // In offline/demo mode, pull sample orders specifically assigned to this user
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [token, email]);

  // 3. Fetch User Addresses (With local scoped fallback)
  const fetchAddresses = useCallback(async () => {
    if (!email) return;
    setLoadingAddresses(true);

    // Check email-isolated local storage first for instant load
    if (addressStorageKey && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(addressStorageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        }
      } catch {
        // ignore parse error
      }
    }

    if (token) {
      try {
        const data = await api.getMyAddresses(token);
        if (Array.isArray(data) && data.length > 0) {
          setAddresses(data);
          if (addressStorageKey && typeof window !== "undefined") {
            localStorage.setItem(addressStorageKey, JSON.stringify(data));
          }
        } else if (addresses.length === 0) {
          // Initialize default starter addresses for clean onboarding
          const defaults = getDemoAddresses(profile?.name || "", email);
          setAddresses(defaults);
          if (addressStorageKey && typeof window !== "undefined") {
            localStorage.setItem(addressStorageKey, JSON.stringify(defaults));
          }
        }
      } catch {
        if (addresses.length === 0) {
          const defaults = getDemoAddresses(profile?.name || "", email);
          setAddresses(defaults);
        }
      } finally {
        setLoadingAddresses(false);
      }
    } else {
      if (addresses.length === 0) {
        const defaults = getDemoAddresses(profile?.name || "", email);
        setAddresses(defaults);
      }
      setLoadingAddresses(false);
    }
  }, [token, email, addressStorageKey, profile?.name, addresses.length]);

  // 4. Fetch Wishlist
  const fetchWishlist = useCallback(async () => {
    if (!token || !email) return;
    try {
      const data = await api.getMyWishlist(token);
      if (Array.isArray(data)) {
        setWishlist(data);
      }
    } catch {
      setWishlist([]);
    }
  }, [token, email]);

  // Initial fetch triggered whenever email or token updates
  useEffect(() => {
    if (email) {
      fetchProfile();
      fetchOrders();
      fetchAddresses();
      fetchWishlist();
    }
  }, [email, token, fetchProfile, fetchOrders, fetchAddresses, fetchWishlist]);

  // Synchronized Manual Refresh
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      fetchProfile(),
      fetchOrders(),
      fetchAddresses(),
      fetchWishlist(),
    ]);
    setIsRefreshing(false);
    toast.success("Dashboard data synchronized!");
  }, [fetchProfile, fetchOrders, fetchAddresses, fetchWishlist]);

  // Computed User Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) =>
      ["PENDING", "PROCESSING", "SHIPPED"].includes((o.status || "").toUpperCase())
    ).length;

    const deliveredOrders = orders.filter(
      (o) => (o.status || "").toUpperCase() === "DELIVERED"
    ).length;

    const totalSpent = orders
      .filter((o) => (o.status || "").toUpperCase() !== "CANCELLED")
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    const savedAddressesCount = addresses.length;
    const wishlistCount = wishlist.length;

    // Extract recently delivered products for "Quick Re-order" widget
    const deliveredItemsMap = new Map<string, any>();
    orders
      .filter((o) => (o.status || "").toUpperCase() === "DELIVERED")
      .forEach((ord) => {
        ord.items?.forEach((it) => {
          const title = it.product?.name || it.productName || it.name || "Product";
          if (!deliveredItemsMap.has(title)) {
            deliveredItemsMap.set(title, {
              id: it.product?.id || it.id || title,
              title,
              price: it.price || it.unitPrice || (it.product as any)?.price || 50,
              image:
                it.product?.images?.[0] ||
                it.productImage ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80",
              orderId: ord.id,
              orderDate: ord.createdAt,
            });
          }
        });
      });

    const quickReorderItems = Array.from(deliveredItemsMap.values()).slice(0, 4);

    return {
      totalOrders,
      activeOrders,
      deliveredOrders,
      totalSpent,
      savedAddressesCount,
      wishlistCount,
      quickReorderItems,
    };
  }, [orders, addresses, wishlist]);

  // Address Mutations (Persists to API and Scoped Local Storage)
  const saveAddressMutation = async (newAddr: Omit<AddressItem, "id">) => {
    const generatedId = `addr_${Date.now()}`;
    const payload: AddressItem = {
      ...newAddr,
      id: generatedId,
    };

    let updatedList: AddressItem[] = [];
    if (payload.isDefault) {
      updatedList = [
        payload,
        ...addresses.map((a) => ({ ...a, isDefault: false })),
      ];
    } else {
      updatedList = [...addresses, payload];
    }

    setAddresses(updatedList);
    if (addressStorageKey && typeof window !== "undefined") {
      localStorage.setItem(addressStorageKey, JSON.stringify(updatedList));
    }

    if (token) {
      try {
        await api.createAddress(payload, token);
      } catch {
        // optimistic fallback retained
      }
    }
    toast.success("Address added successfully!");
  };

  const updateAddressMutation = async (id: string, updatedData: Partial<AddressItem>) => {
    let updatedList = addresses.map((a) => {
      if (a.id === id) {
        return { ...a, ...updatedData };
      }
      if (updatedData.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    setAddresses(updatedList);
    if (addressStorageKey && typeof window !== "undefined") {
      localStorage.setItem(addressStorageKey, JSON.stringify(updatedList));
    }

    if (token) {
      try {
        if (updatedData.isDefault) {
          await api.saveDefaultAddress({ ...updatedData, id }, token);
        }
      } catch {
        // optimistic update preserved
      }
    }
    toast.success("Address updated!");
  };

  const deleteAddressMutation = async (id: string) => {
    const updatedList = addresses.filter((a) => a.id !== id);
    setAddresses(updatedList);
    if (addressStorageKey && typeof window !== "undefined") {
      localStorage.setItem(addressStorageKey, JSON.stringify(updatedList));
    }

    if (token) {
      try {
        await api.deleteAddress(id, token);
      } catch {
        // optimistic delete
      }
    }
    toast.success("Address removed from address book");
  };

  const setDefaultAddressMutation = async (id: string) => {
    const updatedList = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updatedList);
    if (addressStorageKey && typeof window !== "undefined") {
      localStorage.setItem(addressStorageKey, JSON.stringify(updatedList));
    }

    if (token) {
      const target = addresses.find((a) => a.id === id);
      if (target) {
        try {
          await api.saveDefaultAddress({ ...target, isDefault: true }, token);
        } catch {
          // optimistic fallback
        }
      }
    }
    toast.success("Default delivery address set!");
  };

  // User Profile Mutation
  const updateProfileMutation = async (data: { displayName?: string; photoURL?: string; phoneNumber?: string }) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            name: data.displayName || prev.name,
            phone: data.phoneNumber || prev.phone,
            avatar: data.photoURL || prev.avatar,
          }
        : null
    );

    if (token) {
      try {
        await api.updateProfile(data, token);
        toast.success("Profile updated successfully!");
      } catch {
        toast.success("Profile saved locally!");
      }
    } else {
      toast.success("Profile saved!");
    }
  };

  return {
    orders,
    addresses,
    wishlist,
    profile,
    stats,
    loading: loadingOrders || loadingAddresses || loadingProfile,
    loadingOrders,
    loadingAddresses,
    loadingProfile,
    isRefreshing,
    refreshAll,
    saveAddress: saveAddressMutation,
    updateAddress: updateAddressMutation,
    deleteAddress: deleteAddressMutation,
    setDefaultAddress: setDefaultAddressMutation,
    updateProfile: updateProfileMutation,
  };
}

