import type { Movie } from "@/lib/types";
import { MoviePoster } from "@/components/movie-poster";

export function MovieCard({ movie, priority = false }: { movie: Movie; priority?: boolean }) {
  return (
    <article className="group min-w-0">
      <a href={`/movie/${movie.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        <div className="archive-poster overflow-hidden bg-zinc-900">
          <MoviePoster
            path={movie.posterPath}
            title={movie.title}
            priority={priority}
            className="w-full transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
          />
        </div>
        <div className="flex items-start justify-between gap-3 pt-3">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-medium archive-title text-zinc-100">{movie.title}</h2>
            <p className="mt-1 text-xs tracking-wide text-zinc-500">{movie.releaseDate?.slice(0, 4) || "Year unknown"}</p>
          </div>
          <span className="archive-rating shrink-0 border border-white/20 px-2 py-1 text-sm tabular-nums text-zinc-200">
            {movie.rating?.toFixed(1) ?? "—"}<span className="ml-0.5 text-[10px] text-zinc-500">/10</span>
          </span>
        </div>
      </a>
    </article>
  );
}
