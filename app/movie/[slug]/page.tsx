import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { MoviePoster } from "@/components/movie-poster";
import { getPublishedMovie } from "@/lib/movies";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getPublishedMovie(slug);
  return movie ? { title: movie.title, description: movie.shortReview || movie.overview } : { title: "电影未找到" };
}

function formatDate(value: string | null) {
  if (!value) return "未记录";
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function ReviewText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  return <div className="prose-review">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>;
}

export default async function MovieDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = await getPublishedMovie(slug);
  if (!movie) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white">
          <ArrowLeft aria-hidden="true" className="size-4" />返回电影墙
        </a>

        <article className="mt-8 grid gap-9 lg:grid-cols-[minmax(260px,360px)_1fr] lg:gap-14">
          <div>
            <MoviePoster path={movie.posterPath} title={movie.title} priority className="w-full" />
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <a key={genre.id} href={`/?genre=${encodeURIComponent(genre.name)}`} className="border border-white/20 px-2.5 py-1 text-xs text-zinc-400 hover:text-white">
                  {genre.name}
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="border-b border-white/15 pb-8">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{movie.releaseDate?.slice(0, 4) || "年份未知"}</p>
              <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl">{movie.title}</h1>
              {movie.originalTitle !== movie.title && <p className="mt-3 text-lg text-zinc-500">{movie.originalTitle}</p>}
              <div className="mt-7 flex items-end gap-3">
                <span className="text-6xl font-light tabular-nums">{movie.rating?.toFixed(1) ?? "—"}</span>
                <span className="pb-2 text-sm text-zinc-500">/ 10</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/15 py-7 text-sm sm:grid-cols-3">
              <div><dt className="text-zinc-600">导演</dt><dd className="mt-1 text-zinc-200">{movie.director || "未知"}</dd></div>
              <div><dt className="text-zinc-600">片长</dt><dd className="mt-1 text-zinc-200">{movie.runtime ? `${movie.runtime} 分钟` : "未知"}</dd></div>
              <div><dt className="text-zinc-600">制片地区</dt><dd className="mt-1 text-zinc-200">{movie.countries.join(" / ") || "未知"}</dd></div>
              <div className="col-span-2 sm:col-span-3"><dt className="text-zinc-600">主要演员</dt><dd className="mt-1 leading-6 text-zinc-200">{movie.cast.join("、") || "未知"}</dd></div>
            </dl>

            {movie.overview && (
              <section className="border-b border-white/15 py-7">
                <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-600">电影简介</h2>
                <p className="mt-4 max-w-3xl text-[15px] leading-7 text-zinc-400">{movie.overview}</p>
              </section>
            )}

            <section className="py-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-600">观影手记</h2>
                <span className="text-xs text-zinc-600">{formatDate(movie.watchedOn)}</span>
              </div>
              {movie.shortReview && <p className="mt-5 text-xl leading-9 text-zinc-100">“{movie.shortReview}”</p>}
              {movie.longReview && (
                movie.containsSpoilers ? (
                  <details className="mt-7 border border-white/15 p-5 open:bg-zinc-950">
                    <summary className="cursor-pointer text-sm text-zinc-300 marker:text-zinc-600">含有剧透，点击展开长评</summary>
                    <div className="mt-6 text-[16px] leading-8 text-zinc-300"><ReviewText text={movie.longReview} /></div>
                  </details>
                ) : (
                  <div className="mt-7 text-[16px] leading-8 text-zinc-300"><ReviewText text={movie.longReview} /></div>
                )
              )}
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
