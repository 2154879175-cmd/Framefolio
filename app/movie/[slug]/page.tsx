import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MoviePoster } from "@/components/movie-poster";
import { getPublishedMovie } from "@/lib/movies";
import { FilmStrip, OrbitDecoration, CinemaSketch } from "@/components/film-decorations";
import { genreLabels } from "@/lib/genre-labels";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const movie = await getPublishedMovie((await params).slug);
  return movie ? { title: movie.title, description: movie.shortReview || movie.overview } : { title: "电影未找到 · Film not found" };
}
function ReviewText({ text }: { text: string }) {
  return <div className="prose-review">{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>;
}
export default async function MovieDetail({ params }: { params: Promise<{ slug: string }> }) {
  const movie = await getPublishedMovie((await params).slug);
  if (!movie) notFound();
  return (
    <div className="movie-journal">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-7 sm:px-8 lg:px-12">
        <a href="/" className="journal-back inline-flex items-center gap-2 text-sm"><ArrowLeft aria-hidden="true" className="size-4" />返回电影墙 / Back to archive</a>
        <article>
          <header className="journal-cover mt-7 grid gap-8 p-6 sm:p-9 lg:grid-cols-[260px_1fr] lg:gap-12 lg:p-12">
            {movie.genres.some(genre => genre.name === "科幻") && <div className="journal-orbit"><OrbitDecoration /></div>}
            <div className="mx-auto w-full max-w-[260px]">
              <div className="journal-poster"><MoviePoster path={movie.posterPath} title={movie.title} priority className="w-full" /></div>
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-zinc-500">Framefolio / Film notes</p>
            </div>
            <div className="min-w-0 self-center">
              <p className="journal-eyebrow">电影手记 / Film journal · {movie.releaseDate?.slice(0, 4) || "年份未知 / Year unknown"}</p>
              <h1 className="mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">{movie.title}</h1>
              {movie.originalTitle !== movie.title && <p className="journal-original mt-3 text-lg italic sm:text-2xl">{movie.originalTitle}</p>}
              <div className="mt-5 flex flex-wrap gap-2">{movie.genres.map(genre => <a key={genre.id} href={`/?genre=${encodeURIComponent(genre.name)}`} className="journal-tag">{genre.name} / {genreLabels[genre.name] ?? genre.name}</a>)}</div>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="journal-score"><span className="text-5xl tabular-nums">{movie.rating?.toFixed(1) ?? "—"}</span><span className="ml-2 text-sm">/ 10</span><p className="mt-1 text-xs">个人评分 / Personal rating</p></div>
                {movie.watchedOn && <p className="text-sm leading-7 text-zinc-500">观影日期 / Watched on<br /><time dateTime={movie.watchedOn}>{movie.watchedOn}</time></p>}
              </div>
              <dl className="journal-facts mt-7 grid grid-cols-2 gap-x-6 gap-y-4 pt-6 text-sm">
                <div><dt>导演 / Director</dt><dd>{movie.director || "未知 / Unknown"}</dd></div>
                <div><dt>片长 / Runtime</dt><dd>{movie.runtime ? `${movie.runtime} 分钟 / min` : "未知 / Unknown"}</dd></div>
                <div className="col-span-2"><dt>制片地区 / Country</dt><dd>{movie.countries.join(" / ") || "未知 / Unknown"}</dd></div>
                <div className="col-span-2"><dt>主要演员 / Cast</dt><dd>{movie.cast.join("、") || "未知 / Unknown"}</dd></div>
              </dl>
            </div>
          </header>
          <div className="journal-reading mx-auto mt-12 max-w-[760px] sm:mt-16">
            {movie.shortReview && <section className="journal-short"><h2 className="journal-eyebrow">01 / 短评 / Short review</h2><blockquote className="mt-5 text-2xl leading-[1.8] sm:text-3xl">{movie.shortReview}</blockquote></section>}
            <FilmStrip tmdbId={movie.tmdbId} title={movie.title} stills={movie.stills} />
            {movie.overview && <section className="journal-section"><h2 className="journal-eyebrow">02 / 电影简介 / Synopsis</h2><p className="mt-5 text-lg leading-[1.9]">{movie.overview}</p></section>}
            {movie.longReview && <section className="journal-section"><h2 className="journal-eyebrow">03 / 长评 / Full review</h2>
              {movie.containsSpoilers ? <details className="journal-spoilers mt-5"><summary><span>含有剧透 · 点击展开或收起</span><span className="block text-xs tracking-wide">Contains spoilers · Click to expand or collapse</span></summary><div className="journal-review mt-7"><ReviewText text={movie.longReview} /></div></details> : <div className="journal-review mt-5"><ReviewText text={movie.longReview} /></div>}
            </section>}
            <footer className="journal-end mt-14 pt-7"><CinemaSketch /><span aria-hidden="true">✦</span><p className="mt-3 text-xs tracking-wide">散场之后，故事仍在。 / The story stays after the credits.</p><a href="/" className="journal-back mt-5 inline-block text-sm">返回电影墙 / Back to archive</a></footer>
          </div>
        </article>
      </main>
    </div>
  );
}
