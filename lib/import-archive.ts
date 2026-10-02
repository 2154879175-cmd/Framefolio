import { env } from "cloudflare:workers";
import movies from "@/data/archive/movies.json";
import genres from "@/data/archive/genres.json";

const importId = "initial-archive-2026-10-02";

export async function importInitialArchive() {
  const database = env.DB;
  if (!database) throw new Error("DB_UNAVAILABLE");
  if (await database.prepare("SELECT id FROM archive_imports WHERE id = ?").bind(importId).first()) return;
  // All statements share a transaction. A concurrent import rolls back if the
  // marker already exists; later requests never restore deleted movie records.
  const columns = Object.keys(movies[0]);
  const statements = movies.map(movie => database.prepare(
    `INSERT OR IGNORE INTO movies (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
  ).bind(...columns.map(column => movie[column as keyof typeof movie])));
  statements.push(...genres.map(genre => database.prepare(
    "INSERT OR IGNORE INTO movie_genres (movie_id, tmdb_genre_id, name) VALUES (?, ?, ?)",
  ).bind(genre.movie_id, genre.tmdb_genre_id, genre.name)));
  statements.push(database.prepare("INSERT INTO archive_imports (id) VALUES (?)").bind(importId));
  try {
    await database.batch(statements);
  } catch (error) {
    if (!await database.prepare("SELECT id FROM archive_imports WHERE id = ?").bind(importId).first()) throw error;
  }
}
