import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const archiveImports = sqliteTable("archive_imports", {
  id: text("id").primaryKey(),
});

export const movies = sqliteTable(
  "movies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tmdbId: integer("tmdb_id").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    originalTitle: text("original_title").notNull(),
    releaseDate: text("release_date"),
    countriesJson: text("countries_json").notNull().default("[]"),
    runtime: integer("runtime"),
    overview: text("overview").notNull().default(""),
    posterPath: text("poster_path"),
    stillsJson: text("stills_json").notNull().default("[]"),
    director: text("director").notNull().default(""),
    castJson: text("cast_json").notNull().default("[]"),
    rating: real("rating"),
    watchedOn: text("watched_on"),
    shortReview: text("short_review").notNull().default(""),
    longReview: text("long_review").notNull().default(""),
    containsSpoilers: integer("contains_spoilers", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_movies_tmdb_id").on(table.tmdbId),
    uniqueIndex("idx_movies_slug").on(table.slug),
    index("idx_movies_status_watched").on(table.status, table.watchedOn),
    index("idx_movies_status_rating").on(table.status, table.rating),
  ],
);

export const movieGenres = sqliteTable(
  "movie_genres",
  {
    movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: "cascade" }),
    tmdbGenreId: integer("tmdb_genre_id").notNull(),
    name: text("name").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.movieId, table.tmdbGenreId] }),
    index("idx_movie_genres_name_movie").on(table.name, table.movieId),
  ],
);
