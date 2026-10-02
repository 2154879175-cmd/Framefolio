import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ArchivePagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string>;
}) {
  if (totalPages <= 1) return null;
  const href = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    return `/?${next}`;
  };

  return (
    <nav aria-label="电影分页" className="mt-14 flex items-center justify-center gap-5 border-t border-white/15 pt-8">
      {page > 1 ? (
        <a href={href(page - 1)} className={cn(buttonVariants({ variant: "outline" }), "border-white/20")}>
          <ChevronLeft aria-hidden="true" />上一页
        </a>
      ) : <span />}
      <span className="text-sm tabular-nums text-zinc-500">{page} / {totalPages}</span>
      {page < totalPages ? (
        <a href={href(page + 1)} className={cn(buttonVariants({ variant: "outline" }), "border-white/20")}>
          下一页<ChevronRight aria-hidden="true" />
        </a>
      ) : <span />}
    </nav>
  );
}
