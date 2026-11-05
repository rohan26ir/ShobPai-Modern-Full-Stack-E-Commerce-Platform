export type DateRangePreset = "today" | "week" | "month" | "quarter" | "custom";
export type SalesChannel = "all" | "web" | "mobile-app" | "pos" | "social";

export interface ConversionStep {
  id: string;
  name: string;
  count: number;
  percentageOfTotal: number;
  dropoffPercentage: number;
  color: string;
}

export interface MetricComparison {
  title: string;
  value: string;
  previousValue: string;
  changePercentage: number;
  isPositive: boolean;
  benchmark?: string;
  description: string;
}

export interface PaymentMethodShare {
  name: string;
  code: "bkash" | "nagad" | "card" | "cod";
  amount: number;
  percentage: number;
  ordersCount: number;
  color: string;
}

export interface RegionalMetric {
  id: string;
  district: string;
  orders: number;
  revenue: number;
  percentageOfTotal: number;
  trend: "up" | "stable" | "down";
}

export interface RetentionCohort {
  type: "new" | "returning";
  count: number;
  percentage: number;
  revenue: number;
  avgOrderValue: number;
  color: string;
}

export interface ReturnReasonTag {
  id: string;
  reason: string;
  count: number;
  percentage: number;
  category: "product" | "logistics" | "customer";
  impactRevenue: number;
}

export interface AnalyticsPageData {
  funnel: ConversionStep[];
  comparisons: {
    aov: MetricComparison;
    clv: MetricComparison;
    cac: MetricComparison;
  };
  paymentDistribution: PaymentMethodShare[];
  regionalBreakdown: RegionalMetric[];
  retention: RetentionCohort[];
  returnRate: {
    totalReturns: number;
    returnRatePercentage: number;
    reasons: ReturnReasonTag[];
  };
}

