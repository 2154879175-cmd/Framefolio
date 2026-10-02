PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tmdb_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`original_title` text NOT NULL,
	`release_date` text,
	`countries_json` text DEFAULT '[]' NOT NULL,
	`runtime` integer,
	`overview` text DEFAULT '' NOT NULL,
	`poster_path` text,
	`director` text DEFAULT '' NOT NULL,
	`cast_json` text DEFAULT '[]' NOT NULL,
	`rating` real,
	`watched_on` text,
	`short_review` text DEFAULT '' NOT NULL,
	`long_review` text DEFAULT '' NOT NULL,
	`contains_spoilers` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_movies`("id", "tmdb_id", "slug", "title", "original_title", "release_date", "countries_json", "runtime", "overview", "poster_path", "director", "cast_json", "rating", "watched_on", "short_review", "long_review", "contains_spoilers", "status", "created_at", "updated_at") SELECT "id", "tmdb_id", "slug", "title", "original_title", "release_date", "countries_json", "runtime", "overview", "poster_path", "director", "cast_json", "rating", "watched_on", "short_review", "long_review", "contains_spoilers", "status", "created_at", "updated_at" FROM `movies`;--> statement-breakpoint
DROP TABLE `movies`;--> statement-breakpoint
ALTER TABLE `__new_movies` RENAME TO `movies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_movies_tmdb_id` ON `movies` (`tmdb_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_movies_slug` ON `movies` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_movies_status_watched` ON `movies` (`status`,`watched_on`);--> statement-breakpoint
CREATE INDEX `idx_movies_status_rating` ON `movies` (`status`,`rating`);