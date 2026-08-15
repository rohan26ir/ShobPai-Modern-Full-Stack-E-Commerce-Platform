export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  commentsCount: number;
  snippet: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "10 Reasons Why Organic Vegetables Benefit Your Immunity",
    slug: "reasons-organic-vegetables-benefit-immunity",
    category: "Health & Nutrition",
    date: "Aug 12, 2026",
    commentsCount: 8,
    snippet: "Discover how pesticides-free farm harvests retain 40% more antioxidants and vitamins for your family.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "blog-2",
    title: "Top 5 Fresh Farm Smoothie Recipes for Summer Energy",
    slug: "top-fresh-farm-smoothie-recipes",
    category: "Recipes",
    date: "Aug 08, 2026",
    commentsCount: 14,
    snippet: "Blend these seasonal organic fruits with spinach and honey for a nutrient-packed daily recharge.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "blog-3",
    title: "How ShobPai Connects Local Organic Farmers to Your Table",
    slug: "connecting-local-organic-farmers",
    category: "Farming",
    date: "Aug 02, 2026",
    commentsCount: 5,
    snippet: "Learn how our direct-from-field supply chain ensures vegetables reach your kitchen within 24 hours of harvest.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
  },
];
