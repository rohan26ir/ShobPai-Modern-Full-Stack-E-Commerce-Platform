export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  snippet: string;
  date: string;
  author: string;
  commentsCount: number;
  image: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "10 Health Benefits of Eating Fresh Organic Greens Daily",
    slug: "health-benefits-organic-greens",
    snippet: "Discover how incorporating raw spinach, broccoli, and kale into your everyday diet boosts immunity and vitality.",
    date: "August 10, 2026",
    author: "Vegist Team",
    commentsCount: 12,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    category: "Organic Living",
  },
  {
    id: "blog-2",
    title: "Why Farm-to-Table Organic Produce Tastes So Much Better",
    slug: "why-farm-to-table-tastes-better",
    snippet: "Learn about the natural soil nutrients and chemical-free harvesting that keep fruits juicy, sweet, and wholesome.",
    date: "August 06, 2026",
    author: "Chef Sarah",
    commentsCount: 8,
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80",
    category: "Fresh Food",
  },
  {
    id: "blog-3",
    title: "Quick & Easy Summer Detox Smoothie Recipes",
    slug: "summer-detox-smoothie-recipes",
    snippet: "Refresh your body with these 5 delicious cold-pressed fruit juices and green detox blend ideas.",
    date: "July 28, 2026",
    author: "Nutritionist Dave",
    commentsCount: 15,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
    category: "Recipes",
  },
];
