import { NextResponse } from "next/server";
import { getPublishedMovie } from "@/lib/movies";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const movie = await getPublishedMovie((await params).slug);
  return movie ? NextResponse.json(movie) : NextResponse.json({ error: "没有找到这部电影。" }, { status: 404 });
}
