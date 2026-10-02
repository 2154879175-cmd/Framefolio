"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TmdbSearchResult } from "@/lib/types";

function posterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
}

export function MovieSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function searchMovies(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/tmdb/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json() as { results?: TmdbSearchResult[]; error?: string };
      if (!response.ok) throw new Error(data.error || "搜索失败，请稍后重试。");
      setResults(data.results ?? []);
      if (!data.results?.length) setMessage("没有找到匹配的电影，可以换一个片名或加入年份再试。 ");
    } catch (error) {
      setResults([]);
      setMessage(error instanceof Error ? error.message : "搜索失败，请稍后重试。");
    } finally {
      setSearching(false);
    }
  }

  async function addMovie(tmdbId: number) {
    setAddingId(tmdbId);
    try {
      const response = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId }),
      });
      const data = await response.json() as { id?: number; error?: string };
      if (!response.ok || !data.id) throw new Error(data.error || "创建电影草稿失败。");
      toast.success(response.status === 200 ? "这部电影已经在档案中" : "已创建电影草稿");
      router.push(`/admin/movies/${data.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建电影草稿失败。");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <section className="border border-white/15 bg-zinc-950 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <Film aria-hidden="true" className="size-5 text-zinc-400" />
        <div>
          <h2 className="font-medium">添加一部电影</h2>
          <p className="mt-1 text-sm text-zinc-500">输入中文名、原名或“片名 + 年份”。</p>
        </div>
      </div>
      <form onSubmit={searchMovies} className="mt-5 flex gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">搜索电影</span>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：花样年华 2000" className="h-11 border-white/20 pl-10" />
        </label>
        <Button type="submit" className="h-11" disabled={searching || !query.trim()}>
          {searching ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}搜索
        </Button>
      </form>

      {message && <p className="mt-4 border-l-2 border-white/30 pl-3 text-sm leading-6 text-zinc-400" role="status">{message}</p>}
      {results.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {results.map((movie) => (
            <li key={movie.id} className="flex gap-4 border border-white/15 p-3">
              {posterUrl(movie.posterPath) ? (
                <img src={posterUrl(movie.posterPath)!} alt="" className="h-28 w-[75px] shrink-0 object-cover" />
              ) : (
                <div className="flex h-28 w-[75px] shrink-0 items-center justify-center bg-zinc-900 text-xs text-zinc-600">无海报</div>
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="font-medium leading-6">{movie.title}</p>
                <p className="mt-1 truncate text-xs text-zinc-500">{movie.originalTitle}</p>
                <p className="mt-1 text-xs text-zinc-500">{movie.releaseDate?.slice(0, 4) || "年份未知"}</p>
                <Button type="button" variant="outline" size="sm" className="mt-auto w-full border-white/20" onClick={() => addMovie(movie.id)} disabled={addingId !== null}>
                  {addingId === movie.id ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}选择这部
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
