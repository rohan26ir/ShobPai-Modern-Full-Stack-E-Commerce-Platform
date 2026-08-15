const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    // If backend is currently offline in local dev mode, return fallback gracefully
    console.warn(`[API Call to ${endpoint}]:`, error);
    throw error;
  }
}

// API Service Methods
export const api = {
  // Auth & Profile
  syncUser: async (userData: {
    firebaseUid: string;
    email?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    role?: "USER" | "ADMIN";
  }, token?: string | null) => {
    return fetchWithAuth("/auth/sync", {
      method: "POST",
      body: JSON.stringify(userData),
    }, token);
  },

  getMyProfile: async (token: string) => {
    return fetchWithAuth("/auth/me", { method: "GET" }, token);
  },

  updateProfile: async (data: { displayName?: string; photoURL?: string; phoneNumber?: string }, token: string) => {
    return fetchWithAuth("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
  },

  getMyAddresses: async (token: string) => {
    return fetchWithAuth("/auth/addresses", { method: "GET" }, token);
  },

  createAddress: async (addressData: any, token: string) => {
    return fetchWithAuth("/auth/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    }, token);
  },

  // Products & Categories
  getProducts: async (params?: { category_slug?: string; search?: string; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category_slug) query.append("category_slug", params.category_slug);
    if (params?.search) query.append("search", params.search);
    if (params?.featured !== undefined) query.append("featured", String(params.featured));
    return fetchWithAuth(`/products?${query.toString()}`, { method: "GET" });
  },

  getProduct: async (slugOrId: string) => {
    return fetchWithAuth(`/products/${slugOrId}`, { method: "GET" });
  },

  getCategories: async () => {
    return fetchWithAuth("/categories", { method: "GET" });
  },

  // Orders
  createOrder: async (orderData: any, token: string) => {
    return fetchWithAuth("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }, token);
  },

  getMyOrders: async (token: string) => {
    return fetchWithAuth("/orders/my-orders", { method: "GET" }, token);
  },

  getOrderDetails: async (orderId: string, token: string) => {
    return fetchWithAuth(`/orders/${orderId}`, { method: "GET" }, token);
  },

  // Wishlist
  getMyWishlist: async (token: string) => {
    return fetchWithAuth("/wishlist", { method: "GET" }, token);
  },

  toggleWishlist: async (productId: string, token: string) => {
    return fetchWithAuth("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }, token);
  },

  // Admin APIs
  getAdminOverview: async (token: string) => {
    return fetchWithAuth("/admin/overview", { method: "GET" }, token);
  },

  getAdminUsers: async (token: string) => {
    return fetchWithAuth("/admin/users", { method: "GET" }, token);
  },

  updateUserRole: async (userId: string, role: "USER" | "ADMIN", token: string) => {
    return fetchWithAuth(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }, token);
  },

  adminListOrders: async (statusFilter: string | undefined, token: string) => {
    const query = statusFilter ? `?status_filter=${statusFilter}` : "";
    return fetchWithAuth(`/orders/admin/all${query}`, { method: "GET" }, token);
  },

  adminUpdateOrderStatus: async (orderId: string, status: string, token: string) => {
    return fetchWithAuth(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, token);
  },

  adminCreateProduct: async (productData: any, token: string) => {
    return fetchWithAuth("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }, token);
  },

  adminUpdateProduct: async (productId: string, productData: any, token: string) => {
    return fetchWithAuth(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }, token);
  },

  adminDeleteProduct: async (productId: string, token: string) => {
    return fetchWithAuth(`/products/${productId}`, { method: "DELETE" }, token);
  },
};
