export interface Rating {
  id?: number;
  userId: number;
  eventId: number;
  ratingValue: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingStats {
  averageRating: number;
  ratingCount: number;
}

export interface EventWithRating {
  event: any; // Using any for now, should be Event interface
  averageRating: number;
  ratingCount: number;
}
