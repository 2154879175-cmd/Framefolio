import { tmdbPosterUrl } from "@/lib/tmdb";

export function MoviePoster({
  path,
  title,
  priority = false,
  className = "",
}: {
  path: string | null;
  title: string;
  priority?: boolean;
  className?: string;
}) {
  const src = tmdbPosterUrl(path);
  if (!src) {
    return (
      <div className={`flex aspect-[2/3] items-end border border-white/15 bg-[linear-gradient(145deg,#232323,#090909_65%)] p-4 ${className}`}>
        <span className="text-sm leading-snug text-zinc-400">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${title} poster`}
      className={`aspect-[2/3] object-cover ${className}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
