import { env } from "cloudflare:workers";
import type { TmdbSearchResult } from "@/lib/types";

const TMDB_API = "https://api.themoviedb.org/3";

type TmdbDetails = {
  id: number;
  title: string;
  original_title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  runtime?: number | null;
  production_countries?: { name: string }[];
  genres?: { id: number; name: string }[];
  credits?: {
    crew?: { job: string; name: string }[];
    cast?: { name: string; order: number }[];
  };
};

export type TmdbMovieSnapshot = {
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
};

function readToken() {
  return env.TMDB_READ_TOKEN || process.env.TMDB_READ_TOKEN || "";
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const token = readToken();
  if (!token) {
    throw new Error("TMDB_NOT_CONFIGURED");
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(`${TMDB_API}${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch {
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
      }
      throw new Error("TMDB_NETWORK");
    }

    if (response.ok) return response.json() as Promise<T>;
    if (attempt < 2 && (response.status === 429 || response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      continue;
    }
    throw new Error(`TMDB_${response.status}`);
  }

  throw new Error("TMDB_NETWORK");
}

export async function searchTmdbMovies(query: string): Promise<TmdbSearchResult[]> {
  const yearMatch = query.match(/(?:\s|\()((?:18|19|20)\d{2})\)?$/);
  const titleQuery = yearMatch ? query.slice(0, yearMatch.index).trim() : query;
  const requestedYear = yearMatch?.[1];

  type SearchMovie = {
    id: number;
    title?: string;
    original_title?: string;
    release_date?: string;
    overview?: string;
    poster_path?: string | null;
  };

  async function search(language: string, region?: string) {
    const params = new URLSearchParams({
      query: titleQuery,
      language,
      include_adult: "false",
    });
    if (region) params.set("region", region);
    if (requestedYear) params.set("primary_release_year", requestedYear);
    return tmdbFetch<{ results?: SearchMovie[] }>(`/search/movie?${params}`);
  }

  const primaryLanguage = /[a-z]/i.test(titleQuery) ? "en-US" : "zh-CN";
  const primary = await search(primaryLanguage, "CN");
  let movies = primary.results ?? [];

  const needsFallback = !movies.length
    || (requestedYear && !movies.some((movie) => movie.release_date?.startsWith(requestedYear)));
  if (needsFallback) {
    for (const language of ["zh-CN", "zh-TW", "en-US"].filter((language) => language !== primaryLanguage)) {
      try {
        const fallback = await search(language);
        const seen = new Set(movies.map((movie) => movie.id));
        movies = [...movies, ...(fallback.results ?? []).filter((movie) => !seen.has(movie.id))];
      } catch {
        // The primary search is still useful if an optional language fallback fails.
      }
    }
  }

  movies.sort((a, b) => {
    if (!requestedYear) return 0;
    return Number(b.release_date?.startsWith(requestedYear)) - Number(a.release_date?.startsWith(requestedYear));
  });

  if (requestedYear) {
    const exactYearMatches = movies.filter((movie) => movie.release_date?.startsWith(requestedYear));
    movies = exactYearMatches;
  }

  return movies.slice(0, 12).map((movie) => ({
    id: movie.id,
    title: movie.title || movie.original_title || "未命名电影",
    originalTitle: movie.original_title || movie.title || "未命名电影",
    releaseDate: movie.release_date || null,
    overview: movie.overview || "",
    posterPath: movie.poster_path || null,
  }));
}

export async function getTmdbMovieSnapshot(tmdbId: number): Promise<TmdbMovieSnapshot> {
  const params = new URLSearchParams({
    language: "zh-CN",
    append_to_response: "credits,images",
    include_image_language: "zh,en,null",
  });
  const movie = await tmdbFetch<TmdbDetails>(`/movie/${tmdbId}?${params}`);

  if (!movie.overview) {
    for (const language of ["zh-TW", "en-US"]) {
      try {
        const fallback = await tmdbFetch<TmdbDetails>(`/movie/${tmdbId}?language=${language}`);
        if (fallback.overview) {
          movie.overview = fallback.overview;
          break;
        }
      } catch {
        // Keep the main movie data when an optional translation is unavailable.
      }
    }
  }

  const director = movie.credits?.crew?.find((person) => person.job === "Director")?.name ?? "";
  const cast = [...(movie.credits?.cast ?? [])]
    .sort((a, b) => a.order - b.order)
    .slice(0, 8)
    .map((person) => person.name);

  return {
    tmdbId: movie.id,
    slug: makeSlug(movie.original_title || movie.title, movie.id),
    title: movie.title || movie.original_title || "未命名电影",
    originalTitle: movie.original_title || movie.title || "未命名电影",
    releaseDate: movie.release_date || null,
    countries: (movie.production_countries ?? []).map((country) => country.name),
    runtime: movie.runtime ?? null,
    overview: movie.overview || "",
    posterPath: movie.poster_path || null,
    director,
    cast,
    genres: movie.genres ?? [],
  };
}

function makeSlug(title: string, tmdbId: number) {
  const base = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  return `${base || "movie"}-${tmdbId}`;
}

export function tmdbPosterUrl(path: string | null, size: "w342" | "w500" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
