import { DatabaseSync } from "node:sqlite";
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const databaseDirectory = resolve(root, ".wrangler/state/v3/d1/miniflare-D1DatabaseObject");
const databases = readdirSync(databaseDirectory).filter(name => name.endsWith(".sqlite") && name !== "metadata.sqlite");
if (databases.length !== 1) throw new Error("Expected one local movie database.");
const database = new DatabaseSync(resolve(databaseDirectory, databases[0]), { readOnly: true });
try {
  const movies = database.prepare("SELECT * FROM movies ORDER BY id").all();
  const genres = database.prepare("SELECT * FROM movie_genres ORDER BY movie_id, tmdb_genre_id").all();
  const directory = resolve(root, "data/archive");
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, "movies.json"), JSON.stringify(movies, null, 2) + "\n");
  writeFileSync(resolve(directory, "genres.json"), JSON.stringify(genres, null, 2) + "\n");
  console.log(`Exported ${movies.length} movies and ${genres.length} genre relationships to data/archive.`);
} finally {
  database.close();
}
