import { FilmStrip, OrbitDecoration } from "@/components/film-decorations";
import { SiteHeader } from "@/components/site-header";
import { FilterForm } from "@/components/filter-form";
import { MovieCard } from "@/components/movie-card";
import { ArchivePagination } from "@/components/archive-pagination";
import { EmptyArchive } from "@/components/empty-archive";
import { listGenres, listPublishedMovies } from "@/lib/movies";
import { importInitialArchive } from "@/lib/import-archive";

export const dynamic = "force-dynamic";

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await importInitialArchive();
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
    <div className="archive-home">
      <section className="archive-hero relative isolate overflow-hidden text-white">
        <SiteHeader overlay />
        <img src="/empty-cinema.png" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="archive-hero-shade absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1500px] px-5 pb-14 pt-40 sm:px-8 sm:pb-20 sm:pt-48 lg:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-violet-200">A personal film journal</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Films stay.<br />Stories unfold.</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">A collection of films, personal reviews, and the moments that linger long after the credits roll.</p>
          <a href="#film-archive" className="mt-8 inline-flex items-center gap-3 border-b border-white/50 pb-2 text-xs uppercase tracking-[0.18em] hover:border-white">Explore the archive <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      <main id="film-archive" className="mx-auto max-w-[1500px] scroll-mt-6 px-5 pb-20 pt-9 sm:px-8 lg:px-12 lg:pt-12">
        {single(raw.notice) === "not-owner" && (
          <div className="mb-6 border border-white/20 bg-zinc-900 px-4 py-3 text-sm text-zinc-300" role="status">
            This account does not have permission to manage Framefolio.
          </div>
        )}
        <div className="archive-collection-heading flex items-end justify-between gap-6">
          <div className="archive-orbit"><OrbitDecoration /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">The collection</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Film archive</h2>
          </div>
          <p className="text-xs tabular-nums text-zinc-500 sm:text-sm">{archive.total} {archive.total === 1 ? "film" : "films"}</p>
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
            {!filtered && <div className="archive-frame-interlude"><FilmStrip /></div>}
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
      <footer className="mx-auto flex max-w-[1500px] flex-wrap justify-between gap-3 border-t border-black/10 px-5 py-7 text-xs text-zinc-500 sm:px-8 lg:px-12"><span>FRAMEFOLIO — A life in films.</span><a href="/about" className="underline underline-offset-4">Film data & credits</a></footer>
    </div>
  );
}
