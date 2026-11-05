export interface LarkonKPICard {
  id: string;
  title: string;
  value: string;
  iconType: "orders" | "leads" | "deals" | "revenue";
  change: string;
  period: string;
  isPositive: boolean;
  viewMoreHref: string;
}

export interface PerformancePoint {
  month: string;
  pageViews: number;
  clicks: number;
}

export interface TopPageItem {
  id: string;
  path: string;
  views: number;
  exitRate: string;
  rateColor: "green" | "red" | "yellow";
}

export interface LarkonRecentOrder {
  id: string;
  orderId: string;
  date: string;
  product: {
    name: string;
    image: string;
  };
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentType: "Credit Card" | "Pay Pal" | "bKash" | "Nagad";
  status: "Completed" | "Processing" | "Pending";
}

export const defaultLarkonKPIs: LarkonKPICard[] = [
  {
    id: "kpi-orders",
    title: "Total Orders",
    value: "13, 647",
    iconType: "orders",
    change: "2.3%",
    period: "Last Week",
    isPositive: true,
    viewMoreHref: "/dashboard/orders",
  },
  {
    id: "kpi-leads",
    title: "New Leads",
    value: "9, 526",
    iconType: "leads",
    change: "8.1%",
    period: "Last Month",
    isPositive: true,
    viewMoreHref: "/dashboard/customers",
  },
  {
    id: "kpi-deals",
    title: "Deals",
    value: "976",
    iconType: "deals",
    change: "0.3%",
    period: "Last Month",
    isPositive: false,
    viewMoreHref: "/dashboard/offers",
  },
  {
    id: "kpi-revenue",
    title: "Booked Rev...",
    value: "$123.6k",
    iconType: "revenue",
    change: "10.6%",
    period: "Last Month",
    isPositive: false,
    viewMoreHref: "/dashboard/analytics",
  },
];

export const performance12Months: PerformancePoint[] = [
  { month: "Jan", pageViews: 32, clicks: 8 },
  { month: "Feb", pageViews: 64, clicks: 12 },
  { month: "Mar", pageViews: 48, clicks: 6 },
  { month: "Apr", pageViews: 68, clicks: 15 },
  { month: "May", pageViews: 50, clicks: 17 },
  { month: "Jun", pageViews: 62, clicks: 13 },
  { month: "Jul", pageViews: 45, clicks: 5 },
  { month: "Aug", pageViews: 47, clicks: 8 },
  { month: "Sep", pageViews: 82, clicks: 7 },
  { month: "Oct", pageViews: 52, clicks: 28 },
  { month: "Nov", pageViews: 64, clicks: 12 },
  { month: "Dec", pageViews: 68, clicks: 35 },
];

export const topPagesList: TopPageItem[] = [
  { id: "tp-1", path: "/", views: 14820, exitRate: "2.1%", rateColor: "green" },
  { id: "tp-2", path: "/shop", views: 8460, exitRate: "4.4%", rateColor: "green" },
  { id: "tp-3", path: "/checkout", views: 3290, exitRate: "12.8%", rateColor: "yellow" },
  { id: "tp-4", path: "/dashboard", views: 2750, exitRate: "3.5%", rateColor: "green" },
  { id: "tp-5", path: "/login", views: 2180, exitRate: "5.2%", rateColor: "green" },
  { id: "tp-6", path: "/cart", views: 4890, exitRate: "8.6%", rateColor: "green" },
  { id: "tp-7", path: "/categories", views: 1940, exitRate: "3.2%", rateColor: "green" },
];

export const larkonRecentOrders: LarkonRecentOrder[] = [
  {
    id: "ord-1",
    orderId: "#RB5625",
    date: "29 April 2024",
    product: {
      name: "Ultra Slim Laptop Pro",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&q=80",
    },
    customerName: "Anna M. Hines",
    email: "anna.hines@mail.com",
    phone: "(+1)-555-1564-261",
    address: "Burr Ridge/Illinois",
    paymentType: "Credit Card",
    status: "Completed",
  },
  {
    id: "ord-2",
    orderId: "#RB9652",
    date: "25 April 2024",
    product: {
      name: "Vintage SLR Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=80&q=80",
    },
    customerName: "Judith H. Fritsche",
    email: "judith.fritsche.com",
    phone: "(+57)-305-5579-759",
    address: "SULLIVAN/Kentucky",
    paymentType: "Credit Card",
    status: "Completed",
  },
  {
    id: "ord-3",
    orderId: "#RB5984",
    date: "25 April 2024",
    product: {
      name: "Wireless ANC Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&q=80",
    },
    customerName: "Peter T. Smith",
    email: "peter.smith@mail.com",
    phone: "(+33)-655-5187-93",
    address: "Yreka/California",
    paymentType: "Pay Pal",
    status: "Completed",
  },
  {
    id: "ord-4",
    orderId: "#RB3625",
    date: "21 April 2024",
    product: {
      name: "5G OLED Smartphone",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&q=80",
    },
    customerName: "Emmanuel J. Delcid",
    email: "emmanuel.delcid@mail.com",
    phone: "(+30)-693-5553-637",
    address: "Atlanta/Georgia",
    paymentType: "Pay Pal",
    status: "Processing",
  },
  {
    id: "ord-5",
    orderId: "#RB8652",
    date: "18 April 2024",
    product: {
      name: "Smart Fitness Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&q=80",
    },
    customerName: "William J. Cook",
    email: "william.cook@mail.com",
    phone: "(+91)-855-5446-150",
    address: "Rosenberg/Texas",
    paymentType: "Credit Card",
    status: "Processing",
  },
];

