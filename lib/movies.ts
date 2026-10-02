import { env } from "cloudflare:workers";
import type { Movie, MovieListFilters, MovieListResult, MovieUpdate } from "@/lib/types";
import { getTmdbFilmImages, type TmdbMovieSnapshot } from "@/lib/tmdb";

const PAGE_SIZE = 24;

type MovieRow = {
  id: number;
  tmdb_id: number;
  slug: string;
  title: string;
  original_title: string;
  release_date: string | null;
  countries_json: string;
  runtime: number | null;
  overview: string;
  poster_path: string | null;
  stills_json: string;
  director: string;
  cast_json: string;
  rating: number | null;
  watched_on: string | null;
  short_review: string;
  long_review: string;
  contains_spoilers: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

type GenreRow = { movie_id: number; tmdb_genre_id: number; name: string };

function db() {
  if (!env.DB) throw new Error("DB_UNAVAILABLE");
  return env.DB;
}

function jsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toMovie(row: MovieRow, genres: GenreRow[] = []): Movie {
  return {
    id: row.id,
    tmdbId: row.tmdb_id,
    slug: row.slug,
    title: row.title,
    originalTitle: row.original_title,
    releaseDate: row.release_date,
    countries: jsonArray(row.countries_json),
    runtime: row.runtime,
    overview: row.overview,
    posterPath: row.poster_path,
    stills: jsonArray(row.stills_json),
    director: row.director,
    cast: jsonArray(row.cast_json),
    genres: genres.map((genre) => ({ id: genre.tmdb_genre_id, name: genre.name })),
    rating: row.rating,
    watchedOn: row.watched_on,
    shortReview: row.short_review,
    longReview: row.long_review,
    containsSpoilers: Boolean(row.contains_spoilers),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function attachGenres(rows: MovieRow[]) {
  if (!rows.length) return [];
  const placeholders = rows.map(() => "?").join(",");
  const genres = await db()
    .prepare(`SELECT movie_id, tmdb_genre_id, name FROM movie_genres WHERE movie_id IN (${placeholders}) ORDER BY name`)
    .bind(...rows.map((row) => row.id))
    .all<GenreRow>();
  const genreRows = genres.results ?? [];
  return rows.map((row) => toMovie(row, genreRows.filter((genre) => genre.movie_id === row.id)));
}

export async function listPublishedMovies(filters: MovieListFilters = {}): Promise<MovieListResult> {
  const clauses = ["m.status = 'published'"];
  const bindings: unknown[] = [];

  if (filters.query?.trim()) {
    clauses.push("(m.title LIKE ? OR m.original_title LIKE ?)");
    const query = `%${filters.query.trim()}%`;
    bindings.push(query, query);
  }
  if (filters.genre?.trim()) {
    clauses.push("EXISTS (SELECT 1 FROM movie_genres mg WHERE mg.movie_id = m.id AND mg.name = ?)");
    bindings.push(filters.genre.trim());
  }
  if (filters.ratingMin && filters.ratingMin >= 1) {
    clauses.push("m.rating >= ?");
    bindings.push(filters.ratingMin);
  }

  const orderBy = filters.sort === "rating"
    ? "m.rating DESC, m.updated_at DESC"
    : filters.sort === "release"
      ? "m.release_date DESC, m.updated_at DESC"
      : "COALESCE(m.watched_on, m.created_at) DESC, m.updated_at DESC";
  const page = Math.max(1, Math.floor(filters.page || 1));
  const where = clauses.join(" AND ");

  const [countResult, rowsResult] = await Promise.all([
    db().prepare(`SELECT COUNT(*) AS total FROM movies m WHERE ${where}`).bind(...bindings).first<{ total: number }>(),
    db().prepare(`SELECT m.* FROM movies m WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`)
      .bind(...bindings, PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .all<MovieRow>(),
  ]);

  const total = Number(countResult?.total ?? 0);
  return {
    movies: await attachGenres(rowsResult.results ?? []),
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  };
}

export async function listGenres() {
  const result = await db().prepare(
    "SELECT DISTINCT mg.name FROM movie_genres mg JOIN movies m ON m.id = mg.movie_id WHERE m.status = 'published' ORDER BY mg.name",
  ).all<{ name: string }>();
  return (result.results ?? []).map((row) => row.name);
}

export async function getPublishedMovie(slug: string) {
  const row = await db().prepare("SELECT * FROM movies WHERE slug = ? AND status = 'published'").bind(slug).first<MovieRow>();
  if (!row) return null;
  return (await attachGenres([row]))[0] ?? null;
}

export async function listAdminMovies() {
  const result = await db().prepare(
    "SELECT * FROM movies ORDER BY CASE status WHEN 'draft' THEN 0 ELSE 1 END, updated_at DESC",
  ).all<MovieRow>();
  return attachGenres(result.results ?? []);
}

export async function getAdminMovie(id: number) {
  const row = await db().prepare("SELECT * FROM movies WHERE id = ?").bind(id).first<MovieRow>();
  if (!row) return null;
  return (await attachGenres([row]))[0] ?? null;
}

export async function createMovieFromSnapshot(snapshot: TmdbMovieSnapshot) {
  const existing = await db().prepare("SELECT id, stills_json FROM movies WHERE tmdb_id = ?").bind(snapshot.tmdbId).first<{ id: number; stills_json: string }>();
  if (existing) {
    if (!jsonArray(existing.stills_json).length && snapshot.stills.length) {
      await db().prepare("UPDATE movies SET stills_json = ? WHERE id = ? AND stills_json = '[]'").bind(JSON.stringify(snapshot.stills), existing.id).run();
    }
    return { duplicate: true as const, id: existing.id };
  }

  const now = new Date().toISOString();
  const statements = [
    db().prepare(`INSERT INTO movies (
      tmdb_id, slug, title, original_title, release_date, countries_json, runtime, overview,
      poster_path, director, cast_json, stills_json, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`)
      .bind(
        snapshot.tmdbId,
        snapshot.slug,
        snapshot.title,
        snapshot.originalTitle,
        snapshot.releaseDate,
        JSON.stringify(snapshot.countries),
        snapshot.runtime,
        snapshot.overview,
        snapshot.posterPath,
        snapshot.director,
        JSON.stringify(snapshot.cast),
        JSON.stringify(snapshot.stills),
        now,
        now,
      ),
    ...snapshot.genres.map((genre) => db().prepare(
      "INSERT INTO movie_genres (movie_id, tmdb_genre_id, name) SELECT id, ?, ? FROM movies WHERE tmdb_id = ?",
    ).bind(genre.id, genre.name, snapshot.tmdbId)),
  ];

  await db().batch(statements);
  const inserted = await db().prepare("SELECT id FROM movies WHERE tmdb_id = ?").bind(snapshot.tmdbId).first<{ id: number }>();
  if (!inserted) throw new Error("MOVIE_CREATE_FAILED");
  return { duplicate: false as const, id: inserted.id };
}

export async function updateMovie(id: number, update: MovieUpdate) {
  const now = new Date().toISOString();
  const result = await db().prepare(`UPDATE movies SET
    rating = ?, watched_on = ?, short_review = ?, long_review = ?, contains_spoilers = ?, status = ?, updated_at = ?
    WHERE id = ?`)
    .bind(
      update.rating,
      update.watchedOn,
      update.shortReview,
      update.longReview,
      update.containsSpoilers ? 1 : 0,
      update.status,
      now,
      id,
    ).run();
  const changed = Number(result.meta.changes ?? 0) > 0;
  if (changed && update.status === "published") await fillMissingFilmImages(id);
  return changed;
}

export async function deleteMovie(id: number) {
  const results = await db().batch([
    db().prepare("DELETE FROM movie_genres WHERE movie_id = ?").bind(id),
    db().prepare("DELETE FROM movies WHERE id = ?").bind(id),
  ]);
  return Number(results[1]?.meta.changes ?? 0) > 0;
}

async function fillMissingFilmImages(id: number) {
  const row = await db().prepare("SELECT tmdb_id, stills_json FROM movies WHERE id = ?").bind(id).first<{ tmdb_id: number; stills_json: string }>();
  if (!row || jsonArray(row.stills_json).length) return;
  try {
    const images = await getTmdbFilmImages(row.tmdb_id);
    if (images.length) await db().prepare("UPDATE movies SET stills_json = ? WHERE id = ? AND stills_json = '[]'").bind(JSON.stringify(images), id).run();
  } catch {
    // Image outages must not discard a saved review. The next publication retries.
  }
}
