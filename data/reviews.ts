export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  designation?: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Knedid setlon",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.",
    designation: "Verified Buyer"
  },
  {
    id: "2",
    name: "Jenny colina",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.",
    designation: "Organic Enthusiast"
  },
  {
    id: "3",
    name: "Girard Mailak",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.",
    designation: "Regular Customer"
  },
  {
    id: "4",
    name: "Sophia Martinez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "The organic vegetables are amazingly fresh and delivered same day! Best online grocery experience I have ever had.",
    designation: "Verified Customer"
  },
  {
    id: "5",
    name: "Alexander Wright",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "High quality 100% organic honey and fresh sourdough bread. Packaged with great care and super fast express delivery.",
    designation: "Loyal Shopper"
  }
];
