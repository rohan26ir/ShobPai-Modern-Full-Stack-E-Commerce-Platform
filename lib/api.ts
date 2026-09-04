import axios from "axios";
import { Product } from "@/data/products";
import { Category } from "@/data/categories";
import { Coupon } from "@/data/coupons";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://shobpai-api.vercel.app/api"
    : "http://localhost:5000/api");

// Axios client configured with live backend URL
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
  timeoutMs = 10000
) {
  const method = (options.method || "GET").toUpperCase();
  let data: any = undefined;

  if (options.body) {
    if (typeof options.body === "string") {
      try {
        data = JSON.parse(options.body);
      } catch {
        data = options.body;
      }
    } else {
      data = options.body;
    }
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await apiClient.request({
      url: endpoint,
      method,
      data,
      headers,
      timeout: timeoutMs,
    });
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      `Request failed (${endpoint})`;
    const formatted = Array.isArray(message) ? message.join(", ") : message;
    console.error(`[Axios API Error] (${endpoint}):`, formatted);
    throw new Error(formatted);
  }
}

// Live API Service Methods (Connected directly to Neon PostgreSQL Backend)
export const api = {
  // Auth & Profile
  syncUser: async (
    userData: {
      firebaseUid: string;
      email?: string | null;
      displayName?: string | null;
      phoneNumber?: string | null;
      photoURL?: string | null;
      role?: "USER" | "ADMIN";
    },
    token?: string | null
  ) => {
    return fetchWithAuth(
      "/auth/sync",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
      token
    );
  },

  getMyProfile: async (token: string) => {
    return fetchWithAuth("/auth/me", { method: "GET" }, token);
  },

  updateProfile: async (data: { displayName?: string; photoURL?: string; phoneNumber?: string }, token: string) => {
    return fetchWithAuth(
      "/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  },

  getMyAddresses: async (token: string) => {
    return fetchWithAuth("/auth/addresses", { method: "GET" }, token);
  },

  createAddress: async (addressData: any, token: string) => {
    return fetchWithAuth(
      "/auth/addresses",
      {
        method: "POST",
        body: JSON.stringify(addressData),
      },
      token
    );
  },

  // Products
  getProducts: async (params?: { category_slug?: string; search?: string; featured?: boolean; trending?: boolean }): Promise<Product[]> => {
    const query = new URLSearchParams();
    if (params?.category_slug) query.append("category_slug", params.category_slug);
    if (params?.search) query.append("search", params.search);
    if (params?.featured !== undefined) query.append("featured", String(params.featured));
    if (params?.trending !== undefined) query.append("trending", String(params.trending));

    const res = await fetchWithAuth(`/products?${query.toString()}`, { method: "GET" });
    const items = Array.isArray(res) ? res : (res?.data || []);
    return items;
  },

  getProduct: async (slugOrId: string): Promise<Product | null> => {
    const product = await fetchWithAuth(`/products/${slugOrId}`, { method: "GET" });
    return product || null;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const data = await fetchWithAuth("/categories", { method: "GET" });
    return Array.isArray(data) ? data : [];
  },

  // Coupons
  validateCoupon: async (code: string, subtotal: number): Promise<{ valid: boolean; discountPercentage: number; discountAmount: number; message: string }> => {
    return fetchWithAuth("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    });
  },

  // Orders
  createOrder: async (orderData: any, token?: string | null) => {
    return fetchWithAuth(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(orderData),
      },
      token
    );
  },

  getMyOrders: async (token?: string | null) => {
    return fetchWithAuth("/orders/my-orders", { method: "GET" }, token);
  },

  getOrderDetails: async (orderId: string, token?: string | null) => {
    return fetchWithAuth(`/orders/${orderId}`, { method: "GET" }, token);
  },

  // Wishlist
  getMyWishlist: async (token?: string | null) => {
    return fetchWithAuth("/wishlist", { method: "GET" }, token);
  },

  toggleWishlist: async (productId: string, token?: string | null) => {
    return fetchWithAuth(
      "/wishlist/toggle",
      {
        method: "POST",
        body: JSON.stringify({ productId }),
      },
      token
    );
  },

  // Admin APIs
  getAdminOverview: async (token?: string | null) => {
    return fetchWithAuth("/admin/overview", { method: "GET" }, token);
  },

  getAdminUsers: async (token?: string | null) => {
    return fetchWithAuth("/admin/users", { method: "GET" }, token);
  },

  updateUserRole: async (userId: string, role: "USER" | "ADMIN", token?: string | null) => {
    return fetchWithAuth(
      `/admin/users/${userId}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      },
      token
    );
  },

  adminListOrders: async (statusFilter?: string, token?: string | null) => {
    const query = statusFilter ? `?status_filter=${statusFilter}` : "";
    return fetchWithAuth(`/orders/admin/all${query}`, { method: "GET" }, token);
  },

  adminUpdateOrderStatus: async (orderId: string, status: string, token?: string | null) => {
    return fetchWithAuth(
      `/orders/${orderId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      token
    );
  },

  adminCreateProduct: async (productData: any, token?: string | null) => {
    return fetchWithAuth(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(productData),
      },
      token
    );
  },

  adminUpdateProduct: async (productId: string, productData: any, token?: string | null) => {
    return fetchWithAuth(
      `/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(productData),
      },
      token
    );
  },

  adminDeleteProduct: async (productId: string, token?: string | null) => {
    return fetchWithAuth(`/products/${productId}`, { method: "DELETE" }, token);
  },

  // Reviews
  getReviews: async (productId?: string) => {
    const query = productId ? `?product_id=${productId}` : "";
    return fetchWithAuth(`/reviews${query}`, { method: "GET" });
  },

  getMyReviews: async (token?: string | null) => {
    return fetchWithAuth("/reviews/my", { method: "GET" }, token);
  },

  createReview: async (reviewData: any, token?: string | null) => {
    return fetchWithAuth(
      "/reviews",
      {
        method: "POST",
        body: JSON.stringify(reviewData),
      },
      token
    );
  },

  deleteReview: async (reviewId: string, token?: string | null) => {
    return fetchWithAuth(`/reviews/${reviewId}`, { method: "DELETE" }, token);
  },
};
