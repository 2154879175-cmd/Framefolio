import { NextResponse } from "next/server";
import { getOwnerApiAccess } from "@/lib/admin-auth";
import { createMovieFromSnapshot } from "@/lib/movies";
import { getTmdbMovieSnapshot } from "@/lib/tmdb";

export async function POST(request: Request) {
  const access = await getOwnerApiAccess();
  if (!access.ok) return NextResponse.json({ error: access.message }, { status: access.status });

  const body = await request.json().catch(() => null) as { tmdbId?: unknown } | null;
  const tmdbId = Number(body?.tmdbId);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) return NextResponse.json({ error: "电影编号无效。" }, { status: 400 });

  try {
    const result = await createMovieFromSnapshot(await getTmdbMovieSnapshot(tmdbId));
    return NextResponse.json({ id: result.id }, { status: result.duplicate ? 200 : 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "TMDB_NOT_CONFIGURED") return NextResponse.json({ error: "还没有配置 TMDB 密钥。" }, { status: 503 });
    return NextResponse.json({ error: "读取电影详情失败，请稍后重试。" }, { status: 502 });
  }
}
