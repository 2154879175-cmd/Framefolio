import { NextResponse } from "next/server";
import { getOwnerApiAccess } from "@/lib/admin-auth";
import { searchTmdbMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const access = await getOwnerApiAccess();
  if (!access.ok) return NextResponse.json({ error: access.message }, { status: access.status });

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query || query.length > 100) return NextResponse.json({ error: "请输入有效的电影片名。 / Enter a valid film title." }, { status: 400 });

  try {
    return NextResponse.json({ results: await searchTmdbMovies(query) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "TMDB_NOT_CONFIGURED") {
      return NextResponse.json({ error: "还没有配置 TMDB 密钥。请在本地环境文件中填写 TMDB_READ_TOKEN 后重启网站。 / Configure TMDB_READ_TOKEN in the local environment file and restart." }, { status: 503 });
    }
    if (message === "TMDB_401") return NextResponse.json({ error: "TMDB 密钥无效，请检查后重试。 / Invalid TMDB credentials. Please check and retry." }, { status: 503 });
    return NextResponse.json({ error: "电影资料服务暂时不可用，请稍后重试。 / Film information is temporarily unavailable. Please retry." }, { status: 502 });
  }
}
