import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/15">
      <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-baseline gap-3 focus-visible:outline-2 focus-visible:outline-white">
          <span className="text-xl font-semibold tracking-[0.16em]">银幕手记</span>
          <span className="hidden text-[11px] uppercase tracking-[0.22em] text-zinc-500 sm:inline">Framefolio</span>
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-5 text-sm text-zinc-400">
          <Link className="transition-colors hover:text-white" href="/about">关于</Link>
          <Link className="transition-colors hover:text-white" href="/admin">管理</Link>
        </nav>
      </div>
    </header>
  );
}
