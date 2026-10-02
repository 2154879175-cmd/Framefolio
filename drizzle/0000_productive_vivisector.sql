CREATE TABLE `movie_genres` (
	`movie_id` integer NOT NULL,
	`tmdb_genre_id` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`movie_id`, `tmdb_genre_id`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_movie_genres_name_movie` ON `movie_genres` (`name`,`movie_id`);--> statement-breakpoint
CREATE TABLE `movies` (
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
	`rating` integer,
	`watched_on` text,
	`short_review` text DEFAULT '' NOT NULL,
	`long_review` text DEFAULT '' NOT NULL,
	`contains_spoilers` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_movies_tmdb_id` ON `movies` (`tmdb_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_movies_slug` ON `movies` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_movies_status_watched` ON `movies` (`status`,`watched_on`);--> statement-breakpoint
CREATE INDEX `idx_movies_status_rating` ON `movies` (`status`,`rating`);