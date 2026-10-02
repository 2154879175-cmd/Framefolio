import { NextResponse } from "next/server";
import { listPublishedMovies } from "@/lib/movies";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const sort = params.get("sort");
  const archive = await listPublishedMovies({
    query: params.get("q")?.slice(0, 80) || undefined,
    genre: params.get("genre")?.slice(0, 40) || undefined,
    ratingMin: Number.parseInt(params.get("rating") || "", 10) || undefined,
    sort: sort === "rating" || sort === "release" ? sort : "watched",
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  });
  return NextResponse.json(archive);
}
