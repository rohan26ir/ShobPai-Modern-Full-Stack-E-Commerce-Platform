import { AnalyticsPageData } from "./types";

export const mockAnalyticsData: AnalyticsPageData = {
  funnel: [
    {
      id: "step-visits",
      name: "Store Visits",
      count: 48500,
      percentageOfTotal: 100,
      dropoffPercentage: 35.8,
      color: "#3B82F6", // blue-500
    },
    {
      id: "step-views",
      name: "Product Views",
      count: 31137,
      percentageOfTotal: 64.2,
      dropoffPercentage: 48.2,
      color: "#6366F1", // indigo-500
    },
    {
      id: "step-cart",
      name: "Add to Cart",
      count: 16128,
      percentageOfTotal: 33.2,
      dropoffPercentage: 42.5,
      color: "#8B5CF6", // purple-500
    },
    {
      id: "step-checkout",
      name: "Checkout Initiated",
      count: 9273,
      percentageOfTotal: 19.1,
      dropoffPercentage: 28.4,
      color: "#EC4899", // pink-500
    },
    {
      id: "step-purchase",
      name: "Completed Purchase",
      count: 6639,
      percentageOfTotal: 13.7,
      dropoffPercentage: 0,
      color: "#10B981", // emerald-500
    },
  ],

  comparisons: {
    aov: {
      title: "Average Order Value (AOV)",
      value: "$68.40",
      previousValue: "$59.80",
      changePercentage: 14.3,
      isPositive: true,
      benchmark: "Top 10% in Grocery E-Com",
      description: "Driven by cross-sell suggestions in Cart Drawer & bundle discounts",
    },
    clv: {
      title: "Customer Lifetime Value (CLV)",
      value: "$384.20",
      previousValue: "$342.00",
      changePercentage: 12.3,
      isPositive: true,
      benchmark: "5.6x CAC",
      description: "Organic repeat buyers making 4+ orders per calendar quarter",
    },
    cac: {
      title: "Customer Acquisition Cost (CAC)",
      value: "$18.50",
      previousValue: "$21.10",
      changePercentage: -12.3,
      isPositive: true, // Dropping CAC is positive
      benchmark: "LTV/CAC = 20.7",
      description: "Organic referrals and local SEO reducing paid marketing reliance",
    },
  },

  paymentDistribution: [
    {
      name: "bKash (MFS)",
      code: "bkash",
      amount: 41250,
      percentage: 42.5,
      ordersCount: 2821,
      color: "#E2136E", // bKash official brand pink
    },
    {
      name: "Nagad (MFS)",
      code: "nagad",
      amount: 24270,
      percentage: 25.0,
      ordersCount: 1660,
      color: "#F7941D", // Nagad brand orange
    },
    {
      name: "Credit / Debit Card",
      code: "card",
      amount: 19410,
      percentage: 20.0,
      ordersCount: 1328,
      color: "#3B82F6", // Blue
    },
    {
      name: "Cash on Delivery",
      code: "cod",
      amount: 12135,
      percentage: 12.5,
      ordersCount: 830,
      color: "#10B981", // Emerald
    },
  ],

  regionalBreakdown: [
    {
      id: "reg-dhaka",
      district: "Dhaka Metro",
      orders: 3450,
      revenue: 52400,
      percentageOfTotal: 52.0,
      trend: "up",
    },
    {
      id: "reg-chittagong",
      district: "Chittagong",
      orders: 1420,
      revenue: 21500,
      percentageOfTotal: 21.4,
      trend: "up",
    },
    {
      id: "reg-sylhet",
      district: "Sylhet",
      orders: 780,
      revenue: 11800,
      percentageOfTotal: 11.7,
      trend: "stable",
    },
    {
      id: "reg-rajshahi",
      district: "Rajshahi",
      orders: 590,
      revenue: 8900,
      percentageOfTotal: 8.9,
      trend: "up",
    },
    {
      id: "reg-khulna",
      district: "Khulna",
      orders: 399,
      revenue: 6100,
      percentageOfTotal: 6.0,
      trend: "stable",
    },
  ],

  retention: [
    {
      type: "new",
      count: 2450,
      percentage: 36.9,
      revenue: 33400,
      avgOrderValue: 54.50,
      color: "#6366F1",
    },
    {
      type: "returning",
      count: 4189,
      percentage: 63.1,
      revenue: 63665,
      avgOrderValue: 76.20,
      color: "#10B981",
    },
  ],

  returnRate: {
    totalReturns: 142,
    returnRatePercentage: 2.14,
    reasons: [
      {
        id: "reason-damaged",
        reason: "Produce Bruised or Damaged in Transit",
        count: 58,
        percentage: 40.8,
        category: "logistics",
        impactRevenue: 1850,
      },
      {
        id: "reason-unreachable",
        reason: "Customer Phone Unreachable on Delivery",
        count: 41,
        percentage: 28.9,
        category: "customer",
        impactRevenue: 1320,
      },
      {
        id: "reason-changed-mind",
        reason: "Customer Changed Mind / Ordered Duplicate",
        count: 26,
        percentage: 18.3,
        category: "customer",
        impactRevenue: 840,
      },
      {
        id: "reason-incorrect-item",
        reason: "Incorrect SKU Packed by Fulfillment Center",
        count: 17,
        percentage: 12.0,
        category: "product",
        impactRevenue: 540,
      },
    ],
  },
};

