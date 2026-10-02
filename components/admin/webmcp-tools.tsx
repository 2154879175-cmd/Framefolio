"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ModelContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: unknown) => Promise<unknown>;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

export function AdminWebMcpTools() {
  const router = useRouter();

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const register = async () => {
      await context.registerTool({
        name: "search_movie_catalog",
        title: "搜索电影资料",
        description: "按片名搜索 TMDB，返回可供确认的电影候选项。",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string", minLength: 1, maxLength: 100 } },
          required: ["query"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        async execute(input) {
          const query = typeof input === "object" && input && "query" in input ? String(input.query).trim() : "";
          if (!query || query.length > 100) throw new Error("query 必须是 1 到 100 个字符的片名。");
          const response = await fetch(`/api/admin/tmdb/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          if (!response.ok) throw new Error((data as { error?: string }).error || "搜索失败。");
          return data;
        },
      }, { signal: lifecycle.signal });

      await context.registerTool({
        name: "create_movie_draft",
        title: "创建电影草稿",
        description: "使用确认过的 TMDB 电影编号创建一条电影草稿，并打开影评编辑页。",
        inputSchema: {
          type: "object",
          properties: { tmdbId: { type: "integer", minimum: 1 } },
          required: ["tmdbId"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        async execute(input) {
          const tmdbId = typeof input === "object" && input && "tmdbId" in input ? Number(input.tmdbId) : 0;
          if (!Number.isInteger(tmdbId) || tmdbId < 1) throw new Error("tmdbId 必须是有效的正整数。");
          const response = await fetch("/api/admin/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tmdbId }),
          });
          const data = await response.json() as { id?: number; error?: string };
          if (!response.ok || !data.id) throw new Error(data.error || "创建草稿失败。");
          router.push(`/admin/movies/${data.id}`);
          return { id: data.id, status: "draft", editorUrl: `/admin/movies/${data.id}` };
        },
      }, { signal: lifecycle.signal });
    };

    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [router]);

  return null;
}
