export type TimeRange = "7D" | "30D" | "90D" | "1Y";

export interface SparklinePoint {
  date: string;
  value: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  changePercentage?: number;
  changePeriod?: string;
  isPositive?: boolean;
  trend?: "up" | "down" | "neutral";
  sparkline: SparklinePoint[];
  colorTheme: "emerald" | "amber" | "indigo" | "rose" | "blue";
  tooltip?: string;
}

export interface RevenueTrendPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  grossProfit: number;
}

export type OrderStatus = "PAID" | "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "FAILED" | "CANCELLED";

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
  };
  date: string;
  amount: number;
  status: OrderStatus;
  itemsCount: number;
  paymentMethod: "bKash" | "Nagad" | "Card" | "COD";
}

export interface TopProduct {
  id: string;
  rank: number;
  name: string;
  slug: string;
  thumbnail: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
}

export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  iconName: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface OverviewPageData {
  metrics: {
    revenue: MetricCardData;
    orders: MetricCardData;
    customers: MetricCardData;
    lowStock: MetricCardData;
  };
  trends: Record<TimeRange, RevenueTrendPoint[]>;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

