import { SiteHeader } from "@/components/site-header";
import { FilterForm } from "@/components/filter-form";
import { MovieCard } from "@/components/movie-card";
import { ArchivePagination } from "@/components/archive-pagination";
import { EmptyArchive } from "@/components/empty-archive";
import { listGenres, listPublishedMovies } from "@/lib/movies";

export const dynamic = "force-dynamic";

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query = single(raw.q).slice(0, 80);
  const genre = single(raw.genre).slice(0, 40);
  const rating = single(raw.rating);
  const sort = ["watched", "rating", "release"].includes(single(raw.sort)) ? single(raw.sort) : "watched";
  const page = Math.max(1, Number.parseInt(single(raw.page), 10) || 1);

  const [archive, genres] = await Promise.all([
    listPublishedMovies({
      query,
      genre,
      ratingMin: Number.parseInt(rating, 10) || undefined,
      sort: sort as "watched" | "rating" | "release",
      page,
    }),
    listGenres(),
  ]);
  const filtered = Boolean(query || genre || rating);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1500px] px-5 pb-20 pt-9 sm:px-8 lg:px-12 lg:pt-12">
        {single(raw.notice) === "not-owner" && (
          <div className="mb-6 border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-zinc-300" role="status">
            当前账号没有“银幕手记”的管理权限。
          </div>
        )}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">A Personal Film Archive</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">看过，也写下。</h1>
          </div>
          <p className="hidden text-sm tabular-nums text-zinc-500 sm:block">共 {archive.total} 部</p>
        </div>

        <div className="mt-9">
          <FilterForm genres={genres} values={{ query, genre, rating, sort }} />
        </div>

        {archive.movies.length ? (
          <>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {archive.movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} priority={index < 6} />
              ))}
            </div>
            <ArchivePagination
              page={archive.page}
              totalPages={archive.totalPages}
              params={{ q: query, genre, rating, sort }}
            />
          </>
        ) : (
          <EmptyArchive filtered={filtered} />
        )}
      </main>
    </>
  );
}
