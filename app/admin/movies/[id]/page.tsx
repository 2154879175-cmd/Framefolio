import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EditMovieForm } from "@/components/admin/edit-movie-form";
import { MoviePoster } from "@/components/movie-poster";
import { requireOwner } from "@/lib/admin-auth";
import { getAdminMovie } from "@/lib/movies";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "编辑电影 / Edit film" };

export default async function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner("/admin");
  const { id } = await params;
  const movie = await getAdminMovie(Number(id));
  if (!movie) notFound();

  return (
    <main className="editor-ui mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <a href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft aria-hidden="true" className="size-4" />返回管理后台 / Back to admin</a>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside>
          <MoviePoster path={movie.posterPath} title={movie.title} priority className="w-full" />
          <div className="mt-4">
            <h1 className="text-xl font-medium">{movie.title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{movie.originalTitle}</p>
            <p className="mt-3 text-xs leading-5 text-zinc-500">{movie.releaseDate?.slice(0, 4) || "年份未知 / Year unknown"} · {movie.director || "导演未知 / Director unknown"}</p>
            {movie.status === "published" && (
              <a href={`/movie/${movie.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm text-zinc-300 underline underline-offset-4 hover:text-white">查看公开页面 / View public page<ExternalLink aria-hidden="true" className="size-3.5" /></a>
            )}
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-7 border-b border-white/15 pb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">Personal Notes</p>
            <h2 className="mt-2 text-2xl font-medium">写下这次观看 / Write your notes</h2>
          </div>
          <EditMovieForm movie={movie} />
        </section>
      </div>
    </main>
  );
}
