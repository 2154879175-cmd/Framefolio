import { NextResponse } from "next/server";
import { deleteMovie, updateMovie } from "@/lib/movies";
import { getOwnerApiAccess } from "@/lib/admin-auth";
import type { MovieUpdate } from "@/lib/types";

function movieId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateUpdate(value: unknown): MovieUpdate | string {
  if (!value || typeof value !== "object") return "提交内容无效。 / Invalid submission.";
  const body = value as Record<string, unknown>;
  const status = body.status;
  const rating = body.rating === null || body.rating === "" ? null : Number(body.rating);
  const watchedOn = body.watchedOn === null || body.watchedOn === "" ? null : String(body.watchedOn);
  const shortReview = typeof body.shortReview === "string" ? body.shortReview.trim() : "";
  const longReview = typeof body.longReview === "string" ? body.longReview.trim() : "";

  if (status !== "draft" && status !== "published") return "记录状态无效。 / Invalid entry status.";
  if (rating !== null && (!Number.isFinite(rating) || !Number.isInteger(rating * 10) || rating < 1 || rating > 10)) return "评分必须是 1.0 到 10.0 之间的数值，最多保留一位小数。 / Rating must be 1.0–10.0 with at most one decimal place.";
  if (watchedOn && !/^\d{4}-\d{2}-\d{2}$/.test(watchedOn)) return "观影日期格式无效。 / Invalid viewing date.";
  if (shortReview.length > 500) return "短评不能超过 500 字。 / Short reviews cannot exceed 500 characters.";
  if (longReview.length > 20000) return "长评不能超过 20000 字。 / Full reviews cannot exceed 20,000 characters.";
  if (status === "published" && rating === null) return "发布前请填写 1 到 10 分的个人评分。 / Add a rating from 1 to 10 before publishing.";
  if (status === "published" && !shortReview && !longReview) return "发布前请至少填写短评或长评。 / Add a short or full review before publishing.";

  return { rating, watchedOn, shortReview, longReview, containsSpoilers: body.containsSpoilers === true, status };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await getOwnerApiAccess();
  if (!access.ok) return NextResponse.json({ error: access.message }, { status: access.status });
  const id = movieId((await params).id);
  if (!id) return NextResponse.json({ error: "电影编号无效。 / Invalid film ID." }, { status: 400 });
  const update = validateUpdate(await request.json().catch(() => null));
  if (typeof update === "string") return NextResponse.json({ error: update }, { status: 400 });
  const changed = await updateMovie(id, update);
  return changed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "没有找到这部电影。 / Film not found." }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await getOwnerApiAccess();
  if (!access.ok) return NextResponse.json({ error: access.message }, { status: access.status });
  const id = movieId((await params).id);
  if (!id) return NextResponse.json({ error: "电影编号无效。 / Invalid film ID." }, { status: 400 });
  const deleted = await deleteMovie(id);
  return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "没有找到这部电影。 / Film not found." }, { status: 404 });
}
