export type Rating = "L" | "6" | "10" | "12" | "14" | "16" | "18";

export interface Movie {
  id?: string;
  title: string;
  release_year: number;
  genre: string;
  duration: number;
  rating: Rating;
  created_at?: string;
}

export interface RatingOption {
  value: Rating;
  description: string;
}
