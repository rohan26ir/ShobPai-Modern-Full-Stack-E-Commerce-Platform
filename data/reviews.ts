export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  designation?: string;
  adminReply?: string;
  adminReplyAt?: string;
}

// All fake reviews removed - real reviews are loaded dynamically from Neon PostgreSQL backend
export const reviews: Review[] = [];
