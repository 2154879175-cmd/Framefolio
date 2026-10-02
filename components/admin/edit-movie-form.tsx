"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteMovieButton } from "@/components/admin/delete-movie-button";
import type { Movie } from "@/lib/types";

export function EditMovieForm({ movie }: { movie: Movie }) {
  const router = useRouter();
  const [rating, setRating] = useState(movie.rating?.toFixed(1) ?? "");
  const [watchedOn, setWatchedOn] = useState(movie.watchedOn ?? "");
  const [shortReview, setShortReview] = useState(movie.shortReview);
  const [longReview, setLongReview] = useState(movie.longReview);
  const [containsSpoilers, setContainsSpoilers] = useState(movie.containsSpoilers);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);

  async function save(status: "draft" | "published") {
    setSaving(status);
    try {
      const response = await fetch(`/api/admin/movies/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: rating ? Number(rating) : null,
          watchedOn: watchedOn || null,
          shortReview,
          longReview,
          containsSpoilers,
          status,
        }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "保存失败，请稍后重试。");
      toast.success(status === "published" ? "影评已发布" : "草稿已保存");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败，请稍后重试。");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-zinc-300">我的评分</span>
          <span className="ml-2 text-xs text-zinc-600">1.0–10.0 分</span>
          <Input type="number" min={1} max={10} step={0.1} value={rating} onChange={(event) => setRating(event.target.value)} className="mt-2 h-11 border-white/20" placeholder="例如：8.5" />
        </label>
        <label className="block">
          <span className="text-sm text-zinc-300">观影日期</span>
          <span className="ml-2 text-xs text-zinc-600">可不填</span>
          <Input type="date" value={watchedOn} onChange={(event) => setWatchedOn(event.target.value)} className="mt-2 h-11 border-white/20" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-zinc-300">短评</span>
        <span className="ml-2 text-xs text-zinc-600">最多 500 字</span>
        <Textarea value={shortReview} onChange={(event) => setShortReview(event.target.value)} maxLength={500} className="mt-2 min-h-28 border-white/20 leading-7" placeholder="用一两句话记下最直接的感受……" />
      </label>

      <label className="block">
        <span className="text-sm text-zinc-300">长评</span>
        <span className="ml-2 text-xs text-zinc-600">用空行分段</span>
        <Textarea value={longReview} onChange={(event) => setLongReview(event.target.value)} maxLength={20000} className="mt-2 min-h-72 border-white/20 leading-7" placeholder="把想保留的细节慢慢写下来……" />
      </label>

      <label className="flex cursor-pointer items-start gap-3 border border-white/15 p-4">
        <Checkbox checked={containsSpoilers} onCheckedChange={(checked) => setContainsSpoilers(checked === true)} className="mt-0.5" />
        <span><span className="block text-sm">长评包含剧透</span><span className="mt-1 block text-xs leading-5 text-zinc-500">发布后长评会默认折叠，访客需要主动展开。</span></span>
      </label>

      <div className="flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center">
        <Button type="button" variant="outline" className="border-white/20" onClick={() => save("draft")} disabled={saving !== null}>
          {saving === "draft" ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}保存为草稿
        </Button>
        <Button type="button" onClick={() => save("published")} disabled={saving !== null}>
          {saving === "published" ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Eye aria-hidden="true" />}{movie.status === "published" ? "更新已发布内容" : "发布到电影墙"}
        </Button>
        <div className="sm:ml-auto"><DeleteMovieButton id={movie.id} title={movie.title} /></div>
      </div>
    </div>
  );
}
