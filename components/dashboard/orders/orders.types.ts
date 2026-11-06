export type PaymentFilterType = "all" | "paid" | "unpaid" | "refunded";
export type SortOrderType = "newest" | "oldest" | "highest" | "lowest";
export type StatusFilterType = "ALL" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id?: string;
  name?: string;
  model?: string;
  price?: number;
  unitPrice?: number;
  quantity?: number;
  discount?: number;
  total?: number;
  product?: {
    id: string;
    name: string;
    images?: string[];
    price?: number;
    unit?: string;
  };
}

export interface ShippingAddress {
  fullName?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export interface OrderUser {
  id?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId?: string | null;
  user?: OrderUser;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  shippingAddress?: ShippingAddress;
  items?: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  discount?: number;
  discountAmount?: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
  paymentStatus?: "PAID" | "PENDING" | "UNPAID" | "REFUNDED" | string;
  paymentMethod?: string;
  createdAt: string;
  estimatedDeliveryDate?: string;
  deliveryNote?: string;
}

export interface CustomDeliveryOverride {
  deliveryDate: string;
  deliveryNote: string;
}

export interface TabCounts {
  all: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

