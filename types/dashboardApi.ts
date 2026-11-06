export interface OrderUser {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  productSlug?: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

export interface ShippingAddressRecord {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export type OrderStatusType =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type PaymentStatusType = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderRecord {
  id: string;
  orderNumber?: string;
  userId: string | null;
  user?: OrderUser | null;
  totalAmount: number;
  status: OrderStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod: "BKASH" | "NAGAD" | "CARD" | "COD" | string;
  items?: OrderItemRecord[];
  orderItems?: OrderItemRecord[];
  shippingAddress?: ShippingAddressRecord | string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardOverviewResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: OrderRecord[];
  monthlyGoal?: {
    target: number;
    currentRevenue: number;
    percentage: number;
    currentOrders?: number;
    targetOrders?: number;
    month?: string;
    status?: string;
  };
}

export interface InventoryStat {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  healthyItems: number;
  criticalProducts: Array<{
    id: string;
    name: string;
    slug: string;
    stock: number;
    price: number;
    category: string;
  }>;
}

export interface SalesChartPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  grossProfit: number;
}

export interface FormattedDashboardMetrics {
  revenue: {
    value: number;
    formatted: string;
    growthPercent: number;
    sparkline: Array<{ date: string; value: number }>;
  };
  orders: {
    value: number;
    formatted: string;
    growthPercent: number;
    sparkline: Array<{ date: string; value: number }>;
  };
  customers: {
    value: number;
    formatted: string;
    growthPercent: number;
    sparkline: Array<{ date: string; value: number }>;
  };
  lowStock: {
    value: number;
    formatted: string;
    criticalCount: number;
    sparkline: Array<{ date: string; value: number }>;
  };
}

