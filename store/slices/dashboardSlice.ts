import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { api } from "@/lib/api";

const CACHE_TTL = 120_000; // 2 minutes in milliseconds

export interface AdminOverviewData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: any[];
}

export interface DashboardCustomer {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  ordersCount: number;
  createdAt: string;
}

export interface DashboardState {
  overview: {
    data: AdminOverviewData | null;
    lastFetched: number;
    loading: boolean;
    error: string | null;
  };
  orders: {
    items: any[];
    lastFetched: number;
    loading: boolean;
    updatingId: string | null;
    error: string | null;
    page: number;
    pageSize: number;
    statusFilter: string;
    search: string;
  };
  customers: {
    items: DashboardCustomer[];
    lastFetched: number;
    loading: boolean;
    updatingId: string | null;
    error: string | null;
    page: number;
    pageSize: number;
    search: string;
  };
}

const initialState: DashboardState = {
  overview: {
    data: null,
    lastFetched: 0,
    loading: false,
    error: null,
  },
  orders: {
    items: [],
    lastFetched: 0,
    loading: false,
    updatingId: null,
    error: null,
    page: 1,
    pageSize: 10,
    statusFilter: "ALL",
    search: "",
  },
  customers: {
    items: [],
    lastFetched: 0,
    loading: false,
    updatingId: null,
    error: null,
    page: 1,
    pageSize: 10,
    search: "",
  },
};

// Async Thunk: Fetch Admin Overview with Caching
export const fetchAdminOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  async (
    payload: { token: string; force?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { lastFetched, data } = state.dashboard.overview;
    const isFresh = Date.now() - lastFetched < CACHE_TTL;

    if (!payload.force && isFresh && data) {
      return data;
    }

    try {
      const result = await api.getAdminOverview(payload.token);
      return result;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load admin overview");
    }
  }
);

// Async Thunk: Fetch Orders with Caching (Admin or Customer)
export const fetchDashboardOrders = createAsyncThunk(
  "dashboard/fetchOrders",
  async (
    payload: { token: string; isAdmin: boolean; force?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { lastFetched, items } = state.dashboard.orders;
    const isFresh = Date.now() - lastFetched < CACHE_TTL;

    if (!payload.force && isFresh && items.length > 0) {
      return items;
    }

    try {
      if (payload.isAdmin) {
        const data = await api.adminListOrders(undefined, payload.token);
        return Array.isArray(data) ? data : [];
      } else {
        const data = await api.getMyOrders(payload.token);
        return Array.isArray(data) ? data : [];
      }
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load orders");
    }
  }
);

// Async Thunk: Update Order Status (Optimistic + Backend)
export const updateOrderStatusThunk = createAsyncThunk(
  "dashboard/updateOrderStatus",
  async (
    payload: { orderId: string; status: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      await api.adminUpdateOrderStatus(payload.orderId, payload.status, payload.token);
      return { orderId: payload.orderId, status: payload.status };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to update order status");
    }
  }
);

// Async Thunk: Fetch Customers with Caching
export const fetchDashboardCustomers = createAsyncThunk(
  "dashboard/fetchCustomers",
  async (
    payload: { token: string; force?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const { lastFetched, items } = state.dashboard.customers;
    const isFresh = Date.now() - lastFetched < CACHE_TTL;

    if (!payload.force && isFresh && items.length > 0) {
      return items;
    }

    try {
      const data = await api.getAdminUsers(payload.token);
      if (Array.isArray(data)) {
        const mapped: DashboardCustomer[] = data.map((u: any) => ({
          id: u.id,
          firebaseUid: u.firebaseUid,
          name: u.displayName || u.email?.split("@")[0] || "User",
          email: u.email || "No email",
          phone: u.phoneNumber || "N/A",
          role: u.role || "USER",
          ordersCount: u._count?.orders || 0,
          createdAt: u.createdAt,
        }));
        return mapped;
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load customers");
    }
  }
);

// Async Thunk: Update Customer Role (Optimistic + Backend)
export const updateCustomerRoleThunk = createAsyncThunk(
  "dashboard/updateCustomerRole",
  async (
    payload: { userId: string; role: "USER" | "ADMIN"; token: string },
    { rejectWithValue }
  ) => {
    try {
      await api.updateUserRole(payload.userId, payload.role, payload.token);
      return { userId: payload.userId, role: payload.role };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to update customer role");
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Orders pagination & filters
    setOrdersPage: (state, action: PayloadAction<number>) => {
      state.orders.page = action.payload;
    },
    setOrdersPageSize: (state, action: PayloadAction<number>) => {
      state.orders.pageSize = action.payload;
      state.orders.page = 1; // Reset to page 1 on page size change
    },
    setOrdersStatusFilter: (state, action: PayloadAction<string>) => {
      state.orders.statusFilter = action.payload;
      state.orders.page = 1;
    },
    setOrdersSearch: (state, action: PayloadAction<string>) => {
      state.orders.search = action.payload;
      state.orders.page = 1;
    },
    invalidateOrdersCache: (state) => {
      state.orders.lastFetched = 0;
    },

    // Customers pagination & filters
    setCustomersPage: (state, action: PayloadAction<number>) => {
      state.customers.page = action.payload;
    },
    setCustomersPageSize: (state, action: PayloadAction<number>) => {
      state.customers.pageSize = action.payload;
      state.customers.page = 1;
    },
    setCustomersSearch: (state, action: PayloadAction<string>) => {
      state.customers.search = action.payload;
      state.customers.page = 1;
    },
    invalidateCustomersCache: (state) => {
      state.customers.lastFetched = 0;
    },
    invalidateOverviewCache: (state) => {
      state.overview.lastFetched = 0;
    },
  },
  extraReducers: (builder) => {
    // Admin Overview
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.overview.loading = true;
        state.overview.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.overview.loading = false;
        state.overview.data = action.payload;
        state.overview.lastFetched = Date.now();
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.overview.loading = false;
        state.overview.error = action.payload as string;
      });

    // Orders
    builder
      .addCase(fetchDashboardOrders.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(fetchDashboardOrders.fulfilled, (state, action) => {
        state.orders.loading = false;
        state.orders.items = action.payload;
        state.orders.lastFetched = Date.now();
      })
      .addCase(fetchDashboardOrders.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload as string;
      })
      .addCase(updateOrderStatusThunk.pending, (state, action) => {
        state.orders.updatingId = action.meta.arg.orderId;
        // Optimistically update order
        const item = state.orders.items.find((o) => o.id === action.meta.arg.orderId);
        if (item) {
          item.status = action.meta.arg.status;
        }
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.orders.updatingId = null;
        const item = state.orders.items.find((o) => o.id === action.payload.orderId);
        if (item) {
          item.status = action.payload.status;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state) => {
        state.orders.updatingId = null;
      });

    // Customers
    builder
      .addCase(fetchDashboardCustomers.pending, (state) => {
        state.customers.loading = true;
        state.customers.error = null;
      })
      .addCase(fetchDashboardCustomers.fulfilled, (state, action) => {
        state.customers.loading = false;
        state.customers.items = action.payload;
        state.customers.lastFetched = Date.now();
      })
      .addCase(fetchDashboardCustomers.rejected, (state, action) => {
        state.customers.loading = false;
        state.customers.error = action.payload as string;
      })
      .addCase(updateCustomerRoleThunk.pending, (state, action) => {
        state.customers.updatingId = action.meta.arg.userId;
        const cust = state.customers.items.find((c) => c.id === action.meta.arg.userId);
        if (cust) {
          cust.role = action.meta.arg.role;
        }
      })
      .addCase(updateCustomerRoleThunk.fulfilled, (state, action) => {
        state.customers.updatingId = null;
        const cust = state.customers.items.find((c) => c.id === action.payload.userId);
        if (cust) {
          cust.role = action.payload.role;
        }
      })
      .addCase(updateCustomerRoleThunk.rejected, (state) => {
        state.customers.updatingId = null;
      });
  },
});

export const {
  setOrdersPage,
  setOrdersPageSize,
  setOrdersStatusFilter,
  setOrdersSearch,
  invalidateOrdersCache,
  setCustomersPage,
  setCustomersPageSize,
  setCustomersSearch,
  invalidateCustomersCache,
  invalidateOverviewCache,
} = dashboardSlice.actions;

// Base Selectors
const selectOrdersState = (state: RootState) => state.dashboard.orders;
const selectCustomersState = (state: RootState) => state.dashboard.customers;
export const selectOverviewState = (state: RootState) => state.dashboard.overview;

// Memoized Selectors for Orders
export const selectFilteredOrders = createSelector(
  [selectOrdersState],
  (ordersState) => {
    const { items, statusFilter, search } = ordersState;
    const query = search.trim().toLowerCase();

    return items.filter((order) => {
      const matchStatus = statusFilter === "ALL" || order.status === statusFilter;
      if (!matchStatus) return false;

      if (!query) return true;
      const orderNum = (order.orderNumber || order.id || "").toLowerCase();
      const customer = (order.user?.displayName || order.guestName || order.user?.email || "").toLowerCase();
      return orderNum.includes(query) || customer.includes(query);
    });
  }
);

export const selectPaginatedOrders = createSelector(
  [selectFilteredOrders, selectOrdersState],
  (filtered, ordersState) => {
    const { page, pageSize } = ordersState;
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      totalCount,
      totalPages,
      currentPage: safePage,
      pageSize,
    };
  }
);

export const selectOrdersStats = createSelector(
  [selectOrdersState],
  (ordersState) => {
    const items = ordersState.items;
    const total = items.length;
    const pending = items.filter((o) => o.status === "PENDING").length;
    const processing = items.filter((o) => o.status === "PROCESSING").length;
    const shipped = items.filter((o) => o.status === "SHIPPED").length;
    const delivered = items.filter((o) => o.status === "DELIVERED").length;
    const cancelled = items.filter((o) => o.status === "CANCELLED").length;

    return { total, pending, processing, shipped, delivered, cancelled };
  }
);

// Memoized Selectors for Customers
export const selectFilteredCustomers = createSelector(
  [selectCustomersState],
  (customersState) => {
    const { items, search } = customersState;
    const query = search.trim().toLowerCase();

    if (!query) return items;
    return items.filter((c) => {
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
      );
    });
  }
);

export const selectPaginatedCustomers = createSelector(
  [selectFilteredCustomers, selectCustomersState],
  (filtered, customersState) => {
    const { page, pageSize } = customersState;
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      totalCount,
      totalPages,
      currentPage: safePage,
      pageSize,
    };
  }
);

export default dashboardSlice.reducer;
