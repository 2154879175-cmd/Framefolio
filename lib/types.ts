export type MovieStatus = "draft" | "published";

export type Movie = {
  id: number;
  tmdbId: number;
  slug: string;
  title: string;
  originalTitle: string;
  releaseDate: string | null;
  countries: string[];
  runtime: number | null;
  overview: string;
  posterPath: string | null;
  director: string;
  cast: string[];
  genres: { id: number; name: string }[];
  rating: number | null;
  watchedOn: string | null;
  shortReview: string;
  longReview: string;
  containsSpoilers: boolean;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type MovieListFilters = {
  query?: string;
  genre?: string;
  ratingMin?: number;
  sort?: "watched" | "rating" | "release";
  page?: number;
};

export type MovieListResult = {
  movies: Movie[];
  page: number;
  totalPages: number;
  total: number;
};

export type TmdbSearchResult = {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string | null;
  overview: string;
  posterPath: string | null;
};

export type MovieUpdate = {
  rating: number | null;
  watchedOn: string | null;
  shortReview: string;
  longReview: string;
  containsSpoilers: boolean;
  status: "draft" | "published";
};
