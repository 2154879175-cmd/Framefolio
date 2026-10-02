import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { MovieSearch } from "@/components/admin/movie-search";
import { AdminWebMcpTools } from "@/components/admin/webmcp-tools";
import { MoviePoster } from "@/components/movie-poster";
import { buttonVariants } from "@/components/ui/button";
import { requireOwner } from "@/lib/admin-auth";
import { listAdminMovies } from "@/lib/movies";
import { chatGPTSignOutPath } from "@/app/auth";
import { importInitialArchive } from "@/lib/import-archive";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "管理后台" };

export default async function AdminPage() {
  const user = await requireOwner("/admin");
  await importInitialArchive();
  const movies = await listAdminMovies();

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 lg:px-12">
      <AdminWebMcpTools />
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/15 pb-7">
        <div>
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-zinc-500 hover:text-white">银幕手记</Link>
          <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">管理电影档案</h1>
          <p className="mt-2 text-sm text-zinc-500">已登录为 {user.displayName}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>查看网站<ArrowUpRight aria-hidden="true" /></Link>
          <a href={chatGPTSignOutPath("/")} target="_top" className={buttonVariants({ variant: "ghost" })}><LogOut aria-hidden="true" />退出</a>
        </div>
      </header>

      <div className="mt-8"><MovieSearch /></div>

      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <h2 className="text-sm font-medium">全部记录</h2>
          <span className="text-xs text-zinc-600">{movies.length} 部</span>
        </div>
        {movies.length ? (
          <ul className="divide-y divide-white/10">
            {movies.map((movie) => (
              <li key={movie.id}>
                <Link href={`/admin/movies/${movie.id}`} className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-white sm:grid-cols-[56px_1fr_auto_auto]">
                  <MoviePoster path={movie.posterPath} title={movie.title} className="h-[72px] w-12 sm:h-[84px] sm:w-14" />
                  <div className="min-w-0">
                    <p className="truncate font-medium group-hover:underline group-hover:underline-offset-4">{movie.title}</p>
                    <p className="mt-1 truncate text-xs text-zinc-600">{movie.originalTitle} · {movie.releaseDate?.slice(0, 4) || "年份未知"}</p>
                  </div>
                  <span className={`border px-2 py-1 text-xs ${movie.status === "published" ? "border-white/30 text-zinc-200" : "border-white/10 text-zinc-600"}`}>
                    {movie.status === "published" ? "已发布" : "草稿"}
                  </span>
                  <span className="hidden w-10 text-right text-sm tabular-nums text-zinc-400 sm:block">{movie.rating?.toFixed(1) ?? "—"}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-14 text-center text-sm text-zinc-600">还没有电影记录，从上方搜索第一部电影。</div>
        )}
      </section>
    </main>
  );
}
