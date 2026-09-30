export const RATINGS = ["L", "6", "10", "12", "14", "16", "18"] as const;

export type Rating = (typeof RATINGS)[number];

export interface Movie {
  id: string;
  title: string;
  release_year: number;
  genre: string;
  duration: number;
  rating: Rating;
  created_at: string;
}

export interface MovieFilters {
  search?: string;
}

export interface CreateMovieDTO {
  title: string;
  release_year: number;
  genre: string;
  duration: number;
  rating: Rating;
}

export type UpdateMovieDTO = Partial<CreateMovieDTO>;
